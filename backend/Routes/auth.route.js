// backend/routes/auth.route.js

import express from 'express';
import { register, login } from '../Controllers/authController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Store files in 'uploads' folder relative to the server root
        cb(null, 'uploads'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({ storage });

// Routes
router.post('/register', upload.single('photo'), register);
router.post('/login', login);

export default router;
