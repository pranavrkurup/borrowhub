 const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config(); // Load secrets from .env

// 1. Configure Cloudinary with our credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure the Multer Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'borrowhub_items', // The folder name inside your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Prevent users from uploading PDFs or viruses
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // Automatically resize massive images!
    },
});

// 3. Initialize the Multer middleware
const upload = multer({ storage: storage });

module.exports = upload;
