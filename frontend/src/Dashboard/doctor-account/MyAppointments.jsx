// frontend/src/Dashboard/doctor-account/MyAppointments.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!token) {
          throw new Error("No authorization token found.");
        }

        const response = await axios.get(`${BASE_URL}/doctors/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setAppointments(response.data.data);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-8">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-headingColor mb-4">My Appointments</h3>
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-headingColor">
                <th className="px-4 py-2">Patient Name</th>
                <th className="px-4 py-2">Patient Email</th>
                <th className="px-4 py-2">Appointment Date</th>
                <th className="px-4 py-2">Time Slot</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Ticket Price</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{appointment.user?.name || 'N/A'}</td>
                  <td className="px-4 py-2">{appointment.user?.email || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{appointment.session || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">${appointment.ticketPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-textColor">No appointments scheduled yet. Your booked appointments will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
