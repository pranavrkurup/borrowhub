// 1. Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

// Import our Day 2 User Routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

// 2. Load environment variables from the .env file
dotenv.config();

// 3. Initialize the Express application instance
const app = express();

// 4. Mount Global Middlewares

// CORS: Only allow our specific frontend origins
const allowedOrigins = [
    'http://localhost:5173',             // Vite dev server
    'http://localhost:5000',             // Alternate local dev
    'https://theborrowhub.vercel.app',   // Production Vercel frontend
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    },
    credentials: true,
}));

app.use(express.json()); // Tells Express to parse incoming JSON data

// 5. Test route to ensure the server is working
app.get('/api/health', (req, res) => {
    res.json({ status: "success", message: "BorrowHub Server is running perfectly!" });
});

// 6. Mount our User Routes (This connects the URLs to the controller logic)
app.use('/api/users', userRoutes);
app.use('/api/requests', borrowRoutes);
app.use('/api/items', itemRoutes);

// 7. Global Error-Handling Middleware (catches Multer & Cloudinary errors)
app.use((err, req, res, next) => {
    console.error('🔥 Global Error Handler:', err);

    // Handle Multer-specific errors (file too large, wrong field name, etc.)
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: `Upload error: ${err.message}`,
            error: err.code,
        });
    }

    // Handle CORS errors
    if (err.message && err.message.startsWith('CORS policy')) {
        return res.status(403).json({ message: err.message });
    }

    // Handle any other errors (Cloudinary auth failures, etc.)
    return res.status(500).json({
        message: 'Internal server error during upload or processing.',
        error: err.message,
    });
});

// 8. Connect to the MongoDB Database using Mongoose
const PORT = process.env.PORT || 5000;

// Grab the variable from Render, OR fallback to local if running on your computer
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/borrowhub';

mongoose.connect(DB_URI)
    .then(() => {
        console.log("🚀 Database connected successfully to MongoDB!");
        // Only start the web server once the database connection is established
        app.listen(PORT, () => {
            console.log(`Server listening actively on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed completely:", error);
    });