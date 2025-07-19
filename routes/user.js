const express = require('express');
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js');

// ------------------- ROUTES -------------------
router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.createUser));

//login
router.route("/login")
.get(userController.loginForm)
.post(
    saveRedirectUrl , // Use the saveRedirectUrl middleware to save the redirect URL
    passport .authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}),
    userController.login
);


//Logout Route
router.get("/logout",userController.logout);

module.exports = router;