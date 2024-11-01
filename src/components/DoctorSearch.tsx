// app/components/DoctorSearch.tsx
'use client';

import { useState, useEffect } from 'react';

// Define the types for doctor data and qualifications
interface Qualification {
  Degree: string;
  Speciality?: string;
  University: string;
  PassingYear: string;
}

interface Doctor {
  RegistrationNo: string;
  Name: string;
  FatherName: string;
  Status: string;
  qualifications?: Qualification[];
}

const DoctorSearch = () => {
  const [registrationNo, setRegistrationNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensures this component is only fully rendered on the client
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/searchDoctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo }),
      });

      const data: Doctor = await response.json();
      setDoctor(data);

      // Clear the input field after displaying the result
      setRegistrationNo('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-center">Search Doctor by Registration Number</h3>
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`p-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Only render the results if the component is mounted (on the client) */}
      {isMounted && doctor && (
        <div>
          <table className="w-full mb-6 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-300 text-left">Registration No</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Name</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Father Name</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-gray-300 text-left">{doctor.RegistrationNo}</td>
                <td className="py-2 px-4 border border-gray-300 text-left">{doctor.Name}</td>
                <td className="py-2 px-4 border border-gray-300 text-left">{doctor.FatherName}</td>
                <td className="py-2 px-4 border border-gray-300 text-left">{doctor.Status}</td>
              </tr>
            </tbody>
          </table>

          {doctor.qualifications && doctor.qualifications.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Qualifications</h4>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border border-gray-300 text-left">Degree</th>
                    <th className="py-2 px-4 border border-gray-300 text-left">University</th>
                    <th className="py-2 px-4 border border-gray-300 text-left">Passing Year</th>
                  </tr>
                </thead>
                <tbody>
                  {doctor.qualifications.map((qualification, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border border-gray-300 text-left">
                        {qualification.Degree} {qualification.Speciality}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 text-left">{qualification.University}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left">{qualification.PassingYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {!doctor && <p className="text-center text-gray-500 mt-4">No results found.</p>}
    </div>
  );
};

export default DoctorSearch;
