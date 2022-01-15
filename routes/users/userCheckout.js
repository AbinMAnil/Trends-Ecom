var express = require("express");
var router = express.Router();
const { route } = require("../../app");
const middleWare = require("../../middleWares/userAuth");
const  cart = require('../../controllers/user/cart')
const checkOut = require('../../controllers/user/checkout');
const rasorPay = require('../../controllers/user/razorPay');
/*
router to show the chekout page of the user;
if the user is not signined it will send back to the signup page 
*/
router.get('/', checkOut.showCheckOut );
/*
router to place order with tempory address;
*/
router.post("/placeOrder", checkOut.placeOrder);

/* 
router to show the order history 
*/
router.get('/orderHistory' , checkOut.showHistory)
/*
router to cancel order for user 
*/
router.patch('/cancelOreder', checkOut.cancelorder)

/* router to get address of the user 
*/
router.post('/getAddress' , checkOut.getAddressOfUser);

/* router to save the address of the user
*/
router.post('/saveAddress', checkOut.saveAddress)


/* router to get total amout form cart 
*/
router.post('/getTotalAmount' , cart.getTotalAmount);
/*
router to delete address 
*/
router.delete('/deleteAddress', checkOut.deleteAddress)

/*router to create order in razor pay
*/
router.post('/razorPayCreateOrderId' , rasorPay.createOrder);


/* router to verify the order 
*/
router.post('/finalVerify' , rasorPay.verifyRazorPay);


// router to get users wallet amout ;
router.post('/getWallet' , checkOut.getWallet);

// rotuer to update wallet after pay
router.post('/updateWallet' , checkOut.updateWallet);


module.exports = router;