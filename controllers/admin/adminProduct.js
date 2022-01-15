const product = require("../../model/admin/prductSchema");
const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const cloudinary = require("../../API/cloudnary");
const orders = require("../../model/admin/orderSchama");

// {{ to chekck that the product is already exist in the collections}};

function getProduct(productName, brand) {
  return new Promise(async (resolve, reject) => {
    var reuslt;
    if (productName != "" && brand != "") {
      result = await product.find({
        productName: productName,
        brand: brand,
      });
    } else {
      reuslt = await product.find();
    }
    if (result == "") resolve(null);
    else {
      resolve(result);
    }
  });
}

module.exports = {
  addProduct: (data) => {
    return new Promise(async (resolve, reject) => {
      data.image = JSON.parse(data.image);
      data.size = JSON.parse(data.size);
      data.color = JSON.parse(data.color);
      data.price = parseInt(data.price);
      data.quantity = parseInt(data.quantity);

      try {
        var insertData = product(data);
        var result = await insertData.save();

        resolve(true);
      } catch (err) {
        console.log("err");
        resolve("sorry Somthing went wrong ! Plese Try Again");
      }
    });
  },

  // {{ to upload image while selecting the image }};
  uploadImage: (data) => {
    return new Promise((resolve, reject) => {
      // {{if the  an image id is existing it will distroy first the iamge form cloudnary }}
      if (data.productId != "") {
        cloudinary.uploader.destroy(data.productId, function (error, result) {
          console.log(result, error);
        });
      }
      var temData = data.base64.split(";base64,").pop();
      var uploadStr = "data:image/jpeg;base64," + temData;
      cloudinary.uploader.upload(uploadStr, (err, result) => {
        if (err) console.log(err);
        else {
          var urlAndId = {
            url: result.secure_url,
            publicId: result.public_id,
          };
          resolve(urlAndId);
        }
      });
    });
  },

  getProduct: (skip) => {
    return new Promise(async (resolve, reject) => {
      var obj = {
        product: await product.find().skip(skip).limit(20),
        totalLength: await product.count(),
      };

      resolve(obj);
    });
  },

  getProductById: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        var result = await product.findOne({ _id: objectId(id) });

        resolve(result);
      } catch (err) {
        if (err) console.log("err");
      }
    });
  },

  editProducts: (data) => {
    return new Promise(async (resolve, reject) => {
      data.image = JSON.parse(data.image);
      data.color = JSON.parse(data.color);
      data.size = JSON.parse(data.size);
      data.price = parseInt(data.price);
      data.quantity = parseInt(data.quantity);
      var id = data.id;
      delete data["id"];

      var result = await product.updateOne(
        {
          _id: objectId(id),
        },
        {
          $set: {
            productName: data.productName,
            brand: data.brand,
            catagory: data.catagory,
            subCatagory: data.subCatagory,
            image: data.image,
            size: data.size,
            color: data.color,
            price: data.price,
            quantity: data.quantity,
            discription: data.discription,
          },
        }
      );

      if (result.acknowledged) {
        resolve(true);
        return;
      } else {
        resolve("Oops Somthing went wrong");
      }
    });
  },

  search: (key) => {
    return new Promise(async (resolve, reject) => {
      key = key.trim();

      var result = await product.find({
        productName: { $regex: key, $options: "i" },
      });
      resolve(result);
    });
  },

  deleteProducts: (id) => {
    return new Promise(async (resolve, reject) => {
      var deleteImage = await product.findOne({ _id: objectId(id) });
      var result = await product.deleteOne({
        _id: objectId(id),
      });
      if (result.deletedCount == 1) {
        resolve(true);
      } else {
        resolve("Oops somthing went wrong ");
      }

      for (var i = 0; i < deleteImage.image.length; i++) {
        cloudinary.uploader.destroy(
          deleteImage.image[i].publicId,
          function (error, result) {
            if (error) console.log(err);
          }
        );
      }
    });
  },

  sortDate: (date) => {
    return new Promise(async (resolve, reject) => {
      var result = await product.find().sort({ createdAt: parseInt(date) });
      resolve(result);
    });
  },
  trendingProduts: () => {
    return new Promise(async (resolve, reject) => {
      var result = await orders.aggregate([
        { $sort: { createdAt: 1 } },

        {
          $unwind: "$product",
        },
        { $group: { _id: "$product.productId" } },

        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "trendinProducts",
          },
        },
      ]);
      resolve(result);
    });
  },

  showCatagotyAndSubcatagoryWise: (item) => {
    return new Promise(async (resolve, reject) => {

      var obj = {
        product: await product.find({ subCatagory: item }),
        totalLength: await product.count(),
      };

      resolve(obj);
    });
  },
  showCatagoryWise: (item) => {
    return new Promise(async (resolve, reject) => {

      var obj = {
        product: await product.find({ catagory: item }),
        totalLength: await product.count(),
      };

      resolve(obj);
    });
  },

  searchProduct: (item) => {
    return new Promise(async (resolve, reject) => {
      var obj = {
        product: await product.find({
          productName: { $regex: item ,$options: 'i' },
        }),
        totalLength: await product.count(),
      };
      resolve(obj);
    });
  },

  getProductOffer  : async (req,res)=>{
    const result = await product.findOne( {_id : objectId(req.body.pid) })
    console.log(result);
    if(result.offerName == null){
      res.json({status : false});
      return ;
    }

     res.json({
       offerName : result.offerName,
       offerPercentage : result.offerPercentage
     })
  },
  clearOrderFromProduct : async (req,res)=>{
    try{
      var result =await product.updateOne(
        {
          _id : objectId(req.body.id)
        },
        {
          $set:{
            offerName : null,
            offerPercentage : null,
            offerPrice : null,
          }
        }
      )
      console.log(result);
      res.json({status : true})
    }catch(err){
      console.log(err)
      res.json({status : false})
    }
  }
};
