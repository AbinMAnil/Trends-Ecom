const mongoose = require("mongoose");
const schema = mongoose.Schema;

const addresSchema =  new schema({
    
    firstName:String,
    secondeName:String,
    phone:Number,
    email:String,
    address:String,
    landMark:String,
    city:String,
    poatalCode:Number,
    state:String,
    country:String
})


module.exports = addresSchema;