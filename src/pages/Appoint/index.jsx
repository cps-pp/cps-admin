import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  // Fetch patients list
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/report/patient');
      const data = await response.json();
      if (data.resultCode === "200") {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view patient details
  const handleRowClick = (patient) => {
    navigate(`/appoint-patient/detail/${patient.patient_id}`);
  };

  // Handle back to list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPatient(null);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const Headers = [
    'ລະຫັດຄົນເຈັບ',
    'ຊື່',
    'ເພດ',
    'ວັນເດືອນປີເກີດ',
    'ເບີໂທ 1',
    'ເບີໂທ 2',
    'ທີ່ຢູ່',
    'ຈັດການ',
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ລາຍຊື່ຄົນເຈັບ</h1>
              <p className="text-gray-600">Patient List</p>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">ລາຍຊື່ຄົນເຈັບ</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-md">
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr className="text-left bg-gray-50 border-b">
                    {Headers.map((title, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.length > 0 ? (
                    patients.map((patient, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleRowClick(patient)}
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">{patient.patient_id}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {patient.patient_name} {patient.patient_surname}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{patient.gender}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(patient.dob).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{patient.phone1}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{patient.phone2 || '-'}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {patient.village} {patient.district} {patient.province}
                        </td>
                       <td className="px-4 py-4">
  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/appoint-patient/detail/${patient.patient_id}`);
    }}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs transition-colors"
    title="View"
  >
    ເບີ່ງຂໍ້ມູນ
  </button>
</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        ບໍ່ມີຂໍ້ມູນ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointPage;