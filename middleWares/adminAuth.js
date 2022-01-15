const admin = require('../model/admin/adminData');


module.exports = {

     adminCheck  :(req,res, next)=>{
          if(req.session.adminId){
               next()
          }else{
              res.redirect('/admin/signup');
          }
     },

     validationOfAdmin: async (userName , password)=>{
         return new Promise( async (resolve , reject)=>{
          const result = await admin.findOne({})
          if(result.userName == userName){
               if(result.password == password){
                    resolve(true);
               }else{
                    resolve("wrong Password ");
               }
          }else{
               resolve("wrong User Name");
          }
         })
     },

     dontGoBack: (req,res, next)=>{
          if(req.session.adminId){
              res.redirect(req.session.adminLastRoute);
          }else{
               next();
          }
     },
     signUPAdmin  : async  (userName , password)=>{
                    
               return new Promise( async (resolve,reject)=>{
                    try{
                         var result = await admin.findOne({
                              "userName":userName,
                              "password":password
                         })
                    if(result === null)reject("sorry worng Input ")
                    else{
                        resolve(result._id);
                    }
                    }catch(err){
                    console.log(err);
                    }
               })
     }
}

