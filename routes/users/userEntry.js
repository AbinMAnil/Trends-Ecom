const dotEnv = require("dotenv");
dotEnv.config();
var express = require("express");
const { route } = require("../../app");
var router = express.Router();
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const middleWare = require("../../middleWares/userAuth");
const userEntryControllers = require("../../controllers/user/userEntry");
const catagory = require("../../controllers/admin/adminCatagory");
const cart = require("../../controllers/user/cart");
const gustUserCart = require("../../model/user/gustUser");
const userCart = require("../../model/user/cart");
const adminProducts = require("../../controllers/admin/adminProduct");
const addBanner = require('../../controllers/admin/addBanner');
const wishlist = require('../../model/user/wishlist');
// --------------------END OF THE REQUIREMENTS------------------------------\\

// HOME PAGE RENDERNG
router.get("/", middleWare.getUser, async (req, res) => {
  req.session.lastRouter = "/";

  res.render ("user/home", {
    logStatus: req.session.loginStatus,
    catagory: await catagory.getAllCatagory(),
    recentProducts: await adminProducts.sortDate(parseInt(-1)),
    trend: await adminProducts.trendingProduts(),
    banner : await addBanner.getAllBanners(),
  });
});

// ROUTER T0 GET CART COUNT OF THE ALL  TYPE OF USER
router.post("/getCartCount" , userEntryControllers.getCartCount);

// res.render("user/home");

// CREATE ACCOUNT PAGE RENDRING
router.get("/createAccount", middleWare.dontBringToSingupPage, async (req, res) => {

    res.render("user/createAccout", {refId : req.query.refId , logStatus: req.session.loginStatus,
      catagory: await catagory.getAllCatagory(),
      recentProducts: await adminProducts.sortDate(parseInt(-1)),
      trend: await adminProducts.trendingProduts()
     } );
  // res.cookie("demo", "hello world", {
  //   maxAge: 100000000000000000000,
  // });
  
});

// SIGNUP PAGE RENDERING
router.get("/signup", middleWare.dontBringToSingupPage, async (req, res) => {
  res.render("user/signup" , {logStatus: req.session.loginStatus,
    catagory: await catagory.getAllCatagory(),
    recentProducts: await adminProducts.sortDate(parseInt(-1)),
    trend: await adminProducts.trendingProduts()});
});

// TO CHECK THE PHONE NUMBER IS VALID OR NOT OF A NEW USER
router.post("/isValidPhone", async (req, res) => {
  
  try {
   
    res.json({
      status: await userEntryControllers.sendOtpToUser(req.body.phone),
    });
  } catch (err) {
    res.json({ status: err });
  }
});

// TO CHECK THE OTP
router.post("/otp", async (req, res) => {
  var result = await userEntryControllers.checkOtpforNewUser(
    req.body.phone,
    req.body.otp
  );
  res.json({ status: result.status, phone: req.body.phone });
});


//CREATE AN ACCOUNT FOR NEW USE IN THE CASE OF TEH PHONE NUMBER AN EMAIL ID IS NOT EXISTSING
router.post("/createAccountPost", async (req, res) => {
  req.body.password = await middleWare.hashPassword(req.body.password);
  try {
    req.session.temGustUserId = req.body.gustUserId;
    var result = await userEntryControllers.insertUser(req.body);
    req.session.uid = result._id;

    cart.shiftItem(req.session.temGustUserId, req.session.uid);
    res.json({ status: true });
    // shift item of user ;
   

  } catch (err) {
    res.json({ status: err });
  }
});

// SEND OTP FOR THE EXISTING USER TO LOGIN
router.post("/otpSignUp", async (req, res) => {
  var result = await userEntryControllers.sendOtpToExistingUser(req.body.phone);
  res.json({ status: result });
});
module.exports = router;

// OTP CHECKING FOR THE EXISTING USER AND GAVE JWT SESSION TO  THE USER ID
router.post("/otpCheckForExistUser", async (req, res) => {
  var result = await await userEntryControllers.checkOtp(
    req.body.phone,
    req.body.otp
  );

  req.session.uid = result.userId;
  res.json({ status: result.status  });
});

//TO CHECK THE USER SIGNUP WITH PASSWORD AND EMAIL;
router.post("/signupWithEmail", async (req, res) => {
  var result = await userEntryControllers.checkUserSignup(
    req.body.email,
    req.body.password
  );
  if (result.status == true) {
    req.session.uid = result.data._id;
    // function to shift item to gust cart to user actual cart;
    cart.shiftItem(req.body.gustUserId, req.session.uid);
    res.json({ status: result.status });
  } else {
    res.json({ status: result });
  }
});

// TO LOGOUT OF THE USER
router.get("/logout", (req, res) => {
  delete req.session.uid;
  res.redirect("/");
  });

// TO RENDER THE  USER PROFILE
router.get("/userProfile", async (req, res) => {
  res.render("user/userProfile", {
    logStatus: req.session.loginStatus,
    
    catagory: await catagory.getAllCatagory(),
    user: await userEntryControllers.getUserById(req.session.uid),
  });
});

// TO EDIT THE USER PROFILE
router.post("/eidtProfile", (req, res) => {
  res.json({
    status: userEntryControllers.editProfile(req.session.uid, req.body),
  });
});

router.post('/getWishListCount' , async (req,res)=>{
  if(req.session.uid){
    
   var result =  await wishlist.findOne({userId : objectId(req.session.uid)})
   if(result == null){
     res.json({status : 0});
     return ;
   }
  res.json({status : result.product.length});
  }else{
    res.json({status : parseInt(0)})
  }
})


//ROUTER TO CHECK PASSWORD
router.post("/checkPassword", userEntryControllers.changePassword);

//ROTUER TO CHAGE THE PASSWORD
router.post("/changePassword", userEntryControllers.confirmPasswordLast);

//ROUTER TO GET DETAIL OF USE
router.post("/getDetailsOFUser", async (req, res) => {
  res.json({ data: await userEntryControllers.getUserById(req.session.uid) });
});

// ROUTER TO RENDER THEWISH LIST OF THE USER
router.get("/wishlist", userEntryControllers.showWishlist);

//ROUTER TO ADD TO WISH LIST IF USER IS LOGED IN ;
router.post("/addToWishlist", userEntryControllers.addToWishlist);

//ROUTER TO DELETE ITEM FORM WISHLIST
router.delete("/removeFormWishlist", userEntryControllers.removeFromWishlist);

//ROUTER TO EIDT UPLOAD THE PROFILE OF USER
router.post('/uploadProfilPic' , userEntryControllers.uploadProfile)


module.exports = router;
