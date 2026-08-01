const mongoose = require('mongoose');

const stripe = require('../config/stripe');

const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');


exports.createPaymentIntent = async (
  req,
  res
) => {
  try {
    const { appointmentId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        appointmentId
      )
    ) {
      return res.status(400).json({
        message: 'Invalid appointment ID'
      });
    }

    const patient = await Patient.findOne({
      userId: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient profile not found'
      });
    }

    const appointment =
      await Appointment.findById(
        appointmentId
      );

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    if (
      appointment.patientId.toString() !==
      patient._id.toString()
    ) {
      return res.status(403).json({
        message:
          'You can pay only for your own appointment'
      });
    }

    if (
      appointment.status === 'Cancelled'
    ) {
      return res.status(400).json({
        message:
          'Cancelled appointment cannot be paid'
      });
    }

    const doctor = await Doctor.findById(
      appointment.doctorId
    );

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    const amount = doctor.consultationFee;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message:
          'Doctor consultation fee is invalid'
      });
    }

    const existingPayment =
      await Payment.findOne({
        appointmentId:
          appointment._id
      });

    if (
      existingPayment?.paymentStatus ===
      'Paid'
    ) {
      return res.status(400).json({
        message:
          'This appointment is already paid'
      });
    }

    /*
      AED 150 becomes 15000.
      Stripe expects the smallest currency unit.
    */
    const stripeAmount = Math.round(
      amount * 100
    );

    let paymentIntent;

    if (
      existingPayment
        ?.stripePaymentIntentId
    ) {
      paymentIntent =
        await stripe.paymentIntents.retrieve(
          existingPayment
            .stripePaymentIntentId
        );
    } else {
      paymentIntent =
        await stripe.paymentIntents.create({
          amount: stripeAmount,

          currency: 'aed',

          automatic_payment_methods: {
            enabled: true
          },

          metadata: {
            appointmentId:
              appointment._id.toString(),

            patientId:
              patient._id.toString(),

            doctorId:
              doctor._id.toString(),

            userId:
              req.user.id.toString()
          }
        });
    }

    const payment =
      await Payment.findOneAndUpdate(
        {
          appointmentId:
            appointment._id
        },
        {
          patientId: patient._id,

          doctorId: doctor._id,

          amount,

          currency: 'aed',

          paymentMethod: 'Stripe',

          paymentStatus: 'Pending',

          stripePaymentIntentId:
            paymentIntent.id
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

    return res.status(200).json({
      message:
        'Payment intent created successfully',

      clientSecret:
        paymentIntent.client_secret,

      paymentId:
        payment._id,

      amount,

      currency: 'AED',

      appointmentId:
        appointment._id
    });
  } catch (error) {
    console.error(
      'Create payment intent error:',
      error
    );

    return res.status(500).json({
      message:
        'Unable to create payment intent',

      error: error.message
    });
  }
};


exports.getMyPayments = async (
  req,
  res
) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient profile not found'
      });
    }

    const payments = await Payment.find({
      patientId: patient._id
    })
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};


exports.getAllPayments = async (
  req,
  res
) => {
  try {
    const payments = await Payment.find()
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};


exports.getPaymentByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: 'Invalid appointment ID'
      });
    }

    const payment = await Payment.findOne({
      appointmentId
    })
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    // Patient can view only their own payment
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({
        userId: req.user.id
      });

      if (!patient) {
        return res.status(404).json({
          message: 'Patient profile not found'
        });
      }

      if (
        payment.patientId._id.toString() !==
        patient._id.toString()
      ) {
        return res.status(403).json({
          message: 'You are not allowed to view this payment'
        });
      }
    }

    return res.status(200).json(payment);
  } catch (error) {
    console.error(
      'Get payment by appointment error:',
      error
    );

    return res.status(500).json({
      message: 'Unable to get payment',
      error: error.message
    });
  }
};