// backend/Routes/appointment.route.js
import express from 'express';
import {
    getUserAppointments,
    createAppointment
} from '../Controllers/appointment.controller.js';
import {
    authenticate,
    restrictTo
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/my-appointments', authenticate, getUserAppointments);
router.post('/book', authenticate, createAppointment);

export default router;