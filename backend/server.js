// 1. Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import our Day 2 User Routes
const userRoutes = require('./routes/userRoutes');

// 2. Load environment variables from the .env file
dotenv.config();

// 3. Initialize the Express application instance
const app = express();

// 4. Mount Global Middlewares
app.use(cors()); // Allows our frontend React app to talk to this backend
app.use(express.json()); // Tells Express to parse incoming JSON data

// 5. Test route to ensure the server is working
app.get('/api/health', (req, res) => {
    res.json({ status: "success", message: "BorrowHub Server is running perfectly!" });
});

// 6. Mount our User Routes (This connects the URLs to the controller logic)
app.use('/api/users', userRoutes);

// 7. Connect to the MongoDB Database using Mongoose
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
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