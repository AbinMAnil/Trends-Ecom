var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const crypto = require("crypto")
const bcrypt = require('bcrypt');
const Razorpay = require('razorpay')
const request = require("request")
const session = require('express-session');
const dotEnv = require('dotenv');
dotEnv.config();
const offer = require('./controllers/admin/offersAndCoupones');

// ----- routers initilizing for user----
const userEntry = require('./routes/users/userEntry');
const userProducts = require('./routes/users/products');
const userCart = require('./routes/users/userCart');
const userCheckOut = require('./routes/users/userCheckout')
const paypal = require('./routes/users/paypal');

// -----  end of routers initilizing for user----//

// ---------router initilizing for admin -------
const addBanner = require('./routes/admin/addBanner');
const adminCatagory = require('./routes/admin/adminCatagory');
const adminPoduct = require('./routes/admin/adminProduct');
const adminEntry = require('./routes/admin/adminEntry');
const adminUserManageMent  = require('./routes/admin/adminUserManageMent');
const adminOffer = require('./routes/admin/adminOffers');
const adminSalesReport = require('./routes/admin/adminSalesReprort');
const { checkout } = require('./routes/users/userEntry');
const adminOrders = require('./routes/admin/adminOrders');
const { ConferenceContext } = require('twilio/lib/rest/api/v2010/account/conference');
//end of roter initilizing of admin --------




var app = express();

// middelware for expire the coupone; 
app.use(async (req,res, next)=>{
  var result = await offer.expireOffer();
  next()
})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: false}));






app.use(session({
  secret:' cookie_secret',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// app.use(express.json());
// app.use(express.urlencoded({  }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//admin page routes only 
app.use('/admin',adminEntry);
app.use('/admin/userManage', adminUserManageMent);
app.use('/admin/catagory',adminCatagory);
app.use('/admin/products',adminPoduct);
app.use('/admin/orders' , adminOrders);
app.use('/admin/offers' , adminOffer);
app.use('/admin/sales' , adminSalesReport);
app.use('/admin/banner' , addBanner);
//end of the admin-page routes



//user routers 
app.use('/',userEntry);
app.use('/product',userProducts);
app.use('/cart',userCart);
app.use('/checkout', userCheckOut);
// app.use('/paypal', paypal );




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// connect to mongodb atles //

mongoose
  .connect(process.env.MONGODB_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("databse connected  sucesssufully");
  })
  .catch((err) => {
    // console.log(err);
  });






module.exports = app;
