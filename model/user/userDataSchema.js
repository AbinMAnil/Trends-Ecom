const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchma = require('./userAddress')



const userSchecma = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },
    coupones : {
        type : Array,
        required : false
    },
    usedCoupone: {
        type : Array ,
        required: false
    },
    wallet: {
        type:Number,
        required: false
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refCode : {
        type:String,
        required:false
    },
    blockStatus:{
        type:Boolean,
        default:false,
    },
    address:[addressSchma],

    image : {
        type : Object,
    } 

}, {timestamps:true } )

const userData = mongoose.model('user',userSchecma)
module.exports = userData;
