// backend/Routes/booking.route.js
import express from 'express';
import {
    authenticate,
    restrictTo
} from '../middleware/auth.middleware.js';
import {
    getCheckoutSession,
    getAllBookings,
    getSingleBooking,
    updateBookingStatus,
    deleteBooking
} from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession);
// Admin routes removed - only patient and doctor routes remain

export default router;