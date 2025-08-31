// backend/Controllers/doctorController.js (Updated)

import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import bcrypt from "bcryptjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Update all doctor details including approval status
export const updateDoctor = async (req, res) => {
    const id = req.params.id;
    
    try {
        console.log('Update doctor request body:', req.body);
        
        // Handle FormData fields
        const updates = {
            name: req.body.name,
            specialization: req.body.specialization,
            about: req.body.about
        };

        // Validate and convert ticketPrice to number
        if (req.body.ticketPrice !== undefined) {
            const ticketPrice = parseFloat(req.body.ticketPrice);
            if (isNaN(ticketPrice) || ticketPrice < 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Ticket price must be a valid positive number' 
                });
            }
            updates.ticketPrice = ticketPrice;
        }

        // Parse JSON fields if they exist with better error handling
        if (req.body.qualifications) {
            try {
                const qualifications = JSON.parse(req.body.qualifications);
                if (Array.isArray(qualifications)) {
                    updates.qualifications = qualifications.filter(q => 
                        q && q.degree && q.degree.trim() && q.university && q.university.trim()
                    );
                } else {
                    console.warn('Qualifications is not an array:', qualifications);
                    updates.qualifications = [];
                }
            } catch (e) {
                console.error('Error parsing qualifications:', e, 'Raw data:', req.body.qualifications);
                updates.qualifications = [];
            }
        }

        if (req.body.experiences) {
            try {
                const experiences = JSON.parse(req.body.experiences);
                if (Array.isArray(experiences)) {
                    updates.experiences = experiences.filter(e => 
                        e && e.startingDate && e.endingDate && e.position && e.position.trim()
                    );
                } else {
                    console.warn('Experiences is not an array:', experiences);
                    updates.experiences = [];
                }
            } catch (e) {
                console.error('Error parsing experiences:', e, 'Raw data:', req.body.experiences);
                updates.experiences = [];
            }
        }

        if (req.body.timeSlots) {
            try {
                const timeSlots = JSON.parse(req.body.timeSlots);
                if (Array.isArray(timeSlots)) {
                    updates.timeSlots = timeSlots.filter(t => 
                        t && t.day && t.startingTime && t.endingTime
                    );
                } else {
                    console.warn('TimeSlots is not an array:', timeSlots);
                    updates.timeSlots = [];
                }
            } catch (e) {
                console.error('Error parsing timeSlots:', e, 'Raw data:', req.body.timeSlots);
                updates.timeSlots = [];
            }
        }

        // Handle file upload
        if (req.file) {
            updates.photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        console.log('Final updates object:', updates);

        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Doctor details updated successfully',
            data: updatedDoctor
        });
    } catch (err) {
        console.error('Update doctor error:', err);
        res.status(500).json({ success: false, message: 'Failed to update doctor details' });
    }
};

// Delete a doctor by ID
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the doctor is trying to delete their own account
        if (req.userId !== id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own account"
            });
        }

        // Find the doctor first to get their photo path
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Delete associated bookings
        await Booking.deleteMany({ doctor: id });

        // Delete the doctor
        await Doctor.findByIdAndDelete(id);

        // Delete the doctor's photo if it exists
        if (doctor.photo) {
            const oldPhotoPath = `uploads/${path.basename(doctor.photo)}`;
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const absolutePath = path.join(__dirname, '..', oldPhotoPath);
            
            fs.unlink(absolutePath, (err) => {
                if (err) {
                    console.error(`Error deleting old file at ${absolutePath}:`, err);
                } else {
                    console.log(`File deleted successfully at ${absolutePath}`);
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete account' });
    }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).json({
            success: true,
            message: 'Doctors found successfully',
            data: doctors
        });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
};

// Get a single doctor by ID
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id).select('-password');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        console.log('Fetched doctor with reviews:', { 
            doctorId: id, 
            totalReviews: doctor.reviews?.length || 0,
            averageRating: doctor.averageRating || 0,
            ticketPrice: doctor.ticketPrice,
            qualifications: doctor.qualifications,
            experiences: doctor.experiences
        });
        
        res.status(200).json({
            success: true,
            message: 'Doctor found successfully',
            data: doctor
        });
    } catch (err) {
        console.error('Error fetching doctor:', err);
        res.status(404).json({ success: false, message: 'Not found' });
    }
};

// Get a doctor's profile
export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;

    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: doctorId });

        res.status(200).json({ success: true, message: 'Profile info is getting', data: { ...rest, appointments } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong, cannot get profile' });
    }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
    const doctorId = req.userId;

    try {
        // Find all bookings for the doctor and populate user details
        const appointments = await Booking.find({ doctor: doctorId })
            .populate('user', 'name email photo')
            .sort({ appointmentDate: 1 });

        res.status(200).json({
            success: true,
            message: "Doctor appointments fetched successfully",
            data: appointments
        });
    } catch (err) {
        console.error("Error fetching doctor appointments:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments"
        });
    }
};
