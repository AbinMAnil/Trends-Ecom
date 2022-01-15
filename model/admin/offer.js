const mongoose = require('mongoose');
const schema = mongoose.Schema;

const offerSchema = new schema({
     offerName : {
          type : String ,
           required:true
     },
     offerPercentage : {
          type : Number,
          required : true
     },
     expireDate : {
          type : String,
          required: true
     }
} , {timestamps : true});


const offer = mongoose.model("offer" , offerSchema);
module.exports  = offer ;