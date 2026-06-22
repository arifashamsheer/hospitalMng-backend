const Appointment=require('../models/Appointment')
const Doctor= require('../models/Doctor')
exports.createAppointment = async(req,res) =>{
    try
    {
     const doctor= await Doctor.findById(req.body.doctorId)
     if(!doctor)
     {
 return res.status(404).json({ message: "Doctor not found" });
     }
     if(!doctor.availability.includes(req.body.time))
     {
      return res.status(400).json({ message: "Doctor not available at this time" });
     }

     const existing= await Appointment.findOne({
      doctorId:req.body.doctorId,
      date:req.body.date,
      time:req.body.time
     })
     if(existing)
     {
        return res.status(400).json({ message: "Time slot already booked" });
     }
     const appointment=await Appointment.create(req.body)
      res.status(201).json(appointment);
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getAppointments=async(req,res) =>{
    try
    {
      let appointments
      if(req.user.role === 'admin')
      {
       appointments= await Appointment.find().populate('patientId').populate('doctorId')
      }
      else if(req.user.role === 'doctor')
      {

        const doctor= await Doctor.findOne({userId:req.user.id})
        if(!doctor)
        {
           return res.status(404).json({
      message: "Doctor profile not found"
    });
        }
        appointments= await Appointment.find({doctorId:doctor._id}).populate('patientId').populate('doctorId')
      }
      else if(req.user.role === 'patient')
      {
        appointments= await Appointment.find({patientId:req.user.id}).populate('patientId').populate('doctorId')
      }
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
exports.updatestatus=async(req,res)=>{
  try
  {
    if(!['admin','doctor'].includes(req.user.role))
    {
      return res.status(403).json({
        message: "Not allowed"
      });
    }
    const { status }=req.body;
    const allowed=['Pending','Approved','Cancelled','Completed']
    if(!allowed.includes(status))
    {
       return res.status(400).json({
        message: "Invalid status"
      });
    }
    const appointment=await Appointment.findByIdAndUpdate(req.params.id,{ status },{new:true})
     if (!appointment) 
      {

      return res.status(404).json({
        message: "Appointment not found"
      });

    }
    res.json(appointment)
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
  
}