

const dotEnv = require('dotenv');
dotEnv.config();
const {
     AuthTokenPromotionContext,
   } = require("twilio/lib/rest/accounts/v1/authTokenPromotion");
   
  
   
   const client = require("twilio")(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN);
   
   module.exports = {
     sendOtp: (toNumber) => {
       var x = "+91"+ toNumber
   
       return new Promise((resolve, reject) => {
         client.verify
           .services(process.env.SERVICES_ID)
           .verifications.create({
             to: x,
             channel: "sms",
           })
           .then((data) => {
             if (data) {
               resolve(true);
             } else {
               resolve(false);
             }
           });
       });
     },
   
     //check the otp
     checkOtp: (otp,phone) => {
      var x = "+91"+ phone
      return new Promise((resolve, reject) => {
        client.verify
          .services(process.env.SERVICES_ID)
          .verificationChecks.create({
            to: x ,
            code: otp,
          })
          .then((data) => {
          console.log(data.valid)
            resolve(data.valid);
          })
          .catch((err) => console.log(" iam the errto r====================   " +err));
      });
    },
   };
