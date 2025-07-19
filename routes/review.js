const express = require('express');
const router = express.Router({ mergeParams: true }); // <-- Add mergeParams: true
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");



// Add a review to a listing
router.post("/",isLoggedIn,
   validateReview, 
   wrapAsync(reviewsController.createReview));

// Delete a review from a listing
router.delete("/:reviewId", wrapAsync(reviewsController.deleteReview));

// Edit a review
router.put("/:reviewId", isLoggedIn, validateReview, wrapAsync(reviewsController.editReview));





module.exports = router;