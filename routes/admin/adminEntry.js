const express = require('express')
const router = express.Router();
// const {adminCheck} = require('../../middleWares/adminAuth')
const middleWare = require('../../middleWares/adminAuth')
const adminEntry = require('../../controllers/admin/adminEntry');

//HOME PAGE OF ADMIN
router.get('/' , middleWare.adminCheck,  adminEntry.showdashBord)

// SIGN UP PAGE OF ADMIN
router.get('/signup',( req,res , next)=>{
     res.render('admin/signup');
    
})

//SINGUP POST METHOD TO CHECK THE FORM 
router.post("/formSumbit", async (  req,res)=>{
     try{
     var result = await  middleWare.signUPAdmin(req.body.userName,req.body.password)
     req.session.adminId = result;
     res.json({status:true});
     }catch(err){
          console.log(err);
          res.json({status:err});
     }

})

router.get("/logout",(req,res)=>{
     delete req.session.adminId;
     res.json({status:true});
})

router.post('/getDailyCart' , adminEntry.getDailyCart);

router.post('/catWiseSales' , adminEntry.catagoryWiseSalse);


router.get('/adminProfile' , adminEntry.showProfile);

router.post('/getMonthlySales' , adminEntry.getMonthlySales);

router.post('/getOrderChat' , adminEntry.getCaneclAndSuccessOrder)

module.exports = router