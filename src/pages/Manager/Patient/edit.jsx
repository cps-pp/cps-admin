import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '@/components/Forms/Input';
import DatePicker from '@/components/DatePicker_two';
import Select from '@/components/Forms/Select';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import InputBox from '../../../components/Forms/Input_new';
import SelectBox from '../../../components/Forms/Select';
import ButtonBox from '../../../components/Button';
import BoxDate from '../../../components/Date';

const EditPatient = ({ id, onClose, setShow, getList }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      patient_id: '',
      patient_name: '',
      patient_surname: '',
      gender: '',
      dob: '',
      phone1: '',
      phone2: '',
      village: '',
      district: '',
      province: '',
    },
  });

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) {
        console.error('Patient ID is undefined');
        return;
      }
      try {
        const response = await fetch(`http://localhost:4000/src/manager/patient/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        reset(result.data);
        setGender(result.data.gender);
        setLoading(false);
      } catch (err) {
        console.error(err);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ດາວໂຫລດຂໍ້ມູນບໍ່ສຳເລັດ',
            message: 'ບໍ່ສາມາດສະແດງຂໍ້ມູນຂອງຄົນເຈັບໄດ້',
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, reset, fetching, dispatch]);

  useEffect(() => {
    if (gender) {
      setValue('gender', gender);
    }
  }, [gender, setValue]);

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/src/manager/patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Status ${res.status}`);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ແກ້ໄຂສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນຄົນເຈັບສຳເລັດແລ້ວ',
        }),
      );

      if (getList) getList();
      setShow(false);
    } catch (err) {
      console.error(err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜຶດພາດໃນການບັນທືກຂໍ້ມູນ',
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

     <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-4 px-4"

      >
       
        <InputBox
          label="ຊື່ຄົນເຈັບ"
          name="patient_name"
          type="text"
          placeholder="ປ້ອນຊຶ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຄົນເຈັບກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ນາມສະກຸນ"
          name="patient_surname"
          type="text"
          placeholder="ນາມສະກຸນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນນາມສະກຸນກ່ອນ' }}
          errors={errors}

        />
        <SelectBox
          label="ເພດ"
          name="gender"
          options={['ຊາຍ', 'ຍິງ']}
          register={register}
          errors={errors}
          value={gender}
          onSelect={(e) => setGender(e.target.value)}

        />

        <BoxDate
          name="dob"
          label="ວັນເດືອນປີເກີດ"
          register={register}
          errors={errors}
          setValue={setValue}
          select={getValues('dob')}
          className="text-strokedark dark:text-bodydark3"


        />

<InputBox
          label="ເບີຕິດຕໍ່"
          name="phone1"
          type="tel"
          placeholder="ປ້ອນເບີຕິດຕໍ່"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ',
            pattern: {
              value: /^[0-9]+$/,
              message: 'ເບີຕິດຕໍ່ຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ',
            },
            minLength: {
              value: 8,
              message: 'ເບີຕິດຕໍ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວເລກ',
            },
          }}
          errors={errors}
        />
         <InputBox
          label="ເບີຕິດຕໍ່"
          name="phone2"
          type="tel"
          placeholder="ປ້ອນເບີຕິດຕໍ່"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ',
            pattern: {
              value: /^[0-9]+$/,
              message: 'ເບີຕິດຕໍ່ຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ',
            },
            minLength: {
              value: 8,
              message: 'ເບີຕິດຕໍ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວເລກ',
            },
          }}
          errors={errors}
        />
        <InputBox
          label="ບ້ານ"
          name="village"
          type="text"
          placeholder="ບ້ານ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນບ້ານກ່ອນ' }}
          errors={errors}

        />
        <InputBox
          label="ເມືອງ"
          name="district"
          type="text"
          placeholder="ເມືອງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເມືອງກ່ອນ' }}
          errors={errors}

        />
        <InputBox
          label="ແຂວງ"
          name="province"
          type="text"
          placeholder="ແຂວງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນແຂວງກ່ອນ' }}
          errors={errors}

        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
      
          <ButtonBox variant="save" type="submit">
            ບັນທຶກ
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;
