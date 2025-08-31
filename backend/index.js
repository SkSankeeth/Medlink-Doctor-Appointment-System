import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

import authRoute from "./Routes/auth.route.js";
import userRoute from "./Routes/user.route.js";
import doctorRoute from "./Routes/doctor.route.js";
import adminRoute from "./Routes/admin.route.js";
import bookingRoute from "./Routes/booking.route.js";
import appointmentRoute from "./Routes/appointment.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: true
};

// Get the directory name for static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Serve uploaded files statically from the 'uploads' folder
// The URL path '/uploads' will map to the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB database is connected");
    } catch (error) {
        console.log("MongoDB connection failed: " + error);
    }
};

// Start server and connect to database
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

// API routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/appointments", appointmentRoute);

// Default route for testing
app.get("/", (req, res) => {
    res.send("API is running!");
});
