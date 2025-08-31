// backend/Controllers/reviewController.js

import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

/**
 * @desc Add a review to a doctor
 * @route POST /api/v1/doctors/:doctorId/reviews
 * @access Private (Patient)
 */
export const addReview = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.userId;

        console.log('Adding review:', { doctorId, rating, reviewText, userId });

        // Validate required fields
        if (!rating || !reviewText) {
            return res.status(400).json({
                success: false,
                message: "Rating and review text are required"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has already reviewed this doctor
        const existingReview = doctor.reviews.find(review => 
            review.userId.toString() === userId
        );

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this doctor"
            });
        }

        // Create new review object
        const newReview = {
            userId: userId,
            userName: user.name,
            userPhoto: user.photo,
            rating: rating,
            reviewText: reviewText,
            createdAt: new Date()
        };

        // Add review to doctor's reviews array
        doctor.reviews.push(newReview);

        // Calculate new average rating
        const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
        doctor.averageRating = totalRating / doctor.reviews.length;
        doctor.totalRating = doctor.reviews.length;

        // Save the updated doctor
        await doctor.save();

        console.log('Review added successfully:', { 
            doctorId, 
            reviewId: newReview._id,
            totalReviews: doctor.reviews.length,
            newAverageRating: doctor.averageRating,
            newTotalRating: doctor.totalRating
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: newReview
        });

    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({
            success: false,
            message: "Error adding review"
        });
    }
};

/**
 * @desc Get all reviews for a doctor
 * @route GET /api/v1/doctors/:doctorId/reviews
 * @access Public
 */
export const getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findById(doctorId).select('reviews averageRating totalRating');
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        console.log('Fetched reviews for doctor:', { 
            doctorId, 
            totalReviews: doctor.reviews.length,
            averageRating: doctor.averageRating
        });

        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: {
                reviews: doctor.reviews,
                averageRating: doctor.averageRating,
                totalRating: doctor.totalRating
            }
        });

    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews"
        });
    }
};