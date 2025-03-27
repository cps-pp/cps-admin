import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';

const EditDisease: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/manager/disease/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('disease_name', data.data.disease_name);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching disease data:', error);
      }
    };

    fetchCategoryData();
  }, [id, setValue]);

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch(`http://localhost:4000/manager/disease/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_name: formData.disease_name }), // ส่ง type_name
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate('/manager/diseaseຫ'); 
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
       <div className="flex items-center  border-b border-stroke px-4 dark:border-strokedark pb-4">
        <BackButton className="" />
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-6">
          ແກ້ໄຂ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ພະຍາດແຂ້ວ"
          name="disease_name"
          type="text"
          placeholder="ປ້ອນຊື່ພະຍາດແຂ້ວ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ພະຍາດແຂ້ວ' }}
          errors={errors}
          className="text-strokedark dark:text-bodydark3"
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          <button
            className="px-6 py-2 text-md font-medium text-red-500"
            type="button"
            onClick={() => navigate('/manager/disease')}
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

export default EditDisease;