var express = require("express");
var router = express.Router();
const { route } = require("../../app");
const middleWare = require("../../middleWares/userAuth");
const userEntryControllers = require('../../controllers/user/userEntry')
const catagory = require('../../controllers/admin/adminCatagory');
const product = require('../../controllers/admin/adminProduct')

// ROUTER TO SHOW THE PRDUCT LIST PAGE 
router.get('/',async (req,res)=>{
    res.render('user/products' ,{logStatus:req.session.loginStatus ,  catagory: await  catagory.getAllCatagory() ,result :await product.getProduct(0)});
})

//ROUTER TO SHOW THE DETAIL PAGE ;
router.get('/productDetails',async(req,res)=>{
   
     res.render("user/productDetails" ,{logStatus:req.session.loginStatus ,  catagory: await  catagory.getAllCatagory() , product : await product.getProductById(req.query.id)});
})

router.get('/catWise',async (req,res)=>{

    res.render('user/products' ,{logStatus:req.session.loginStatus ,  catagory: await  catagory.getAllCatagory() ,result :await product.showCatagotyAndSubcatagoryWise(req.query.id)});
} )

router.get('/CatagoryWiseShow', async (req,res)=>{
    res.render('user/products' ,{logStatus:req.session.loginStatus ,  catagory: await  catagory.getAllCatagory() ,result :await product.showCatagoryWise(req.query.id)});
});

router.get('/searchProduct' , async (req,res)=>{
    res.render('user/products' ,{logStatus:req.session.loginStatus ,  catagory: await  catagory.getAllCatagory() ,result :await product.searchProduct(req.query.productName)});
} )

module.exports = router;

