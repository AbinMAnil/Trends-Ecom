const offerModel = require("../../model/admin/offer");
const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const product = require("../../model/admin/prductSchema");
const offer = require("../../model/admin/offer");
const couponeCodeGenerator = require('coupon-code');
const  couponeModel = require('../../model/admin/coupone');
const userCart = require('../../model/user/cart');
const userModel = require('../../model/user/userDataSchema');
const cartContrl = require('../../controllers/user/cart');
const DBcart = require("../../model/user/cart");
module.exports = {
  showOfferPage: async (req, res) => {
    res.render("admin/offers", { offers: await offerModel.find() , coupone : await couponeModel.find() });
  },

  saveOffer: async (req, res) => {
    // save the offer into database
    req.body.offerPercentage = parseInt(req.body.offerPercentage);
    try {
      let result = await offerModel(req.body).save();
      res.json({ status: true });
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: "Sorry Somthing Went wrong " });
    }
  },
  deleteOffer: async (req, res) => {
    try {
      var resultName = await offerModel.findOne({ _id: objectId(req.body.id) });
      var upResult = await product.updateMany(
        {
          offerName: resultName.offerName,
        },
        {
          $set: {
            offerName: null,
            offerPercentage: null,
            offerPrice: null,
          },
        }
      );
      var result = await  offerModel.remove({_id : objectId(req.body.id)})
    

      res.json({ status: true, len: await offerModel.find().count() });
    } catch (err) {
      res.json({ status: fales, message: "Somthing went wrong " });
    }
  },

  applyOffer: async (req, res) => {

    var pro = await product.findOne({ _id: objectId(req.body.productId) });
    var offerTem = await offer.findOne({ _id: objectId(req.body.offerId) });

      if(offerTem.offerPercentage > pro.offerPercentage){

      
    var finalPrice = Math.round(
      pro.price - Math.round((pro.price * offerTem.offerPercentage) / 100)
    );

    try {
      var result = await product.updateOne(
        {
          _id: objectId(req.body.productId),
        },
        {
          $set: {
            offerPrice: parseInt(finalPrice),
            offerName: offerTem.offerName,
            offerPercentage: parseInt(offerTem.offerPercentage),
          },
        }
      );
      if (result.modifiedCount == 1) {
        res.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, message: "Somthing Went worng " });
      console.log(err);
    }
      }else{
        res.json({ status : false , message : 'There is already an offer  is more  userfull to user'});
      }
  },

  applyOfferToSubcatagory: async (req, res) => {
    let { catagory, subCat, offerId } = req.body;
    var offerTem = await offer.findOne({ _id: objectId(offerId) });

    var productArray = await product.find({
      catagory: catagory,
      subCatagory: subCat == undefined ? { $regex: "" } : subCat,
    });

    // find the offer price in the loop and also insert the value into the docuemt
    var falg = true;
    for (var i = 0; i < productArray.length; i++) {
      var finalPrice = Math.round(
        productArray[i].price -  Math.round((productArray[i].price * offerTem.offerPercentage) / 100)
      );

      // update into the document
      try {
        var result = await product.updateOne(
          {
            _id: objectId(productArray[i]._id),
          },
          {
            $set: {
              offerPrice: parseInt(finalPrice),
              offerName: offerTem.offerName,
              offerPercentage: parseInt(offerTem.offerPercentage),
            },
          }
        );

        falg = true;
      } catch (err) {
        flag = false;
        res.json({ status: false, message: "Somthing Went worng " });
        console.log(err);
        break;
      }
    }
    if (falg) {
      res.json({ status: true });
    }
  },

  expireOffer:async  () => {
    return new Promise(async (resolve, reject) => {

      // expiriring the coupone 

      var coupone = await couponeModel.find();
      var cpDate =   JSON.stringify(new Date()).substr(1,10)

      let couponeExpire = async ()=>{
        for(var i = 0 ; i< coupone.length ; i++){
          if(coupone[i].expireDate < cpDate ){
            await  couponeModel.remove({_id : coupone[i]._id});
          }
        }

      }
     



      // in the case more than one offer is expired;


      var  offerCount = await  offer.find()

      let expireOfferFun = async () => {
           var date = new Date();
        for (var i = 0; i < offerCount.length; i++) {
               if(offerCount[i].expireDate < JSON.stringify(date).substr(1, 10)){
               // fisrt  remove the offer discounts  form the product page ;
               var upProduct = await product.updateMany(
                    {
                         offerName : offerCount[i].offerName
                    },
                    {
                         $set:{
                              offerName: null,
                              offerPercentage: null,
                              offerPrice: null,
                         }
                    }
               )
               var delResult = await   offer.remove({_id : objectId (offerCount[i]._id) });
               }else{
                    
               }
        }




        resolve(true);
      };
      couponeExpire()
      expireOfferFun();
    });
  },

  eidtOffer : async (req,res)=>{
    let {id } = req.body;
    var data = await offerModel.findOne({_id : objectId(id)})
    res.json(data);
  },


  editOfferConfirm : async (req,res)=>{

  let {offerName , offerPercentage , expireDate , offerId  } = req.body;
    // updatae on the produccts 
  var data = await offer.findOne({_id : objectId(offerId)});
      try{

        var productArray = await product.find({ offerName : data.offerName ,  offerPercentage  : parseInt(data.offerPercentage), expireDate : data.expireDate });
        var falg = true;
        for (var i = 0; i < productArray.length; i++) {
          var finalPrice = Math.round(productArray[i].price -  Math.round((productArray[i].price * offerPercentage  ) / 100)
          );
    
          // update into the document
          try {
            var result = await product.updateOne(
              {
                _id: objectId(productArray[i]._id),
              },
              {
                $set: {
                  offerPrice: parseInt(finalPrice),
                  offerName: offerName,
                  offerPercentage: parseInt(offerPercentage),
                },
              }
            );
    
            falg = true;
          } catch (err) {
            falg = false;
            res.json({ status: false, message: "Somthing Went worng " });
            console.log(err);
            break;
          }
        }

        if(falg){
          res.json({status : true});
        }

        
    // updating in the offer collection also
    var offerUpdate = await offer.updateOne(
      {
        _id : objectId(offerId)
      },
      {
        offerName : offerName ,
        offerPercentage  : parseInt(offerPercentage),
        expireDate : expireDate
      }
    )
    
      }catch(err){

      }

  },
  createCoupone : async (req,res)=>{
      req.body.couponeCode =  couponeCodeGenerator.generate(); 
      try{
        let result = await couponeModel(req.body).save();
        res.json({status : true});
      }catch(err){
         console.log(err)
         res.json({status : false , message  : 'Somthing Went wrong'});
      }
      
  },
  deleteCoupone : async (req,res)=>{
       try{
         var result  = await couponeModel.remove({_id : objectId(req.body.id)});
        res.json({status : true , len : await couponeModel.find().count() })
       }catch(err){
         res.json({status : false , message :"Somthing Went worng" })
       }
  },
  updateCoupone  : async (req,res)=>{
    const couponeId = req.body.couponeId;
    delete req.body.couponeId;
    
    // updating the coupone
   try{
    var result = await couponeModel.updateOne(
      {
        _id : objectId(couponeId)
      },
      req.body
    )
    res.json({status : true});
   }catch(err){
      res.json({status : false , message : 'Somthing went wrong'})
   }
    
  },
  applyCoupone : async (req ,res)=>{
      var coupone = await couponeModel.findOne({couponeCode : req.body.couponeCode});
       if(coupone == null){res.json({status :false , message : 'invalid Coupone Code' })  ; return ;};
       const user = await  userModel.findOne({ _id : objectId(req.session.uid) });
       if(user.usedCoupone.includes(req.body.couponeCode)){res.json({status :false , message : 'coupone already used' })  ; return ;};
       
       // apply coupone;
       const userCart = await cartContrl.getCartForCheckOut(req.session.uid);
      //  calculation 
      const discount = userCart.grandTotal - userCart.grandTotal *  parseInt(coupone.couponeOff)/100;
      // update the coupone into   user's coupon user  array 
      await userModel.updateOne(
        {
          _id: objectId(req.session.uid)
        },
        {
          $push:{
            usedCoupone : req.body.couponeCode
          }
        }
      )

      await userModel.updateOne(
        {
          _id: objectId(req.session.uid)
        },
        {
          $pull:{
            coupone : req.body.couponeCode
          }
        }
      )
      res.json({status : true ,message :  'coupone Applide successFully' , amount : parseInt(discount)})
      
  }
  
};

