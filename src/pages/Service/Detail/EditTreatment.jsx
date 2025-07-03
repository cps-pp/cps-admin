import { FileText } from 'lucide-react';
import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Alerts from '@/components/Alerts';
import InService from './inService';
import InMedicine from './inMedicine';
import BillPopup from '../Treatment/BillPopup';
import { useAppDispatch } from '@/redux/hook';

const EditTreatment = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams(); // รับ in_id จาก URL parameter
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // เพิ่ม state สำหรับ InService
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inspectionId, setInspectionId] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    in_id: '',
    date: '',
  });
  const [intivalue, setIntivalue] = useState({
    symptom: '',
    checkup: '',
    diseases_now: '',
    note: '',
  });

  const fetchInspectionData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/src/report/inspection/${id}`,
      );
      const data = await res.json();

      if (data.resultCode === '200') {
        console.log('Fetched inspection data:', data.data);
        const inspection = data.data;

        setInspectionData(inspection);
        setInspectionId(inspection.in_id || id);

        setFormData({
          patient_id: inspection.patient_id || '',
          in_id: inspection.in_id || '',
          date: inspection.date
            ? new Date(inspection.date).toISOString().split('T')[0]
            : '',
        });

        setIntivalue({
          symptom: inspection.symptom || '',
          checkup: inspection.checkup || '',
          diseases_now: inspection.diseases_now || '',
          note: inspection.note || '',
        });

        setSelectedPatient({
          patient_id: inspection.patient_id,
          patient_name: inspection.patient_name,
          patient_surname: inspection.patient_surname,
          gender: inspection.gender,
        });
      } else {
        console.error('Failed to fetch inspection data:', data.message);

        console.error('Failed to fetch inspection data:', data.message);

        console.error('Failed to fetch inspection data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching inspection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = (updatedData) => {
    setInspectionData((prev) => ({
      ...prev,
      ...updatedData,
    }));

    setRefreshKey((prev) => prev + 1);
  };

  const handleTreatmentSubmit = async () => {
    try {
      setLoading(true);

      const submitData = {
        ...formData,
        ...intivalue,
        in_id: inspectionId,
      };

      console.log('Submitting inspection data:', submitData);

      const response = await fetch(
        `http://localhost:4000/src/in/inspection/${inspectionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Treatment updated successfully');
        // รีเฟรชข้อมูล
        await fetchInspectionData();
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error('Failed to update treatment:', result.message);
      }
    } catch (error) {
      console.error('Error updating treatment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInspectionData();
    }
  }, [id]);

  const items = [
    {
      key: '1',
      label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
      children: (
        <InService
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          inspectionId={inspectionId}
          setInspectionId={setInspectionId}
          formData={formData}
          setFormData={setFormData}
          intivalue={intivalue}
          setIntivalue={setIntivalue}
          setValue={setIntivalue}
          onTreatmentSubmit={handleTreatmentSubmit}
          loading={loading}
          inspectionData={inspectionData}
          onDataUpdate={handleDataUpdate}
          refreshKey={refreshKey}
          dispatch={dispatch}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>
      ),
      children: (
        <InMedicine
          inspectionId={inspectionId || id}
          patientId={inspectionData?.patient_id}
          loading={loading}
          refreshKey={refreshKey}
          medicines={inspectionData?.medicines || []}
        />
      ),
    },
  ];

  if (loading && !inspectionData) {
    return (
      <div className="rounded bg-white pt-4 p-4 shadow-md">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-lg font-semibold text-form-strokedark mb-4">
        ແກ້ໄຂລາຍການບໍລິການ
        {inspectionData && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            - {inspectionData.patient_name} {inspectionData.patient_surname}
          </span>
        )}
      </div>

      <div className="rounded bg-white pt-4 p-4 shadow-md relative">
        <Tabs defaultActiveKey="1" items={items} />

        <button
          type="button"
          onClick={() => setShowBillPopup(true)}
          className="bg-slate-500 hover:bg-slate-600 text-white text-md px-6 py-2 rounded flex items-center gap-2 transition mt-4"
        >
          <FileText className="w-5 h-5" />
          ກົດເບິ່ງໃບບິນ
        </button>

        <BillPopup
          isOpen={showBillPopup}
          onClose={() => setShowBillPopup(false)}
          patientData={inspectionData || {}}
          inspectionData={inspectionData || {}}
          services={[]} // จะต้องดึงจาก InService component
          medicines={[]} // จะต้องดึงจาก InMedicine component
          invoiceData={{}}
          onRefresh={fetchInspectionData}
        />

        <Alerts />
      </div>
    </>
  );
};

export default EditTreatment;
