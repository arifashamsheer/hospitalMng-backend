const Appointment = require('../models/Appointment')
const Doctor=require('../models/Doctor')
exports.createDoctor = async(req,res) =>{
    try
    {
     const doctor= await Doctor.create({
      userId: req.user.id,   
      ...req.body
    })
     res.status(201).json(doctor)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getDoctors=async(req,res) =>{
    try
    {
      let doctors;
      if(req.user.role ==='admin')
      {
          doctors = await Doctor.find();
      }
      else{

 doctors= await Doctor.find({
  $or:[
 { isActive:true},{isActive:{$exists:false}}]
})
      }
      
      res.json(doctors)

    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getDoctorById=async(req,res)=>{
    try
    {
  const doctor=await Doctor.findById(req.params.id)
  res.json(doctor)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.updateDoctor=async(req,res)=>{
    try
    {
     const doctor=await Doctor.findByIdAndUpdate(req.params.id,req.body,{new:true})
     res.json(doctor)
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}
exports.deleteDoctor=async(req,res)=>{
    try
    {
      const appointments=await Appointment.find({
        doctorId:req.params.id
      });
      if(appointments.length>0)
      {
         return res.status(400).json({
        message: "Cannot delete doctor with active appointments"
      });
      }
      const doctor= await Doctor.findById(req.params.id)
      if(!doctor)
      {
        return res.status(404).json({
        message: "Doctor not found"
      });
      }
      doctor.isActive=false;
      await doctor.save();
      res.json({message: 'Doctor deactivated successfully'})
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}
exports.getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.user.id   
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};