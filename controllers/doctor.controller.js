const Doctor=require('../models/Doctor')
exports.createDoctor = async(req,res) =>{
    try
    {
     const doctor= await Doctor.create(req.body)
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
      const doctors= await Doctor.find()
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
      const doctor= await Doctor.findByIdAndDelete(req.params.id)
      res.json({message: 'Doctor deleted successfully'})
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}