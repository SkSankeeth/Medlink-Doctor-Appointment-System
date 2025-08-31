// File: backend/Controllers/appointment.controller.js

import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

/**
 * @desc Get all appointments for a logged-in user.
 * @route GET /api/v1/appointments/my-appointments
 * @access Private (Patient)
 */
export const getUserAppointments = async (req, res) => {
    try {
        const userId = req.userId;

        // Find all bookings for the user
        const bookings = await Booking.find({ user: userId }).populate("doctor", "name photo specialization ticketPrice");

        if (bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have no appointments booked yet.",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: bookings
        });
    } catch (err) {
        // Log the specific error for debugging
        console.error("Error fetching appointments:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments"
        });
    }
};

/**
 * @desc Create a new appointment.
 * @route POST /api/v1/appointments/book
 * @access Private (Patient)
 */
export const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlot } = req.body;
        const userId = req.userId;

        console.log('Received booking request:', { doctorId, appointmentDate, timeSlot, userId });
        console.log('Request body:', req.body);
        console.log('User ID from token:', req.userId);

        // Validate required fields
        if (!doctorId || !appointmentDate || !timeSlot) {
            console.log('Missing fields:', { doctorId: !!doctorId, appointmentDate: !!appointmentDate, timeSlot: !!timeSlot });
            return res.status(400).json({
                success: false,
                message: "Missing required fields: doctorId, appointmentDate, and timeSlot are required"
            });
        }

        // Validate the incoming date string before proceeding
        const parsedDate = new Date(appointmentDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date format. Please send a valid date string."
            });
        }

        // Find the doctor and user documents
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the appointment date is today or in the future (allow same day bookings)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day
        const appointmentDay = new Date(parsedDate);
        appointmentDay.setHours(0, 0, 0, 0); // Set to start of day

        if (appointmentDay < today) {
            return res.status(400).json({
                success: false,
                message: "Appointment date must be today or in the future"
            });
        }

        // Create a new booking document
        const newBooking = new Booking({
            doctor: doctorId,
            user: userId,
            ticketPrice: doctor.ticketPrice,
            appointmentDate: parsedDate,
            status: "pending",
            isPaid: false,
            session: timeSlot // Store the time slot information
        });

        await newBooking.save();

        // Update the user's appointments array
        await User.findByIdAndUpdate(userId, {
            $push: { appointments: newBooking._id }
        });

        // Update the doctor's appointments array
        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { appointments: newBooking._id }
        });

        // Populate the booking with doctor and user details for response
        const populatedBooking = await Booking.findById(newBooking._id)
            .populate('doctor', 'name photo specialization')
            .populate('user', 'name email photo');

        console.log('Appointment created successfully:', populatedBooking._id);

        res.status(201).json({
            success: true,
            message: "Appointment created successfully!",
            data: populatedBooking
        });

    } catch (err) {
        // Log the specific error to help with debugging on the backend
        console.error("Error creating appointment:", err);
        res.status(500).json({
            success: false,
            message: "Error creating appointment"
        });
    }
};
