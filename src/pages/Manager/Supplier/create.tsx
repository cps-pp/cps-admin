import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';
interface CreateProps {
  setShow: (value: boolean) => void;
  getList: any;
}

const CreateSupplier: React.FC<CreateProps> = ({ setShow, getList }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/manager/supplier', {
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

      setShow(false);
      await getList();
      reset();
    } catch (error) {
      console.error('Error saving :', error);
      alert('ບໍ່ສາມາດເພີ່ມຂໍ້ມູນ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ Supplier
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
          label="ເບີໂທ"
          name="phone"
          type="text"
          placeholder="ປ້ອນເບີໂທ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເບີໂທກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ສະຖານະ"
          name="status"
          type="text"
          placeholder="ປ້ອນສະຖານະ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນສະຖານະກ່ອນ' }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          {/* <button
            className="px-6 py-2 text-md font-medium uppercase text-red-500"
            type="button"
            onClick={() => navigate('/manager/supplier')}
          >
            ຍົກເລິກ
          </button> */}
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplier;
