// frontend/src/components/Doctors/DoctorList.jsx



import { useEffect, useState } from 'react';

import { BASE_URL } from '../../config'; // Make sure you have BASE_URL defined in your config file

import DoctorCard from './DoctorCard';

import { SyncLoader } from 'react-spinners'; // Assuming you have react-spinners installed for a loading spinner



const DoctorList = () => {

  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchDoctors = async () => {

      setLoading(true);

      try {

        const res = await fetch(`${BASE_URL}/doctors`);



        if (!res.ok) {

          throw new Error('Failed to fetch doctors');

        }



        const result = await res.json();

        // Assuming the backend returns an object with a 'data' key containing the array of doctors

        setDoctors(result.data);

        setLoading(false);

      } catch (err) {

        setLoading(false);

        setError(err.message);

      }

    };



    fetchDoctors();

  }, []);



  return (

    <>

      {loading && <div className="text-center"><SyncLoader color="#0067ff" /></div>}

      {error && !loading && <h3 className="text-center">{error}</h3>}



      {!loading && !error && (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">

          {doctors.map(doctor => (

            <DoctorCard key={doctor._id} doctor={doctor} />

          ))}

        </div>

      )}

    </>

  );

};



export default DoctorList;