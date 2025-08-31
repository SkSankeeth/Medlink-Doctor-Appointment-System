// frontend/src/components/Header/Header.jsx

import React, { useEffect, useRef, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import userAvatar from '../../assets/images/avatar-icon.png';
import { BiMenu } from 'react-icons/bi';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const navLinks = [
    {
        path: '/home',
        display: 'Home'
    },
    {
        path: '/doctors',
        display: 'Find a Doctor'
    },
    {
        path: '/services',
        display: 'Services'
    },
    {
        path: '/contact',
        display: 'Contact'
    },
];

const Header = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, role, token, dispatch } = useContext(AuthContext);

    // Function to handle logout
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.clear();
        toast.success('Logged out successfully');
        navigate('/home');
    };

    // Function to toggle the mobile menu
    const handleMenuToggle = () => {
        if (menuRef.current) {
            menuRef.current.classList.toggle('show__menu');
        }
    };

    // Sticky header functionality
    const handleStickyHeader = () => {
        if (headerRef.current) {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleStickyHeader);
        return () => window.removeEventListener('scroll', handleStickyHeader);
    }, []);

    return (
        <header className="header flex items-center" ref={headerRef}>
            <div className="container mx-auto max-w-7xl flex items-center justify-between">
                {/* Logo */}
                <div>
                    <img src={logo} alt="MediCare" />
                </div>

                {/* Navigation */}
                <div className="navigation" ref={menuRef} onClick={handleMenuToggle}>
                    <ul className="menu flex items-center gap-[2.7rem]">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    to={link.path}
                                    className={(navClass) =>
                                        navClass.isActive
                                            ? 'text-primaryColor text-[16px] leading-7 font-[600]'
                                            : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                                    }
                                >
                                    {link.display}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nav Right */}
                <div className="flex items-center gap-4">
                    {token && user ? (
                        <div className="flex items-center gap-4">
                            {/* Admin Dashboard Link */}
                            {role === 'admin' && (
                                <Link to="/admin" className="bg-green-600 py-2 px-4 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] hover:bg-green-700">
                                    Admin Dashboard
                                </Link>
                            )}
                            
                            {/* Profile Link */}
                            <Link to={`${role === 'doctor' ? '/doctors/profile/me' : role === 'admin' ? '/admin' : '/users/profile/me'}`}>
                                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer overflow-hidden">
                                    <img
                                        src={user.photo || userAvatar}
                                        className="w-full h-full object-cover rounded-full"
                                        alt="User Avatar"
                                    />
                                </figure>
                            </Link>
            
                            <button
                                onClick={handleLogout}
                                className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                                Login
                            </button>
                        </Link>
                    )}

                    <span className="md:hidden" onClick={handleMenuToggle}>
                        <BiMenu className="w-6 h-6 cursor-pointer" />
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
