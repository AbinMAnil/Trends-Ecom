const mongoose = require('mongoose');
const schema = mongoose.Schema;
// {{ creating the struecture of the size Varient array}}

const pruductScheme = new schema ( {
     productName: {
          type: String,
          required:true
     },
     brand: {
          required :true ,
          type : String
     },
     catagory:{
          type:String,
          required:true
     },
     subCatagory:{
          type:String,
          required:true
     },
     image:{
          type:Array,
          required:true
     },

     discription :{
          type:String,
          required:false
     },
     color:{
          required:true,
          type:Array
     },
     size:{
          required:true,
          type:Array
     },
     price : {
          required:true,
          type:Number
     },
     quantity : {
          required:true,
          type : Number
     },
     offerPrice :{
          type : Number ,
          required : false,
          default : null
     },
     offerName : {
          type : String,
          required:false,
          default : null
     },
     offerPercentage : {
          type : Number ,
          required : false,
          default : null
     
     }
} , {timestamps:true});

const productModel = mongoose.model('product', pruductScheme);
module.exports = productModel;