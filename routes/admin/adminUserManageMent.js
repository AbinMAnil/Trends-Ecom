const express = require('express');
const router = express.Router();
const userManage = require('../../controllers/admin/adminManage');

//TO  GET ALL THE USER AND  RENDER THE TABLE
router.get('/' , async (req,res)=>{
     res.render('admin/userManage' , {result: await userManage.getUser()});
})


// TO BLOCK UNBLOCK TEH USER BY THEIR ID 
router.post('/action' , async (req,res)=>{
    
   res.json({status: await userManage.blockUnblockUser(req.body.id)});

})

//TO SHOW THE BLOCKED USER  ONLY
router.get('/getUsersByBlockStatus/:type', async (req,res)=>{

   res.render('admin/userManage',{result: await userManage.getUsersByBlockStatus((req.params.type)) })
})

module.exports = router;
