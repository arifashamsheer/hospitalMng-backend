const express=require('express');

const router=express.Router();

const auth=require('../middleware/authMiddleware');

const adminController=require('../controllers/admin.controller');


router.get(
'/stats',
auth,
adminController.getDashboardStats
);


module.exports=router;