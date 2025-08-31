// frontend/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config'; // Added BASE_URL import

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Corrected: Using BASE_URL for consistency and to fix the port mismatch
            const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            const { message, token, data: userData, role } = response.data;

            if (response.data.success) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        user: userData,
                        token: token,
                        role: role
                    }
                });
                
                // Redirect based on user role
                if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                setError(message);
            }
        } catch (err) {
            console.error('Login error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="px-5 lg:px-0">
            <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
                <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
                    Hello! <span className="text-primaryColor">Welcome</span> Back 🎉
                </h3>

                <form className="py-4 md:py-0" onSubmit={submitHandler}>
                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
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
                            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                            required
                        />
                    </div>
                    <div className="mt-7">
                        <button
                            type="submit"
                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                    <p className="mt-5 text-textColor text-center">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primaryColor font-medium ml-1">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;
