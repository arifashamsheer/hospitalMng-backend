const mongoose=require('mongoose');

const doctorSchema=new mongoose.Schema({

userId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:'User',
 required:true
},

name:String,

specialization:String,

phone:String,

email:String,

availability:{
      type: [String],
      default: []
    },
profileImage: {
  type: String,
  default: ''
},
isActive:{
 type:Boolean,
 default:true
},
consultationFee: {
  type: Number,
  required: true,
  min: 0,
  default: 100
}

},{
timestamps:true
});


module.exports=mongoose.model('Doctor',doctorSchema);