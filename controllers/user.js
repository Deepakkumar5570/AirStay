const User = require("../models/user.js");


//render signup form
module.exports.signupForm =  (req, res) => {
    res.render("users/signup.ejs");
};


//post callback for signup
module.exports.createUser = async(req, res, next) => {
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
};

//render login form
module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

//post callback for login
module.exports.login = async(req, res) => {
   
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || '/listings'; // Use the saved redirect URL or default to '/listings'
    res.redirect(redirectUrl);
};

//Logout Route
module.exports.logout =(req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye! you are logged out.");
        res.redirect("/listings");
    });
};
