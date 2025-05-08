import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import Select from '@/components/Forms/Select';
import React, { useEffect, useState } from 'react';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';

interface CreateProps {
  setShow: (value: boolean) => void;
  getList: any;
}

const CreatePatient: React.FC<CreateProps> = ({ setShow, getList }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch(); 

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        const message =
          'ທ່ານຍັງບໍ່ໄດ້ບັນທຶກຂໍ້ມູນ. ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ຫຼືບໍ?';
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

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/manager/patient', {
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
    
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນຄົນເຈັບສຳເລັດແລ້ວ',
        })
      );

      setShow(false);

      await getList();
      reset();
    } catch (error: any) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        })
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
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-4 px-4"
      >
        <Input
          label="ລະຫັດຄົນເຈັບ"
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
         <Input
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

        <div className="mt-4 flex justify-end space-x-4 col-span-full py-4">
          <Button 
            variant="save" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;
