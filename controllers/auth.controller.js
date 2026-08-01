const User=require('../models/User.js');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

exports.register = async(req,res)=>{

try{


const {
name,
email,
password,
role,
age,
gender,
phone,
medicalHistory,
specialization,
availability
}=req.body;



const existingUser = await User.findOne({email});


if(existingUser){

return res.status(400).json({
  message: "Email already exists"
});

}



const hashedPassword =
await bcrypt.hash(password,10);



const user=new User({

name,

email,

password:hashedPassword,

role

});


await user.save();





if(role==="patient"){


await Patient.create({

userId:user._id,

name,

email,

age,

gender,

phone,

medicalHistory

});


}


 if (role === "doctor") {

      await Doctor.create({
        userId: user._id,
        name,
        email,
        phone,
        specialization,
        availability,
        isActive: true
      });

    }

res.json({

message:"User registered successfully"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


}
exports.login= async (req,res)=>{
    try{
    const { email,password } =req.body;
    const user= await User.findOne({email})

    if(!user)
    {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        return res.status(400).json({ message: "invalid Password" });
    }
    const token = jwt.sign(
  { id: user._id, role: user.role, email: user.email  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

    res.json({token,user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    } })
}
catch(error)
{
     res.status(500).json({ message: error.message });
}
}