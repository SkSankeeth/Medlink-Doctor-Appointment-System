import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute, { AdminRoute } from './ProtectedRoute';

// The following import paths assume a standard project structure
// where the 'pages' and 'Dashboard' folders are siblings of the 'routes' folder.
// For example:
// src/
// ├── routes/
// │   └── Routers.jsx
// ├── pages/
// │   └── Home.jsx
// └── Dashboard/
//     └── user-account/
//         └── MyAppointments.jsx

import Home from '../pages/Home';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Contact from '../pages/Contact';
import Doctors from '../pages/Doctors/Doctors';
import DoctorDetails from '../pages/Doctors/DoctorDetails';
import MyAccount from '../Dashboard/user-account/MyAccount';
import Dashboard from '../Dashboard/doctor-account/Dashboard';
import BookingPage from '../pages/BookingPage';
import MyAppointments from '../Dashboard/user-account/MyAppointments';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/users/profile/me" element={<MyAccount />} />
      <Route path="/doctors/profile/me" element={<Dashboard />} />
      <Route path="/book-appointment" element={<BookingPage />} />
      {/* This route was added to fix the navigation error. */}
      <Route path="/my-appointments" element={<MyAppointments />} />
      {/* Admin Dashboard Route - Protected for Admin Users Only */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    </Routes>
  );
};

export default Routers;
