import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';


interface EditProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
  getList?: () => void;
}

const EditSupplier: React.FC<EditProps>= ({
  id,
  onClose,
  setShow,
  getList, 
}) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false); 
  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!id) {
        console.error('Supplier ID is undefined');
        navigate('/manager/supplier');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/manager/supplier/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        setValue('company_name', data.data.company_name);
        setValue('address', data.data.address);
        setValue('phone', data.data.phone);
        setValue('status', data.data.status);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        setLoading(false);
      }
    };
  
    fetchSupplierData();
  }, [id, setValue, fetching]);



  const handleSave = async (formData: any) => {
    setLoading(true);  
    try {
      const response = await fetch(`http://localhost:4000/manager/supplier/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: formData.company_name,
          address: formData.address,
          phone: formData.phone,
          status: formData.status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (getList) {
        getList();
      }
      
      setFetching(!fetching);  
      onClose(); 
    } catch (error) {
      console.error('Error saving disease:', error);
    } finally {
      setLoading(false); 
    }
  };



  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂຂໍ້ມູນ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ຊື່ບໍລິສັດ"
          name="company_name"
          type="text"
          placeholder="ປ້ອນຊື່ບໍລິສັດ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນຊື່ບໍລິສັດກ່ອນ" }}
          errors={errors}
        />
        <Input
          label="ທີ່ຢູ່"
          name="address"
          type="text"
          placeholder="ປ້ອນທີ່ຢູ່"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ" }}
          errors={errors}
        />
        <Input
          label="ເບີໂທ"
          name="phone"
          type="text"
          placeholder="ປ້ອນເບີໂທ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນເບີໂທກ່ອນ" }}
          errors={errors}
        />
        <Input
          label="ສະຖານະ"
          name="status"
          type="text"
          placeholder="ເຊັ່ນ: ປິດ, ເປີດ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນສະຖານະ" }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
      
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplier;
