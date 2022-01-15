const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderScheam = new schema({
     userId : {
          type:String,
          required:true
     },
     address : {
          type: Object,
          required:true
     },
     product : {
          type:Array,
          required:true
     },
     totalPrice:{
          type:Number,
          required:true
     },
     paymentMethod:{
          type:String,
          required:true
     },
     status:{
          type:Array,
          required : false
     }
} , {timestamps:true})
const orderModel = mongoose.model("orders" , orderScheam);
module.exports  = orderModel