
const user = require('../../model/user/userDataSchema');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId

module.exports = {
     getUser:async ()=>{
       return new Promise( async (resolve,reject)=>{
          var result = await  user.find({});
          resolve(result);
       })

     },

     blockUnblockUser:(id)=>{
          return new Promise(async (resolve,reject)=>{
               var action;
               var status = await user.findOne({_id:objectId(id)})
               if(status.blockStatus) action = false;
               else{
                    action = true;
               }
               try{
                    var result = await user.updateOne(
                         {
                              _id:objectId(id)
                         }, 
                         {
                              blockStatus:action
                         }
                    );
                   
                   if(result.acknowledged)resolve(action);
               }catch(err){
                    console.log(err);
               }
          })
     }, 

     getUsersByBlockStatus :(type)=>{
          var action;
          if(type == "true")action = true;
          else action = false;
          return new Promise( async (resolve,reject)=>{
               resolve ( await  user.find(
                    {
                         blockStatus:action
                    }
               )
             )
              
          })
         
     }
}