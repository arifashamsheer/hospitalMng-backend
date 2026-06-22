const Patient=require('../models/Patient')
exports.createPatient = async(req,res) =>{
    try
    {
     const patient = await Patient.create({
      userId: req.user.id,   
      ...req.body
    });
     res.status(201).json(patient)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getPatients=async(req,res) =>{
    try
    {
      const patients= await Patient.find()
      res.json(patients)

    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.getPatientById=async(req,res)=>{
    try
    {
  const patient=await Patient.findById(req.params.id)
  res.json(patient)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.updatePatient=async(req,res)=>{
    try
    {
     const patient=await Patient.findByIdAndUpdate(req.params.id,req.body,{new:true})
     res.json(patient)
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}
exports.deletePatient=async(req,res)=>{
    try
    {
      const patient= await Patient.findByIdAndDelete(req.params.id)
      res.json({message: 'Patient deleted successfully'})
    }
    catch(error)
    {
     res.status(500).json({error:error.message})
    }
}
exports.getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};