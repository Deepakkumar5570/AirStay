const express = require('express');
const router = express.Router({ mergeParams: true }); 
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl , // Use the saveRedirectUrl middleware to save the redirect URL
    passport .authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
   
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || '/listings'; // Use the saved redirect URL or default to '/listings'
    res.redirect(redirectUrl);
});

//Logout Route
router.get("/logout", (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye! you are logged out.");
        res.redirect("/listings");
    });
});

module.exports = router;