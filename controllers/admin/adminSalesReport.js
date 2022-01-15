const orders = require('../../model/admin/orderSchama');


function getSalesReportPageData (){
     return new Promise(async (resolve, reject)=>{
          const result = await orders.aggregate([{

               $addFields: {
                                           onlyDate: {
                                               $dateToString: {
                                                   format: '%Y-%m-%d',
                                                   date: '$createdAt'
                                               }
                                           }
                                       }  },
             {
                 $project: {
                     
                     userId : 1 , 'address.email' : 1 , totalPrice : 1 ,  paymentMethod : 1 , status : 1 , onlyDate : 1
                     }
             },
             {$sort : {onlyDate : -1}  }
             
             
             ] )

               resolve(result);
     })
     
          
}

module.exports = {
     showSalesReportPage : async (req,res)=>{
          res.render('admin/salesReport' , {data : await getSalesReportPageData()} );

     },
     monthlySalse : async (req,res)=>{
          let {year , month } = req.body;
               var data = await orders.aggregate([ {
                    $addFields: {
               onlyDate: {
                   $dateToString: {
                       format: '%Y-%m-%d',
                       date: '$createdAt'
                   }
             }
            }  },
                 {
                 $project : {
                      month: { $month: "$createdAt" },
                      year: { $year: "$createdAt" },
                      userId : 1 , 'address.email' : 1 , totalPrice : 1 ,  paymentMethod : 1 , status : 1 , onlyDate : 1
                 }
          },
                                     
                {
                    
                    $match : {
                        "month" : parseInt(month),
                         "year" : parseInt(year)
                        } 
                     },
                 
                     {$sort : {onlyDate : -1}  }
                 ] );
                 res.json(data);
                 
               
     },
     dailySalse : async (req,res)=>{
          let {year , month  , day} = req.body;
               var data = await orders.aggregate([ {
                    $addFields: {
               onlyDate: {
                   $dateToString: {
                       format: '%Y-%m-%d',
                       date: '$createdAt'
                   }
             }
            }  },
                 {
                 $project : {
                      month: { $month: "$createdAt" },
                      year: { $year: "$createdAt" },
                      day: { $dayOfMonth: "$createdAt" },
                      userId : 1 , 'address.email' : 1 , totalPrice : 1 ,  paymentMethod : 1 , status : 1 , onlyDate : 1
                 }
          },
                                     
                {
                    
                    $match : {
                        "month" : parseInt(month),
                         "year" : parseInt(year),
                         "day" : parseInt(day)
                        } 
                     },
                 
                     {$sort : {onlyDate : -1}  }
                 ] );
                 res.json(data);
                 
               
     },
     getEarlySalse : async (req,res)=>{
          let {year } = req.body;
               var data = await orders.aggregate([ {
                    $addFields: {
               onlyDate: {
                   $dateToString: {
                       format: '%Y-%m-%d',
                       date: '$createdAt'
                   }
             }
            }  },
                 {
                 $project : {
                      year: { $year: "$createdAt" },
                      userId : 1 , 'address.email' : 1 , totalPrice : 1 ,  paymentMethod : 1 , status : 1 , onlyDate : 1
                 }
          },
                                     
                {
                    
                    $match : {
                       
                         "year" : parseInt(year),
                        
                        } 
                     },
                 
                     {$sort : {onlyDate : -1}  }
                 ] );
                 res.json(data);
                 
               
     },
     betweenRange : async (req,res)=>{
          let {formDate , toDate } = req.body;
               var data = await orders.aggregate([ {
                    $addFields: {
               onlyDate: {
                   $dateToString: {
                       format: '%Y-%m-%d',
                       date: '$createdAt'
                   }
             }
            }  },
                 {
                 $project : {
                   
                    //   yearMonthDayUTC: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                      userId : 1 , 'address.email' : 1 , totalPrice : 1 ,  paymentMethod : 1 , status : 1 , onlyDate : 1
                 }
          },
                                     
                {
                    
                    $match : {
                         onlyDate : {$gte :  formDate  , $lte : toDate   }
                        
                        } 
                     },
                 
                     {$sort : {onlyDate : -1}  }
                 ] );
                 res.json(data);
                 
               
     },
}


