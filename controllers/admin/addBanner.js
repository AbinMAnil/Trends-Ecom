const banner = require('../../model/admin/adminBanner');
const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const cloudinary = require("../../API/cloudnary");




// function to upload image ;
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
          resolve(urlAndId);
          }
          });

     })
}

function distroyImage(imageUid ){
     return new Promise((resolve,reject)=>{
          cloudinary.uploader.destroy(data.productId, function (error, result) {
                    //upload new image ;

             });
     })
}


module.exports = {
     showPage : async (req,res)=>{
          res.render('admin/addBanner'  ,{ banner : await banner.find()});
     },
     uploadBanner:async (req,res) => {
             let { heading , link , about , image} =  req.body;
              var result = await uploadImage(image);
             try{
                await  banner({
                    header : heading ,
                    about : about ,
                    link : link ,
                    image : result
              }).save();
              res.json({status : true});
             }catch (err){
                  console.log(err);
               res.json({status : false});
             } 
             
              
        }, 
        editBanner  : async (req,res)=>{
             
          let { heading , link , about , image , isImageChange , imageUid , bannerId} =  req.body;


          var updateQuery;

         
         if( isImageChange  == 'true'){
          distroyImage(imageUid);
          var result = await uploadImage(image);
          
                updateQuery = {
               header : heading ,
               about : about ,
               link : link ,
               image : result
          }

               
          }else{
               updateQuery = {
                    header : heading ,
                    about : about ,
                    link : link ,
               }
          }

          try{
               var upResult  = await banner.updateOne(
                    {
                         _id : objectId(bannerId)
                    },
                    {
                         $set:updateQuery
     
                    }
               );
               res.json({status : true})
          }catch(err){
               res.json({status : false})
          }
          
          
        },
        getAllBanners  : ()=>{
             return new Promise(async(resolve , reject)=>{
                    resolve(await banner.find());
             })
        }
}