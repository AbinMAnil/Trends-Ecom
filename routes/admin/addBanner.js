
const express = require('express');
const router = express.Router();
const banner = require('../../controllers/admin/addBanner');

// to show  the  add banner page
router.get('/' ,  banner.showPage);

router.post ('/uploadBanner',  banner.uploadBanner);

router.post('/editBanner' , banner.editBanner);

module.exports = router;
