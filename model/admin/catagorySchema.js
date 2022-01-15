const mongoose = require('mongoose');
const scehma = mongoose.Schema;

const catagorySchema = new scehma({
     catagory:{
          type :String,
          required:true
     },
     subCatagory:{
          type:Array
     },
     image:{
          type:String
     }

})

const catagoryData = mongoose.model('catagory' , catagorySchema);
module.exports = catagoryData;