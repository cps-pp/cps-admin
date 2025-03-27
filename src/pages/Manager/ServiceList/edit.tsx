import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';

const EditServicerList: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/manager/servicelist/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('ser_name', data.data.ser_name);
        setValue('price', data.data.price);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching servicelist data:', error);
      }
    };

    fetchListData();
  }, [id, setValue]);

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch(`http://localhost:4000/manager/servicelist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            ser_name: formData.ser_name,
            price: formData.price
          })
        
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate('/manager/servicelist'); 
    } catch (error) {
      console.error('Error saving servicelist:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ແກ້ໄຂຂໍ້ມູນບໍລີການ
        </h1>
        <BackButton className="mb-4" />

      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
      <Input
        label="ຊື່ລາຍການ"
        name="ser_name"
        type="text"
        placeholder="ປ້ອນຊຶ່ລາຍການ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນຊື່ລາຍການກ່ອນ" }}
        errors={errors}
      />
      <Input
        label="ລາຄາ"
        name="price"
        type="text"
        placeholder="ປ້ອນລາຄາ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນລາຄາກ່ອນ" }}
        errors={errors}
      />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          <button
            className="px-6 py-2 text-md font-medium text-red-500"
            type="button"
            onClick={() => navigate('/manager/servicelist')}
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

export default EditServicerList;