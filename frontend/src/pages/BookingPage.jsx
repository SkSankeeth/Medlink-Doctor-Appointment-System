// frontend/src/pages/BookingPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get tomorrow's date as minimum date for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors`);
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedTimeSlot || !selectedDate) {
      toast.error("Please select a doctor, date, and time slot.");
      return;
    }
    
    if (!token || !user) {
        toast.error("You must be logged in to book an appointment.");
        navigate('/login');
        return;
    }

    try {
      const payload = {
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: `${selectedTimeSlot.day}: ${selectedTimeSlot.startingTime} - ${selectedTimeSlot.endingTime}`,
      };

      const response = await axios.post(`${BASE_URL}/appointments/book`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Redirect to user's appointments page or another success page
        navigate('/users/profile/me');
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Appointment booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-headingColor mb-6">Book an Appointment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? doctors.map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => setSelectedDoctor(doctor)}
            className={`cursor-pointer border-2 rounded-lg p-4 shadow-md transition-all duration-300 ${selectedDoctor && selectedDoctor._id === doctor._id ? 'border-primaryColor bg-blue-50' : 'border-gray-200 hover:shadow-lg'}`}
          >
            <div className="flex items-center gap-4">
              <figure className="w-20 h-20 rounded-full overflow-hidden">
                <img src={doctor.photo} alt="Doctor" className="w-full h-full object-cover" />
              </figure>
              <div>
                <h3 className="text-lg font-bold text-headingColor">{doctor.name}</h3>
                <p className="text-textColor">{doctor.specialization}</p>
                <p className="text-sm font-semibold text-primaryColor">Ticket Price: ${doctor.ticketPrice}</p>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-textColor">No doctors found.</p>
        )}
      </div>

      {selectedDoctor && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-bold text-headingColor mb-4">
            Book with Dr. {selectedDoctor.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-headingColor">Specialization:</p>
              <p className="text-textColor">{selectedDoctor.specialization}</p>
            </div>
            <div>
              <p className="font-semibold text-headingColor">Ticket Price:</p>
              <p className="text-textColor">${selectedDoctor.ticketPrice}</p>
            </div>
            <div className="col-span-full">
              <p className="font-semibold text-headingColor">Available Time Slots:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDoctor.timeSlots && selectedDoctor.timeSlots.length > 0 ? (
                  selectedDoctor.timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedTimeSlot === slot ? 'bg-primaryColor text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {slot.day}: {slot.startingTime} - {slot.endingTime}
                    </button>
                  ))
                ) : (
                  <p className="text-textColor">No time slots available for this doctor.</p>
                )}
              </div>
            </div>
            <div className="col-span-full">
              <p className="font-semibold text-headingColor">Select Appointment Date:</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleBookAppointment}
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
              disabled={!selectedTimeSlot || !selectedDate}
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
