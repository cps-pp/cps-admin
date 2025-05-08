import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';

interface EditProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
  getList?: () => void;
}

const EditDisease: React.FC<EditProps> = ({
  id,
  onClose,
  setShow,
  getList, 
}) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false); 
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchDiseaseData = async () => {
      setLoading(true);  
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
        setLoading(false);  
      }
    };

    fetchDiseaseData();
  }, [id, setValue, fetching]);

  const handleSave = async (formData: any) => {
    setLoading(true);  
    try {
      const response = await fetch(`http://localhost:4000/src/manager/disease/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_name: formData.disease_name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (getList) {
        getList();
      }
      
      setFetching(!fetching);  
 
       dispatch(openAlert({
         type: 'success',
         title: 'ແກ້ໄຂສຳເລັດ',
         message: 'ແກ້ໄຂຂໍ້ມູນພະຍາດແຂ້ວສຳເລັດແລ້ວ'
       }));
 
       if (getList) getList();
       setShow(false);
     } catch (err: any) {
       console.error(err);
      dispatch(openAlert({
        type: 'error',
        title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
        message:  'ເກີດຂໍ້ຜຶດພາດໃນການບັນທືກຂໍ້ມູນ'
      }));
     } finally {
       setLoading(false);
     }
   };
   if (loading) return <Loader />;
 
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts/>
       <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
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

export default EditDisease;