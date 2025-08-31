// backend/models/ReviewSchema.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
    reviewText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
reviewSchema.index({
    doctor: 1
});
reviewSchema.index({
    user: 1
});

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(doctorId) {
    const stats = await this.aggregate([{
        $match: {
            doctor: doctorId
        }
    }, {
        $group: {
            _id: '$doctor',
            numOfRating: {
                $sum: 1
            },
            avgRating: {
                $avg: '$rating'
            }
        }
    }]);

    if (stats.length > 0) {
        await this.model('Doctor').findByIdAndUpdate(doctorId, {
            totalRating: stats[0].numOfRating,
            averageRating: stats[0].avgRating
        });
    } else {
        await this.model('Doctor').findByIdAndUpdate(doctorId, {
            totalRating: 0,
            averageRating: 0
        });
    }
};

// Call calcAverageRating after save and remove
reviewSchema.post('save', function() {
    this.constructor.calcAverageRating(this.doctor);
});

reviewSchema.post('remove', function() {
    this.constructor.calcAverageRating(this.doctor);
});

export default mongoose.model("Review", reviewSchema);