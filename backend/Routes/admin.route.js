// backend/Routes/admin.route.js

import express from 'express';
import {
    getAdminUsers,
    getAdminDoctors,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAdminUser,
    deleteAdminDoctor,
    getDashboardStats,
    createAdminUser
} from '../Controllers/adminController.js';

import {
    authenticate,
    restrictTo
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Test route to verify admin routes are working
router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes are working!' });
});

// Admin creation route (public access for development)
router.post('/create-admin', createAdminUser);

// All other admin routes require authentication and admin role
router.use((req, res, next) => {
    console.log('Admin Route - Headers:', req.headers);
    console.log('Admin Route - Authorization:', req.headers.authorization);
    next();
});

router.use(authenticate);

router.use((req, res, next) => {
    console.log('Admin Route - After authenticate middleware');
    console.log('Admin Route - User ID:', req.userId);
    console.log('Admin Route - User Role:', req.role);
    next();
});

router.use(restrictTo(['admin']));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteAdminUser);

// Doctor management
router.get('/doctors', getAdminDoctors);
router.delete('/doctors/:id', deleteAdminDoctor);

// Appointment management
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

export default router;
