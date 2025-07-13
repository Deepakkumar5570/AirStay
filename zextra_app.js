const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listings.js");

//Mongo connection setup
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connection to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//API CREATION
app.get("/", (req, res) => {
    res.send("Hi i am root");
});

// Serve static files from F:/data/images
// app.use("/images", express.static("F:/data1/images"));
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));


  //New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });

  

  
//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // <-- populate reviews
    res.render("listings/show.ejs", { listing });
  }));

//Create Route
app.post("/listings", wrapAsync(async (req, res,next) => {
  if (!req.body.listing) {
    throw new ExpressError("Invalid Listing Data", 400);
  }
  
    const newListing = new Listing(req.body.listing);
    if(!newListing.title || !newListing.description || !newListing.price || !newListing.location || !newListing.country) {
      throw new ExpressError("All fields are required", 400);   
    }
    if (isNaN(newListing.price) || newListing.price <= 0) {
      throw new ExpressError("Price must be a valid number greater than 0", 400);
    }
    await newListing.save();
    res.redirect("/listings");
  } 
  ));

  //Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));


//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
   if (!req.body.listing) {
    throw new ExpressError("Invalid Listing Data", 400);
  }
  
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));



//Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   }));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  if (deletedListing) {
    console.log(`✅ Deleted listing: ${deletedListing.title} (${deletedListing._id})`);
  } else {
    console.log(`⚠️ No listing found with ID: ${id}`);
  }

  res.redirect("/listings");
}));

app.use("/listings", listings);

// Reviews Route
// post route for creating a new review
// app.post("/listings/:id/reviews", validateReview,wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     const review = new Review(req.body.review);
//     listing.reviews.push(review);
//     await review.save();
//     await listing.save();
//     res.redirect(`/listings/${id}`);
//   }));

// delete route for deleting a review
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,
  res) => {
      let { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);
    }
  ));

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// 404 Route middleware
app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  
  res.render("error.ejs", { err });
  if (!err.message) err.message = "Something went wrong!";
    res.status("404 Page Not Found");
});

 

app.listen(8080, () => {
    console.log("server is running perfectfully at 8080");
});  