import React, { useState, useEffect } from 'react'; 
import { User, ArrowLeft, Stethoscope, Pill } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';


const AppointPatientDetailsPage = ({ onBack }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);

  const { id } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!location.state?.patient);

useEffect(() => {
  if (!patient) {
    const fetchPatientById = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/src/report/patient/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        
        // แยก patient ออกจาก data
        setPatient(data.data.patient);
        setPatientDetails(data.data.patient); // หากยังใช้อยู่
        setInspectionDetails(data.data.inspections); // ถ้ามี inspections ด้วย
      } catch (error) {
        console.error('Error fetching patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientById();
  }
}, [id, patient]);



  const fetchInspectionDetails = async (inspectionId) => {
    try {
      console.log('Fetching inspection details for ID:', inspectionId);
      const response = await fetch(`http://localhost:4000/src/report/inspection/${inspectionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Inspection API response:', data);
      
      if (data.resultCode === "200") {
        // ตรวจสอบว่า data เป็น array หรือ object
        if (Array.isArray(data.data) && data.data.length > 0) {
          setInspectionDetails(data.data[0]);
        } else if (data.data && typeof data.data === 'object') {
          setInspectionDetails(data.data);
        }
        
        // ดึงข้อมูล prescription ด้วย
        await fetchPrescriptionDetails(inspectionId);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
    }
  };

  const fetchPrescriptionDetails = async (inspectionId) => {
    try {
      console.log('Fetching prescription details for ID:', inspectionId);
      const response = await fetch(`http://localhost:4000/src/report/prescription?id=${inspectionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Prescription API response:', data);
      
      if (data.resultCode === "200") {
        if (data.detail && Array.isArray(data.detail)) {
          setPrescriptionDetails(data.detail);
        } else if (data.data && Array.isArray(data.data)) {
          setPrescriptionDetails(data.data);
        } else {
          setPrescriptionDetails([]);
        }
      } else {
        console.error('API returned error:', data);
        setPrescriptionDetails([]);
      }
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      setPrescriptionDetails([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return '-';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">ບໍ່ມີຂໍ້ມູນຄົນເຈັບ</p>
        </div>
      </div>
    );
  }
 const renderDetailItem = (label, value) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-md text-form-strokedark">{value || '-'}</span>
    </div>
  );

  if (loading)
    return <div className="text-center p-6 text-gray-600">Loading patient details...</div>;

  if (!patient)
    return <div className="text-center p-6 text-red-500">ບໍ່ພົບຂໍ້ມູນ</div>;

  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-boxdark p-6 mx-auto">
      <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-6">
        {/* <BackButton /> */}
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
          ລາຍລະອຽດຄົນເຈັບ
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  gap-y-4 ">
        {renderDetailItem('ລະຫັດຄົນເຈັບ', patient.patient_id)}
        {renderDetailItem('ຊື່ ແລະ ນາມສະກຸນ', `${patient.patient_name} ${patient.patient_surname}`)}
        {renderDetailItem('ເພດ', patient.gender)}
        {renderDetailItem('ວັນເດືອນປີເກີດ', formatDate(patient.dob))}
        {renderDetailItem('ບ້ານ', patient.village)}
        {renderDetailItem('ເມືອງ', patient.district)}
        {renderDetailItem('ແຂວງ', patient.province)}
        {renderDetailItem('ເບີຕິດຕໍ່ 1', patient.phone1)}
        {renderDetailItem('ເບີຕິດຕໍ່ 2', patient.phone2)}
      </div>
      {inspectionDetails && (
  <div className="mt-10">
    <h2 className="text-md md:text-lg font-semibold text-strokedark mb-4 flex items-center gap-2">
      <Stethoscope className="w-5 h-5" /> ລາຍລະອຽດການກວດ
    </h2>

    <div className="grid gap-4 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p><strong>ລະຫັດການກວດ:</strong> {inspectionDetails.in_id}</p>
        <p><strong>ວັນທີ:</strong> {formatDate(inspectionDetails.date)}</p>
        <p><strong>ອາການ:</strong> {inspectionDetails.symptom || '-'}</p>
        <p><strong>ໂລກປະຈຸບັນ:</strong> {inspectionDetails.diseases_now || '-'}</p>
        <p><strong>ຜົນກວດ:</strong> {inspectionDetails.checkup || '-'}</p>
        <p><strong>ໝາຍເຫດ:</strong> {inspectionDetails.note || '-'}</p>
      </div>
    </div>

    {inspectionDetails.services?.length > 0 && (
      <div className="mt-6">
        <h3 className="text-base font-semibold text-strokedark mb-2">🔧 ບໍລິການທີ່ໃຊ້</h3>
        <ul className="divide-y divide-gray-200 text-sm">
          {inspectionDetails.services.map((s) => (
            <li key={s.tre_id} className="py-2 flex justify-between">
              <span>{s.ser_name} (x{s.qty})</span>
              <span>{s.total.toLocaleString()} ກີບ</span>
            </li>
          ))}
        </ul>
      </div>
    )}

 {inspectionDetails && inspectionDetails.length > 0 && (
  <div className="mt-8">
    <h2 className="text-md md:text-lg font-semibold text-strokedark mb-4 flex items-center gap-2">
      <Stethoscope className="w-5 h-5" /> ປະຫວັດການກວດ
    </h2>

    <div className="grid gap-4">
      {inspectionDetails.map((item) => (
        <div
          key={item.in_id}
          className="rounded-md border border-gray-200 p-4 shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">ລະຫັດການກວດ</p>
              <p className="font-medium text-form-strokedark">{item.in_id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ວັນທີ</p>
              <p className="font-medium text-form-strokedark">
                {formatDate(item.date)}
              </p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p><strong>ອາການ:</strong> {item.symptom || '-'}</p>
            <p><strong>ໂລກປະຈຸບັນ:</strong> {item.diseases_now || '-'}</p>
            <p><strong>ບັນທຶກ:</strong> {item.note || '-'}</p>
            <p><strong>ສະຖານະ:</strong> {item.status || '-'}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

  </div>
)}

    </div>
  );
  
};

export default AppointPatientDetailsPage;