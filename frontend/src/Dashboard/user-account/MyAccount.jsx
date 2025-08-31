// frontend/src/Dashboard/user-account/MyAccount.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MyAppointments from './MyAppointments';
import Profile from './Profile';

const MyAccount = () => {
    // Get user and other auth-related data from the context
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState('profile');
    const location = useLocation();

    // Use a useEffect hook to check for a 'tab' state in the location object
    // This allows navigating directly to a specific tab, for example, after a booking is made
    useEffect(() => {
        if (location.state?.tab) {
            setTab(location.state.tab);
        }
    }, [location.state]);

    // Conditional rendering to show a message if the user is not logged in
    if (!user) {
        return <div className="text-center mt-8">Please log in to view your account.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-headingColor mb-4">My Account</h2>
            
            {/* Tab navigation buttons */}
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

            {/* Content area based on the selected tab */}
            <div className="mt-8">
                {/* Conditionally render the selected component based on the 'tab' state */}
                {tab === 'profile' && <Profile />}
                {tab === 'appointments' && <MyAppointments />}
            </div>
        </div>
    );
};

export default MyAccount;
