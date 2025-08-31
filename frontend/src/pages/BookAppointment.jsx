// frontend/src/components/BookAppointment.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
// Assuming you have a config file for your base URL
// import { BASE_URL } from '../config'; 

const BookAppointment = () => {
    const [loading, setLoading] = useState(false);

    // This data would typically be fetched from your state or props,
    // like the doctor's ID and the patient's ID from a logged-in user context.
    // For this example, we will use mock data.
    const appointmentDetails = {
        // Renamed 'patientId' to 'user' to match the backend model
        user: 'patient123',
        // Renamed 'doctorId' to 'doctor' to match the backend model
        doctor: 'doctor456',
        date: '2025-09-01',
        // Renamed 'time' to 'timeSlot' to match the backend model
        timeSlot: '10:00 AM'
    };

    const handleBookAppointment = async () => {
        setLoading(true);

        // A real application would send this data to a backend endpoint.
        // For this demonstration, we will simulate a network request.
        try {
            // Replace this with your actual API endpoint.
            // Example: const response = await axios.post(`${BASE_URL}/appointments/book`, appointmentDetails);
            
            // Simulating a successful API call with a 2-second delay
            // A real successful API response would have a success flag
            // and maybe some returned data
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check for success from the simulated response
            const success = true; // Simulating a successful response from the server

            if (success) {
                toast.success("Appointment booked successfully!");
            } else {
                // This would handle a scenario where the server returns a non-200 status code but with an error message
                toast.error("Failed to book appointment. Please try again.");
            }
        } catch (err) {
            // This handles network errors or other unexpected issues
            console.error('Booking error:', err);
            toast.error("An error occurred while booking. Please check your network and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-headingColor">Book Your Appointment</h2>
                
                <div className="mb-6 text-textColor">
                    <p className="mb-2">You are about to book an appointment with a doctor.</p>
                    <p className="mb-2">Date: <span className="font-semibold">{appointmentDetails.date}</span></p>
                    <p className="mb-2">Time: <span className="font-semibold">{appointmentDetails.timeSlot}</span></p>
                </div>
                
                <button
                    onClick={handleBookAppointment}
                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 shadow-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Booking...' : 'Confirm and Book'}
                </button>
            </div>
        </div>
    );
};

export default BookAppointment;
