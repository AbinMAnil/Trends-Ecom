const  express = require('express');
const router = express.Router()
const dotEnv = require('dotenv');
dotEnv.config();
const paypal = require('paypal-rest-sdk');


var address ;
 
router.post('/attachAddress',(req,res)=>{
  
  req.session.address = req.body;
  

  res.json('address added');
})

var clientId = process.env.PAY_PAL_CLIENT_ID;
var secrect = process.env.PAY_PAL_SECRECT;



paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': clientId,
  'client_secret': secrect
});


router.post('/', (req, res) => {
 

  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/paypal/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Redhock Bar Soap",
                "sku": "001",
                "price": "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "Washing Bar soap"
    }]
};
paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});


router.get('/success', (req, res) => {
 
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
 
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

// Obtains the transaction details from paypal
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
    if (error) {
        throw error;
    } else {
        res.send('user/success');
    }
});
});


module.exports = router;