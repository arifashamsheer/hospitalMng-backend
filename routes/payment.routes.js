const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const paymentController = require(
  '../controllers/payment.controller'
);

// Patient creates a Stripe PaymentIntent
router.post(
  '/create-payment-intent',
  auth,
  roleMiddleware(['patient']),
  paymentController.createPaymentIntent
);

// Patient views their own payments
router.get(
  '/my',
  auth,
  roleMiddleware(['patient']),
  paymentController.getMyPayments
);

// Admin views all payments
router.get(
  '/',
  auth,
  roleMiddleware(['admin']),
  paymentController.getAllPayments
);

// Admin or patient views payment for an appointment
router.get(
  '/appointment/:appointmentId',
  auth,
  roleMiddleware(['admin', 'patient']),
  paymentController.getPaymentByAppointment
);

module.exports = router;