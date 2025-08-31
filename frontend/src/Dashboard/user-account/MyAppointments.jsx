// frontend/src/Dashboard/user-account/MyAppointments.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const MyAppointments = () => {
    // State to hold the list of appointments
    // We initialize it with an empty array to prevent the "length" error
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the user and token from the authentication context
    const { user, token } = useContext(AuthContext);

    // useEffect hook to fetch data when the component mounts or dependencies change
    useEffect(() => {
        // Asynchronous function to handle fetching the appointments
        const fetchAppointments = async () => {
            // Check if the user and token exist before making the API call
            if (!user || !token) {
                setLoading(false);
                setError("You must be logged in to view your appointments.");
                return;
            }

            try {
                // Set loading state to true while fetching data
                setLoading(true);

                // Make a GET request to the backend endpoint for user appointments
                // The Authorization header is crucial for authenticating the request
                const response = await axios.get(`${BASE_URL}/appointments/my-appointments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Check if the request was successful
                if (response.data.success) {
                    // FIX: Check if the data is an array before setting the state
                    // This prevents the "Cannot read properties of undefined (reading 'length')" error
                    const fetchedAppointments = response.data.data;
                    if (Array.isArray(fetchedAppointments)) {
                        setAppointments(fetchedAppointments);
                    } else {
                        // If the data is not an array, log a warning and set an empty array
                        console.warn("API returned non-array data for appointments:", fetchedAppointments);
                        setAppointments([]);
                    }
                } else {
                    // If the request was not successful, set an error message
                    setError(response.data.message);
                    toast.error(response.data.message);
                }
            } catch (err) {
                // Handle any network or server errors
                console.error("Failed to fetch appointments:", err);
                // Log the full error response for easier debugging
                if (err.response) {
                    console.error("Server response:", err.response.data);
                    console.error("Status code:", err.response.status);
                    console.error("Headers:", err.response.headers);
                }
                setError("Failed to load your appointments. Please try again later.");
                toast.error("Failed to load your appointments.");
            } finally {
                // Set loading state to false after the fetch is complete
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchAppointments();

        // Set up an interval to refresh appointments every 30 seconds
        const interval = setInterval(fetchAppointments, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);

    }, [user, token]); // Re-run the effect if the user or token changes

    // Conditional rendering based on the component's state
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading your appointments...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    // Now, before proceeding, let's make sure the appointments variable is valid
    const displayAppointments = appointments || [];

    // Check if the appointments list is empty
    if (displayAppointments.length === 0) {
        return <div className="flex justify-center items-center min-h-screen text-gray-500">You have no appointments booked yet.</div>;
    }

    return (
        <section className="bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-headingColor mb-8">My Appointments</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <ul className="divide-y divide-gray-200">
                        {displayAppointments.map((appointment) => (
                            <li key={appointment._id} className="py-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    {/* Display doctor's name and specialization */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-headingColor">{appointment.doctor?.name || "N/A"}</h2>
                                        <p className="text-textColor text-sm mt-1">{appointment.doctor?.specialization || "N/A"}</p>
                                    </div>
                                    {/* Display appointment details */}
                                    <div className="md:text-right mt-4 md:mt-0">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Date:</span> {new Date(appointment.appointmentDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {/* Safely access nested timeSlot property */}
                                            <span className="font-semibold">Time:</span> {appointment.session || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Status:</span> 
                                            <span className={`font-semibold ml-1 ${
                                                appointment.status === 'approved' ? 'text-green-500' : 
                                                appointment.status === 'cancelled' ? 'text-red-500' : 
                                                'text-yellow-500'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Price:</span> ${appointment.ticketPrice}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default MyAppointments;
