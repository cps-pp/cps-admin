import React, { useEffect, useState } from 'react';
import TypeService from '../TypeService/TypeService';
import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
import AntdTextArea from '../../../components/Forms/AntdTextArea';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import { CheckCircle, Save } from 'lucide-react';

const InTreatmentService = ({
  selectedPatient,
  setSelectedPatient,
  inspectionId,
  setInspectionId,
  formData,
  setFormData,    
  intivalue,
  setIntivalue,
  setValue,
  register,
  dispatch,
  onTreatmentSubmit,
  loading,
    refreshKey,
}) => {
  const [patients, setPatients] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();

  const getGenderLabel = (gender) => {
    if (gender === 'male') return 'ຊາຍ';
    if (gender === 'female') return 'ຍິງ';
    return '';
  };
 const handleClick = () => {
    if (!inspectionId) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາເລືອກຄົນເຈັບ',
          message: 'ກ່ອນບັນທຶກການປິ່ນປົວ ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
        })
      );
      return;
    }
    onTreatmentSubmit();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/patient');
      const data = await res.json();
      setPatients(data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handlePatientSelect = async (patientData) => {
    setSelectedPatient(patientData);
    setFormData((prev) => ({
      ...prev,
      patient_id: patientData.patient_id,
    }));

    try {
      const res = await fetch(
        `http://localhost:4000/src/in/inspection/${patientData.patient_id}`,
      );
      const result = await res.json();


      if (res.ok && result?.data?.in_id) {
        const inspection = result.data;
  setInspectionId(inspection.in_id);
        let formattedDate = '';
        if (inspection.date) {
          const date = new Date(inspection.date);

          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
            console.log('Formatted date:', formattedDate);
          }
        }

        setFormData((prev) => {
          const newData = {
            ...prev,
            in_id: inspection.in_id,
            date: formattedDate,
          };
          // console.log('Setting new formData:', newData);
          return newData;
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const [idPatient, setIdPatient] = useState('');
  const [checkID, setCheckID] = useState(false);

  useEffect(() => {
    if (checkID) {
      setIdPatient(idPatient);
    }
  }, [checkID]);

  useEffect(() => {
    if (formData.date) {
      setValue('date', formData.date);
    }
  }, [formData.date, setValue]);

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <label className="text-sm text-gray-600 mb-1 block">
            ເລືອກຄົນເຈັບ
          </label>
          <input
            type="text"
            readOnly
            className="w-full rounded border text-purple-700 font-medium border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary dark:text-white capitalize cursor-pointer"
            placeholder="ປ້ອນຄົນເຈັບ"
            value={
              selectedPatient
                ? `${selectedPatient.patient_id ?? ''} ${selectedPatient.patient_name ?? ''} ${selectedPatient.patient_surname ?? ''} ${getGenderLabel(selectedPatient?.gender)}`
                : ''
            }
            onClick={() => setShowPopup(true)}
          />
          <div
            className="absolute top-8 right-2 cursor-pointer text-gray-600 hover:text-primary"
            onClick={() => setShowPopup(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-purple-800"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z"
              />
            </svg>
          </div>
          {showPopup && (
            <SelectPatientPopup
              patients={patients}
              onSelect={handlePatientSelect}
              onClose={() => setShowPopup(false)}
              callback={(x) => {
                if (x) {
                  setIdPatient(x);
                  setCheckID(true);
                }
              }}
            />
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            ເລກທີປິ່ນປົວ
          </label>
          <input
            type="text"
            readOnly
            className="w-full rounded border border-stroke bg-gray-50 py-3 px-4 outline-none"
            value={inspectionId || ''}
            placeholder="ລໍຖ້າເລືອກຄົນເຈັບ"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            ວັນທີປິ່ນປົວ
          </label>
          <input
            type="date"
            className="w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary text-black capitalize"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled
          />
        </div>

        <AntdTextArea
          label="ອາການເບື່ອງຕົ້ນ (Symptom)"
          name="symptom"
          rows={2}
          placeholder="ປ້ອນອາການ"
          onChange={(e) =>
            setIntivalue({ ...intivalue, symptom: e.target.value })
          }
          value={intivalue.symptom}
        />

        <AntdTextArea
          label="ບົ່ງມະຕິ (Checkup)"
          name="checkup"
          rows={2}
          placeholder="ປ້ອນຂໍ້ມູນບບົ່ງມະຕິ"
          onChange={(e) =>
            setIntivalue({ ...intivalue, checkup: e.target.value })
          }
          value={intivalue.checkup}
        />

        <AntdTextArea
          label="ພະຍາດ (diseases Now)"
          name="diseases_now"
          rows={2}
          placeholder="ປ້ອນຜົນກວດ"
          onChange={(e) =>
            setIntivalue({ ...intivalue, diseases_now: e.target.value })
          }
          value={intivalue.diseases_now}
        />
      </div>
      <AntdTextArea
        label="ໝາຍເຫດ"
        name="note"
        rows={2}
        placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
        onChange={(e) => setIntivalue({ ...intivalue, note: e.target.value })}
        value={intivalue.note}
      />

      <div className="overflow-x-auto  mb-4">
       <TypeService refreshKey={refreshKey} />
      </div>
     <div className="flex justify-end mt-6">
  <button
        onClick={handleClick}
        className={`px-6 py-2 rounded flex items-center gap-2 transition duration-200 ${
          loading
            ? 'bg-gray-300 text-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Save className="w-5 h-5" />
        {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການປິ່ນປົວ'}
      </button>
</div>

    </div>
  );
};

export default InTreatmentService;
