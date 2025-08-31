import React, { useState } from "react";
import { AiFillStar } from 'react-icons/ai'; // Ensure AiFillStar is imported

const FeedbackForm = ({ doctor }) => { // Accept doctor prop
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmitReview = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(''); // Clear previous messages

        // Basic client-side validation
        if (rating === 0) {
            setMessage('Please provide a star rating.');
            setIsSubmitting(false);
            return;
        }
        if (reviewText.trim() === '') {
            setMessage('Please write your feedback.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate API call to a backend endpoint
            // In a real application, replace this with an actual fetch or axios call to your API
            const response = await new Promise(resolve => setTimeout(() => {
                console.log("Simulating API call for feedback:", {
                    doctorId: doctor.id, // Use doctor.id
                    rating,
                    reviewText
                });
                // Simulate success or failure for demonstration
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, message: 'Feedback submitted successfully!' });
                } else {
                    resolve({ success: false, message: 'Failed to submit feedback. Please try again.' });
                }
            }, 1500)); // Simulate network delay of 1.5 seconds

            if (response.success) {
                setMessage(response.message);
                // Optionally reset form fields after successful submission
                setRating(0);
                setHover(0);
                setReviewText('');
                // If you want to hide the form after submission, you would typically
                // call a prop function passed from the parent (Feedback.jsx) here.
                // e.g., if (props.onFeedbackSubmitted) props.onFeedbackSubmitted();
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmitReview} className="mt-8">
            <div>
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    How would you rate the overall experience?*
                </h3>
                <div>
                    {[...Array(5).keys()].map((_, index) => {
                        index += 1; // Stars are 1-indexed
                        return (
                            <button
                                key={index}
                                type="button" // Important: type="button" to prevent form submission
                                className={`${
                                    index <= ((rating && hover) || hover)
                                        ? "text-yellowColor"
                                        : "text-gray-400"
                                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                                onClick={() => setRating(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                                onDoubleClick={() => { // Allows resetting rating on double click
                                    setHover(0);
                                    setRating(0);
                                }}
                            >
                                <span>
                                    <AiFillStar />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-[30px]">
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    Share feedback or suggestions*
                </h3>

                <textarea
                    className="border border-solid border-[#0066ff4] focus:outline outline-primaryColor
                    w-full px-4 py-3 rounded-md"
                    rows="5"
                    placeholder="write your message"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
            </div>

            {/* Display submission message */}
            {message && (
                <p className={`text-center mt-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}

            <button
                type="submit"
                className="btn"
                disabled={isSubmitting} // Disable button during submission
            >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    );
};

export default FeedbackForm;
