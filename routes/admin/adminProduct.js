const express = require('express');
const router =  express.Router();
const fs = require("fs");
const catagory = require('../../controllers/admin/adminCatagory');
const product = require('../../controllers/admin/adminProduct')
const offerModel = require("../../model/admin/offer");


//RENDERING THE PRODUCT- LIST PAGE;
router.get('/',async (req,res)=>{
     if(! req.body.skip) req.body.skip = 0;
     res.render("admin/productListAdmin" , {data : await product.getProduct(req.body.skip) , offer : await offerModel.find() });
})

//RENDERIN  THE PRODUCT - ADDING PAGE ;
router.get('/addproucts', async (req,res)=>{
     res.render('admin/addproducts' , {data: await catagory.getAllCatagory()});
})

//ADD PRODUCT ROUTER
router.post('/addProduct', async (req,res)=>{
    res.json({status :await   product.addProduct(req.body)});  
})

//ROUTER TO ADD IMAGE IN COLUDNARY 
router.post('/uploadImage',async (req,res)=>{
     res.json({status: await product.uploadImage(req.body)})
})

//ROUTER FOR GET PRODUCT BY ID 
router.post("/getProductById", async (req,res)=>{
     res.json({porduct: await product.getProductById(req.body.id) , catagory:await  catagory.getAllCatagory()})
})


//ROUTER TO EDIT PRODUCTS
router.post('/editProducts', async (req,res)=>{
     res.json({status: await  product.editProducts(req.body)});
})


//ROUTER  SEARCH PRODUCTS
router.post('/search',async (req,res)=>{
     res.json({status:await product.search(req.body.key)});
})

//ROUTER FOR PAGENATION 
router.post('/pagination',async (req,res)=>{
     if(! req.body.skip) req.body.skip = 0;
     res.json({status : await product.getProduct(req.body.skip)})
})

//ROUTER TO DELETE THE PRODUCTS
router.post('/deleteProducts',async (req,res)=>{
     res.json({status : await product.deleteProducts(req.body.id)});
})

//ROUTER TO SORT THE PRODUCTS BY DATE
router.post('/sortDate', async (req, res)=>{
     res.json({status : await product.sortDate(req.body.date)});

})

//ROUTER T0 SHOW CURRENT OFFER A PRODUCT HAVE 
router.post('/getOfferOfProduct' , product.getProductOffer );


// router to delter the offer form the product 
router.post('/removeOffer' , product.clearOrderFromProduct);


module.exports = router
