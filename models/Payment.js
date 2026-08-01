const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: 'aed',
      lowercase: true
    },

    paymentMethod: {
      type: String,
      default: 'Stripe'
    },

    paymentStatus: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Paid',
        'Failed',
        'Cancelled',
        'Refunded'
      ],
      default: 'Pending'
    },

    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true
    },

    stripeChargeId: {
      type: String
    },

    transactionId: {
      type: String
    },

    paidAt: {
      type: Date
    },

    failureMessage: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Payment',
  paymentSchema
);