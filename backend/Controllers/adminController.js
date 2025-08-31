// backend/Controllers/adminController.js

import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

/**
 * @desc Get all users (patients) for admin
 * @route GET /api/v1/admin/users
 * @access Private (Admin)
 */
export const getAdminUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').populate('appointments');
        
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

/**
 * @desc Get all doctors for admin
 * @route GET /api/v1/admin/doctors
 * @access Private (Admin)
 */
export const getAdminDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password').populate('appointments');
        
        res.status(200).json({
            success: true,
            message: 'Doctors fetched successfully',
            data: doctors
        });
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors'
        });
    }
};

/**
 * @desc Get all appointments
 * @route GET /api/v1/admin/appointments
 * @access Private (Admin)
 */
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Booking.find({})
            .populate('user', 'name email photo')
            .populate('doctor', 'name specialization photo')
            .sort({ appointmentDate: -1 });
        
        res.status(200).json({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments
        });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
};

/**
 * @desc Update appointment status
 * @route PUT /api/v1/admin/appointments/:id/status
 * @access Private (Admin)
 */
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, completed, or cancelled'
            });
        }

        const appointment = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('user', 'name email photo')
         .populate('doctor', 'name specialization photo');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment status'
        });
    }
};

/**
 * @desc Delete a user (admin function)
 * @route DELETE /api/v1/admin/users/:id
 * @access Private (Admin)
 */
export const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user first to get photo path
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete associated appointments
        await Booking.deleteMany({ user: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};

/**
 * @desc Delete a doctor (admin function)
 * @route DELETE /api/v1/admin/doctors/:id
 * @access Private (Admin)
 */
export const deleteAdminDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        // Find doctor first to get photo path
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Delete associated appointments
        await Booking.deleteMany({ doctor: id });

        // Delete the doctor
        await Doctor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting doctor:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting doctor'
        });
    }
};

/**
 * @desc Get dashboard statistics
 * @route GET /api/v1/admin/stats
 * @access Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
            User.countDocuments(),
            Doctor.countDocuments(),
            Booking.countDocuments()
        ]);

        const [pendingApps, completedApps, cancelledApps] = await Promise.all([
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: 'cancelled' })
        ]);

        res.status(200).json({
            success: true,
            message: 'Dashboard stats fetched successfully',
            data: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                pendingAppointments: pendingApps,
                completedAppointments: completedApps,
                cancelledAppointments: cancelledApps
            }
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        });
    }
};

/**
 * @desc Create an admin user (for development/testing)
 * @route POST /api/v1/admin/create-admin
 * @access Public (for development only)
 */
export const createAdminUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new admin user
        const newAdmin = new User({
            name,
            email,
            password, // Will be hashed by the pre-save middleware
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            data: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (err) {
        console.error('Error creating admin user:', err);
        res.status(500).json({
            success: false,
            message: 'Error creating admin user'
        });
    }
};
