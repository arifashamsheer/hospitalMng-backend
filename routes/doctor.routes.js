const express=require('express')
const router= express.Router()

const auth=require('../middleware/authMiddleware')
const roleMiddleware= require('../middleware/roleMiddleware')

const doctorController=require('../controllers/doctor.controller')
router.get('/public/list',doctorController.getPublicDoctors);

router.get('/me', auth, roleMiddleware(['doctor']), doctorController.getMyDoctorProfile);
router.put('/me',auth,roleMiddleware(['doctor']),doctorController.updateMyDoctorProfile);
router.post('/',auth, roleMiddleware(['admin']),doctorController.createDoctor)
router.get('/',auth,doctorController.getDoctors)


router.get('/:id',auth,doctorController.getDoctorById)
router.put('/:id',auth, roleMiddleware(['admin','doctor']),doctorController.updateDoctor)
router.delete('/:id',auth, roleMiddleware(['admin']),doctorController.deleteDoctor)
router.patch('/:id/status',auth,roleMiddleware(['admin']),doctorController.updateDoctorStatus);

module.exports=router