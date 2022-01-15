

const Razorpay = require('razorpay')
const crypto = require("crypto")
const dotEnv = require('dotenv');
dotEnv.config();
const orderAmount = require('./cart');

async function getAmount (uid){
     return new Promise(async (resolve,reject)=>{
          var result = await orderAmount.getCartForCheckOut(uid);
          resolve(result.grandTotal);
     })
}


var instance = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret:process.env.RAZORPAY_KEY_SECRECT,
   });
  
   module.exports = {

  
   // api for generate the order id ;
      createOrder : async (req,res)=>{
     console.log("ya in the server to generate the order id ");
       var options = {
         amount: req.body.amount*100 ,  // amount in the smallest currency unit
         currency: "INR",
         receipt: "new_recipt_id"
       };
       instance.orders.create(options,async  function(err, order) {
         res.send({orderId :order.id , amount : await getAmount(req.session.uid) });
       })
       
   },

  //  // veify 
   verifyRazorPay : async (req,res)=>{
   
     let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    
      var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRECT )
                                      .update(body.toString())
                                      .digest('hex');
                                      console.log("sig received " ,req.body.response.razorpay_signature);
                                      console.log("sig generated " ,expectedSignature);
      var response = {"signatureIsValid":"false"}
      if(expectedSignature === req.body.response.razorpay_signature){
        console.log('payment successufull.........')
       response={"signatureIsValid":true}
          res.send(response);
      }else{
        console.log("payment failed..........")
        response={"signatureIsValid":false}
          res.send(response);
      }
      }
   
}
   
    
   
   