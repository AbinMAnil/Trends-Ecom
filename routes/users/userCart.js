var express = require("express");
var router = express.Router();
const { route } = require("../../app");
const middleWare = require("../../middleWares/userAuth");
const  cart = require('../../controllers/user/cart')

/*
@no params;
rouer to render the cart page of the user
*/
router.get('/', cart.showCart);

/*
router  to add to cart process 
@params product_id , color, size;
*/
router.post('/addToCart', cart.addToCart);

/*
router to chekc the variernt  is exists in the users collections
*/
router.post('/checkVarient', cart.chekcVarient);

/*
router to chage the qunatity and chage the price ;
*/
router.post('/chageQuantity', cart.chageQuantity);

/* 
router to delete one product form cart 
*/
router.delete('/delteItem' , cart.deleteCartItem);


module.exports = router;