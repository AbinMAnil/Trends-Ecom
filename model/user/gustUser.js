const mongoose = require('mongoose');
const scehma = mongoose.Schema;


const gustUsercart = new scehma({
     userId:{
          type:String
          ,
          required:true
     },
     product:{
          required:true,
          type:Array
     }

})

const gustCartModel = mongoose.model('gustUserCart' , gustUsercart);
module.exports = gustCartModel;