const Patient=require('../models/Patient')
const Appointment = require('../models/Appointment');
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
  if(!patient){

return res.status(404).json({
message:"Patient not found"
});

}
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
 

}

exports.getPatientAppointments = async(req,res)=>{

try{

const appointments = await Appointment.find({
    patientId:req.params.id
})
.populate('doctorId');


res.json(appointments);


}
catch(error){

res.status(500).json({
    error:error.message
});

}

}




// Get logged-in patient's profile
exports.getMyProfile = async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.user.id
    });

    if (!patient) {

      return res.status(404).json({
        message: 'Patient profile not found'
      });

    }

    res.json(patient);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Update logged-in patient's profile
exports.updateMyProfile = async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.user.id
    });

    if (!patient) {

      return res.status(404).json({
        message: 'Patient profile not found'
      });

    }


    const {
      name,
      age,
      gender,
      phone,
      medicalHistory
    } = req.body;


    patient.name = name;
    patient.age = age;
    patient.gender = gender;
    patient.phone = phone;
    patient.medicalHistory = medicalHistory;


    await patient.save();


    res.json({

      message: 'Patient profile updated successfully',

      patient

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};
