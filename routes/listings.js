const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingsController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js'); // Assuming you have a cloudinary setup
const upload = multer({ storage });


// ------------------- ROUTES -------------------

//index and create a listing
router
.route("/")
.get(wrapAsync(listingsController.index))
.post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingsController.createListing)
);

// New Listing Form
router.get("/new", isLoggedIn,listingsController.newListingForm);


//show and update route
router
.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put( isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing 
    upload.single("image"), // Handle image upload
    validateListing, // Validate the listing data
    wrapAsync(listingsController.updateListing))
.delete(isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    wrapAsync(listingsController.deleteListing)
);    



// Edit Form
router.get("/:id/edit", isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    wrapAsync(listingsController.editListingForm));


module.exports = router;
