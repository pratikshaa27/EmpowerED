var express = require('express');
var router = express.Router();
const userModel = require('./users');
// const userModel = require('./models/user'); // Assuming your user model is defined in ./models/user.js
const passport = require('passport');
const volunteerModel = require('./volunteer');
const helpSchema = require('./help');
const axios = require('axios');
const uniqid = require('uniqid');
const sha256 = require("sha256");
require('dotenv').config();



const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/donate', function (req, res, next) {
  res.render('donate');
});


router.get('/qr', function (req, res, next) {
  res.render('qr');
});

router.get('/login', function (req, res, next) {
  res.render("login");
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.send("Profile");
});

router.get('/volunteer', function (req, res, next) {
  res.render('volunteer');
});

router.get('/Help', function (req, res, next) {
  res.render('help');
});

router.post("/register", function (req, res, next) {
  let userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  userModel.register(userdata, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    });
});

// Handle user login
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to login page with flash message
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Authentication successful, redirect to profile page
      return res.redirect("/profile");
    });
  })(req, res, next);
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/maps', function (req, res) {
  res.render("map");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Assuming volunteerModel is your Mongoose model
router.post("/volunteersubmit", function (req, res, next) {
  let newVolunteer = new volunteerModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNo: req.body.phoneNo,
    agegrp: req.body.agegrp,
    adhaarNo: req.body.adhaarNo
  });

  newVolunteer.save()
    .then((volunteer) => {
      // Handle successful registration
      res.redirect("/");
    })
    .catch((err) => {
      // Handle registration error
      console.error(err);
      res.status(500).send("Failed to register volunteer");
    });
});


router.post("/helpsubmit", function (req, res, next) {
  let newHelp = new helpSchema({
    name: req.body.name,
    email: req.body.email,
    adharNo: req.body.adharNo,
    address: req.body.address,
    agegrp: req.body.agegrp,
    description: req.body.description
  });

  newHelp.save()
    .then((help) => {
      // Handle successful help request submission
      res.redirect("/"); // Redirect to home page or any other appropriate route
    })
    .catch((err) => {
      // Handle submission error
      console.error(err);
      res.status(500).send("Failed to submit help request");
    });
});




router.get('/dashboard', function (req, res, next) {
  res.render('dashboard');
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
// const MERCHANT_ID = "PGTESTPAYUAT";
// const SALT_INDEX = 1;
// const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"


// router.get('/funding', function (req, res, next) {
//   res.render('funding');
// });


// router.get("/pay", (res, req) => {
//   const payEndpoint = "/pg/v1/pay";
//   const merchantTransactionId = uniqid();
//   const userId = 123
//   const payload = {
//     "merchantId": MERCHANT_ID,
//     "merchantTransactionId": merchantTransactionId,
//     "merchantUserId": userId,
//     "amount": 10000,
//     "redirectUrl": `http://localhost:3000/redirect-url/${merchantTransactionId}`,
//     "redirectMode": "REDIRECT",
//     "mobileNumber": "9999999999",
//     "paymentInstrument": {
//       "type": "PAY_PAGE"
//     }
//   }


//   const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
//   const base63EncodedPayload = bufferObj.toString("base64");
//   const xVerify = sha256(base63EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

//   // const axios = require('axios');
//   const options = {
//     method: 'post',
//     url: `${PHONE_PE_HOST_URL}${payEndpoint}`,
//     headers: {
//       accept: 'text/plain',
//       'Content-Type': 'application/json',
//       "X-VERIFY": xVerify
//     },
//     data: {
//       request: base63EncodedPayload,
//     }
//   };
//   axios.request(options)
//     .then(function (response) {
//       // console.log(response.data);
//       const url = response.data.data.instrumrntResponse.redirectInfo.url;
//       // res.send(url);
//       console.log(url);
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// })


module.exports = router;