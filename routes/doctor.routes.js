const express=require('express')
const router= express.Router()

const auth=require('../middleware/authMiddleware')
const roleMiddleware= require('../middleware/roleMiddleware')

const doctorController=require('../controllers/doctor.controller')

router.post('/',auth, roleMiddleware(['admin']),doctorController.createDoctor)
router.get('/me', auth, roleMiddleware(['doctor']), doctorController.getMyDoctorProfile);
router.get('/',auth,doctorController.getDoctors)

router.get('/:id',auth,doctorController.getDoctorById)
router.put('/:id',auth, roleMiddleware(['admin']),doctorController.updateDoctor)
router.delete('/:id',auth, roleMiddleware(['admin']),doctorController.deleteDoctor)

module.exports=router