import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import Select from '@/components/Forms/Select';
import BackButton from '@/components/BackButton';
import SelectID from '@/components/Forms/SelectID';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
interface CreateProps {
  setShow: (value: boolean) => void;
  getList: () => Promise<void>;
}
const CreateFollow: React.FC<CreateProps> = ({ setShow,getList }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [status, setStatus] = useState<string>('');
  const [patients, setPatients] = useState<
    { patient_id: string; patient_name: string }[]
  >([]);
  const [doctors, setDoctors] = useState<
    { emp_id: string; emp_name: string ; role:string}[]
  >([]);
  const [selectedPat, setSelectedPat] = useState<string>('');
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
        );
        const data = await response.json();
        if (response.ok) {
          console.log('Patient API Response:', data.data);
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
          console.log('Doctor API Response:', data.data);
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

  const onSubmit = async (data: any) => {
    try {
      if (!status || !selectedEmp || !selectedPat) {
        alert('ກະລຸນາກວດສອບຄ່າທີ່ກຳລັງສົ່ງ');
        return;
      }

      const response = await fetch(
        'http://localhost:4000/src/appoint/appointment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appoint_id: data.appoint_id,
            date_addmintted: data.date_addmintted,
            status: status,
            description: data.description,
            emp_id: selectedEmp,
            patient_id: selectedPat,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'ບໍ່ສາມາດບັນທຶກ');
      }

      
    dispatch(
      openAlert({
        type: 'success',
        title: 'ສຳເລັດ',
        message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
      }),
    );

    await getList();
    reset();
    setShow(false);
    } catch (error) {
       console.error('Error saving data:', error);
       dispatch(
         openAlert({
           type: 'error',
           title: 'ເກີດຂໍ້ຜິດພາດ',
           message: 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
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
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2  gap-4 px-4 pt-4"
      >
        <Input
          label="ລະຫັດນັດໝາຍ"
          name="appoint_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດນັດໝາຍ' }}
          errors={errors}
        />
        <DatePicker
          select=""
          register={register}
          errors={errors}
          name="date_addmintted"
          label="ວັນທີນັດໝາຍ"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີນັດໝາຍ' }}
          setValue={setValue}
          withTime={true}
        />
        <Select
          label="ສະຖານະ"
          name="status"
          options={['ລໍຖ້າ', 'ກວດແລ້ວ']}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => setStatus(e.target.value)}
        />
        <Input
          label="ລາຍລະອຽດ"
          name="description"
          type="text"
          placeholder="ປ້ອນລາຍລະອຽດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລາຍລະອຽດ' }}
          errors={errors}
        />

        <SelectID
          label="ທ່ານຫມໍ"
          name="emp"
          value={selectedEmp}
          options={doctors.map((doctor) => ({
            value: doctor.emp_id,
            label: `${doctor.emp_name} - ${doctor.role}`,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => setSelectedEmp(e.target.value)}
        />

        <SelectID
          label="ຄົນເຈັບ"
          name="patient"
          value={selectedPat}
          options={patients.map((patient) => ({
            value: patient.patient_id,
            label: patient.patient_name,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => setSelectedPat(e.target.value)}
        />

        <div className="flex justify-end space-x-4 col-span-full  py-4">
        
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFollow;
