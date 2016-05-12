var express = require('express');
var router = express.Router();
// ***************************** Added MongoDB and Mongoose *****************************
var mongoUrl = "mongodb://localhost:27017/digitalgrub"
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);
// ***************************** Mongoose Schema and Model *****************************
var Account = require('../models/accounts');
// ***************************** Added bcrypt *****************************
var bcrypt = require('bcrypt-nodejs');
// ***************************** Added Rand Token *****************************
// Create a token generator with the default settings:
var randtoken = require('rand-token');
// ***************************** Added Stripe *****************************
var stripe = require("stripe")(
    "sk_test_Grq0h2qciv06GoPjaVCb4sMt"
);
// ***************************** UserData GET *****************************

router.post('/payment', function(req, res, next) {
    stripe.charges.create({
        amount: req.body.stripeAmount,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge for " + req.body.stripleEmail
    }, {
        idempotency_key: "kztE1HjypouXhDA8"
    }, function(err, charge) {
        // asynchronously called
        res.json(charge);
    });
});

router.get('/getUserData', function(req, res, next) {
    console.log(req.query.token);
    if (req.query.token == undefined) {
        res.json({ 'failure': "noToken" });
    } else {
        Account.findOne({ token: req.query.token },
            function(err, doc) {
                if (doc == null) {
                    res.json({ failure: "badToken" });
                } else {
                    res.json(doc);
                }
            }
        );
    }
})

// ***************************** Register POST *****************************

// POST route for register
router.post('/register', function(req, res, next) {
    //The user posted: username, email, password, password2

    if (req.body.password != req.body.password2) {
        res.json({ failure: 'passwordMatch' });
    } else {
        var token = randtoken.generate(32);
        var newAccount = new Account({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            emailAddress: req.body.email,
            token: token,
            popeye: "HAHAHAHAHA" // This will be ignored
        });
        newAccount.save();
        res.json({
            success: "added",
            token: token
        });
    }
});

// ***************************** Login POST *****************************

router.post('/login', function(req, res, next) {
    Account.findOne({ username: req.body.username },
        function(err, doc) {
            //doc is the document returned from our Mongo query. It has a property for each field.
            //We need to check the password in the db (doc.password) against the submitted password through bcrypt
            if (doc == null) {
                res.json({ failure: "noUser" });
            } else {
                var loginResult = bcrypt.compareSync(req.body.password, doc.password);
                if (loginResult) {
                    //Hashes matched. Set up req.session.username and move them on
                    res.json({
                        success: 'found',
                        token: doc.token
                    });
                } else {
                    //Hashes did not match or doc not found. Set them back to login
                    res.json({
                        failure: 'badPassword'
                    })
                }
            }
        });
});

// ***************************** Options POST *****************************

router.post('/options', function(req, res, next) {
    Account.update({ token: req.body.token }, //which doc to update
        {
            quantity: req.body.quantity, // what to update
            frequency: req.body.frequency.option, // what to update -- include option because ng-option packags it thus
            grind: req.body.grind.option // what to update
        }, { multi: true }, //update multiple or not
        function(err, numberAffected) {
            console.log(numberAffected);
            if (numberAffected.ok == 1) {
                //we succeeded in updating.
                res.json({ success: "updated" });
            } else {
                res.json({ failure: "failedUpdate" });
            }
        }
    );
});

// ***************************** Delivery POST *****************************

router.post('/delivery', function(req, res, next) {
    // console.log(req.body.fullname);
    Account.update({ token: req.body.token }, //which doc to update	
        {
            fullname: req.body.fullname, // what to update
            address: req.body.addressOne,
            addres2: req.body.addressTwo,
            city: req.body.userCity,
            state: req.body.userState,
            zip: req.body.userZip,
            deliveryDate: req.body.deliveryDate
        }, { multi: true }, //update multiple or not
        function(err, numberAffected) {
            console.log(numberAffected);
            if (numberAffected.ok == 1) {
                //we succeeded in updating.
                res.json({ success: "updated" });
            } else {
                res.json({ failure: "failedUpdate" });
            }
        }
    );
})

module.exports = router;
