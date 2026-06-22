const express=require('express')
const router= express.Router()

const auth=require('../middleware/authMiddleware')
const roleMiddleware= require('../middleware/roleMiddleware')

const patientController=require('../controllers/patient.controller')

router.post('/', auth, roleMiddleware(['admin','patient']),patientController.createPatient)
router.get('/me', auth, roleMiddleware(['patient']), patientController.getMyProfile)
router.get('/',auth,patientController.getPatients)
router.get('/:id',auth,patientController.getPatientById)
router.put('/:id', auth, roleMiddleware(['admin']),patientController.updatePatient)
router.delete('/:id', auth, roleMiddleware(['admin']),patientController.deletePatient)

module.exports=router