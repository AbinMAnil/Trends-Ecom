const mongoose = require("mongoose");
const schema = mongoose.Schema;


const adminScheam = new schema({
     userName:{
          type:String,
          
     },
     password:{
          type:String,
          
     },
     image:{
          type:String,
          required:false
     }
})
  
const  adminData = mongoose.model("admin", adminScheam);
module.exports = adminData;