import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/manager/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type_name: formData.type_name }), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate('/manager/category'); // กลับไปหน้าหมวดหมู่
    } catch (error) {
      console.error('Error saving category:', error);
      alert('ບໍ່ສາມາດເພີ່ມຂໍ້ມູນປະເພດຢາ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded bg-white pt-2 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4  dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ສ້າງປະເພດຢາໃຫມ່
        </h1>
        <BackButton className="mb-4" />

      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ຊື່ປະເພດ"
          name="type_name"
          type="text"
          placeholder="ປ້ອນຊື່ປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ປະເພດກ່ອນ' }}
          errors={errors}
          className="text-strokedark dark:text-bodydark3"
        />

<div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <button className="px-6 py-2 text-md font-medium uppercase text-red-500" type="button" onClick={() => navigate("/manager/patient")}>
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

export default CreateCategory;
