const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ValidationError = require('mongoose').Error.ValidationError;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data= initData.data.map((obj) => {
    return {
      ...obj,
      owner: "68775d50144461f24c3114bf" // Replace with a valid user ID
    };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();