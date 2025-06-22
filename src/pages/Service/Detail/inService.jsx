// import React, { useEffect, useState } from 'react';
// import TypeService from '../TypeService/TypeService';
// import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
// import AntdTextArea from '../../../components/Forms/AntdTextArea';
// import BoxDate from '../../../components/Date';
// import useStoreServices from '../../../store/selectServices';
// import useStoreMed from '../../../store/selectMed';
// import useStoreQi from '../../../store/selectQi';

// import { CheckCircle, Save } from 'lucide-react';

// const InService = ({
//   selectedPatient,
//   setSelectedPatient,
//   inspectionId,
//   setInspectionId,
//   formData,
//   setFormData,
//   intivalue,
//   setIntivalue,
//   setValue,
//   register,
//   errors,
//   onTreatmentSubmit,
//   loading,
//   isTreatmentSaved,
// }) => {
//   const [patients, setPatients] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const { services } = useStoreServices();
//   const { medicines } = useStoreMed();
//   const { equipment } = useStoreQi();

//   const getGenderLabel = (gender) => {
//     if (gender === 'male') return 'ຊາຍ';
//     if (gender === 'female') return 'ຍິງ';
//     return '';
//   };

//   const getDob = (dob) => {
//     return dob ? dob : '';
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/src/manager/patient');
//       const data = await res.json();
//       setPatients(data.data);
//     } catch (err) {
//       console.error('Error fetching patients:', err);
//     }
//   };

//   const handlePatientSelect = async (patientData) => {
//     console.log('Selected patient:', patientData);
//     setSelectedPatient(patientData);

//     setFormData((prev) => ({
//       ...prev,
//       patient_id: patientData.patient_id,
//     }));

//     try {
//       const res = await fetch(
//         `http://localhost:4000/src/in/inspection/${patientData.patient_id}`,
//       );
//       const result = await res.json();

//       console.log('Inspection API response:', result);

//       if (res.ok && result?.data?.in_id) {
//         const inspection = result.data;
//         setInspectionId(inspection.in_id);
//         setFormData((prev) => ({
//           ...prev,
//           in_id: inspection.in_id,
//           date: inspection.date,
//         }));
//         console.log('Inspection ID set:', inspection.in_id);
//       } else {
//         console.warn('No inspection data found or invalid response:', result);
//       }
//     } catch (err) {
//       console.error('Error fetching inspection data:', err);
//     }
//   };

//   const [idPatient, setIdPatient] = useState('');
//   const [checkID, setCheckID] = useState(false);

//   useEffect(() => {
//     if (checkID) {
//       setIdPatient(idPatient);
//     }
//   }, [checkID]);

//   return (
//     <div className="">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         <div className="relative">
//           <label className="text-sm text-gray-600 mb-1 block">
//             ເລືອກຄົນເຈັບ
//           </label>
//           <input
//             type="text"
//             readOnly
//             className="w-full rounded border text-purple-700 font-medium border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary dark:text-white capitalize cursor-pointer"
//             placeholder="ປ້ອນຄົນເຈັບ"
//             value={
//               selectedPatient
//                 ? `${selectedPatient.patient_id ?? ''} ${selectedPatient.patient_name ?? ''} ${selectedPatient.patient_surname ?? ''} ${getGenderLabel(selectedPatient?.gender)}`
//                 : ''
//             }
//             onClick={() => setShowPopup(true)}
//           />
//           <div
//             className="absolute top-8 right-2 cursor-pointer text-gray-600 hover:text-primary"
//             onClick={() => setShowPopup(true)}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 text-purple-800"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 fill="currentColor"
//                 d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z"
//               />
//             </svg>
//           </div>
//           {showPopup && (
//             <SelectPatientPopup
//               patients={patients}
//               onSelect={handlePatientSelect}
//               onClose={() => setShowPopup(false)}
//               callback={(x) => {
//                 if (x) {
//                   setIdPatient(x);
//                   setCheckID(true);
//                 }
//               }}
//             />
//           )}
//         </div>

//         <div>
//           <label className="text-sm text-gray-600 mb-1 block">
//             ເລກທີປິ່ນປົວ
//           </label>
//           <input
//             type="text"
//             readOnly
//             className="w-full rounded border border-stroke bg-gray-50 py-3 px-4 outline-none"
//             value={inspectionId || ''}
//             placeholder="ລໍຖ້າເລືອກຄົນເຈັບ"
//           />
//         </div>

//         <BoxDate
//           select=""
//           register={register}
//           errors={errors}
//           name="date"
//           label="ວັນທີປິ່ນປົວ"
//           formOptions={{ required: false }}
//           setValue={setValue}
//           onChange={(newDate) => setFormData({ ...formData, date: newDate })}
//         />

//         <AntdTextArea
//           label="ອາການເບື່ອງຕົ້ນ (Symptom)"
//           name="symptom"
//           rows={2}
//           placeholder="ປ້ອນອາການ"
//           onChange={(e) =>
//             setIntivalue({ ...intivalue, symptom: e.target.value })
//           }
//           value={intivalue.symptom}
//         />

//         <AntdTextArea
//           label="ບົ່ງມະຕິ (Checkup)"
//           name="checkup"
//           rows={2}
//           placeholder="ປ້ອນຂໍ້ມູນບບົ່ງມະຕິ"
//           onChange={(e) =>
//             setIntivalue({ ...intivalue, checkup: e.target.value })
//           }
//           value={intivalue.checkup}
//         />

//         <AntdTextArea
//           label="ພະຍາດ (diseases Now)"
//           name="diseases_now"
//           rows={2}
//           placeholder="ປ້ອນຜົນກວດ"
//           onChange={(e) =>
//             setIntivalue({ ...intivalue, diseases_now: e.target.value })
//           }
//           value={intivalue.diseases_now}
//         />

//       </div>
//         <AntdTextArea
//           label="ໝາຍເຫດ"
//           name="note"
//           rows={2}
//           placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
//           onChange={(e) => setIntivalue({ ...intivalue, note: e.target.value })}
//           value={intivalue.note}
//         />

//       <div className="overflow-x-auto  mb-4">
//         <TypeService />
//       </div>
//       <div className=" flex justify-end">
//         <button
//           onClick={onTreatmentSubmit}
//           disabled={loading || !inspectionId}
//           className={`px-6 py-2 rounded flex items-center gap-2 transition  ${
//             loading || !inspectionId
//               ? 'bg-gray-400 text-white cursor-not-allowed'
//               : 'bg-blue-600 text-white hover:bg-blue-700'
//           }`}
//         >
//           <Save className="w-5 h-5" />
//           {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການປິ່ນປົວ'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InService;

import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import Button from '@/components/Button';
import TypeService from '../TypeService/TypeService';
import { useForm } from 'react-hook-form';
import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
import AntdTextArea from '../../../components/Forms/AntdTextArea';
import BoxDate from '../../../components/Date';
import InputBox from '../../../components/Forms/Input_new';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';

const InService = () => {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspectionId, setInspectionId] = useState(null);

  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();

  const [intivalue, setIntivalue] = useState({
    diseases_now: '',
    symptom: '',
    note: '',
    checkup: '',
  });

  const [formData, setFormData] = useState({
    patient_id: '',
    in_id: '',
    date: '',
  });

  const getGenderLabel = (gender) => {
    if (gender === 'male') return 'ຊາຍ';
    if (gender === 'female') return 'ຍິງ';
    return '';
  };

  const getDob = (dob) => {
    return dob ? dob : '';
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
    console.log('Selected patient:', patientData);
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

      console.log('Inspection API response:', result);

      if (res.ok && result?.data?.in_id) {
        const inspection = result.data;
        setInspectionId(inspection.in_id);
        setFormData((prev) => ({
          ...prev,
          in_id: inspection.in_id,
          date: inspection.date,
        }));
        console.log('Inspection ID set:', inspection.in_id);
      } else {
        console.warn('No inspection data found or invalid response:', result);
      }
    } catch (err) {
      console.error('Error fetching inspection data:', err);
    }
  };

  const [idPatient, setIdPatient] = useState('');
  const [checkID, setCheckID] = useState(false);

  console.log(medicines);

  useEffect(() => {
    if (checkID) {
      setIdPatient(idPatient);
    }
  }, [checkID]);

  const HandlenSubmit = async () => {
    console.log('kk');
    setLoading(true);

    let newService = services.map((item) => ({
      ser_id: item.ser_id,
      qty: item.qty,
      price: item.price,
    }));

    const sendData = {
      diseases_now: intivalue.diseases_now || '',
      symptom: intivalue.symptom || '',
      note: intivalue.note || '',
      checkup: intivalue.checkup || '',
      detailed: newService,
    };

    const medicineData = [
      ...medicines.map((med) => ({
        med_id: med.med_id,
        qty: med.qty,
        price: med.price,
      })),
      ...equipment.map((item) => ({
        med_id: item.med_id,
        qty: item.qty,
        price: item.price,
      })),
    ];

    const sendMed = { data: medicineData };

    try {
      const response = await fetch(
        `http://localhost:4000/src/in/inspection/${inspectionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Inspection response:', result);

      const medicineRes = await fetch(
        `http://localhost:4000/src/in/inspectionmedicines/${inspectionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendMed),
        },
      );

      if (!medicineRes.ok) {
        throw new Error(`HTTP error! status: ${medicineRes.status}`);
      }

      const results = await medicineRes.json();
      console.log('equipment response:', results);

      alert('ບັນທຶກສຳເລັດ');

      setIntivalue({
        diseases_now: '',
        symptom: '',
        note: '',
        checkup: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('ມີຂໍ້ຜິດພາດ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowBill = () => {
    // if (!selectedPatient || !inspectionId) {
    //   alert('ກະລຸນາເລືອກຄົນເຈັບແລະມີຂໍ້ມູນການປິ່ນປົວກ່ອນ');
    //   return;
    // }
    setShowBillPopup(true);
  };

  const inspectionData = {
    in_id: inspectionId,
    date: formData.date,
    symptom: intivalue.symptom,
    checkup: intivalue.checkup,
    diseases_now: intivalue.diseases_now,
    note: intivalue.note,
  };

  const allMedicines = [
    ...medicines.map((med) => ({
      ...med,
      name: med.med_name || med.name,
    })),
    ...equipment.map((item) => ({
      ...item,
      name: item.med_name || item.name,
    })),
  ];

  return (
    <div className="rounded-lg  ">
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

        <BoxDate
          name="date"
          label="ວັນທີປິ່ນປົວ"
          select="date"
          formOptions={false}
          withTime={true}
          value={formData.date}
        />

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

        <AntdTextArea
          label="ໝາຍເຫດ"
          name="note"
          rows={2}
          placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
          onChange={(e) => setIntivalue({ ...intivalue, note: e.target.value })}
          value={intivalue.note}
        />
      </div>

      <div className="overflow-x-auto shadow mb-8">
        <TypeService />
      </div>

      {/* Fixed button section */}
      {/* <div className="fixed bottom-4 left-0 w-full  flex  mr-28 z-50">
        <div className="bg-white  dark:bg-boxdark p-4 rounded-lg shadow-lg flex  mx-auto px-4  justify-end   gap-4">
          <button
            onClick={handleShowBill}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ກົດເບິ່ງໃບບິນ
          </button>
          <button
            onClick={HandlenSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </button>
        </div>
      </div> */}

      {/* <BillPopup
        isOpen={showBillPopup}
        onClose={() => setShowBillPopup(false)}
        patientData={selectedPatient}
        inspectionData={inspectionData}
        services={services}
        medicines={allMedicines}
      /> */}
    </div>
  );
};

export default InService;
