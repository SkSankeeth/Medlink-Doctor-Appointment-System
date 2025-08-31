import React from "react";
import heroImg01 from "../assets/images/hero-img01.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import featureImg from '../assets/images/feature-Img.png';
import videoIcon from '../assets/images/video-icon.png';
import avatarIcon from '../assets/images/avatar-icon.png';
import faqImg from '../assets/images/faq-img.png'
import { Link } from "react-router-dom";
import { BsArrowRight } from 'react-icons/bs';
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import FaqList from "./faq/faqList";
import Testimonial from "../components/Testimonial/Testimonial"; // Ensure Testimonial is imported


const Home = () => {
    return <>

        
        <section className="hero_section pt-[60px] 2xl:h-[800px] relative overflow-hidden">
            {/* Enhanced Background Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-green-100 rounded-full opacity-15 blur-xl animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-28 h-28 bg-yellow-100 rounded-full opacity-15 blur-xl animate-bounce"></div>
            
            {/* Emergency Care Popup - Top Right Corner */}
            <div className="absolute top-8 right-8 z-20">
                <div className="group cursor-pointer">
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-2xl border border-white/20 backdrop-blur-sm animate-pulse hover:animate-bounce transition-all duration-300 transform hover:scale-110">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                            <span className="text-sm font-bold">🚨 EMERGENCY</span>
                            <span className="text-xs opacity-90">24/7</span>
                        </div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute right-0 top-12 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg border border-gray-200">
                        Emergency Care Available
                        <div className="absolute -top-2 right-4 w-3 h-3 bg-white/90 transform rotate-45 border-l border-t border-gray-200"></div>
                    </div>
                </div>
            </div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20 hidden lg:block">
                <div className="flex flex-col gap-4">
                    <div className="group cursor-pointer">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-primaryColor transition-all duration-300 transform hover:scale-110">
                            <svg className="w-6 h-6 text-primaryColor group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Call Now
                        </div>
                    </div>
                    
                    <div className="group cursor-pointer">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-primaryColor transition-all duration-300 transform hover:scale-110">
                            <svg className="w-6 h-6 text-primaryColor group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Chat Support
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
                    <div>
                        <div className="lg:w-[570px]">
                            {/* Enhanced Badge */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transform hover:scale-105 transition-transform duration-300">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                Trusted by 10,000+ Patients
                            </div>
                            
                            <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px] bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                                We help patients live a healthy, longer life
                            </h1>

                            <p className="text_para text-lg leading-relaxed mt-6 opacity-90">
                                Experience world-class healthcare with our team of expert doctors. We provide comprehensive medical services with cutting-edge technology and compassionate care for you and your family.
                            </p>

                            <button className="btn mt-8 transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                                <a href="/doctors" className="flex items-center gap-2">
                                    Request an Appointment
                                    <BsArrowRight className="w-5 h-5" />
                                </a>
                            </button>
                        </div>
                        
                        {/* Enhanced Statistics Section with Animations */}
                        <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-[40px]">
                            <div className="group text-center p-6 rounded-2xl hover:bg-white/80 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:shadow-xl border border-white/20">
                                <div className="relative">
                                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor group-hover:text-primaryColor transition-colors duration-300">30+</h2>
                                    <span className="w-[100px] h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full block mt-[-14px] mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300"></span>
                                </div>
                                <p className="text_para font-medium mt-2">Years of Experience</p>
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                            </div>
                            
                            <div className="group text-center p-6 rounded-2xl hover:bg-white/80 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:shadow-xl border border-white/20">
                                <div className="relative">
                                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor group-hover:text-primaryColor transition-colors duration-300">15+</h2>
                                    <span className="w-[100px] h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full block mt-[-14px] mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300"></span>
                                </div>
                                <p className="text_para font-medium mt-2">Clinic Location</p>
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                            </div>
                            
                            <div className="group text-center p-6 rounded-2xl hover:bg-white/80 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:shadow-xl border border-white/20">
                                <div className="relative">
                                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor group-hover:text-primaryColor transition-colors duration-300">100%</h2>
                                    <span className="w-[100px] h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full block mt-[-14px] mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300"></span>
                                </div>
                                <p className="text_para font-medium mt-2">Patient Satisfaction</p>
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-[30px] justify-end">
                        <div className="transform hover:scale-105 transition-transform duration-500">
                            <img className="w-full rounded-2xl shadow-2xl" src={heroImg01} alt="" />
                        </div>
                        <div className="mt-[30px] space-y-[30px]">
                            <div className="transform hover:scale-105 transition-transform duration-500">
                                <img src={heroImg02} alt="" className="w-full rounded-2xl shadow-2xl" />
                            </div>
                            <div className="transform hover:scale-105 transition-transform duration-500">
                                <img src={heroImg03} alt="" className="w-full rounded-2xl shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50/30 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-10 blur-xl"></div>
            
            <div className="container relative z-10">
                <div className="xl:w-[470px] mx-auto text-center mb-16">
                    <h2 className="heading text-center bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        Providing the best medical services
                    </h2>
                    <p className="text_para text-center text-lg mt-4 opacity-90">
                        World-class care for everyone. Our health system offers unmatched, expert health care
                    </p>
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[40px] mt-[30px] lg:mt-[55px]">
                    {/* Find a Doctor Card */}
                    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100 hover:border-primaryColor/20 overflow-hidden">
                        {/* Background Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon Container with Enhanced Styling */}
                        <div className="relative z-10 flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                                <img src={icon01} className="w-10 h-10 filter brightness-0 invert" alt="Find Doctor" />
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <h2 className="text-[26px] leading-9 text-headingColor font-[700] mb-4 group-hover:text-primaryColor transition-colors duration-300">
                                Find a Doctor
                            </h2>
                            <p className="text-[16px] leading-7 text-textColor font-[400] mb-6 text-center">
                                World class care for everyone. Our health system offers unmatched, expert health care. From the lab to the clinic
                            </p>

                            {/* Enhanced CTA Button */}
                            <Link to='/doctors' className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-md hover:shadow-lg">
                                <BsArrowRight className="h-5 w-6" />
                            </Link>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    </div>

                    {/* Find a Location Card */}
                    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100 hover:border-primaryColor/20 overflow-hidden">
                        {/* Background Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon Container with Enhanced Styling */}
                        <div className="relative z-10 flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                                <img src={icon02} className="w-10 h-10 filter brightness-0 invert" alt="Find Location" />
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <h2 className="text-[26px] leading-9 text-headingColor font-[700] mb-4 group-hover:text-primaryColor transition-colors duration-300">
                                Find a Location
                            </h2>
                            <p className="text-[16px] leading-7 text-textColor font-[400] mb-6 text-center">
                                World class care for everyone. Our health system offers unmatched, expert health care. From the lab to the clinic
                            </p>

                            {/* Enhanced CTA Button */}
                            <Link to='/doctors' className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-md hover:shadow-lg">
                                <BsArrowRight className="h-5 w-6" />
                            </Link>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    </div>

                    {/* Book Appointment Card */}
                    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100 hover:border-primaryColor/20 overflow-hidden">
                        {/* Background Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon Container with Enhanced Styling */}
                        <div className="relative z-10 flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                                <img src={icon03} className="w-10 h-10 filter brightness-0 invert" alt="Book Appointment" />
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <h2 className="text-[26px] leading-9 text-headingColor font-[700] mb-4 group-hover:text-primaryColor transition-colors duration-300">
                                Book Appointment
                            </h2>
                            <p className="text-[16px] leading-7 text-textColor font-[400] mb-6 text-center">
                                World class care for everyone. Our health system offers unmatched, expert health care. From the lab to the clinic
                            </p>

                            {/* Enhanced CTA Button */}
                            <Link to='/doctors' className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-md hover:shadow-lg">
                                <BsArrowRight className="h-5 w-6" />
                            </Link>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>

        <About />

        <section className="py-16">
            <div className="container">
                <div className="xl:w-[470px] mx-auto text-center">
                    <h2 className="heading text-center bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        Our medical services
                    </h2>
                    <p className="text_para text-center text-lg mt-4 opacity-90">
                        World-class care for everyone. Our health system offers unmatched, expert health care
                    </p>
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>
                <ServiceList />
            </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-10 blur-2xl animate-pulse"></div>
            
            <div className="container relative z-10">
                <div className="flex items-center justify-between flex-col lg:flex-row gap-12">
                    <div className="xl:w-[670px]">
                        <h2 className="heading bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                            Get virtual treatment <br />anytime.
                        </h2>
                        <p className="text-lg text-gray-600 mt-4 opacity-90">
                            Experience the future of healthcare with our advanced virtual consultation platform
                        </p>
                        
                        <ul className="pl-4 space-y-4 mt-8">
                            <li className="text_para flex items-start gap-4 group">
                                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">1</span>
                                <span className="group-hover:text-primaryColor transition-colors duration-300">Schedule the appointment directly</span>
                            </li>
                            <li className="text_para flex items-start gap-4 group">
                                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">2</span>
                                <span className="group-hover:text-primaryColor transition-colors duration-300">Search for your physician here, and contact their office</span>
                            </li>
                            <li className="text_para flex items-start gap-4 group">
                                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">3</span>
                                <span className="group-hover:text-primaryColor transition-colors duration-300">View our physicians who are accepting new patients, use the online scheduling tool to select an appointment time</span>
                            </li>
                        </ul>
                        
                        <Link to='/'>
                            <button className="btn mt-8 transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                                Learn More
                            </button>
                        </Link>
                    </div>
                    <div className="relative z-10 xl:w-[770px] flex justify-end-mt-[50px] lg:mt-0">
                        <img src={featureImg} alt="" className="w-3/4" />

                        <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-[6px] lg:gap-3">
                                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                                        Tue, 24
                                    </p>
                                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]">
                                        10:00AM
                                    </p>
                                </div>
                                <span className="w-5 h-5 lg:w-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
                                    <img src={videoIcon} alt="" />
                                </span>
                            </div>
                            <div className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4 rounded-full">
                                Consultation
                            </div>

                            <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                                <img src={avatarIcon} alt="" />
                                <h4 className="text-[10px] leading-3 lg:text[16px] lg:leading-[22px] font-[700] text-headingColor">
                                    Wayne Collins
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="container">
                <div className="xl:w-[470px] mx-auto text-center">
                    <h2 className="heading text-center bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        Our great doctors
                    </h2>
                    <p className="text_para text-center text-lg mt-4 opacity-90">
                        World-class care for everyone. Our health system offers unmatched, expert health care
                    </p>
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>
                <DoctorList />
            </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
            <div className="container">
                <div className="flex justify-between gap-[50px] lg:gap-0">
                    <div className="w-1/2 hidden md:block">
                        <img src={faqImg} alt="" className="rounded-2xl shadow-lg" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="heading bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent mb-6">
                            Most questions by our beloved patients
                        </h2>
                        <FaqList />
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16">
            <div className="container">
                <div className="xl:w-[470px] mx-auto text-center">
                    <h2 className="heading text-center bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        What our patient say
                    </h2>
                    <p className="text_para text-center text-lg mt-4 opacity-90">
                        World-class care for everyone. Our health system offers unmatched, expert health care.
                    </p>
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>
                <Testimonial />
            </div>
        </section>
        

        {/* Scroll to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-14 h-14 bg-gradient-to-r from-primaryColor to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
        
        
    </>;
};

export default Home;