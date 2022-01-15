const mongoose = require('mongoose');
const schema = mongoose.Schema;


const couponeSchema = new schema({
     couponeName : {
          type: String,
          required: true
     },
     couponeCode : {
          type : String ,
          required: true
     },
     couponeOff :{
          type : Number,
          required: true
     },
     expireDate : {
          type : String,
          required: true
     }
})

const couponeModel = mongoose.model('coupone' , couponeSchema);
module.exports = couponeModel;