// frontend/src/Dashboard/doctor-account/DoctorProfile.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import avatarIcon from '../../assets/images/avatar-icon.png';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
    const { user, token, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: '',
        specialization: '',
        ticketPrice: '',
        about: '',
        timeSlots: [],
        qualifications: [],
        experiences: [],
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayPhoto, setDisplayPhoto] = useState(avatarIcon);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                photo: user.photo || '',
                specialization: user.specialization || '',
                ticketPrice: user.ticketPrice || '',
                about: user.about || '',
                timeSlots: user.timeSlots || [],
                qualifications: user.qualifications || [],
                experiences: user.experiences || [],
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
            dataToSubmit.append('specialization', formData.specialization);
            dataToSubmit.append('ticketPrice', formData.ticketPrice);
            dataToSubmit.append('about', formData.about);
            
            // Fix qualifications filtering - only filter out completely empty objects
            const validQualifications = formData.qualifications.filter(q => 
                q.degree && q.degree.trim() && q.university && q.university.trim()
            );
            dataToSubmit.append('qualifications', JSON.stringify(validQualifications));
            
            // Fix experiences filtering
            const validExperiences = formData.experiences.filter(e => 
                e.startingDate && e.endingDate && e.position && e.position.trim()
            );
            dataToSubmit.append('experiences', JSON.stringify(validExperiences));
            
            // Fix timeSlots filtering
            const validTimeSlots = formData.timeSlots.filter(t => 
                t.day && t.startingTime && t.endingTime
            );
            dataToSubmit.append('timeSlots', JSON.stringify(validTimeSlots));

            if (selectedFile) {
                dataToSubmit.append('photo', selectedFile);
            }

            // Add debugging
            console.log('Sending data:', {
                name: formData.name,
                specialization: formData.specialization,
                ticketPrice: formData.ticketPrice,
                qualifications: validQualifications,
                experiences: validExperiences,
                timeSlots: validTimeSlots
            });

            const response = await axios.put(`${BASE_URL}/doctors/${user._id}`, dataToSubmit, {
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
            const response = await axios.delete(`${BASE_URL}/doctors/${user._id}`, {
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

    // Adds a new empty object to the specified dynamic field array
    const handleAddField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], {}]
        }));
    };

    // Removes an item from the specified dynamic field array by index
    const handleRemoveField = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };
    
    // Updates a specific key-value pair within a dynamic field's object
    const handleDynamicFieldChange = (field, index, key, value) => {
        setFormData(prev => {
            const updatedFields = [...prev[field]];
            updatedFields[index][key] = value;
            return {
                ...prev,
                [field]: updatedFields
            };
        });
    };

    if (!user) {
        return <div className="text-center mt-8">Doctor not found.</div>;
    }

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold text-headingColor mb-4">Profile Settings</h3>
            <form onSubmit={submitHandler}>
                <div className="flex items-center mb-6">
                    <figure className="w-24 h-24 rounded-full overflow-hidden mr-6">
                        <img 
                            key={displayPhoto} 
                            src={displayPhoto} 
                            alt="Doctor Avatar" 
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-5">
                        <label className="block text-headingColor font-bold mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-headingColor font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-headingColor font-bold mb-2">Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-headingColor font-bold mb-2">Ticket Price</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                            required
                        />
                    </div>
                    <div className="mb-5 col-span-full">
                        <label className="block text-headingColor font-bold mb-2">About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows="5"
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                        />
                    </div>
                </div>
                
                {/* Qualifications Section */}
                <div className="mb-5 border-t border-gray-200 pt-5">
                    <h4 className="text-lg font-bold mb-2">Qualifications</h4>
                    {formData.qualifications.map((qualification, index) => (
                        <div key={index} className="flex gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Degree"
                                value={qualification.degree || ''}
                                onChange={(e) => handleDynamicFieldChange('qualifications', index, 'degree', e.target.value)}
                                className="w-full py-2 px-3 border border-gray-300 rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="University"
                                value={qualification.university || ''}
                                onChange={(e) => handleDynamicFieldChange('qualifications', index, 'university', e.target.value)}
                                className="w-full py-2 px-3 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveField('qualifications', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddField('qualifications')}
                        className="bg-primaryColor text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Qualification
                    </button>
                </div>
                
                {/* Experiences Section */}
                <div className="mb-5 border-t border-gray-200 pt-5">
                    <h4 className="text-lg font-bold mb-2">Experiences</h4>
                    {formData.experiences.map((experience, index) => (
                        <div key={index} className="flex flex-wrap gap-4 mb-2">
                            <input
                                type="date"
                                value={experience.startingDate || ''}
                                onChange={(e) => handleDynamicFieldChange('experiences', index, 'startingDate', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            />
                             <input
                                type="date"
                                value={experience.endingDate || ''}
                                onChange={(e) => handleDynamicFieldChange('experiences', index, 'endingDate', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            />
                             <input
                                type="text"
                                placeholder="Position"
                                value={experience.position || ''}
                                onChange={(e) => handleDynamicFieldChange('experiences', index, 'position', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveField('experiences', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddField('experiences')}
                        className="bg-primaryColor text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Experience
                    </button>
                </div>
                
                {/* Time Slots Section */}
                <div className="mb-5 border-t border-gray-200 pt-5">
                    <h4 className="text-lg font-bold mb-2">Time Slots</h4>
                    {formData.timeSlots.map((slot, index) => (
                        <div key={index} className="flex flex-wrap gap-4 mb-2">
                             <select
                                value={slot.day || ''}
                                onChange={(e) => handleDynamicFieldChange('timeSlots', index, 'day', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Day</option>
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                            </select>
                            <input
                                type="time"
                                value={slot.startingTime || ''}
                                onChange={(e) => handleDynamicFieldChange('timeSlots', index, 'startingTime', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            />
                            <input
                                type="time"
                                value={slot.endingTime || ''}
                                onChange={(e) => handleDynamicFieldChange('timeSlots', index, 'endingTime', e.target.value)}
                                className="w-full md:w-auto py-2 px-3 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveField('timeSlots', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddField('timeSlots')}
                        className="bg-primaryColor text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Time Slot
                    </button>
                </div>

                <div className="mt-7 flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white text-[18px] leading-[30px] rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorProfile;
