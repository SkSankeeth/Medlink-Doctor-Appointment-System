import ServiceCard from "../components/Services/ServiceCard";
import { services } from "../assets/data/services";
const Services = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <h2 className="heading bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
                        Our Medical Services
                    </h2>
                    <p className="text-lg text-gray-600 mt-4 opacity-90 max-w-2xl mx-auto">
                        Comprehensive healthcare solutions designed to meet all your medical needs with the highest standards of care
                    </p>
                    
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((item, index) => (
                        <ServiceCard item={item} index={index} key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;