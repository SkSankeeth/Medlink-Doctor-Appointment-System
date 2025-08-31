import React from "react";

const Contact = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="container relative z-10">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h2 className="heading bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        Contact Us
                    </h2>
                    <p className="text-lg text-gray-600 mt-4 opacity-90">
                        Got a technical issue? Want to send feedback about a better feature? Let us know.
                    </p>
                    
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <form action="#" className="space-y-6">
                            <div>
                                <label htmlFor="email" className="form_label text-gray-700 font-semibold">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@gmail.com"
                                    className="form_input mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="form_label text-gray-700 font-semibold">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="Let us know how we can help you"
                                    className="form_input mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300"
                                />
                            </div> 
                            <div>
                                <label htmlFor="message" className="form_label text-gray-700 font-semibold">Your Message</label>
                                <textarea
                                    rows="6"
                                    id="message"
                                    placeholder="Leave a comment..."
                                    className="form_input mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all duration-300 resize-none"
                                />
                            </div> 
                            <button 
                                type="submit" 
                                className="btn w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
