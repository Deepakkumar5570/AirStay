const Listing = require("./models/listing");
// const Review = require("./models/review");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to do that");
    return res.redirect("/login");
  }
  next();
};

//redirect
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = (req, res, next) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((listing) => {
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
      }
      next();
    })
    .catch((err) => {
      req.flash("error", "An error occurred while checking ownership");
      res.redirect("/listings");
    });

};


// ------------------- VALIDATORS -------------------
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // <-- validate the whole body
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


//......................review...............

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};


