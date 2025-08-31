import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15d' }
    );
};

export const register = async (req, res) => {
    const { email, password, name, role, gender } = req.body;

    // Always store full URL in DB
    let photoUrl = null;
    if (req.file) {
        const filename = req.file.filename;
        photoUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    }

    let specialization = req.body.specialization || null;
    let experiences = [];

    try {
        if (req.body.experiences) {
            experiences = JSON.parse(req.body.experiences);
        }
    } catch (parseError) {
        console.error('Error parsing experiences JSON:', parseError);
        return res.status(400).json({ success: false, message: 'Invalid experiences data format.' });
    }

    try {
        let user = null;
        if (role === 'patient') user = await User.findOne({ email });
        else if (role === 'doctor') user = await Doctor.findOne({ email });

        if (user) return res.status(400).json({ success: false, message: 'User already exists' });

        const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        if (role === 'patient') {
            user = new User({ name, email, password: hashPassword, photo: photoUrl, gender, role });
        } else if (role === 'doctor') {
            user = new Doctor({ name, email, password: hashPassword, photo: photoUrl, gender, role, specialization, experiences, isApproved: 'pending' });
        }

        await user.save();
        res.status(200).json({ success: true, message: 'User successfully created' });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email }) || await Doctor.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const token = generateToken(user);

        const { password: pwd, role, ...rest } = user._doc;

        res.status(200).json({ success: true, message: 'Successfully logged in', token, data: { ...rest }, role });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
};
