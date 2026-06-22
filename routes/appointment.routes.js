const express=require('express')
const router= express.Router()

const auth=require('../middleware/authMiddleware')
const roleMiddleware= require('../middleware/roleMiddleware')
const appointmentController=require('../controllers/appointment.controller')

router.post('/',auth, roleMiddleware(['patient','admin']),appointmentController.createAppointment)

router.get('/:id',auth,roleMiddleware(['admin', 'doctor','patient']),appointmentController.getAppointmentById)
router.put('/:id',auth,roleMiddleware(['patient','admin']),appointmentController.updateAppointment)
router.delete('/:id',auth, roleMiddleware(['admin']),appointmentController.deleteAppointment)
router.get('/',auth,appointmentController.getAppointments)
router.patch('/:id/status',auth,roleMiddleware(['admin', 'doctor']),appointmentController.updatestatus)

module.exports=router