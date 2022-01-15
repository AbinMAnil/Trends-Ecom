
const express = require('express');
const router = express.Router();
const offerCouponeControl = require('../../controllers/admin/offersAndCoupones');



/* 
router to show the offerpage of admin 
*/
router.get('/' , offerCouponeControl.showOfferPage);

/* 
router to save the offer in database
*/
router.post('/saveOffer' , offerCouponeControl.saveOffer );

/* 
rotuer to delete the offer 
*/ 
router.delete('/deleteOffer' , offerCouponeControl.deleteOffer);

/*
router to allply the offer 
*/
router.post('/applyOffer' , offerCouponeControl.applyOffer );

/*
router to apply offer to subcatagory 
*/
router.post('/applyOfferToSubCatagory' , offerCouponeControl.applyOfferToSubcatagory );

/* 
router to edit the  offer and update it on every product 
*/
router.post('/eidtOffer' , offerCouponeControl.eidtOffer);

/*
rotuer to edit confirm the offer 
*/
router.post('/editOfferConfirm' , offerCouponeControl.editOfferConfirm);

/*
router to show  create coupone
*/
router.post('/createCoupone' ,offerCouponeControl.createCoupone);

/*
router to delete the coupone 
*/
router.delete('/dltCoupone' , offerCouponeControl.deleteCoupone)

/*
rouer to edit the coupone detail 
*/
router.post('/updateCoupone' , offerCouponeControl.updateCoupone)

/*
router to appli the coupone 
*/
router.post('/applyCoupone' , offerCouponeControl.applyCoupone)

module.exports = router;