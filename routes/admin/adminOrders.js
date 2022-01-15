const  express = require('express');
const router = express.Router()
const orders = require("../../controllers/admin/adminOrders");

/* 
router to manage orders for the admin 
*/

router.get('/', orders.showOrderPage);

/* 
router to get ordre by id 
*/ 
router.post('/getOrder',orders.getOrderById);

/* router to get the the ordered products 
*/
router.post('/orderedProduct' , orders.getOrderedProducts)

/* 
router for the updation of the status of the order;
*/
router.post('/changeStatus', orders.updateStatus);


module.exports = router;
