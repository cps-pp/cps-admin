import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import Select from '@/components/Forms/Select';
interface CreateProps {
  setShow: (value: boolean) => void;
  getList: any;
}

const CreateSupplier: React.FC<CreateProps> = ({ setShow, getList }) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<string>('');

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/manager/supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sup_id: formData.sup_id,
          company_name: formData.company_name,
          address: formData.address,
          phone: formData.phone,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

        dispatch(
              openAlert({
                type: 'success',
                title: 'ສຳເລັດ',
                message: 'ບັນທຶກຂໍ້ມູນຜູ້ສະໜອງສຳເລັດແລ້ວ',
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
          message: 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
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
      <div className="flex items-center border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ລະຫັດ Supplier"
          name="sup_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ຊື່ບໍລິສັດ"
          name="company_name"
          type="text"
          placeholder="ປ້ອນຊື່ບໍລິສັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ບໍລິສັດກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ທີ່ຢູ່"
          name="address"
          type="text"
          placeholder="ປ້ອນທີ່ຢູ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ' }}
          errors={errors}
        />
       <Input
          label="ເບີຕິດຕໍ່"
          name="phone"
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

<Select
  label="ສະຖານນະ"
  name="status"
  options={['ເປີດ', 'ປິດ']}
  register={register}
  errors={errors}
  value={status}
  onSelect={(e) => {
    setStatus(e.target.value);
    setValue('status', e.target.value); 
  }}
/>

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
         
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplier;
