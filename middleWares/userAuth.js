
// const crypto = require("crypto")
const bcrypt = require('bcrypt');
var saltRound = 10;


module.exports = {
     hashPassword:(password)=>{
          return new Promise((resolve,rejcet)=>{
               bcrypt.genSalt(saltRound , (err, salt)=>{
                    bcrypt.hash(password , salt ,(err , result)=>{
                         if(err)rejcet(false);
                         else{
                             
                              resolve(result);
                         }
                    })
               })
          })
     },

     comparePassword: (checkPassword , hashPasswrod)=>{
          return new Promise( async (resolve, reject)=>{
            try{
               var result =  await  bcrypt.compare(checkPassword , hashPasswrod) 
               if (result === true) resolve(true)
            else{
                 resolve(false);
            }
            }catch(err){
               console.log(err);
               location.reload();
            }
          })
     } ,

     getUser:(req, res , next)=>{
          
               if(req.session.uid){
                    req.session.loginStatus = true;
               }else{
                   req.session.loginStatus = false;
               }
               next()
          
     },
     isUserHaveUid: (req,res,next)=>{
          if(req.session.uid){
               req.session.loginStatus = true;
               next()
          }else{
               res.redirect("/signup")
          }
     },
     dontBringToSingupPage:(req , res ,next)=>{
          if(req.session.uid){
               res.redirect('/')
               // res.redirect(req.session.lastRouter);
          }else{
               next();
          }
     }

}