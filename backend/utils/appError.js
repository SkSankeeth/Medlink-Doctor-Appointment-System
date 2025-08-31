// backend/utils/appError.js

/**
 * Custom error class for handling API-specific errors.
 * This class extends the native Error class and adds properties
 * for a status code and an operational status.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        // Call the parent constructor (Error) with the error message
        super(message);

        // Assign the provided status code to the instance
        this.statusCode = statusCode;
        // Determine the error status based on the status code
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // Mark the error as operational (trusted) to distinguish it from programming errors
        this.isOperational = true;

        // Capture the stack trace to provide more detailed error information
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
