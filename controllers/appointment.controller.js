const Appointment=require('../models/Appointment')
exports.createAppointment = async(req,res) =>{
    try
    {
     const appointment= await Appointment.create(req.body)
     res.status(201).json(appointment)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getAppointments=async(req,res) =>{
    try
    {
      const appointments= await Appointment.find().populate('patientId').populate('doctorId')
      res.json(appointments)

    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getAppointmentById=async(req,res)=>{
    try
    {
  const appointment=await Appointment.findById(req.params.id).populate('patientId').populate('doctorId')
  res.json(appointment)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.updateAppointment=async(req,res)=>{
    try
    {
     const appointment=await Appointment.findByIdAndUpdate(req.params.id,req.body,{new:true})
     res.json(appointment)
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}
exports.deleteAppointment=async(req,res)=>{
    try
    {
      const appointment= await Appointment.findByIdAndDelete(req.params.id)
      res.json({message: 'appointment deleted successfully'})
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}