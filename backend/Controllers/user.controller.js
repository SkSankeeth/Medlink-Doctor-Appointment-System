// backend/Controllers/userController.js (Updated)

import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to delete a file from the uploads directory
const deleteFile = (filePath) => {
    // Determine the absolute path of the file to be deleted
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const absolutePath = path.join(__dirname, '..', filePath);
    
    fs.unlink(absolutePath, (err) => {
        if (err) {
            // Log a more informative error message if the file can't be deleted
            console.error(`Error deleting old file at ${absolutePath}:`, err);
        } else {
            console.log(`File deleted successfully at ${absolutePath}`);
        }
    });
};

// Update a user's details, including profile photo and approval status
export const updateUser = async (req, res) => {
    const id = req.params.id;

    // Define allowed fields to prevent sensitive data like password from being updated.
    // Added 'isApproved' to match the doctor controller's functionality.
    const allowedFields = ['name', 'gender', 'bloodGroup', 'isApproved'];
    const updates = {};
    for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    // Check if a new file was uploaded
    if (req.file) {
        // Find the user first to check for an existing photo
        try {
            const user = await User.findById(id);
            if (user && user.photo) {
                // Ensure the path is correct by stripping the base URL
                const oldPhotoPath = `uploads/${path.basename(user.photo)}`;
                deleteFile(oldPhotoPath);
            }
        } catch (err) {
            console.error("Error finding user to delete old photo:", err);
            // Don't stop the update process if old photo deletion fails
        }
        
        // Construct the full, public URL for the new photo
        updates.photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
        // Use findByIdAndUpdate to update the user with only the allowed fields and the new photo URL
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");
        
        if (!updatedUser) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Return the updated user data
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser,
        });

    } catch (err) {
        if (req.file) {
            deleteFile(req.file.path);
        }
        console.error("Update error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if the user is trying to delete their own account
        if (req.userId !== id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own account"
            });
        }

        // Find the user first to get their photo path
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete associated bookings
        await Booking.deleteMany({ user: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        // Delete the user's photo if it exists
        if (user.photo) {
            const oldPhotoPath = `uploads/${path.basename(user.photo)}`;
            deleteFile(oldPhotoPath);
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete account"
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json({
            success: true,
            message: "Users found",
            data: users,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Users not found"
        });
    }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: "User found",
            data: user,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "No user found"
        });
    }
};

// Get a user's profile
export const getUserProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, ...rest } = user._doc;
        // Fetch the bookings for the user to make the profile similar to the doctor's profile
        const bookings = await Booking.find({ user: userId });

        res.status(200).json({
            success: true,
            message: "Profile info is getting",
            data: { ...rest, bookings },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, cannot get profile"
        });
    }
};
