import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import Button from '@/components/Button';
import TypeService from '../TypeService/TypeService';
import { useForm } from 'react-hook-form';
import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
import AntdTextArea from '../../../components/Forms/AntdTextArea';
import BoxDate from '../../../components/Date';
import InputBox from '../../../components/Forms/Input_new';

const Treatment = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspectionId, setInspectionId] = useState(null);
  const [detailed, setDetailed] = useState([]);
const [medicineData, setMedicineData] = useState([]);
  const getGenderLabel = (gender) => {
    if (gender === 'male') return 'ຊາຍ';
    if (gender === 'female') return 'ຍິງ';
    return '';
  };

  const getDob = (dob) => {
    return dob ? dob : '';
  };

  const selectedDate = watch('date');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/patient');
      const data = await res.json();
      console.log(data);
      setPatients(data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  // const handlePatientSelect = (patientData) => {
  //   setSelectedPatient(patientData);
  //   setValue('patient_id', patientData.patient_id);

  //   if (patientData.inspectionId) {
  //     setInspectionId(patientData.inspectionId);
  //     setValue('in_id', patientData.inspectionId);
  //   }

  //   if (patientData.inspectionDate) {
  //     setValue('date', patientData.inspectionDate);
  //   }
  // };

  const handlePatientSelect = async (patientData) => {
    setSelectedPatient(patientData);
    setValue('patient_id', patientData.patient_id);

    try {
      const res = await fetch(
        `http://localhost:4000/src/in/inspection/${patientData.patient_id}`,
      );
      const result = await res.json();

      if (res.ok && result?.data?.in_id) {
        const inspection = result.data;
        setInspectionId(inspection.in_id);
        setValue('in_id', inspection.in_id);
        setValue('date', inspection.date);
      }
    } catch (err) {
      console.error('Error fetching inspection data:', err);
    }
  };

  const onSubmit = async (data) => {
  setLoading(true);

  try {
    const payload = {
      diseases_now: detailed.diseases_now || '',
      checkup: detailed.checkup || '',
      symptom: detailed.symptom || '',
      note: detailed.note || '',
      detailed: detailed || [],
    };

    await fetch(`http://localhost:4000/src/in/inspection/${inspectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (medicineData && medicineData.length > 0) {
      const medicinePayload = {
        med_id: data.med_id || '',
        qty: data.qty || '',
        price: data.price || '',
      };

      await fetch(`http://localhost:4000/src/in/inspectionmed/${inspectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicinePayload),
      });
    }

    alert("ບັນທຶກສຳເລັດ");

  } catch (error) {
    console.error("Error submitting form:", error);
    alert("ມີຂໍ້ຜິດພາດ: " + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md"
    >
      <div className="mb-6 border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ບໍລິການ
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <label className="text-sm text-gray-600 mb-1 block">
            ເລືອກຄົນເຈັບ
          </label>
          <input
            type="text"
            readOnly
            className="w-full rounded border text-purple-700  font-medium border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary  dark:text-white capitalize cursor-pointer"
            placeholder="ປ້ອນຄົນເຈັບ"
            value={
              selectedPatient
                ? `${selectedPatient.patient_id ?? ''} ${selectedPatient.patient_name ?? ''} ${selectedPatient.patient_surname ?? ''}  ${getGenderLabel(selectedPatient?.gender)}`
                : ''
            }
            onClick={() => setShowPopup(true)}
          />
          <input
            type="hidden"
            {...register('patient_id', { required: 'ກະລຸນາເລືອກຄົນເຈັບ' })}
            value={selectedPatient ? selectedPatient.patient_id : ''}
          />
          {errors.patient_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.patient_id.message}
            </p>
          )}

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
            />
          )}
        </div>

        <InputBox
          label="ເລກທີປິ່ນປົວ"
          name="in_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={false}
          errors={errors}
          value={inspectionId}
          readOnly={true}
        />

        <BoxDate
          name="date"
          label="ວັນທີປິ່ນປົວ"
          register={register}
          errors={errors}
          select={selectedDate}
          formOptions={false}
          setValue={setValue}
          withTime={true}
        />

        <AntdTextArea
          label="ອາການເບື່ອງຕົ້ນ (Symptom)"
          name="symptom"
          rows={2}
          placeholder="ປ້ອນອາການ"
          register={register}
          formOptions={false}
          errors={errors}
        />

        <InputBox
  label="ການກວດຮ່າງກາຍ (Checkup)"
  name="checkup"
  type="text"
  placeholder="ປ້ອນຂໍ້ມູນ"
  register={register}
  formOptions={false}
  errors={errors}
/>
        <AntdTextArea
          label="ພະຍາດ (diseases Now)"
          name="diseases_now"
          rows={2}
          placeholder="ປ້ອນຜົນກວດ"
          register={register}
          formOptions={false}
          errors={errors}
        />
        <AntdTextArea
          label="ໝາຍເຫດ"
          name="note"
          rows={2}
          placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
          register={register}
          formOptions={{ required: false }}
          errors={errors}
        />
      </div>

      <div className="overflow-x-auto shadow mb-8">
        <TypeService onDetailChange={setDetailed} />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600 flex items-center transition"
          >
            <FileText className="mr-2" size={20} />
            Bill
          </button>

          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Treatment;

// import React, { useEffect, useState } from 'react';
// import { FileText } from 'lucide-react';
// import Button from '@/components/Button';
// import TypeService from '../TypeService/TypeService';
// import { useForm } from 'react-hook-form';
// import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
// import AntdTextArea from '../../../components/Forms/AntdTextArea';
// import BoxDate from '../../../components/Date';
// import InputBox from '../../../components/Forms/Input_new';

// const Treatment = ({ setShow, getList }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const getGenderLabel = (gender) => {
//     if (gender === 'male') return 'ຊາຍ';
//     if (gender === 'female') return 'ຍິງ';
//     return '';
//   };
//   const getDob = (dob) => {
//     return dob ? dob : '';
//   };
//   const selectedDate = watch('date_addmintted');

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/src/manager/patient');
//       const data = await res.json();
//       setPatients(data.data);
//       if (data.in_id) {
//         setInspectionId(data.in_id);
//       }
//     } catch (err) {
//       console.error('Error fetching patients:', err);
//     }
//   };

//   const onSubmit = (data) => {
//     setLoading(true);
//     setLoading(false);
//   };
//   const [inspectionId, setInspectionId] = useState(null);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md"
//     >
//       <div className="mb-6 border-b border-stroke dark:border-strokedark pb-4">
//         <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
//           ບໍລິການ
//         </h1>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//         <div className="relative">
//           <label className="text-sm text-gray-600 mb-1 block">
//             ເລືອກຄົນເຈັບ
//           </label>
//           <input
//             type="text"
//             readOnly
//             className="w-full rounded border text-purple-700  font-medium border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary  dark:text-white capitalize cursor-pointer"
//             placeholder="ປ້ອນຄົນເຈັບ"
//             value={
//               selectedPatient
//                 ? `${selectedPatient.patient_id ?? ''} ${selectedPatient.patient_name ?? ''} ${selectedPatient.patient_surname ?? ''}  ${getGenderLabel(selectedPatient?.gender)}`
//                 : ''
//             }
//             onClick={() => setShowPopup(true)}
//           />
//           <input
//             type="hidden"
//             {...register('patient_id', { required: 'ກະລຸນາເລືອກຄົນເຈັບ' })}
//             value={selectedPatient ? selectedPatient.patient_id : ''}
//           />
//           {errors.patient_id && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.patient_id.message}
//             </p>
//           )}

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
//               onSelect={(patient) => {
//                 setSelectedPatient(patient);
//                 setValue('patient_id', patient.patient_id);
//               }}
//               onClose={() => setShowPopup(false)}
//             />
//           )}
//         </div>
//         <InputBox
//           label="ເລກທີປິ່ນປົວ"
//           name="in_id"
//           type="text"
//           placeholder="ປ້ອນລະຫັດ"
//           register={register}
//           formOptions={false}
//           errors={errors}
//           value={inspectionId}
//           readOnly={true}
//         />

//         <BoxDate
//           name="date"
//           label="ວັນທີປິ່ນປົວ"
//           register={register}
//           errors={errors}
//           select={selectedDate}
//           formOptions={{ required: 'ກະລຸນາເລືອກວັນທີປິ່ນປົວ' }}
//           setValue={setValue}
//           withTime={true}
//         />
//         <AntdTextArea
//           label="ອາການເບື່ອງຕົ້ນ (Symptom)"
//           name="symptom"
//           rows={2}
//           placeholder="ປ້ອນອາການ"
//           register={register}
//           formOptions={{ required: 'ກະລຸນາປ້ອນອາການກ່ອນ' }}
//           errors={errors}
//         />

//         <AntdTextArea
//           label="ບົ່ງມະຕິ (Checkup)"
//           name="checkup"
//           rows={2}
//           placeholder="ປ້ອນຜົນກວດ"
//           register={register}
//           formOptions={{ required: 'ກະລຸນາປ້ອນຜົນກວດ' }}
//           errors={errors}
//         />
//         <AntdTextArea
//           label="ໝາຍເຫດ"
//           name="note"
//           rows={2}
//           placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
//           register={register}
//           formOptions={{ required: false }}
//           errors={errors}
//         />
//       </div>

//       <div className="overflow-x-auto shadow mb-8">
//         <TypeService />
//       </div>
//       <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//         <div className="flex space-x-4">
//           <button
//             type="button"
//             className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600 flex items-center transition"
//           >
//             <FileText className="mr-2" size={20} />
//             Bill
//           </button>

//           <Button variant="save" type="submit" disabled={loading}>
//             {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Treatment;
