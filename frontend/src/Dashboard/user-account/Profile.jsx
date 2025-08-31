import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import avatarIcon from '../../assets/images/avatar-icon.png';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    bloodGroup: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayPhoto, setDisplayPhoto] = useState(user?.photo || avatarIcon);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
      });
      setDisplayPhoto(user.photo || avatarIcon);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setDisplayPhoto(previewUrl);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('gender', formData.gender);
      dataToSubmit.append('bloodGroup', formData.bloodGroup);

      if (selectedFile) {
        dataToSubmit.append('photo', selectedFile);
      }

      const response = await axios.put(`${BASE_URL}/users/${user._id}`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        
        // Update the AuthContext with the new user data
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.data
        });
        
        // Update the display photo if a new photo was uploaded
        if (response.data.data.photo) {
          setDisplayPhoto(response.data.data.photo);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Update profile error:', err.response?.data?.message || err.message);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Account deleted successfully');
        // Logout the user
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Delete account error:', err.response?.data?.message || err.message);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  if (!user) {
    return <div className="text-center mt-8">User not found.</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent mb-2">
            Profile Settings
          </h3>
          <p className="text-gray-600">Manage your personal information and account settings</p>
          
          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-4"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={submitHandler}>
        <div className="flex items-center mb-6">
          <figure className="w-24 h-24 rounded-full overflow-hidden mr-6">
            <img 
              key={displayPhoto} 
              src={displayPhoto} 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
            />
          </figure>
          <div className="relative w-40 h-10">
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handlePhotoChange}
              accept=".jpg,.png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="photo"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg overflow-hidden bg-primaryColor text-white truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <label className="block text-headingColor font-bold mb-3 text-lg">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-headingColor font-bold mb-3 text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="mb-6">
            <label className="block text-headingColor font-bold mb-3 text-lg">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-headingColor font-bold mb-3 text-lg">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
        <div className="mt-7 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-red-600 text-white text-[18px] leading-[30px] rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Delete Account
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
