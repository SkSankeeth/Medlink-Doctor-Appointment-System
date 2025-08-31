import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import { FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';

const DoctorDetails = () => {
    // We use useParams to get the doctor's ID from the URL (e.g., /doctors/123)
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    
    // State for feedback submission
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Function to fetch doctor details
    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/doctors/${id}`);
            
            if (response.data.success) {
                console.log('Doctor data received:', response.data.data);
                console.log('Doctor ticket price:', response.data.data.ticketPrice);
                console.log('Reviews count:', response.data.data.reviews?.length || 0);
                setDoctor(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Failed to fetch doctor details:", err);
            setError("Failed to load doctor details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorDetails();
    }, [id]); // The effect re-runs if the doctor ID in the URL changes

    const handleBookAppointment = async () => {
        if (!doctor || !selectedTimeSlot || !selectedDate) {
            toast.error("Please select a date and a time slot.");
            return;
        }
        
        if (!token || !user) {
            toast.error("You must be logged in to book an appointment.");
            navigate('/login');
            return;
        }

        try {
            const payload = {
                doctorId: doctor._id,
                appointmentDate: selectedDate,
                timeSlot: `${selectedTimeSlot.day}: ${selectedTimeSlot.startingTime} - ${selectedTimeSlot.endingTime}`
            };
            
            console.log('Sending booking payload:', payload);
            console.log('Selected date:', selectedDate);
            console.log('Selected time slot:', selectedTimeSlot);
            
            const response = await axios.post(`${BASE_URL}/appointments/book`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/users/profile/me');
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error('Appointment booking error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to book appointment. Please try again.');
            }
        }
    };

    const handleReviewSubmit = async () => {
        if (!rating || !reviewText.trim()) {
            toast.error("Please provide a rating and a review.");
            return;
        }

        if (!token || !user) {
            toast.error("You must be logged in to submit a review.");
            navigate('/login');
            return;
        }
        
        try {
            const payload = {
                rating: rating,
                reviewText: reviewText
            };
            
            console.log('Submitting review with payload:', payload);
            console.log('Doctor ID:', id);
            
            const response = await axios.post(`${BASE_URL}/doctors/${id}/reviews`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log('Review submitted successfully:', response.data);
                toast.success(response.data.message);
                // Clear form and re-fetch doctor data to show new review
                setReviewText('');
                setRating(0);
                console.log('Re-fetching doctor details to show new review...');
                fetchDoctorDetails(); // Re-fetch data to update reviews list
            } else {
                console.log('Review submission failed:', response.data);
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error('Review submission error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to submit review. Please try again.');
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading doctor details...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    if (!doctor) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">No doctor found.</div>;
    }

    return (
        <section className="bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
                    {/* Doctor Profile Section */}
                    <div className="w-full md:w-1/3 p-6 flex flex-col items-center border-r border-gray-200">
                        <img src={doctor.photo} alt={`${doctor.name} profile`} className="w-48 h-48 rounded-full object-cover border-4 border-primaryColor" />
                        <h2 className="text-2xl font-bold mt-4 text-headingColor">{doctor.name}</h2>
                        <p className="text-primaryColor text-xl mt-1 font-semibold">{doctor.specialization}</p>
                        
                        {/* Doctor Fee Display */}
                        <div className="mt-4 text-center">
                            <div className="bg-primaryColor text-white px-6 py-3 rounded-lg">
                                <p className="text-sm font-medium">Consultation Fee</p>
                                <p className="text-2xl font-bold">₹{doctor.ticketPrice || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center text-textColor">
                            <h4 className="font-semibold text-lg">About</h4>
                            <p className="mt-2">{doctor.about}</p>
                        </div>
                    </div>

                    {/* Booking & Review Section */}
                    <div className="w-full md:w-2/3 p-6">
                        <div className="text-lg font-bold text-headingColor mb-4">Book an Appointment</div>

                        {/* Select Date */}
                        <div className="mb-4">
                            <label htmlFor="date-picker" className="block text-textColor mb-2 font-semibold">Select a Date</label>
                            <div className="flex items-center border border-gray-300 rounded-md p-2">
                                <FaCalendarAlt className="text-primaryColor mr-2" />
                                <input
                                    type="date"
                                    id="date-picker"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Select Time Slot */}
                        <div className="mb-6">
                            <label className="block text-textColor mb-2 font-semibold">Select a Time Slot</label>
                            <div className="flex items-center border border-gray-300 rounded-md p-2">
                                <FaClock className="text-primaryColor mr-2" />
                                <div className="flex flex-wrap gap-2 w-full">
                                    {doctor.timeSlots.length > 0 ? (
                                        doctor.timeSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedTimeSlot(slot)}
                                                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${selectedTimeSlot === slot ? 'bg-primaryColor text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                {slot.day}: {slot.startingTime}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-textColor">No time slots available for this doctor.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fee Display Above Booking */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-headingColor">Consultation Fee:</span>
                                <span className="text-2xl font-bold text-primaryColor">₹{doctor.ticketPrice || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Booking Button */}
                        <button
                            onClick={handleBookAppointment}
                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 shadow-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedTimeSlot || !selectedDate}
                        >
                            Book Appointment
                        </button>

                        {/* Feedback Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-headingColor mb-4">Patient Reviews ({doctor.reviews?.length || 0})</h3>
                            {console.log('Current doctor reviews:', doctor.reviews)}
                            <div className="space-y-4">
                                {doctor.reviews && doctor.reviews.length > 0 ? (
                                    doctor.reviews.map((review, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-textColor">{review.userName}</span>
                                                <div className="flex items-center text-yellow-400">
                                                    {Array(review.rating).fill().map((_, i) => <FaStar key={i} />)}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.reviewText}</p>
                                            <div className="text-xs text-gray-400 mt-2">
                                                Rating: {review.rating}/5 • {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-textColor text-sm">No reviews yet. Be the first to leave one!</p>
                                )}
                            </div>
                        </div>

                        {/* Feedback Submission Form */}
                        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-headingColor mb-4">Leave a Review</h3>
                            <div className="mb-4">
                                <label className="block text-textColor mb-2 font-semibold">Your Rating</label>
                                <div className="flex items-center text-gray-400 space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            onClick={() => setRating(i + 1)}
                                            className={`cursor-pointer text-2xl transition-colors duration-200 ${i < rating ? 'text-yellow-400' : 'hover:text-yellow-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="review-text" className="block text-textColor mb-2 font-semibold">Your Feedback</label>
                                <textarea
                                    id="review-text"
                                    rows="4"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-primaryColor focus:border-primaryColor"
                                    placeholder="Write your review here..."
                                />
                            </div>
                            <button
                                onClick={handleReviewSubmit}
                                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 shadow-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!rating || !reviewText.trim()}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorDetails;
