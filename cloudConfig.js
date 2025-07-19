const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage } = require("multer-storage-cloudinary");  

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Wanderlust_DEV", // Folder name in Cloudinary
        allowed_formats: ["jpeg", "png", "jpg"], // Allowed file formats
        // transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional transformations
    },
});

module.exports = {
    cloudinary, 
    storage,

};    

