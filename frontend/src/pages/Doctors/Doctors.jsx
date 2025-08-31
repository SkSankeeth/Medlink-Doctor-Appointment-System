import DoctorCard from '../../components/Doctors/DoctorCard.jsx';
import { BASE_URL } from '../../config.js';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/doctors`);
        if (!res.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const result = await res.json();
        setDoctors(result.data);
        setFilteredDoctors(result.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="container text-center relative z-10">
          <h2 className="heading bg-gradient-to-r from-headingColor to-primaryColor bg-clip-text text-transparent">
            Find a Doctor
          </h2>
          <p className="text-lg text-gray-600 mt-4 mb-8 opacity-90">
            Connect with our expert healthcare professionals
          </p>
          
          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full mx-auto mb-8"></div>
          
          <div className="max-w-[570px] mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 flex items-center justify-between overflow-hidden">
            <input
              type="search"
              className="py-4 pl-6 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor text-lg"
              placeholder="Search Doctor by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="btn mt-0 rounded-l-none transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50/30">
        <div className="container">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <SyncLoader color="#0067ff" size={20} />
                <p className="mt-4 text-gray-600">Finding the best doctors for you...</p>
              </div>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-20">
              <h3 className="text-red-500 text-xl font-semibold">{error}</h3>
              <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredDoctors.length > 0 ? (
                <>
                  <div className="text-center mb-12">
                    <h3 className="text-2xl font-semibold text-headingColor mb-2">
                      Found {filteredDoctors.length} Doctor{filteredDoctors.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-gray-600">Choose from our expert healthcare professionals</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
