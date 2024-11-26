// IN THIS LISTING FOLDER WE ARE DOING TITLE , DESCRIPTION ,IMAGE ,PRICE, LOCATION ,COUNTERY ETC



const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename:{type: String , default : "listingimage"},
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-room-with-a-lot-of-chairs-and-tables-avkWNMVh9Z8",

        },
        // default: "https://unsplash.com/photos/a-room-with-a-lot-of-chairs-and-tables-avkWNMVh9Z8",
        // set: (v) =>
        //     v === ""
        //         ? " https://unsplash.com/photos/a-room-with-a-lot-of-chairs-and-tables-avkWNMVh9Z8"
        //         : v,
    },
    price: Number,
    location: String,
    country: String,

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;