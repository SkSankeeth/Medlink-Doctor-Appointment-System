// File: backend/models/UserSchema.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["patient", "admin"],
        default: "patient"
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    // The "appointments" field must reference the "Booking" model, not "Appointment"
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    }]
}, {
    timestamps: true
});

export default mongoose.model("User", UserSchema);