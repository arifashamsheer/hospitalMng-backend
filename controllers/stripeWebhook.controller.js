const stripe = require('../config/stripe');

const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

exports.handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({
      message: 'Stripe signature is missing'
    });
  }

  let event;

  /*
   * Verify that the webhook request really came from Stripe.
   * req.body must be the raw request body.
   */
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      'Stripe webhook signature verification failed:',
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    switch (event.type) {
      /*
       * Payment completed successfully.
       */
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;

        const payment = await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id
          },
          {
            paymentStatus: 'Paid',
            transactionId: paymentIntent.id,
            stripeChargeId:
              paymentIntent.latest_charge || null,
            paidAt: new Date(),
            failureMessage: null
          },
          {
            new: true,
            runValidators: true
          }
        );

        /*
         * A Stripe CLI test event may not have a matching
         * MongoDB payment record. That is normal.
         */
        if (!payment) {
          console.warn(
            `No local payment found for PaymentIntent ${paymentIntent.id}`
          );

          break;
        }

        /*
         * Approve the appointment after successful payment.
         * Do not change Cancelled or Completed appointments.
         */
        const appointment =
          await Appointment.findOneAndUpdate(
            {
              _id: payment.appointmentId,
              status: {
                $nin: ['Cancelled', 'Completed']
              }
            },
            {
              status: 'Approved'
            },
            {
              new: true,
              runValidators: true
            }
          );

        if (!appointment) {
          console.warn(
            `Appointment ${payment.appointmentId} was not updated`
          );
        }

        console.log(
          `Payment completed successfully: ${paymentIntent.id}`
        );

        break;
      }

      /*
       * Stripe is still processing the payment.
       */
      case 'payment_intent.processing': {
        const paymentIntent = event.data.object;

        const payment = await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id
          },
          {
            paymentStatus: 'Processing',
            failureMessage: null
          },
          {
            new: true,
            runValidators: true
          }
        );

        if (!payment) {
          console.warn(
            `No local payment found for PaymentIntent ${paymentIntent.id}`
          );
        }

        console.log(
          `Payment is processing: ${paymentIntent.id}`
        );

        break;
      }

      /*
       * Payment failed.
       */
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        const failureMessage =
          paymentIntent.last_payment_error?.message ||
          'Payment failed';

        const payment = await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id
          },
          {
            paymentStatus: 'Failed',
            failureMessage
          },
          {
            new: true,
            runValidators: true
          }
        );

        if (!payment) {
          console.warn(
            `No local payment found for PaymentIntent ${paymentIntent.id}`
          );
        }

        console.log(
          `Payment failed: ${paymentIntent.id} - ${failureMessage}`
        );

        break;
      }

      /*
       * PaymentIntent was cancelled.
       */
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;

        const payment = await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id
          },
          {
            paymentStatus: 'Cancelled',
            failureMessage:
              paymentIntent.cancellation_reason ||
              'Payment was cancelled'
          },
          {
            new: true,
            runValidators: true
          }
        );

        if (!payment) {
          console.warn(
            `No local payment found for PaymentIntent ${paymentIntent.id}`
          );
        }

        console.log(
          `Payment cancelled: ${paymentIntent.id}`
        );

        break;
      }

      default: {
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
      }
    }

    return res.status(200).json({
      received: true
    });
  } catch (error) {
    console.error(
      'Stripe webhook processing error:',
      error
    );

    return res.status(500).json({
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};