import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import { AiFillStar } from 'react-icons/ai'; // Using AiFillStar for consistency with other parts of your code

// Import your testimonials data
import { testimonials } from "../../assets/data/testimonials"; // Ensure this path is correct

const Testimonial = () => {
    return (
        <div className="mt-[30px] lg:mt-[55px]">
            <Swiper
                modules={[Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }}
            >
                {/* Map over your testimonials data to create dynamic SwiperSlides */}
                {testimonials.map((testimonial) => (
                   <SwiperSlide key={testimonial.id}> {/* Use unique id as key */}
                        <div className="py-[30px] px-5 rounded-3xl">
                            <div className="flex items-center gap-[13px]">
                                <img src={testimonial.photo} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                                        {testimonial.name}
                                    </h4>
                                    <div className="flex items-center gap-[2px]">
                                        {/* Render filled stars dynamically based on rating */}
                                        {[...Array(testimonial.rating).keys()].map((_, index) => (
                                            <AiFillStar key={index} className="text-yellowColor w-[18px] h-[18px]" />
                                        ))}
                                        {/* Render empty/gray stars if rating is less than 5 */}
                                        {[...Array(5 - testimonial.rating).keys()].map((_, index) => (
                                            <AiFillStar key={index + testimonial.rating} className="text-gray-300 w-[18px] h-[18px]" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text__para mt-4 text-[15px] leading-7 text-textColor">
                                {testimonial.review}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Testimonial;
