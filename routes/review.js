const express = require('express');
const router = express.Router({ mergeParams: true }); // <-- Add mergeParams: true
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};


// ------------------- REVIEWS -------------------

// Add a review to a listing
router.post("/", validateReview, wrapAsync(async (req, res) => {
    // if (!req.body.review) {
    //     throw new ExpressError("Review content is required", 400);
    // }
    // console.log(req.body.review);
    // // Ensure the listing exists before adding a review
    // if (!req.params.id) {
    //     throw new ExpressError("Listing ID is required", 400);
    // }
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    const review = new Review(req.body.review);
    listing.reviews.push(review);
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