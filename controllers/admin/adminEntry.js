const orders =  require('../../model/admin/orderSchama');

function getTotalOrders  (){
    return  new Promise(async (resolve, reject)=>{
         var result = await orders.find({}).count();
         resolve(result);
    })
}

function totalSales (){
     return  new Promise(async (resolve, reject)=>{
          var result = await orders.find( { status:{ $in: ['Completed'] }   }).count();
          resolve(result);
     })
}
function totalRevenue (){
     return  new Promise(async (resolve, reject)=>{
          
          var sales =  await orders.find( { status:{ $in: ['Completed'] }   }) ;

          var sum = 0  ; 
          for(var i = 0 ;i< sales.length ; i++){
               sum += sales[i].totalPrice
          }
          resolve(sum)
     })
     
}

function totalRetunrs (){
     return  new Promise(async (resolve, reject)=>{
          
          var returns =  await orders.find( { status:{ $in: ['Cancel'] }   }).count()
          resolve(returns)


     })
     
}


function lastSevenDaysSales (){
     return new Promise(async (resolve , reject)=>{
        var result = await  orders.aggregate([
          {
                          $addFields: {
                              onlyDate: {
                                  $dateToString: {
                                      format: '%Y-%m-%d',
                                      date: '$createdAt'
                                  }
                              }
                          }
                      },
                      
                      {
               
             $group:
                   {
                       _id :  '$onlyDate' ,
                     count: { $sum:parseInt(1) }
                   }
                 
               },
               
                 { $sort : { count : -1 } },

               


              
          ])


var dateObj = new Date();


function userExists(name) {
     return result.some(function(el) {
       return el._id === name;
     }); 
   }





// console.log(JSON.stringify(dateObj).substring(1, 11));
var j = 0 ;
           let chartArray = [];
           let dayArray = [];
              for(var i = 0 ;  i   <= 7  ; i++){
               dateObj.setDate(dateObj.getDate() - 1 );
               dayArray.push( JSON.stringify(dateObj).substring(1, 11))   
                 if( userExists(JSON.stringify(dateObj).substring(1, 11))  ){
                      
                      chartArray.push(result[j].count);
                      j++   


                 }else{
                      chartArray.push(parseInt(0));
                 }
                 
              }
             resolve({salse : chartArray.reverse() , day : dayArray.reverse() }); 
     })
}

function getCatWiseSales(){
    return new Promise(async (resolve, reject)=>{
         const result = await orders.aggregate([
          {$unwind : '$product' }  ,
          {$project : {product : 1}},
          {$unwind: '$product.productArray'},
          {$group : { _id : '$product.productArray.catagory'  , count : {$sum : 1}  }    } ,
          {$project : { catagory : '$_id' , sales : '$count'   , _id : 0 } }
          ])

          var catagory = [];
          var sales = [];

          for(var i = 0 ;i< result.length ;i++){
              catagory.push(result[i].catagory);
              sales.push(result[i].sales);
          }

          resolve({cat : catagory , sales : sales});
    })
}

function getMonthlySale (){
     return new Promise(async (resolve , reject)=>{
          var result = await orders.aggregate([
               {$project : {  month: { $month: "$createdAt" },   
               }},
               {$sort: {month : 1} },
               
               {$group : {_id : "$month"  , count : {$sum : 1} }  },

               {$limit : 12}
               
               ]);
               var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

               var monthArray = [];
               var salesArray = [];

               result.forEach((item)=>{
                    
                    monthArray.push(monthList[item._id -1]);
                    salesArray.push(item.count);
               })
              resolve({
                   month : monthArray,
                   salse : salesArray
              });
     })   
}




module.exports = {
      showdashBord : async (req,res)=>{
          req.session.adminLastRoute = "/"
          totalRetunrs()
          res.render("admin/homepage"  , {totalOrders : await getTotalOrders()  , totalSales : await totalSales()  , totalRevenu : await totalRevenue() , returns : await  totalRetunrs()  }    );
      },

      getDailyCart : async (req,res)=>{
           res.json({ status :  await lastSevenDaysSales() });
      },
      catagoryWiseSalse : async(req,res)=>{
           res.json(await getCatWiseSales())
      },
      showProfile : async (req , res)=>{
           res.render('admin/adminProfile')
      },
      getMonthlySales : async (req,res)=>{
        res.json(await  getMonthlySale()); 
      },
      getCaneclAndSuccessOrder : async (req,res)=>{
          var ordersStatusArray = [];
          ordersStatusArray.push(await totalSales())
          ordersStatusArray.push(await  totalRetunrs())
          res.json({arr : ordersStatusArray});
      }

}