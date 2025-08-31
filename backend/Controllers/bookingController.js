// backend/Controllers/bookingController.js
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            customer_email: req.user.email,
            client_reference_id: req.user._id,
            line_items: [{
                price_data: {
                    currency: "usd",
                    unit_amount: doctor.ticketPrice * 100,
                    product_data: {
                        name: doctor.name,
                        description: `Appointment with ${doctor.specialization}`,
                        images: [doctor.photo]
                    }
                },
                quantity: 1
            }]
        });

        // Create new booking with the session ID
        const newBooking = new Booking({
            doctor: doctor._id,
            user: req.userId,
            ticketPrice: doctor.ticketPrice,
            session: session.id,
            appointmentDate: new Date(), // This should be dynamic
            isPaid: false // Stripe webhook will update this
        });

        await newBooking.save();

        res.status(200).json({
            success: true,
            message: "Checkout session created",
            session
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating checkout session",
            error: err.message
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error retrieving bookings"
        });
    }
};

export const getSingleBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error retrieving booking"
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: booking
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating booking status"
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting booking"
        });
    }
};