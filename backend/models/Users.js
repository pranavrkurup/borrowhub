const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the Blueprint (Schema)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide a college email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false, // Security: Don't return passwords by default in database queries
        },
        role: {
            type: String,
            enum: ['Student', 'Admin'],
            default: 'Student',
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// 2. Mongoose Middleware (The Shredder)
// This runs automatically BEFORE a user is saved to the database
userSchema.pre('save', async function (next) {
    // If the password hasn't been modified, skip hashing (e.g., if user just updates their name)
    if (!this.isModified('password')) return next();

    // Generate a 'salt' (random data added to the password before hashing for extra security)
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 3. Custom Method to compare passwords during Login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Export the Model
const User = mongoose.model('User', userSchema);
module.exports = User;