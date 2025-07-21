// import { useForm } from 'react-hook-form';
// import { useEffect, useState } from 'react';
// import Alerts from '@/components/Alerts';
// import Loader from '@/common/Loader';
// import { openAlert } from '@/redux/reducer/alert';
// import { useAppDispatch } from '@/redux/hook';
// import SelectBox from '../../components/Forms/Select';
// import InputBox from '../../components/Forms/Input_new';
// import SelectBoxId from '../../components/Forms/SelectID';
// import ButtonBox from '../../components/Button';
// import DatePickerBox from '../../components/DatePicker_New';
// // import DatePicker from '@/components/DatePicker_two';
// import moment from 'moment';
// import DateBox from '../../components/Date';
// import DateTime from '../../components/DateTime';

// const EditFollow = ({ setShow, getList, id }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     watch,
//     formState: { errors },
//   } = useForm();
//   const [originalDate, setOriginalDate] = useState('');
//   const [status, setStatus] = useState('');
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [selectedPat, setSelectedPat] = useState('');
//   const [selectedEmp, setSelectedEmp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     const fetchAppointment = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:4000/src/appoint/appointment/${id}`,
//         );
//         const data = await response.json();
//         if (response.ok) {
//           const appt = data.data;

//           setValue('appoint_id', appt.appoint_id);
//           setValue('date_addmintted', appt.date_addmintted);
//           setValue('description', appt.description);
//           setStatus(appt.status);
//           setOriginalDate(appt.date_addmintted);
//           setSelectedEmp(appt.emp_id);
//           setSelectedPat(appt.patient_id);
//         } else {
//           console.error('Failed to fetch appointment', data);
//         }
//       } catch (error) {
//         console.error('Error fetching appointment', error);
//       }
//     };

//     if (id) {
//       fetchAppointment();
//     }
//   }, [id, setValue]);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:4000/src/manager/patient',
//         );
//         const data = await response.json();
//         if (response.ok) {
//           setPatients(data.data);
//         } else {
//           console.error('Failed to fetch patients', data);
//         }
//       } catch (error) {
//         console.error('Error fetching patients', error);
//       }
//     };
//     fetchPatients();
//   }, []);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/src/manager/emp');
//         const data = await response.json();
//         if (response.ok) {
//           setDoctors(data.data);
//         } else {
//           console.error('Failed to fetch doctors', data);
//         }
//       } catch (error) {
//         console.error('Error fetching doctors', error);
//       }
//     };
//     fetchDoctors();
//   }, []);
//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       // if (!status || !selectedEmp || !selectedPat) {
//       //   alert('ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນສົ່ງ');
//       //   setLoading(false);
//       //   return;
//       // }

//       const originalDate = data.date_addmintted
//         ? moment(data.date_addmintted).format('YYYY-MM-DDTHH:mm:ssZ')
//         : '';

//       const response = await fetch(
//         `http://localhost:4000/src/appoint/appointment/${id}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             appoint_id: data.appoint_id,
//             date_addmintted: originalDate,
//             status,
//             description: data.description,
//             emp_id: selectedEmp,
//             patient_id: selectedPat,
//           }),
//         },
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້');
//       }

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ສຳເລັດ',
//           message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ',
//         }),
//       );
//       window.dispatchEvent(new Event('refresh-notifications'));

//       await getList();
//       setShow(false);
//     } catch (error) {
//       console.error('Error saving data:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ເກີດຂໍ້ຜິດພາດ',
//           message: 'ການແກ້ໄຂຂໍ້ມູນມີຂໍ້ຜິດພາດ',
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="rounded bg-white pt-4 dark:bg-boxdark">
//       <Alerts />
//       <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
//         <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
//           ແກ້ໄຂຂໍ້ມູນ
//         </h1>
//       </div>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-4 px-4 pt-4"
//       >
//         {/* <DatePickerBox
//           name="date_addmintted"
//           label="ວັນທີນັດໝາຍ"
//           register={register}
//           errors={errors}
//           select={getValues('date_addmintted')}
//           formOptions={{ required: 'ກະລຸນາເລືອກວັນທີນັດໝາຍ' }}
//           setValue={setValue}
//           withTime={true}
//         /> */}
//         <DateTime
//           name="date_addmintted"
//           label="ວັນທີນັດໝາຍ"
//           register={register}
//           errors={errors}
//           select={getValues('date_addmintted')}
//           formOptions={{ required: 'ກະລຸນາເລືອກວັນທີນັດໝາຍ' }}
//           setValue={setValue}
//           withTime={true}
//         />

//         <SelectBox
//           label="ສະຖານະ"
//           name="status"
//           options={['ລໍຖ້າ', 'ກວດແລ້ວ']}
//           register={register}
//           errors={errors}
//           value={status}
//           onSelect={(e) => setStatus(e.target.value)}
//         />

//         <InputBox
//           label="ລາຍລະອຽດ"
//           name="description"
//           type="text"
//           placeholder="ປ້ອນລາຍລະອຽດ"
//           register={register}
//           errors={errors}
//         />

//         <SelectBoxId
//           label="ທ່ານຫມໍ"
//           name="emp"
//           value={selectedEmp}
//           options={doctors.map((doctor) => ({
//             value: doctor.emp_id,
//             label: `${doctor.emp_name} - ${doctor.role}`,
//           }))}
//           register={register}
//           errors={errors}
//           onSelect={(e) => setSelectedEmp(e.target.value)}
//         />

//         <SelectBoxId
//           label="ຄົນເຈັບ"
//           name="patient"
//           value={selectedPat}
//           options={patients.map((patient) => ({
//             value: patient.patient_id,
//             label: patient.patient_name,
//           }))}
//           register={register}
//           errors={errors}
//           onSelect={(e) => setSelectedPat(e.target.value)}
//         />

//         <div className="flex justify-end space-x-4 col-span-full py-4">
//           <ButtonBox variant="save" type="submit">
//             ແກ້ໄຂ
//           </ButtonBox>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditFollow;
import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import SelectBox from '../../components/Forms/Select';
import InputBox from '../../components/Forms/Input_new';
import SelectBoxId from '../../components/Forms/SelectID';
import ButtonBox from '../../components/Button';
import DatePickerBox from '../../components/DatePicker_New';

import moment from 'moment';
import DateBox from '../../components/Date';


const EditFollow = ({ setShow, getList, id }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  
  const [originalDate, setOriginalDate] = useState('');
  const [status, setStatus] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPat, setSelectedPat] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // ใช้ useMemo สำหรับ options เพื่อป้องกัน re-render
  const doctorOptions = useMemo(() => 
    doctors.map((doctor) => ({
      value: doctor.emp_id,
      label: `${doctor.emp_name} - ${doctor.role}`,
    })), [doctors]
  );

  const patientOptions = useMemo(() => 
    patients.map((patient) => ({
      value: patient.patient_id,
      label: patient.patient_name,
    })), [patients]
  );

  const statusOptions = useMemo(() => ['ລໍຖ້າ', 'ກວດແລ້ວ'], []);

  // ใช้ useCallback สำหรับ handlers
  const handleStatusSelect = useCallback((e) => {
    setStatus(e.target.value);
  }, []);

  const handleDoctorSelect = useCallback((e) => {
    setSelectedEmp(e.target.value);
  }, []);

  const handlePatientSelect = useCallback((e) => {
    setSelectedPat(e.target.value);
  }, []);

  // ฟังก์ชันแปลง datetime สำหรับ input datetime-local
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/src/appoint/appointment/${id}`,
        );
        const data = await response.json();
        if (response.ok) {
          const appt = data.data;

          setValue('appoint_id', appt.appoint_id);
          // แปลงวันที่ให้เหมาะสมกับ datetime-local input
          const formattedDate = formatDateTimeLocal(appt.date_addmintted);
          setValue('date_addmintted', formattedDate);
          setValue('description', appt.description);
          setStatus(appt.status);
          setOriginalDate(appt.date_addmintted);
          setSelectedEmp(appt.emp_id);
          setSelectedPat(appt.patient_id);
        } else {
          console.error('Failed to fetch appointment', data);
        }
      } catch (error) {
        console.error('Error fetching appointment', error);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id, setValue]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
        );
        const data = await response.json();
        if (response.ok) {
          setPatients(data.data);
        } else {
          console.error('Failed to fetch patients', data);
        }
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:4000/src/manager/emp');
        const data = await response.json();
        if (response.ok) {
          setDoctors(data.data);
        } else {
          console.error('Failed to fetch doctors', data);
        }
      } catch (error) {
        console.error('Error fetching doctors', error);
      }
    };
    fetchDoctors();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // แปลงวันที่จาก datetime-local เป็น ISO format
      const appointmentDate = data.date_addmintted 
        ? moment(data.date_addmintted).format('YYYY-MM-DDTHH:mm:ssZ')
        : '';

      const response = await fetch(
        `http://localhost:4000/src/appoint/appointment/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appoint_id: data.appoint_id,
            date_addmintted: appointmentDate,
            status,
            description: data.description,
            emp_id: selectedEmp,
            patient_id: selectedPat,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ',
        }),
      );
      window.dispatchEvent(new Event('refresh-notifications'));

      await getList();
      setShow(false);
    } catch (error) {
      console.error('Error saving data:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ການແກ້ໄຂຂໍ້ມູນມີຂໍ້ຜິດພາດ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-4 px-4 pt-4"
      >
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ວັນທີນັດໝາຍ
          </label>
          <input
            type="datetime-local"
            {...register('date_addmintted', { required: 'ກະລຸນາເລືອກວັນທີນັດໝາຍ' })}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          {errors.date_addmintted && (
            <span className="text-red-500 text-sm">{errors.date_addmintted.message}</span>
          )}
        </div>
        <SelectBox
          label="ສະຖານະ"
          name="status"
          options={statusOptions}
          register={register}
          errors={errors}
          value={status}
          onSelect={handleStatusSelect}
        />

        <InputBox
          label="ລາຍລະອຽດ"
          name="description"
          type="text"
          placeholder="ປ້ອນລາຍລະອຽດ"
          register={register}
          errors={errors}
        />

        <SelectBoxId
          label="ທ່ານຫມໍ"
          name="emp"
          value={selectedEmp}
          options={doctorOptions}
          register={register}
          errors={errors}
          onSelect={handleDoctorSelect}
        />

        <SelectBoxId
          label="ຄົນເຈັບ"
          name="patient"
          value={selectedPat}
          options={patientOptions}
          register={register}
          errors={errors}
          onSelect={handlePatientSelect}
        />

        <div className="flex justify-end space-x-4 col-span-full py-4">
          <ButtonBox variant="save" type="submit">
            ບັນທຶກ
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default EditFollow;
