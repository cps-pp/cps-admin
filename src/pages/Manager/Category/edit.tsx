import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';

interface EditCateProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
}

const EditCate: React.FC<EditCateProps> = ({
  id,
  onClose,
  setShow,
}) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);  
  const [fetching, setFetching] = useState(false); 

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);  
      try {
        const response = await fetch(`http://localhost:4000/manager/category/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('type_name', data.data.type_name);  
        setLoading(false);  
      } catch (error) {
        console.error('Error fetching category data:', error);
        setLoading(false);  
      }
    };

    fetchCategoryData();
  }, [id, setValue, fetching]);

  const handleSave = async (formData: any) => {
    setLoading(true);  
    try {
      const response = await fetch(`http://localhost:4000/manager/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type_name: formData.type_name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFetching(!fetching);  
      onClose(); 
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ຊື່ປະເພດ"
          name="type_name"
          type="text"
          placeholder="ປ້ອນຊື່ປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ປະເພດ' }}
          errors={errors}
          className="text-strokedark dark:text-bodydark3"
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          {/* <button
            className="px-6 py-2 text-md font-medium uppercase text-red-500"
            type="button"
            onClick={() => setShow(false)}
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

export default EditCate;
