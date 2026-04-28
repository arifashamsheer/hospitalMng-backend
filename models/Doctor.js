const mongoose= require('mongoose')
const  doctorSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   specialization:{
    type:String,

   },
   phone:{
    type:String
   },
   email:{
    type:String,
    unique:true
   },
   availability:{
    type:String
   }

},
{
    timestamps: true
})
module.exports=mongoose.model('Doctor',doctorSchema)