import BackButton from '@/components/BackButton';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const DetailPatient = () => {
  const { id } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!location.state?.patient);

  useEffect(() => {
    if (!patient) {
      const fetchPatientById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/src/manager/patient/${id}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setPatient(data.data);
        } catch (error) {
          console.error('Error fetching patient details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPatientById();
    }
  }, [id, patient]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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
        <BackButton />
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
    </div>
  );
};

export default DetailPatient;
