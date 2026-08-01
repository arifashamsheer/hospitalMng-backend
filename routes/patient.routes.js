const express=require('express')
const router= express.Router()

const auth=require('../middleware/authMiddleware')
const roleMiddleware= require('../middleware/roleMiddleware')

const patientController=require('../controllers/patient.controller')

router.post('/', auth, roleMiddleware(['admin','patient']),patientController.createPatient)
router.get('/me', auth, roleMiddleware(['patient']), patientController.getMyProfile)
router.put('/me',auth,roleMiddleware(['patient']),patientController.updateMyProfile);
router.get('/',auth,roleMiddleware(['admin']),patientController.getPatients)
router.get('/:id',auth,roleMiddleware(['admin']),patientController.getPatientById)
router.put('/:id', auth, roleMiddleware(['admin']),patientController.updatePatient)
router.delete('/:id', auth, roleMiddleware(['admin']),patientController.deletePatient)
router.get('/:id/appointments',auth,roleMiddleware(['admin']),patientController.getPatientAppointments)



module.exports=router