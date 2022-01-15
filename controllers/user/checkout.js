
const product = require("../../controllers/admin/adminProduct");
const porductModel = require('../../model/admin/prductSchema');
const catagory = require("../../controllers/admin/adminCatagory");
const cart = require("../../model/user/cart");
const mongoose = require("mongoose");
const productModel = require("../../model/admin/prductSchema");
const cartController = require('../../controllers/user/cart');
const userModel = require('../../model/user/userDataSchema');
const objectId = mongoose.Types.ObjectId;
const orderModel = require('../../model/admin/orderSchama')


 function generateUniqueId(){

     return Date.now().toString(36) + Math.random().toString(36).substr(2);
 }

 async  function addAddress(address , id){
     var toatalAddressCount = await userModel.findOne({_id: objectId(id)});
 

     if(toatalAddressCount.address.length > 3 ) { var result = await  userModel.updateOne(

          {
               _id: objectId(id)
          },
          {
             $pop:{
                  address : -1
             }
          }
     ).then(async ()=>{
          var addressUpdate  =  await  userModel.updateOne(
               {
                    _id : objectId(id),
               },
               {
                    $addToSet:{
                         address:address
                    }
               }
          
          ) 
     })
}else{
     var addressUpdate  =  await  userModel.updateOne(
          {
               _id : objectId(id),
          },
          {
               $addToSet:{
                    address:address
               }
          }
     
     ) 
}
     // save the address into users address array;
     
 }
  
//  function to clear cart of the ordered users 
 async function clearCart(id){
     var result = await cart.updateOne(
          {
               userId : id
          },
          {
               product : []
          }
     )
}


//  function to reEntry of quantity of the ordered products
async function canelProductQuantityUpdate(product){
    
     for(var i = 0 ;i< product.length ;i++){
     var result = await productModel.updateOne(
          {
               _id : objectId(product[i].productId)
          },
          {
               $inc:{
                    quantity: product[i].quantity
               }
          }
     )
   


     }
}
 

module.exports = {
     // to show the checkout page 
     showCheckOut : async (req, res)=>{

          if(req.session.uid){
               var result = await cartController.getCartForCheckOut(req.session.uid);
             if(result.product.length >= 1){
          res.render('user/checkOut' , {logStatus: req.session.loginStatus,
               catagory: await catagory.getAllCatagory(),
               product : result,
               user : await userModel.findOne({_id : objectId(req.session.uid)})
          }

               );


                  }else{
                       res.redirect('/cart')
                  }     
          }
          else{
               res.redirect('/signup')
          }
     },
     placeOrder : async (req,res)=>{
         

          
         var userId = req.session.uid
         var paymentMethod = req.body.paymentMethod;
         var saveAddress =req.body.saveAddress ;
         delete req.body['saveAddress'];
         delete req.body['paymentMethod']
         var cartProduct = await cartController.getCartForCheckOut(userId);

          if(cartProduct.grandTotal > 1 ){
               var lastAmount ; 
               if(req.body.amount != undefined) {lastAmount = parseInt(req.body.amount)}
               else{
                    lastAmount = parseInt(cartProduct.grandTotal)
               }
         try{
          var confirmOrder = orderModel({
               userId : objectId(userId),
               product: cartProduct.product,
               totalPrice :lastAmount ,
               paymentMethod : paymentMethod,
               address : req.body ,
               status : ['pending']
          });
          var result = await confirmOrder.save();
         
          // decrease the quantity of  the products from the product collections
         
         
          for(var i = 0 ;i< cartProduct.product.length ;i++){
               // decrease the quaitity
              productModel.updateOne(
                    {
                         _id : objectId(cartProduct.product[i].productId)
                    },
                    {
                         $inc :{
                              quantity: -parseInt(cartProduct.product[i].quantity)
                         }
                    }    
               );
          }

          // to clear the cart of the user;
          clearCart(userId)


          // to save the  address;
          if(saveAddress == true){
               // req.body.addressUniqueId =  generateUniqueId()
               addAddress(req.body, userId);
          }
          res.json({status : result._id , totalPrice :  parseInt(lastAmount) , paymentMethod : paymentMethod});

         // 
         }catch(err){
         res.json({status : false});
              
              console.log(err);
         }
     }else{
          res.json({status : false})
     }

     }, 

     showHistory :async (req,res)=>{
          
          res.render("user/orderConfirmed" ,{logStatus: req.session.loginStatus,
               catagory: await catagory.getAllCatagory() , 
               orders : await  orderModel.find({userId : req.session.uid}).sort( {'createdAt' : -1})
          });
     },

     cancelorder :async (req,res)=>{

          // update the ordre status into cancel ;
          var result = await orderModel.updateOne(
               {
                    _id : objectId(req.body.orderId)
               },
               {
                    $push:{
                         status : "Cancel"
                    }
               }
          );
          var orderProduct = await orderModel.findOne({_id: objectId(req.body.orderId)});
          canelProductQuantityUpdate(orderProduct.product)
          if(result.modifiedCount == 1){
               res.json({status : true});
          }
     },
     getAddressOfUser : async (req,res)=>{

          var result = await userModel.aggregate([

               {$match:{_id  :  objectId(req.session.uid)}} ,
               {$unwind: "$address"},
               {$match: {"address._id" :objectId(req.body.id.trim()) }},
               {$project:{"address" : 1 , _id :0}}
               
               ])
         res.json(result[0])
          
     },

     saveAddress : async (req,res)=>{
          addAddress(req.body , req.session.uid)
          res.json({status : true});
     },
     deleteAddress :async (req,res)=>{
          var result = await userModel.updateOne(
               {_id :objectId(req.session.uid)},

               {$pull: {'address' : {_id : objectId(req.body.id)} }  }
          );
          var addressCount = await userModel.findOne({_id : objectId(req.session.uid)});
          if(result.modifiedCount)res.json({status :true  , address : addressCount.address.length});
          
     },
     getWallet : async (req,res)=>{
          var user =  await userModel.findOne({_id : objectId(req.session.uid)});
          const totalAmount  = await cartController.getAmoutOnlyForWallet(req.session.uid)
          if(user.wallet >= totalAmount){
               console.log("ya aligible")
               res.json({status :true})
          }else{
               res.json({status :false})
          }
     },

     updateWallet : async (req,res)=>{
          var wallet =  await userModel.findOne({_id : objectId(req.session.uid)});
          wallet = wallet.wallet;
          

          if(wallet => req.body.amount){
          const result = await userModel.updateOne(
               {
                    _id :  objectId(req.session.uid)
               },
               {
                    $inc: {
                         wallet : -parseInt(req.body.amount)
                    }
               }
          )
          console.log(result);
          res.json({status : true})
          }else{
               res.json({status : false , message  : "you don't have enough money to purchase"});
          }

     }

   


     
}