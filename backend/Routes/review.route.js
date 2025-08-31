// backend/Routes/review.route.js
import express from 'express';
import { addReview, getDoctorReviews } from '../Controllers/reviewController.js';
import { authenticate, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add debugging middleware
router.use((req, res, next) => {
    console.log('Review route hit:', req.method, req.originalUrl);
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    next();
});

// Add a review (only patients can add reviews)
router.post('/', authenticate, restrictTo(['patient']), addReview);

// Get all reviews for a doctor (public access)
router.get('/', getDoctorReviews);

export default router;