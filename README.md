# Doctor Appointment Booking System

A full-stack web application for booking doctor appointments, built with React.js frontend and Node.js backend.

## 🚀 Features

- **User Authentication**: Secure login/signup system
- **Doctor Management**: Doctor profiles and availability
- **Appointment Booking**: Easy appointment scheduling
- **Admin Dashboard**: Comprehensive admin panel
- **User Dashboard**: Personal appointment management
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📁 Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── uploads/           # File uploads
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Doctor_Appointment_Booking_System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create `.env` file in backend directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

## 👥 Team Members

This project is developed by:
- [Your Name] - [Role]
- [Team Member 2] - [Role]
- [Team Member 3] - [Role]
- [Team Member 4] - [Role]
- [Team Member 5] - [Role]
- [Team Member 6] - [Role]

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Add new doctor

## 🔧 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Project Goals

- Provide a seamless appointment booking experience
- Streamline doctor-patient communication
- Reduce administrative overhead
- Improve healthcare accessibility

## 📞 Contact

For any queries, please contact the development team.

---

**Note**: This is a university group project for demonstration and educational purposes.
