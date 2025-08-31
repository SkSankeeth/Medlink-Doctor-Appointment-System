// File: backend/models/DoctorSchema.js

import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
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
    ticketPrice: {
        type: Number,
        default: 500
    },
    role: {
        type: String,
        default: "doctor"
    },
    specialization: {
        type: String,
        trim: true
    },
    qualifications: [{
        type: String,
        trim: true
    }],
    experiences: [{
        startingDate: {
            type: Date
        },
        endingDate: {
            type: Date
        },
        position: {
            type: String,
            trim: true
        },
        hospital: {
            type: String,
            trim: true
        }
    }],
    bio: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    about: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    timeSlots: [{
        day: {
            type: String,
            enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        },
        startingTime: {
            type: String
        },
        endingTime: {
            type: String
        }
    }],
    reviews: [{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userPhoto: {
            type: String
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reviewText: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRating: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: String,
        enum: ["pending", "approved", "cancelled"],
        default: "pending"
    },
    // The "appointments" field must reference the "Booking" model, not "Appointment"
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    }]
}, {
    timestamps: true
});

export default mongoose.model("Doctor", DoctorSchema);