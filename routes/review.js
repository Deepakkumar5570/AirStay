const express = require('express');
const router = express.Router({ mergeParams: true }); // <-- Add mergeParams: true
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn} = require("../middleware.js");



// Add a review to a listing
router.post("/",isLoggedIn,
   validateReview, 
   wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    const review = new Review(req.body.review);
    review.author = req.user._id; // Assuming req.user is set by the isLoggedIn middleware
    review.listing = id; // Associate the review with the listing
    listing.reviews.push(review_.id);
    await review.save();
    await listing.save();
    req.flash("success", `✅ Added review to listing: ${listing.title}`);
    res.redirect(`/listings/${id}`);
}));

// Delete a review from a listing
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `✅ Deleted review from listing: ${id}`);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;