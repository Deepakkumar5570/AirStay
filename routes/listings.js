const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
// const ExpressError = require('../utils/ExpressError.js');
// const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
// const Review = require('../models/review.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');



// ------------------- ROUTES -------------------

// Index Route – Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// ...existing code...
// Create New Listing
router.post("/", isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Set the owner to the currently logged-in user
        await newListing.save();
        req.flash("success", `✅ Created new listing: ${newListing.title}`);
        res.redirect("/listings");
    }));


// ...existing code...

// New Listing Form
router.get("/new", isLoggedIn, (req, res) => {
    // if (!req.isAuthenticated()) {
    //     req.flash("error", "You must be logged in to create a listing");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
});

// // Create New Listing
// router.post("/", validateListing, wrapAsync(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));





// Show Specific Listing (with reviews)
// Show Specific Listing (with reviews and review authors populated)
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }) // 👈 this is correct
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not available");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));

// Edit Form
router.get("/:id/edit", isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    // validateListing,
    wrapAsync(async (req, res) => {
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
router.put("/:id", isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    // validateListing, 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", `✅ Updated listing: ${req.body.listing.title}`);
        res.redirect(`/listings/${id}`);
    }));

// Delete Listing
router.delete("/:id", isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    // validateListing,
    wrapAsync(async (req, res) => {
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
