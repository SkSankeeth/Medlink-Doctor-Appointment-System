// backend/Routes/doctor.route.js
import express from 'express';
import {
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getSingleDoctor,
    getDoctorProfile,
    getDoctorAppointments
} from '../Controllers/doctorController.js';

import {
    authenticate,
    restrictTo
} from '../middleware/auth.middleware.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { addReview, getDoctorReviews } from '../Controllers/reviewController.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename with a timestamp and the original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Add debugging middleware to see all requests
router.use((req, res, next) => {
    console.log('Doctor route hit:', req.method, req.originalUrl);
    next();
});

router.get('/profile/me', authenticate, restrictTo(['doctor']), getDoctorProfile);
router.get('/appointments', authenticate, restrictTo(['doctor']), getDoctorAppointments);
router.get('/', getAllDoctors);

// Direct review routes - MUST come before /:id route
router.post('/:doctorId/reviews', (req, res, next) => {
    console.log('Doctor review POST route hit:', req.method, req.originalUrl);
    console.log('Doctor ID from params:', req.params.doctorId);
    next();
}, authenticate, restrictTo(['patient']), addReview);

router.get('/:doctorId/reviews', (req, res, next) => {
    console.log('Doctor review GET route hit:', req.method, req.originalUrl);
    console.log('Doctor ID from params:', req.params.doctorId);
    next();
}, getDoctorReviews);

// These routes must come AFTER the more specific routes
router.get('/:id', getSingleDoctor);
router.put('/:id', authenticate, restrictTo(['doctor']), upload.single('photo'), updateDoctor);
router.delete('/:id', authenticate, restrictTo(['doctor']), deleteDoctor);

export default router;