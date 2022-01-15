const mongoose = require('mongoose');
const scehma = mongoose.Schema;

const wishlist = new scehma({
     userId:{
          type:String,
          required:false
     },
     product:{
          required:true,
          type:Array
     }

})
const wishlistModel = mongoose.model('wishlist' , wishlist);
module.exports = wishlistModel;