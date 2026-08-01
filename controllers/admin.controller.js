const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');


exports.getDashboardStats = async(req,res)=>{

try{

const patients = await Patient.countDocuments();

const doctors = await Doctor.countDocuments();

const appointments = await Appointment.countDocuments();

const pendingAppointments =
await Appointment.countDocuments({
    status:"Pending"
});


res.json({

patients,
doctors,
appointments,
pendingAppointments

});


}
catch(error){

res.status(500).json({
message:error.message
});

}


}