require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const stripeWebhookController = require(
  './controllers/stripeWebhook.controller'
);

const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

const PORT = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Stripe Webhook
|--------------------------------------------------------------------------
*/
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookController.handleStripeWebhook
);

/*
|--------------------------------------------------------------------------
| General Middleware
|--------------------------------------------------------------------------
*/
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hospital management system API running');
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

/*
|--------------------------------------------------------------------------
| Database Connection and Server
|--------------------------------------------------------------------------
*/
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });