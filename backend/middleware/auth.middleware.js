// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "No token, authorization denied"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token is expired"
            });
        }
        res.status(401).json({
            message: "Token is invalid"
        });
    }
};

export const restrictTo = roles => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return res.status(403).json({
            message: "You are not authorized to access this resource"
        });
    }
    next();
};