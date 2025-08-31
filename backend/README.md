# Doctor Appointment Booking System - Backend API

## Overview
This is the backend API for the Doctor Appointment Booking System built with Node.js, Express.js, and MongoDB.

## Features
- User authentication (patients and doctors)
- Doctor management and profiles
- Appointment booking system
- Review and rating system
- Role-based access control
- JWT token authentication

## Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root with the following variables:
```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/doctor-appointment
JWT_SECRET_KEY=your-super-secret-jwt-key-here
CLIENT_SITE_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run start-dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register new user/doctor
- `POST /login` - Login user/doctor

### User Routes (`/api/v1/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get single user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `GET /profile/me` - Get current user profile
- `GET /appointments/my-appointments` - Get user's appointments

### Doctor Routes (`/api/v1/doctors`)
- `GET /` - Get all approved doctors
- `GET /:id` - Get single doctor
- `PUT /:id` - Update doctor (doctor only)
- `DELETE /:id` - Delete doctor (doctor only)
- `GET /profile/me` - Get current doctor profile

### Booking Routes (`/api/v1/bookings`)
- `POST /checkout-session/:doctorId` - Book appointment
- `GET /` - Get all bookings
- `GET /:id` - Get single booking
- `PUT /:id` - Update booking status
- `DELETE /:id` - Cancel booking

### Review Routes (`/api/v1/reviews`)
- `GET /` - Get all reviews
- `POST /` - Create review (patient only)
- `GET /:id` - Get single review
- `PUT /:id` - Update review (patient only)
- `DELETE /:id` - Delete review (patient/admin only)

### Nested Routes
- `GET /doctors/:doctorId/reviews` - Get reviews for specific doctor
- `POST /doctors/:doctorId/reviews` - Create review for specific doctor

## Database Models

### User Schema
- email, password, name, phone, photo, role, gender, bloodType
- appointments (references to Booking)

### Doctor Schema
- email, password, name, phone, photo, ticketPrice, role, specialization
- qualifications, experiences, bio, about, timeSlots
- reviews (references to Review), averageRating, totalRating
- isApproved status, appointments (references to Booking)

### Booking Schema
- doctor (reference to Doctor), user (reference to User)
- ticketPrice, appointmentDate, status, isPaid, session

### Review Schema
- doctor (reference to Doctor), user (reference to User)
- reviewText, rating

## Authentication & Authorization

### JWT Authentication
- Include token in Authorization header: `Bearer <token>`
- Token expires in 15 days

### Roles
- **patient** - Can book appointments, write reviews
- **doctor** - Can manage profile, view appointments
- **admin** - Can manage all users and data

## Sample Data
The application includes a seeder that automatically creates sample doctors when the database is empty. Sample doctors include:
- Dr. Hamsath (Surgeon)
- Dr. Nasif (Neurologist)
- Dr. Malsan (Dermatologist)

## Error Handling
All endpoints return consistent JSON responses:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // Only on success
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS protection

## Development

### Scripts
- `npm start` - Start production server
- `npm run start-dev` - Start development server with nodemon

### Database
Make sure MongoDB is running on your system or use MongoDB Atlas for cloud database.

## Environment Variables Required
- `PORT` - Server port (default: 8000)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT signing
- `CLIENT_SITE_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production) 