// frontend/src/pages/Signup.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../assets/images/signup.gif';
import axios from 'axios';
import { BASE_URL } from '../config';

const Signup = () => {
    // State to manage the selected photo file
    const [selectedFile, setSelectedFile] = useState(null);
    // State to manage all form data, including new fields for doctors
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photo: null,
        gender: '',
        role: 'patient',
        specialization: '', // New field for doctors
        experiences: [{ hospital: '', startingDate: '' }], // New field for doctors, initialized with one experience
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handles changes for all text and select inputs
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles changes for the photo file input
    const handleFileInputChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        // Create a URL for a local preview of the selected image
        setFormData({ ...formData, photo: file ? URL.createObjectURL(file) : null });
    };

    // Handles input changes for the experiences array
    const handleExperienceChange = (e, index) => {
        const { name, value } = e.target;
        const newExperiences = [...formData.experiences];
        newExperiences[index] = { ...newExperiences[index], [name]: value };
        setFormData({ ...formData, experiences: newExperiences });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create a copy of the formData to modify for submission
            const dataToSubmit = { ...formData };

            // Check if the user is a doctor and format the date
            if (dataToSubmit.role === 'doctor' && dataToSubmit.experiences && dataToSubmit.experiences.length > 0) {
                // IMPORTANT FIX: Parse the date string into a Date object
                // The backend expects an ISO format, so we convert "DD/MM/YYYY" to "YYYY-MM-DD"
                const [day, month, year] = dataToSubmit.experiences[0].startingDate.split('/');
                dataToSubmit.experiences[0].startingDate = `${year}-${month}-${day}`;
            }

            // Create a FormData object to handle both text and file data
            const finalFormData = new FormData();
            finalFormData.append('name', dataToSubmit.name);
            finalFormData.append('email', dataToSubmit.email);
            finalFormData.append('password', dataToSubmit.password);
            finalFormData.append('gender', dataToSubmit.gender);
            finalFormData.append('role', dataToSubmit.role);

            if (selectedFile) {
                finalFormData.append('photo', selectedFile);
            }

            // Add doctor-specific data only if the role is 'doctor'
            if (dataToSubmit.role === 'doctor') {
                finalFormData.append('specialization', dataToSubmit.specialization);
                // Append the experiences array as a JSON string
                finalFormData.append('experiences', JSON.stringify(dataToSubmit.experiences));
            }

            const response = await axios.post(`${BASE_URL}/auth/register`, finalFormData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Important for file uploads
            });

            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }

        } catch (err) {
            console.error('Registration error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="px-5 xl:px-0">
            <div className="max-w-[1170px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="hidden lg:block bg-primaryColor rounded-l-lg">
                        <figure className="rounded-l-lg">
                            <img src={signupImg} alt="" className="w-full rounded-l-lg" />
                        </figure>
                    </div>

                    <div className="rounded-l-lg lg:pl-16 py-10">
                        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
                            Create an <span className="text-primaryColor">account</span>
                        </h3>
                        <form onSubmit={submitHandler}>
                            <div className="mb-5">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>

                            <div className="mb-5 flex items-center justify-between">
                                <label className="text-headingColor font-bold text-[16px] leading-7">
                                    Are you a:
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                                    >
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </label>

                                <label className="text-headingColor font-bold text-[16px] leading-7">
                                    Gender:
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                            </div>

                            {/* Conditional fields for Doctor role */}
                            {formData.role === 'doctor' && (
                                <>
                                    <div className="mb-5">
                                        <input
                                            type="text"
                                            placeholder="Specialization"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                            required
                                        />
                                    </div>
                                    {/* Experiences field - simplified for one entry */}
                                    <div className="mb-5">
                                        <input
                                            type="text"
                                            placeholder="Hospital Name"
                                            name="hospital"
                                            value={formData.experiences[0].hospital}
                                            onChange={(e) => handleExperienceChange(e, 0)}
                                            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <input
                                            type="text"
                                            placeholder="Starting Date (DD/MM/YYYY)"
                                            name="startingDate"
                                            value={formData.experiences[0].startingDate}
                                            onChange={(e) => handleExperienceChange(e, 0)}
                                            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                                            required
                                        />
                                    </div>
                                    {/* You could add more fields for each experience here */}
                                </>
                            )}
                            {/* End of conditional fields */}

                            <div className="mb-5 flex items-center gap-3">
                                {formData.photo && (
                                    <figure className="w-[50px] h-[50px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                                        <img
                                            src={formData.photo}
                                            alt="Preview"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </figure>
                                )}

                                <div className="relative w-[130px] h-[50px]">
                                    <input
                                        type="file"
                                        name="photo"
                                        id="photo"
                                        onChange={handleFileInputChange}
                                        accept=".jpg,.png"
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="photo"
                                        className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                                    >
                                        {selectedFile ? selectedFile.name : 'Upload Photo'}
                                    </label>
                                </div>
                            </div>
                            <div className="mt-7">
                                <button
                                    type="submit"
                                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Sign Up'}
                                </button>
                            </div>

                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                            <p className="mt-5 text-textColor text-center">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primaryColor font-medium ml-1">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
