const Listing = require("../models/listing");

// to render all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New Listing Form
module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Specific Listing (with reviews and review authors populated)
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }) // 👈 this is correct
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not available");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

//ceate New Listing
module.exports.createListing = async (req, res) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user

    // Save image info if uploaded
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", `✅ Created new listing: ${newListing.title}`);
    res.redirect("/listings");
};

// Edit Form
module.exports.editListingForm = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not available");
            res.redirect("/listings");
            // throw new ExpressError("Listing not found", 404);
        }

        let originalIMG= listing.image.url;
        originalIMG=originalIMG.replace("/upload","/upload/h_300,w_250");

        res.render("listings/edit.ejs", { listing,originalIMG });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updateData = { ...req.body.listing };

    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    req.flash("success", `✅ Updated listing: ${listing.title}`);
    res.redirect(`/listings/${id}`);
};


// Delete Listing
module.exports.deleteListing = async (req, res) => {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (deletedListing) {
            req.flash("success", `✅ Deleted listing: ${deletedListing.title}`);
        } else {
            req.flash("success", `⚠️ No listing found with ID: ${id}`);
        }
        res.redirect("/listings");
};