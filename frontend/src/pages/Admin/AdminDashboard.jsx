import React, { useState, useEffect, useContext } from 'react';
import { 
    FaUsers, 
    FaUserMd, 
    FaCalendarCheck, 
    FaChartLine, 
    FaEye, 
    FaEdit, 
    FaTrash, 
    FaCheckCircle, 
    FaTimesCircle,
    FaSearch,
    FaFilter,
    FaDownload,
    FaBell,
    FaCog
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
    });
    
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Debug: Check if token exists
            console.log('Admin Dashboard - Token:', token ? 'Token exists' : 'No token');
            console.log('Admin Dashboard - Token value:', token);
            
            if (!token) {
                toast.error('No authentication token found. Please login again.');
                return;
            }
            
            // Fetch all data in parallel using admin endpoints
            const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
                axios.get(`${BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/admin/doctors`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/admin/appointments`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const patientsData = patientsRes.data.data || [];
            const doctorsData = doctorsRes.data.data || [];
            const appointmentsData = appointmentsRes.data.data || [];

            setPatients(patientsData);
            setDoctors(doctorsData);
            setAppointments(appointmentsData);

            // Calculate statistics
            const pendingApps = appointmentsData.filter(app => app.status === 'pending').length;
            const completedApps = appointmentsData.filter(app => app.status === 'completed').length;
            const cancelledApps = appointmentsData.filter(app => app.status === 'cancelled').length;

            setStats({
                totalPatients: patientsData.length,
                totalDoctors: doctorsData.length,
                totalAppointments: appointmentsData.length,
                pendingAppointments: pendingApps,
                completedAppointments: completedApps,
                cancelledAppointments: cancelledApps
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
        setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/admin/appointments/${appointmentId}/status`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success(`Appointment status updated to ${newStatus}`);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating appointment status:', error);
            toast.error('Failed to update appointment status');
        }
    };

    const handleDeleteUser = async (userId, userType) => {
        if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
            try {
                const endpoint = userType === 'doctor' ? 'admin/doctors' : 'admin/users';
                await axios.delete(`${BASE_URL}/${endpoint}/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                toast.success(`${userType} deleted successfully`);
                fetchDashboardData(); // Refresh data
            } catch (error) {
                console.error(`Error deleting ${userType}:`, error);
                toast.error(`Failed to delete ${userType}`);
            }
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Monitor and control your healthcare system</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <FaBell className="h-6 w-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <FaCog className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: FaChartLine },
                            { id: 'patients', label: 'Patients', icon: FaUsers },
                            { id: 'doctors', label: 'Doctors', icon: FaUserMd },
                            { id: 'appointments', label: 'Appointments', icon: FaCalendarCheck }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'overview' && (
                    <div className="px-4 sm:px-0">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaUsers className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.totalPatients}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaUserMd className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.totalDoctors}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaCalendarCheck className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.totalAppointments}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaChartLine className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.pendingAppointments}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {appointments.slice(0, 5).map((appointment) => (
                                        <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <FaCalendarCheck className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {appointment.user?.name} → {appointment.doctor?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="px-4 sm:px-0">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Management</h3>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Export Data
                                    </button>
                                </div>
                                
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                                            {patients.map((patient) => (
                                                <tr key={patient._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full" src={patient.photo || '/default-avatar.png'} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.appointments?.length || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(patient._id, 'patient')}>
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="px-4 sm:px-0">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Doctor Management</h3>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Add Doctor
                                    </button>
                                </div>
                                
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                                            {doctors.map((doctor) => (
                                                <tr key={doctor._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full" src={doctor.photo || '/default-avatar.png'} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                                <div className="text-sm text-gray-500">{doctor.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-900">{doctor.averageRating?.toFixed(1) || '0'}</span>
                                                            <FaChartLine className="h-4 w-4 text-yellow-400 ml-1" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.appointments?.length || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-900 mr-3">
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(doctor._id, 'doctor')}>
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="px-4 sm:px-0">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Management</h3>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Search appointments..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredAppointments.map((appointment) => (
                                                <tr key={appointment._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full" src={appointment.user?.photo || '/default-avatar.png'} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{appointment.user?.name}</div>
                                                                <div className="text-sm text-gray-500">{appointment.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{appointment.doctor?.name}</div>
                                                        <div className="text-sm text-gray-500">{appointment.doctor?.specialization}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
        </div>
                                                        <div className="text-sm text-gray-500">{appointment.session}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            {appointment.status === 'pending' && (
                                                                <>
              <button
                                                                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                                        className="text-green-600 hover:text-green-900"
              >
                                                                        <FaCheckCircle className="h-4 w-4" />
              </button>
              <button
                                                                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        <FaTimesCircle className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className="text-blue-600 hover:text-blue-900">
                                                                <FaEye className="h-4 w-4" />
              </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
