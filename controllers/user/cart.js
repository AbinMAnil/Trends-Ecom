const product = require("../../controllers/admin/adminProduct");
const catagory = require("../../controllers/admin/adminCatagory");
const cart = require("../../model/user/cart");
const gustCart = require("../../model/user/gustUser");
const mongoose = require("mongoose");
const productModel = require("../../model/admin/prductSchema");
const objectId = mongoose.Types.ObjectId;

// get the quantity of the product;
function getQuantityOfProduct(pid) {
  return new Promise(async (resolve, reject) => {
    var result = await productModel.findOne({ _id: objectId(pid) });
    resolve(parseInt(result.quantity));
  });
}
// function to get number of products use have ;
function howMuchUserHave(db, varientId, userId) {
  return new Promise(async (resolve, reject) => {
    var result = await db.findOne({ userId: userId });
    for (var i = 0; i < result.product.length; i++) {
      if (result.product[i].vaientId == varientId) {
        resolve(parseInt(result.product[i].quantity));
      }
    }
  });
}

// function to create unique id for the user;
const makeUniqueId = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2).trim();
};
// to calculate the grand total of the products;
function calculatTheAllTotal(data) {
  var total = 0;
  return new Promise((resolve, reject) => {
    for (var i = 0; i < data.length; i++) {
      total += data[i].totalPrice;
    }

    resolve(total);
  });
}

// function to check varient
function checkVarient(db, data, userId) {
  return new Promise(async (resolve, reject) => {
    var result = await db.findOne({
      userId: userId,
      product: {
        $elemMatch: {
          color: data.color,
          size: data.size,
          productId: objectId(data.productId),
        },
      },
    });

    if (result != null) resolve(true);
    else {
      resolve(false);
    }
  });
}

// function to insert a doument of product into the collection
function insertData(db, data, id) {
  return new Promise(async (resolve, reject) => {
    const packData = {
      userId: id,
      product: [
        {
          vaientId: makeUniqueId(),
          productId: objectId(data.productId),
          size: data.size,
          color: data.color,
          quantity: parseInt(1),
        },
      ],
    };
    try {
      var newGustUser = db(packData);
      const gustUserCart = await newGustUser.save();
      resolve(true);
    } catch (err) {
      console.log(err);
      resolve("somthing went wrong ");
    }
  });
}

// function to chekc the use have that product ;
function isUserHaveTheProduct(db, data, id) {
  return new Promise(async (resolve, reject) => {
    if (
      (await db.findOne({
        userId: id,
        "product.productId": objectId(data.productId),
        "product.color": data.color,
        "product.size": data.size,
      })) == null
    ) {
      // "user dosn't have this product"
      // push the product into the array of product;
      var pushPackProduct = {
        vaientId: makeUniqueId(),
        color: data.color,
        size: data.size,
        productId: objectId(data.productId),
        quantity: parseInt(1),
      };
      var result = await db.updateOne(
        {
          userId: id,
        },
        {
          $push: { product: pushPackProduct },
        }
      );
      if (result.modifiedCount == 1) {
        resolve(true);
        return;
      }
    } else {
      //user have this product
      resolve(false);
    }
  });
}

// function for get users product gust and  user also
function getUserCartProducts(userId, db)  {
  return new Promise(async (resolve, reject) => {
    var result = await db.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          productId: "$product.productId",
          quantity: "$product.quantity",
          vaientId: "$product.vaientId",
          color: "$product.color",
          size : "$product.size"
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productArray",
        },
      },
      
    ]);
    // for loop to find the toal of the product 
    for(var i = 0 ;  i < result.length ; i++){
      //to checke the product has an offer ;
      if(result[i].productArray[0].offerPrice !== null){
        // offer applied product 
        var totoalAmout = result[i].quantity *  result[i].productArray[0].offerPrice;
      
        result[i].totalPrice = totoalAmout;

      }else{
        var totoalAmout = result[i].quantity *  result[i].productArray[0].price;
      
        result[i].totalPrice = totoalAmout;
      }
    }
  
    

    var product = {
      grandTotal: await calculatTheAllTotal(result),
      product: result,
    };

    resolve(product);
  });
}

// function to chage the quantity of the user;
function chageQuantity(quantity ,  db, userId, varientId, productId) {
  return new Promise(async (resolve, reject) => {

        // updateing the quantity;

        var result = await db.updateOne(
          {
            userId: userId,
            "product.vaientId": varientId,
          },
          {
            $set: {
              "product.$.quantity": parseInt(quantity),
            },
          }
        );


        if (result.modifiedCount == 1) {
          var product = await getUserCartProducts(userId, db);
          
            resolve({
              product: product
            });
          
        }
        resolve("somThing Went Worng ");
      
    
  });
}

// function to delete one item form cart
function deleteItem(db, varientId, userId, pid) {
  return new Promise(async (resolve, reject) => {
    let result = await db.updateOne(
      {
        _id: objectId(pid),
      },
      {
        $pull: {
          product: {
            vaientId: varientId,
          },
        },
      }
    );

    var EnptyChekc = await db.findOne({ _id: objectId(pid) });
    var emptyCart;
    if (EnptyChekc.product.length == 0 ) emptyCart = true;
    else {
      emptyCart = false;
    }

    if (result.modifiedCount == 1)
      resolve({
        emptyCart: emptyCart,
        process: true,
      });
    else {
      resolve("Sorry Somthing Went Wrong");
    }
  });
}

module.exports = {
  showCart: async (req, res) => {
    if (!req.session.uid)
      res.render("user/userCart", {
        logStatus: req.session.loginStatus,
        catagory: await catagory.getAllCatagory(),
        data: await getUserCartProducts(req.query.userId, gustCart),
      });
    else {
      res.render("user/userCart", {
        logStatus: req.session.loginStatus,
        catagory: await catagory.getAllCatagory(),
        data: await getUserCartProducts(req.session.uid, cart),
      });
    }
  },

  addToCart: async (req, res) => {
    // check user is signuped or not ;
    if (req.session.uid) {
      // make a proper cart to the user
      if ((await cart.findOne({ userId: req.session.uid })) == null) {
        // user dosn't have an cart in gust user;
        res.json({ status: await insertData(cart, req.body, req.session.uid) , product : await cart.findOne({userId : userId}) });
      } else {
        // user already have an cart in gust user

        res.json({
          status: await isUserHaveTheProduct(cart, req.body, req.session.uid),
         
        });
      }
    } else {
      // req.session.gustUserId = req.body.userId;
      // make a gust cart for the use;
      // check the gust user have a cart in the gust cart;
      if ((await gustCart.findOne({ userId: req.body.userId })) == null) {
        // user dosn't have an cart in gust user;
        res.json({
          status: await insertData(gustCart, req.body, req.body.userId),
        });
      } else {
        // user already have an cart in gust user

        res.json({
          status: await isUserHaveTheProduct(
            gustCart,
            req.body,
            req.body.userId
          ),
          
        });
      }
    }
  },
  chekcVarient: async (req, res) => {
    if (!req.session.uid) {
      res.json({
        status: await checkVarient(gustCart, req.body, req.body.userId),
      });
    } else {
      res.json({ status: await checkVarient(cart, req.body, req.session.uid) });
    }
  },

  chageQuantity: async (req, res) => {
    if (req.session.uid)
      res.json({
        status: await chageQuantity(
          req.body.quantity,
          cart,
          req.session.uid,
          req.body.id,
          req.body.pid
        ),
      });
    else {
      res.json({
        status: await chageQuantity(
          req.body.quantity,
          gustCart,
          req.body.userId,
          req.body.id,
          req.body.pid
        ),
      });
    }
  },

  deleteCartItem: async (req, res) => {
    let { varientId, userId, productId } = req.body;
    if (req.session.uid)
      res.json({
        status: await deleteItem(cart, varientId, req.session.uid, productId),
       
      });
    else {
      res.json({
        status: await deleteItem(gustCart, varientId, userId, productId),
       
      });
    }
  },
  shiftItem: async (gustUserId, userId) => {
   
    
            //check the gust use add somthing in the cart;
            if(userId == null) return;
            // get the items for the gustuser collection
            var gustUserItem = await gustCart.findOne({
              userId : gustUserId
            })
           if(gustUserItem == null)return ; 
            var gustArray = gustUserItem.product;
           
            var validUserCart = await  cart.findOne({
              userId : userId 
            })

            if(validUserCart != null){
              // user have a cart previosusly;
              var result = await cart.updateOne(
                {
                  userId : userId
                },
                {
                  $addToSet:{
                    product : {
                      $each:gustArray 
                    }
                  }
                }
              )
             
            }else{
              // user dosnt havea an account in cart;
                var packData = {
                  userId :  userId,
                  product : gustUserItem.product,
                }
                var careateNewCart = cart(packData);
                 careateNewCart.save();

            };


            var clearGustCart = await gustCart.updateOne(
            {
              userId : gustUserId
            },
            {
              $set: {
                product : []
              }
            }

         )


            
            
  },

  getCartForCheckOut : (id)=>{
    return new Promise(async (resolve , reject)=>{
        resolve ( await getUserCartProducts(id , cart));
    })
  },
  
  getTotalAmount :async (req,res)=>{
    var result = await getUserCartProducts(req.session.uid , cart);
    res.json({amount : result.grandTotal});
  },

  getAmoutOnlyForWallet : (uid)=>{
    return new Promise(async (resolve , reject )=>{
      var result = await getUserCartProducts(uid, cart);
      resolve(result.grandTotal);
    })
  }

  
};
