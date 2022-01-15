const orders = require('../../model/admin/orderSchama');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const orderStages = [
     'pending',
     'placed',
     'Shipped',
     'on The Way',
     'Completed',
     'Cancel'
]

// function to get all oredrs
 async function getAllOrders(){
     return new Promise( async (resolve ,reject)=>{
          resolve(await orders.find())
     })
}

module.exports = {
     showOrderPage :async (req, res)=>{
          res.render('admin/orders' ,{result : true , orders : await getAllOrders() , stages : orderStages });
     },
     getOrderById : async (req,res)=>{

         var data = await orders.findOne({_id : objectId(req.body.id)})
          res.json({result :data.address });
     },
     getOrderedProducts : async (req,res)=>{
          var result =  await orders.findOne({_id : objectId(req.body.id)});
          res.json({data :result.product});
     }, 
     updateStatus:async(req,res)=>{
          console.table(req.body)
          var result = await orders.updateOne(
               {
                    _id: objectId(req.body.id)
               },
               {
                    $addToSet:{
                         status : req.body.update
                    }
               }
          );
     },
}
