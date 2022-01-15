const mongoose = require("mongoose");
const cloudinary = require("../../API/cloudnary");
const user = require('../../model/user/userDataSchema');
const API = require('../../API/twilio');
const { response } = require("../../app");
const middleWare = require("../../middleWares/userAuth");
const objectId = mongoose.Types.ObjectId;
const product = require('../../model/admin/prductSchema');
const { json } = require("express");
const catagory = require('../../controllers/admin/adminCatagory');
const cart = require('../../controllers/user/cart');
const cartModel = require('../../model/user/cart');
const gustCartModel = require('../../model/user/gustUser');
const wishlist = require('../../model/user/wishlist');
const referralCodeGenerator = require('referral-code-generator');
const { pre } = require("../../model/user/userAddress");

function distroyImage(imageUid ){
     
     return new Promise((resolve,reject)=>{
          cloudinary.uploader.destroy(imageUid, function (error, result) {
                    //upload new image ;

             });
     })
}

function uploadImage(base64){
     return new Promise((resolve , reject)=>{

          var temData = base64.split(";base64,").pop();
          var uploadStr = "data:image/jpeg;base64," + temData;
          cloudinary.uploader.upload(uploadStr, (err, result) => {
          if (err) console.log(err);
          else {
          var urlAndId = {
               imageUrl: result.secure_url,
               publicId: result.public_id,
          };
          console.log(result.publicId);
          resolve(urlAndId);
          }
          });

     })
}


// function to check the user is exists;

function findUserByMail(email){
    return new Promise( async (resolve, reject)=>{
    var result = await user.findOne(
          {
               email:email,  
              
          }
     )
     
     if(result == "")resolve(null)
     else{
          resolve(result);
     }
    })
}

//function to check the users phone number is exists or not
function findUserByPhone(phone){
     phone+= '.0';
     return new Promise( async (resolve,reject)=>{
          var result = await user.findOne(
               {
                    phone:parseInt(phone)
               }
          )
         
          if(result == "")resolve(null)
          else{
               resolve(result);
          }
     })
}

// function  to  inser user FullData 
function insertDataOfUser(data){
     return new Promise( async (resolve,reject)=>{
          var newUser = user(data);
         resolve(await  newUser.save());
     })
};

// function to get products of  wishlist
function getWishlistProducts (userId){
     return new Promise(async (resolve, reject)=>{
          var result =  await wishlist.aggregate([
               {$match : {userId  :userId }  },
               {$unwind :"$product"} ,
               
               {$lookup: {
                         from: "products",
                         localField: "product.productId",
                         foreignField: "_id",
                         as: "productArray",
                   
                   } 
                },

                {
                     $project : {'productArray' : 1 , _id : 0 }
                },
                {$unwind : "$productArray"}
               
               
               ])
               resolve(result);

     })
}


module.exports = {

     // the insert data of  the user;
     insertUser: async  (data)=>{
          return new Promise(async (resolve , reject)=>{
               delete data.gustUserId;
          const {refId , userName , email , passwrod , phone}= data;

          if(refId == ""){
               console.log("no refer Id ");
               //check the email is exist in the  data base 
               var existUser = await user.findOne({email : email});
               if(existUser == null){

                    // make an  referId to the user and   it on the userId;
                    data.refCode =  referralCodeGenerator.alphaNumeric('uppercase', 5, 3);
                    data.phone =  parseInt(data.phone);
                    data.wallet = parseInt(0)
                    try{
                    var newUser = user(data);
                    var result = await  newUser.save()
                    resolve({status : true , _id: result._id });
                    }catch(err){
                         console.log(err);
                         reject("somthing went wrong ")
                    }
               }else{
                    reject('Email is exist in the database ')
               }
          }else{
               // user have refrel code
               // update cash on the  referd user wallet;
               let updateReferdUser = await user.updateOne(
                    {
                         refCode : refId
                    },
                    {
                        $inc:{
                            wallet: +50
                        }
                    }
               )
               // also gave 25 rupees to the user while creataing ;

               data.refCode =  referralCodeGenerator.alphaNumeric('uppercase', 5, 3);
                    data.phone =  parseInt(data.phone);
                    data.wallet = parseInt(25) ; 
                    try{
                    var newUser = user(data);
                    var result = await  newUser.save()
                    resolve({status : true , _id: result._id });
                    }catch(err){
                         console.log(err);
                         reject("somthing went wrong ")
                    }
          }

          })
    
     },

     sendOtpToUser:(phone)=>{
          return new Promise( async (resolve , reject)=>{
             if(await findUserByPhone(phone) === null){
               try{
                    resolve(  await  API.sendOtp(phone));
                   }catch(err){
                        console.log(err);
                    reject("sorry somthing went wrong ");
                   }
             }else{
                  reject("The Phone number is already exists Please Do login ")
             }

          
          })
     },

     checkOtp:(phone, otp)=>{
          return new Promise( async (resolve, reject)=>{
              try{
               var result = await  API.checkOtp(otp , phone);

               if(result) {
                    var userData =  await findUserByPhone(phone)
                   if(userData.blockStatus == false){
                       
                         var resoponseData = {
                              status:true,
                              userId: userData._id
                         }
                         resolve(resoponseData);
                    }else{
                         var resoponseData = {
                              status:"Sorry You are blocked by the admin",
                              userId: ""
                         }
                         resolve(resoponseData);
                    }
                    
               }
               else {
                    var resoponseData = {
                         status: '  Wrong OTP' ,
                         userId: ""
                    }
                    
                    resolve(resoponseData)
               
               }
              }catch(err){
               console.log("error in  the otp validtion");
                 console.log(err);
                
              }
              
          })
     },

     checkOtpforNewUser:(phone, otp)=>{
          return new Promise( async (resolve, reject)=>{
              try{
               var result = await  API.checkOtp(otp , phone);

               if(result) {
                   var userExits = await   user.findOne({phone: phone})
                   if(userExits == null){
                    let resoponseData = {
                         status: true ,
                         userId: ""
                    }
                    resolve(resoponseData);
                        
                   }else{
                    let resoponseData = {
                         status: false ,
                         userId: "phone number is already exists  Please do login"
                    }
                    resolve(resoponseData);
                        
                   }
               }
               else {
                    let resoponseData = {
                         status: '  Wrong OTP' ,
                         userId: ""
                    }
                    
                    resolve(resoponseData)
               
               }
              }catch(err){
               console.log("error in  the otp validtion");
                 console.log(err);
                
              }
              
          })
     },


     sendOtpToExistingUser:(phone)=>{

          return new Promise(async (resolve, reject)=>{
               try{
                    var result = await  findUserByPhone(phone)
                   
                  if(await result   !== null){
                       if(result.blockStatus === false){
                      resolve( await  API.sendOtp(phone) )
                       }else{
                            resolve("Sorry You Are Blocked By the Admin");
                       }
                  }else{
                    resolve("This phone number is not Exists Please Create An Account")
                  }
               }catch(err){
                    console.log(err);
               }
          })
     },

     checkUserSignup :(email , password)=>{
          return new Promise( async (resolve , reject)=>{
                    var result = await findUserByMail(email);

                   if(result === null) {

                   resolve("sorry ! cannot find The Email ID ")
                   }
                   else{
                        if(result.blockStatus === false){
                         // NOW COMPARE THE PASSWORDS;
                         var finalData = await middleWare.comparePassword(password , result.password)
                         if (finalData ){
                            
                             var data = {
                                   status : true,
                                   data : await findUserByMail(email)
                             } 
                              resolve(data);
                         }
                         else{
                              resolve("Wrong  password ");
                         }
                    }else{
                         resolve('You are Blocked By the admin ');
                    }
                   }
          })
     } , 
     getCartCount :async (req,res)=>{
         if(req.session.uid){
              var cartProduct = await cartModel.findOne({userId : req.session.uid});
              if(cartProduct == null ){
                   res.json({count : 0});
                   return ; 
              }

              res.json({count : cartProduct.product.length});
              return ;
         }

         var gustUserCart = await gustCartModel.findOne({userId : req.body.id});

         if(gustUserCart == null ){
              res.json({count : 0});
              return ; 
         }
         res.json({count : gustUserCart.product.length});    
         return ; 
      }, 
     getUserById: (id)=>{
          return new Promise(async (resolve ,reject)=>{
               resolve(
                    await user.findOne({_id : objectId(id)})
               )
          })
     },

     editProfile: async (id , data)=>{
               return new Promise( async  (resolve ,reject)=>{
                    var result = await user.updateOne(
                         {
                              _id : objectId(id)
                         },
                         {
                              name: data.name,
                              email : data.email ,
                               
                         }
                    )
                    
                    
               })
     },

     changePassword: async (req,res)=>{
           var result = await user.findOne({_id : objectId(req.session.uid)});
          res.json({status : await middleWare.comparePassword(req.body.password , result.password)});
     },
     confirmPasswordLast : async (req,res)=>{
          var result = await user.updateOne(
               {
                  _id : (req.session.uid)  
               },
               {
                    password :await  middleWare.hashPassword(req.body.pass)
               }
          )
         if(result.modifiedCount == 1){ res.json({status : true}) };
     },
     showWishlist : async (req,res)=>{
          var data 
          if(req.session.uid){
               data =  await  getWishlistProducts(req.session.uid)
               }else{
                   data = [] 
               }
               console.log(data);
          res.render('user/wishlist' , {logStatus: req.session.loginStatus,
               catagory: await catagory.getAllCatagory(),
               data: data
          })
     },
     addToWishlist :async (req,res)=>{
          // check  the user have an collection in wishlist
          if(req.session.uid){
          var result = await  wishlist.findOne({userId : req.session.uid});
          if(result == null){
               var data = {
                    userId : req.session.uid,
                    product : [{productId : objectId(req.body.id)}]
               }
               var insertWishlist = await  wishlist(data)
              var lastInsert = await  insertWishlist.save();
                  if(lastInsert.modifiedCount == 1) res.json({status  : true})

          }else{
                    // user has a document in  the collection 
                    var  up = await wishlist.updateOne(
                         {
                              userId : req.session.uid
                         },
                         {
                              $addToSet : {
                                   product : {productId : objectId(req.body.id)}
                              }
                         }
                    )
                   if(up.modifiedCount == 1) res.json({status  : true})
          }     /*-------user is not logind ----------*/
          }else{
             res.json({status : false});
          }
     },
     removeFromWishlist : async (req,res)=>{
          var result = await wishlist.updateOne(
               {
                    userId : req.session.uid
               },
               {
                    $pull:{
                        product:{ 'productId' : objectId(req.body.id)}
                    }
               }
          )
          if(result.modifiedCount == 1)res.json({status : true});
     }, 

     uploadProfile : async (req,res)=>{
          console.log("hello -------------in the  contrller of image upload")
          var preImage = await user.findOne({_id : objectId(req.session.uid)});
         

          if(preImage.image  == null){
              updateQuery = await uploadImage(req.body.base64);
          }else{
               distroyImage(preImage.image.publicId);
              updateQuery = await uploadImage(req.body.base64);
          } 

          console.log(updateQuery);

          try{
               var result = await user.updateOne(
                    {
                         _id : objectId(req.session.uid)
                    },
                    {
                         $set:{
                                   'image.imageUrl' : updateQuery.imageUrl,
                                   'image.publicId'  : updateQuery.publicId
                         }
                    }
               )
               res.json({status : true});
          }catch(err){
               
               consle.log(err);
               res.json({status : false});
          }

     }

     
}