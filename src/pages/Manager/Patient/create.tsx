import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import SelectGender from '@/components/Forms/SelectGender';
import Select from '@/components/Forms/Select';
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

const CreatePatient: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty,errors  },
  } = useForm();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        const message = 'ທ່ານຍັງບໍ່ໄດ້ບັນທຶກຂໍ້ມູນ. ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ຫຼືບໍ?';
        event.preventDefault(); 
        event.returnValue = message;
        return message;
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const [gender, setGender] = useState<string>(''); 

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:4000/manager/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, gender }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');
      }

      reset();
      navigate('/manager/patient');
    } catch (error: any) {
      alert(error.message || 'ມີຂໍ້ຜິດພາດ');
    }
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center  border-b border-stroke px-4 dark:border-strokedark pb-4">
        <BackButton className="" />
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-6">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1  gap-4 px-4 pt-4 "
      >
        <Input
          label="ຊື່ຄົນເຈັບ"
          name="patient_id"
          type="text"
          placeholder="ປ້ອນລະຫັດຄົນເຈັບ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດຄົນເຈັບກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ຊື່ຄົນເຈັບ"
          name="patient_name"
          type="text"
          placeholder="ປ້ອນຊຶ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຄົນເຈັບກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ນາມສະກຸນ"
          name="patient_surname"
          type="text"
          placeholder="ນາມສະກຸນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນນາມສະກຸນກ່ອນ' }}
          errors={errors}
        />

        <Select
          label="ເພດ"
          name="ເພດ"
          options={['ຊາຍ', 'ຍິງ']}
          register={register}
          errors={errors}
          value={gender}
          onSelect={(e) => setGender(e.target.value)}
        />

        <DatePicker
          select=""
          register={register}
          errors={errors}
          name="dob"
          label="ວັນເດືອນປິເກີດ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນເດືອນປີເກີດ' }}
          setValue={setValue}
        />
        <Input
          label="ເບີຕິດຕໍ່"
          name="phone1"
          type="text"
          placeholder="ເບີຕິດຕໍ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ເບີຕິດຕໍ່ສຳຮອງ"
          name="phone2"
          type="text"
          placeholder="ເບີຕິດຕໍ່ສຳຮອງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ສຳຮອງກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ບ້ານ"
          name="village"
          type="text"
          placeholder="ບ້ານ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນບ້ານກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ເມືອງ"
          name="district"
          type="text"
          placeholder="ເມືອງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເມືອງກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ແຂວງ"
          name="province"
          type="text"
          placeholder="ແຂວງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນແຂວງກ່ອນ' }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <button
            className="px-6 py-2 text-md font-medium uppercase text-red-500"
            type="button"
            onClick={() => navigate('/manager/patient')}
          >
            ຍົກເລິກ
          </button>
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;
