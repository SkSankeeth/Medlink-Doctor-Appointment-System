// frontend/src/Dashboard/doctor-account/Dashboard.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import DoctorProfile from './DoctorProfile'; // New component
import MyAppointments from './MyAppointments'; // Placeholder for future feature

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [tab, setTab] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!token) {
                    throw new Error("No authorization token found.");
                }

                const response = await axios.get(`${BASE_URL}/doctors/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setProfileData(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchProfile();
        } else {
            setLoading(false);
            setError("User not authenticated.");
        }
    }, [token, user]);

    if (loading) {
        return <div className="text-center mt-8">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (!profileData) {
        return <div className="text-center mt-8">No profile data found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-headingColor mb-4">Doctor Dashboard</h2>
            <div className="flex items-center justify-between border-b border-solid border-gray-200">
                <button
                    onClick={() => setTab('profile')}
                    className={`py-2 px-5 font-semibold text-base md:text-lg ${tab === 'profile' ? 'text-primaryColor border-b-2 border-primaryColor' : 'text-headingColor'}`}
                >
                    Profile Settings
                </button>
                <button
                    onClick={() => setTab('appointments')}
                    className={`py-2 px-5 font-semibold text-base md:text-lg ${tab === 'appointments' ? 'text-primaryColor border-b-2 border-primaryColor' : 'text-headingColor'}`}
                >
                    My Appointments
                </button>
            </div>

            <div className="mt-8">
                {tab === 'profile' && <DoctorProfile doctor={profileData} />}
                {tab === 'appointments' && <MyAppointments />}
            </div>
        </div>
    );
};

export default Dashboard;
