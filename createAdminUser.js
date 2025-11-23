// createAdminUser.js
// One-time script to create or update an admin user with a hashed password in MongoDB

// require('dotenv').config(); // No longer needed as MONGODB_URI is hardcoded in server.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// --- Define Mongoose Schema and Model for User (copied from your server.js) ---
// This definition must match the UserSchema in your server.js file.
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
  isActive: { type: Boolean, default: true },
  timeTableUrl: { type: String, default: null }, // New field for Time Table URL
  createdAt: { type: Date, default: Date.now }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

// --- New Admin User Information ---
const adminUsername = "admin"; // Your requested username
const adminPassword = "admin"; // Your requested password
const adminRole = "admin";
// const appId = "myganttproject-471e7"; // This appId is not part of your UserSchema, so it's commented out.

async function createAdminUser() {
    try {
        // Your MongoDB Connection String - Directly using the value from your server.js
        const mongoUri = 'mongodb://localhost:2900/project_dashboard';
        
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully for admin user creation.');

        // Check if a user with this username already exists
        let existingUser = await User.findOne({ username: adminUsername });

        if (existingUser) {
            console.log(`User '${adminUsername}' already exists. Its role will be updated to '${adminRole}' and password will be updated.`);
            // Hash the new password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            
            existingUser.role = adminRole;
            existingUser.password = hashedPassword; // Update with the new hashed password
            existingUser.isActive = true; // Ensure the user is active
            await existingUser.save();
            console.log(`User '${adminUsername}' successfully updated to role '${adminRole}'.`);
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // Create the new user
            const newUser = new User({
                username: adminUsername,
                password: hashedPassword,
                role: adminRole,
                isActive: true, // Admin user is active by default
            });
            await newUser.save();
            console.log(`Admin user '${adminUsername}' with role '${adminRole}' created successfully.`);
        }

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Disconnect from the database
        mongoose.disconnect();
        console.log('MongoDB connection disconnected.');
    }
}

createAdminUser();
