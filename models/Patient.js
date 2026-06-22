const mongoose= require('mongoose')
const patientSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
   name:{
        type:String,
        required:true
    },

    age:{
        type:Number
    },
    gender:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    medicalHistory:{
        type:String
    },
    phone:{
        type:String
    }

},
{
    timestamps:true
})
module.exports=mongoose.model('Patient',patientSchema)