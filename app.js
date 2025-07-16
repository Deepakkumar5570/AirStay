const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
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

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Home Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user; // <-- Add this line
  // console.log("Success messages:", res.locals.success);
  // res.locals.error = req.flash("error");
  next();
});





// Use Listings Router
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
// Use User Router
app.use("/", userRouter);



//fake user authentication middleware
// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ 
//   email: "studentt@gmail.com",
//   username: "studdent2",
//   });
//   const registeredUser =await User.register(user, "password123");
//   res.send(`Fake user created: ${registeredUser.username}`);
// });

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

