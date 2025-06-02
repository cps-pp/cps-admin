import BackButton from '@/components/BackButton';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const DetailPatient = () => {
  const { id } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!location.state?.patient);
  const navigate = useNavigate();

  useEffect(() => {
    if (!patient) {
      const fetchPatientById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/src/manager/patient/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
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

  const renderDetailItem = (label, value) => {
    return (
      <p>
        <span className="text-md text-strokedark dark:text-bodydark3">{label}:</span>{" "}
        <span className="text-md text-strokedark dark:text-bodydark3">{value || "-"}</span>
      </p>
    );
  };

  if (loading)
    return <div className="text-center p-4">Loading patient details...</div>;

  if (!patient)
    return <div className="text-center p-4 text-red-500">ບໍ່ພົບຂໍ້ມູນ</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ລາຍລະອຽດຄົນເຈັບ
        </h1>
        <BackButton className="mb-4" />
      </div>

      <div className="space-y-4 py-4 px-4">
        <div className="space-y-2">
          {renderDetailItem("ລະຫັດຄົນເຈັບ", patient.patient_id)}
          {renderDetailItem("ຊື່", `${patient.patient_name} ${patient.patient_surname}`)}
          {renderDetailItem("ເພດ", patient.gender)}
          {renderDetailItem("ວັນເດືອນປີເກີດ", patient.dob)}
          {renderDetailItem("ບ້ານ", patient.village)}
          {renderDetailItem("ເມືອງ", patient.district)}
          {renderDetailItem("ແຂວງ", patient.province)}
          {renderDetailItem("ເບີໂທ 1", patient.phone1)}
          {renderDetailItem("ເບີໂທ 2", patient.phone2)}
        </div>
      </div>
    </div>
  );
};

export default DetailPatient;
