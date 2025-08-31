import express from 'express';
import { 
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUsers,
    getUserProfile
} from '../Controllers/user.controller.js';
import {
    authenticate,
    restrictTo
} from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

router.put('/:id', 
    authenticate, 
    restrictTo(['patient']),
    upload.single('photo'), // Multer middleware added here
    updateUser
);
router.delete('/:id', authenticate, restrictTo(['patient']), deleteUser);
router.get('/:id', authenticate, restrictTo(['patient']), getSingleUser);
// Admin routes removed - only patient routes remain
router.get('/profile/me', authenticate, restrictTo(['patient']), getUserProfile);

export default router;
