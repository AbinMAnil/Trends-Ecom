const mongoose = require("mongoose");
const schema = mongoose.Schema;


const imageModel = new schema ({
     imageUrl : {
          type : String ,
          default : null
     },
     publicId : {
          type : String ,
          default : null
     }
})

const banner = new schema({
     header:{
          type:String,
          
     },
     about:{
          type:String,
          
     },
     link : {
          type :String
     },
     image:imageModel
})
  
const  bannerModel = mongoose.model("addBanner", banner);
module.exports = bannerModel;