const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

// ------------------- VALIDATORS -------------------
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // <-- validate the whole body
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// ------------------- ROUTES -------------------

// Index Route – Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// ...existing code...
// Create New Listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", `✅ Created new listing: ${newListing.title}`);
    res.redirect("/listings");
}));


// ...existing code...

// New Listing Form
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// // Create New Listing
// router.post("/", validateListing, wrapAsync(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));





// Show Specific Listing (with reviews)
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not available");
        res.redirect("/listings");
        // throw new ExpressError("Listing not found", 404);
    }
    res.render("listings/show.ejs", { listing });
}));

// Edit Form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not available");
        res.redirect("/listings");
        // throw new ExpressError("Listing not found", 404);
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update Listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", `✅ Updated listing: ${req.body.listing.title}`);
    res.redirect(`/listings/${id}`);
}));

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
        req.flash("success", `✅ Deleted listing: ${deletedListing.title}`);
    } else {
        req.flash("success", `⚠️ No listing found with ID: ${id}`);
    }
    res.redirect("/listings");
}));


module.exports = router;
