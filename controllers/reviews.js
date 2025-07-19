const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// new revies creation controller
module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
       
        throw new ExpressError("Listing not found", 404);
    }
    const review = new Review(req.body.review);
    review.author = req.user._id; // Assuming req.user is set by the isLoggedIn middleware
    review.listing = id; // Associate the review with the listing
    listing.reviews.push(review._id);
    await review.save();
    await listing.save();
    req.flash("success", `✅ Added review to listing: ${listing.title}`);
    res.redirect(`/listings/${id}`);
};


// Delete a review from a listing
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `✅ Deleted review from listing: ${id}`);
    res.redirect(`/listings/${id}`);
};

// Edit a review
module.exports.editReview = async (req, res) => {
    let { id, reviewId } = req.params;
    const review = await Review.findBy
Id(reviewId);
    if (!review) {
        throw new ExpressError("Review not found", 404);
    }
    // Check if the logged-in user is the author of the review
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this review");
        return res.redirect(`/listings/${id}`);
    }
    review.set(req.body.review);
    await review.save();
    req.flash("success", `✅ Updated review for listing: ${id}`);
    res.redirect(`/listings/${id}`);
};