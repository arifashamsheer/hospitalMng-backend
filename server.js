const connectDB=require('./config/db')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const app = express()
// const port = 3000
const PORT = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI
//middleware
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hospital management system API running')
})
//Routes
const patientRoutes=require('./routes/patient.routes')
const doctorRoutes=require('./routes/doctor.routes')
const appointmentRoutes=require('./routes/appointment.routes')
app.use('/api/patients',patientRoutes)
app.use('/api/doctors',doctorRoutes)
app.use('/api/appointments',appointmentRoutes)
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('DB Error:', err.message)
  })
