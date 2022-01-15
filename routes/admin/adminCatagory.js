const express = require('express');
const router = express.Router();
const catagory = require('../../controllers/admin/adminCatagory');
const offerModel = require('../../model/admin/offer');
// TO RENDER THE CATAGORY PAGE OF THE ADMIN WITH CATAGORIES AND SUBCATGORIES;
router.get('/', async (req,res)=>{

     res.render('admin/catagory' ,{catagory : await  catagory.getAllCatagory() , offer : await offerModel.find() });
})

// TO ADD A NEW CATAGORY IF THERE IS NO MORE EXISTS;
router.post('/addCatagory' , async (req,res)=>{
     res.json({status: await catagory.insertUser(req.body.catagory)})
})
 
// TO ADD SUB- CATAGORY IN IT ALREADY  EXISTS ON THAT ARRAY IN WILL BE NOT ADDED (use  addToSet);
router.post("/addSubCat", async (req,res)=>{
     req.body.subCatagory = req.body.subCatagory.split(",");
    
     res.json({status: await catagory.addSubCatagory(req.body)});
})

//EDIT CATAGORY 
router.post('/editCatagory', async (req,res)=>{
    res.json({status: await catagory.editCatagory(req.body)});
})


//DELETE THE CATAGORY 
router.post("/deleteCatagory", async (req,res)=>{
     res.json({status:await catagory.deleteCatagory(req.body.catagory) });
})

// GET ALL SUBCATAGORIES TO SHOW IN THE TABLE 
router.post("/getSubs", async (req,res)=>{

    res.json({status: await catagory.getSubCatagories(req.body.catagory)})
})

// EDIT SUB-CATAGORIES 
router.post('/editSubCat',async (req,res)=>{
     res.json({status: await catagory.editSubCatagory(req.body)});
})

//  ROUTRE TO DELETE SUB CATAGORIES
router.post('/deleteSubCatagory', async (req,res)=>{
     res.json({status : await  catagory.deleteSubCatagory(req.body)});
})

module.exports = router;