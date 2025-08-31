import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {
  // Get token from headers
  const authToken = req.headers.authorization;

  // Check if token exists and starts with Bearer
  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token, access denied'
    });
  }

  try {
    // Extract token (remove 'Bearer ' prefix)
    const token = authToken.split(' ')[1];

    // Verify token
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Server misconfigured: missing JWT secret' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next(); // Must call next to continue
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token is expired'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const restrict = roles => async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.role; // Use role from JWT token

  // Check if the user's role from JWT is in the allowed roles
  if (!roles.includes(userRole)) {
    return res.status(401).json({
      success: false,
      message: 'You are not authorized'
    });
  }

  next();
}; 