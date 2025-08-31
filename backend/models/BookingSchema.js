// File: backend/models/BookingSchema.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "cancelled"],
        default: "pending"
    },
    isPaid: {
        type: Boolean,
        default: false // Set to false by default, as payment happens later
    },
    session: {
        type: String
    }
}, {
    timestamps: true
});

// Pre-populate doctor and user details when querying
bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'doctor',
        select: 'name'
    });
    next();
});

export default mongoose.model("Booking", bookingSchema);