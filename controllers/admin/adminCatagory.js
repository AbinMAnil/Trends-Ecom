const cat = require('../../model/admin/catagorySchema');
const product =  require('../../model/admin/prductSchema');

function getCatagory(catagory){
     return new Promise(async (resolve,reject)=>{
      var result
          if(catagory != ""){
          result  = await cat.findOne(
               {
                    catagory:catagory
               }
          )
          }else{
           result =  await cat.find()
          }
          resolve(result);
          
         
     })
}

function insertSubCatagory(data){
     return  new Promise( async (resolve,reject)=>{
        var result = await   cat.updateOne(
               {
                    catagory:data.catagory
               },

               {
                    $addToSet:{
                         subCatagory:
                         {
                              $each:data.subCatagory
                         }
                    }
               }

          )
        resolve(result.acknowledged);
     })
}

function editCatagory(data){
     return new Promise( async (resolve , reject)=>{
        var result =  await cat.updateOne(
               {
                    catagory:data.oldCatagory
               },

               {
                    catagory:data.newCatgory
               }
          )
          resolve(result)

          var proUpdate = await product.updateMany(
               {
                    catagory:data.oldCatagory
               },

               {
                    catagory:data.newCatgory
               }
          )
          
     })
}

function deleteCatagory(catagory){
     return new Promise(async (resolve,reject)=>{
       var  result = await    cat.deleteOne(
               {
                    catagory:catagory
               }
          )
          resolve(result);
     })
}

function editSubCatagories (data){
     return new Promise( async (resolve, reject)=>{
          var result = await cat.updateOne(
               {
                    catagory:data.catagory,
                    subCatagory:data.oldSubCat
               },

               {
                    $set:{'subCatagory.$':data.newSubCat}
               }
          )
          if(result.modifiedCount == 1){resolve(true)  ;}
          else{
               resolve("UnExpected Error While Compiling");
               
          }

          // {{ chanaging in the procuct also}};
        var proUpdate = await   product.updateMany(
               {
                    catagory:data.catagory,
                    subCatagory : data.oldSubCat
               },
               {
                    subCatagory: data.newSubCat
               }
          )
         

     })
}

function deleteSubCatagory(data){
    return new Promise(async (resolve, reject)=>{
     let{catagory , subCatagory} = data

     var result = await cat.updateOne(
          {
               catagory:catagory
          },

          {
               $pull:
                    {
                         subCatagory:subCatagory
                    }
          }
     )
      if(result.modifiedCount == 1 ){resolve(true) ; return }
      else{
           resolve("Un Expected Error  Please Try Again ");
      }
    })
}


module.exports = {
     insertUser:(catagory)=>{
          return new Promise( async (resolve,reject)=>{
               if(await getCatagory(catagory) === null){
                 try{
                    var newCat = cat({
                         'catagory':catagory
                    })
                    var result = await newCat.save();
                  
                    resolve(true);
                 }catch(err){
                    console.log(err);
                 }
                    
               }else{
                    resolve("This Catagoy already Existing In the Database")
               }
          })
          
     },

     getAllCatagory:  ()=>{
         return new Promise( async (resolve , reject)=>{
               var result = await  getCatagory('')
          
               resolve(result);
         })
     },

     addSubCatagory :(data)=>{
          return new Promise( async (resolve ,reject)=>{

             resolve(await   insertSubCatagory(data));
          })
     },

     editCatagory:(data)=>{
          return new Promise( async (resolve , reject)=>{
                    var result = await getCatagory(data.newCatgory) 
                    if(result !== null){ resolve("The New Catagory Name Is Already Exists ") ;  return}
                    else{
                    var insertResult =  await editCatagory(data) 
                         if(insertResult.acknowledged  == true) {resolve(true) ; return }
                         else{
                              console.log("somthing err");
                         }
                    }
          })
     },

     deleteCatagory:(data)=>{
     
         return new Promise( async (resolve ,reject)=>{
            try{
               var result =await deleteCatagory(data);
               if(result.deletedCount){resolve(true) ; return }
               else{
                    resolve("Un-expected Error try Agagin");
               }
            }catch(err){
                 console.log(err);
               resolve("Un-expected Error try Agagin");
            }
         })
     },

     getSubCatagories:(catagory)=>{
          return new Promise(async (resolve,reject)=>{
               var result = await  getCatagory(catagory );
               
               resolve(result.subCatagory);
          })
     },

     editSubCatagory: (data)=>{
          return new Promise( async (resolve, reject)=>{
              resolve(await editSubCatagories(data));
          })
     },

     deleteSubCatagory: (data)=>{
        return new Promise((resolve, reject)=>{
           resolve(deleteSubCatagory(data));
        })

         
     }
}
