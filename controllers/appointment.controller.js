const Appointment=require('../models/Appointment')
const Doctor= require('../models/Doctor')
const Patient = require('../models/Patient')
const mongoose = require('mongoose');
exports.createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      reason
    } = req.body;

    if (
      !doctorId ||
      !date ||
      !time ||
      !reason
    ) {
      return res.status(400).json({
        message:
          'Doctor, date, time and reason are required'
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(400).json({
        message: 'Invalid doctor ID'
      });
    }

    const doctor = await Doctor.findById(
      doctorId
    );

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    if (doctor.isActive === false) {
      return res.status(400).json({
        message:
          'Doctor is currently inactive'
      });
    }

    if (
      !doctor.availability.includes(time)
    ) {
      return res.status(400).json({
        message:
          'Doctor is not available at this time'
      });
    }

    const existingAppointment =
      await Appointment.findOne({
        doctorId,
        date,
        time,
        status: {
          $ne: 'Cancelled'
        }
      });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'Time slot already booked'
      });
    }

    let selectedPatient;

    /*
     * Admin creates an appointment for the
     * patient selected in the form.
     */
    if (req.user.role === 'admin') {
      if (!patientId) {
        return res.status(400).json({
          message: 'Patient is required'
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          patientId
        )
      ) {
        return res.status(400).json({
          message: 'Invalid patient ID'
        });
      }

      selectedPatient =
        await Patient.findById(patientId);
    }

    /*
     * A patient can book only for their own
     * patient profile.
     */
    else if (req.user.role === 'patient') {
      selectedPatient =
        await Patient.findOne({
          userId: req.user.id
        });
    } else {
      return res.status(403).json({
        message:
          'You are not allowed to create appointments'
      });
    }

    if (!selectedPatient) {
      return res.status(404).json({
        message: 'Patient profile not found'
      });
    }

    const appointment =
      await Appointment.create({
        patientId: selectedPatient._id,
        doctorId,
        date,
        time,
        reason: reason.trim(),
        status: 'Pending'
      });

    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate('patientId')
        .populate('doctorId');

    return res.status(201).json({
      message:
        'Appointment created successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error(
      'Create appointment error:',
      error
    );

    return res.status(500).json({
      message:
        'Unable to create appointment',
      error: error.message
    });
  }
};
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
        console.log("LOGIN USER:", req.user);
        const doctor= await Doctor.findOne({userId:req.user.id});
        console.log("DOCTOR RESULT:", doctor);

        
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
        const patient = await Patient.findOne({userId: req.user.id});
        if (!patient) {
    return res.status(404).json({
        message: "Patient profile not found"
    });
}
        appointments= await Appointment.find({ patientId: patient._id}).populate('patientId').populate('doctorId')
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
  if (!appointment) {
    return res.status(404).json({
        message: "Appointment not found"
    });
}
  res.json(appointment)
    }
    catch(error)
    {
      res.status(500).json({error:error.message})
    }
}
exports.updateAppointment = async (req, res) => {

  try {

    const appointment = await Appointment
      .findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {

      return res.status(404).json({
        message: "Appointment not found"
      });

    }


    // ADMIN can update any appointment

    if (req.user.role === 'admin') {

      const updatedAppointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      return res.json(updatedAppointment);

    }


    // PATIENT can update only their own appointment

    if (req.user.role === 'patient') {

      const patient = await Patient.findOne({
        userId: req.user.id
      });

      if (!patient) {

        return res.status(404).json({
          message: "Patient profile not found"
        });

      }


      if (
        appointment.patientId._id.toString() !==
        patient._id.toString()
      ) {

        return res.status(403).json({
          message: "You can update only your own appointment"
        });

      }


      // Don't allow patient to change status

      const {
        doctorId,
        date,
        time,
        reason
      } = req.body;


      const updatedAppointment =
        await Appointment.findByIdAndUpdate(

          req.params.id,

          {
            doctorId,
            date,
            time,
            reason
          },

          {
            new: true
          }

        );


      return res.json(updatedAppointment);

    }


    return res.status(403).json({
      message: "Access denied"
    });


  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};
exports.deleteAppointment = async (req, res) => {

  try {

    const appointment =
      await Appointment.findById(req.params.id);


    if (!appointment) {

      return res.status(404).json({
        message: "Appointment not found"
      });

    }


    // ADMIN can delete any appointment

    if (req.user.role === 'admin') {

      await Appointment.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        message: "Appointment deleted successfully"
      });

    }


    // PATIENT can delete/cancel only own appointment

    if (req.user.role === 'patient') {

      const patient =
        await Patient.findOne({
          userId: req.user.id
        });


      if (!patient) {

        return res.status(404).json({
          message: "Patient profile not found"
        });

      }


      if (
        appointment.patientId.toString() !==
        patient._id.toString()
      ) {

        return res.status(403).json({
          message:
            "You can cancel only your own appointment"
        });

      }


      // Better to cancel instead of permanently deleting

      appointment.status = "Cancelled";

      await appointment.save();


      return res.json({
        message:
          "Appointment cancelled successfully",
        appointment
      });

    }


    return res.status(403).json({
      message: "Access denied"
    });


  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};
exports.updatestatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'Approved',
      'Cancelled',
      'Completed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid appointment status'
      });
    }

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true
        }
      )
        .populate('patientId')
        .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      message:
        'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    return res.status(500).json({
      message:
        'Failed to update appointment status',
      error: error.message
    });
  }
};
