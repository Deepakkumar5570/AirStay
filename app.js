const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// View Engine and Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Middleware
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7* 24 * 60 * 60 * 1000, // 1 day
        maxAge: 7* 24 * 60 * 60 * 1000 ,// 1 day
        httpOnly: true, // Helps prevent XSS attacks
        secure: false, // Set to true if using HTTPS
    },
};

app.get("/", (req, res) => {
  res.send("Welcome to Wanderlust!");
});

app.use(session(sessionOptions));  
app.use(flash());

// Home Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log("Success messages:", res.locals.success);
  // res.locals.error = req.flash("error");
  next();
});

// Use Listings Router
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Handle Unmatched Routes
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server is running on http://localhost:8080");
});

