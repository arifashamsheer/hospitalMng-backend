const mongoose= require('mongoose')
const  doctorSchema= new mongoose.Schema({
    userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
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
    type:[String]
   },
   isActive: {
    type:Boolean,
    default:true
   }

},
{
    timestamps: true
})
module.exports=mongoose.model('Doctor',doctorSchema)