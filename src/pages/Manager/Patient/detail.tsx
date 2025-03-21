import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const DetailPatient: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState<any>(location.state?.patient || null);
  const [loading, setLoading] = useState<boolean>(!location.state?.patient);
  const navigate = useNavigate();

  useEffect(() => {
    if (!patient) {
      const fetchPatientById = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:4000/manager/patient/${id}`,
          );
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

  if (loading) return <div className="text-center p-4">Loading patient details...</div>;
  if (!patient) return <div className="text-center p-4 text-red-500">ບໍ່ພົບຂໍ້ມູນ</div>;

  return (
    <div className="rounded bg-white shadow-lg pt-4 px-4 dark:bg-boxdark dark:text-white">
      <div className="border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl  text-gray-800 dark:text-white">ລະລາຍອຽດຄົນເຈັບ</h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded bg-slate-500 px-4 py-2 text-center font-medium text-white transition-all duration-150 ease-linear hover:bg-opacity-90 hover:shadow-lg focus:outline-none active:bg-slate-600"
          >
            ກັບຄືນ
          </button>
        </div>
      </div>

      <div className="space-y-4 py-8">
        <div className="space-y-2">
          <p><strong className="text-lg font-medium">ລະຫັດຄົນເຈັບ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.patient_id}</span></p>
          <p><strong className="text-lg font-medium">ຊື່:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.patient_name} {patient.patient_surname}</span></p>
          <p><strong className="text-lg font-medium">ເພດ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.gender}</span></p>
          <p><strong className="text-lg font-medium">ວັນເດືອນປີເກີດ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.dob}</span></p>
          <p><strong className="text-lg font-medium">ບ້ານ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.village}</span></p>
          <p><strong className="text-lg font-medium">ເມືອງ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.district}</span></p>
          <p><strong className="text-lg font-medium">ແຂວງ:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.province}</span></p>
          <p><strong className="text-lg font-medium">ເບີໂທ 1:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.phone1}</span></p>
          <p><strong className="text-lg font-medium">ເບີໂທ 2:</strong> <span className="text-gray-700 dark:text-gray-300">{patient.phone2}</span></p>
        </div>
      </div>
    </div>
  );
};

export default DetailPatient;
