const mongoose = require('mongoose');
const scehma = mongoose.Schema;


const cart = new scehma({
     userId:{
          type:String,
          required:true
     },
     product:{
     required:true,
          type:Array
     }

})

const cartModel = mongoose.model('cart' , cart);
module.exports = cartModel;