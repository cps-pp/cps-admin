import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import InputBox from '../../../components/Forms/Input_new';
import ButtonBox from '../../../components/Button';
import { usePrompt } from '@/hooks/usePrompt';

const CreateDisease = ({ setShow, getList, existingIds, onCloseCallback }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // ✅ ใช้ useRef เพื่อเก็บ current value ของ isDirty
    const isDirtyRef = useRef(isDirty);
    
    // ✅ อัพเดต ref ทุกครั้งที่ isDirty เปลี่ยน
    useEffect(() => {
      isDirtyRef.current = isDirty;
    }, [isDirty]);
    
    // ✅ เตือนเมื่อมีการพยายามออกจากหน้าด้วย navigation (Back / เปลี่ยน route)
    usePrompt('ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.', isDirty);
  
    // ✅ เตือนเมื่อจะรีเฟรช / ปิดแท็บ
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        if (!isDirtyRef.current) return;
        event.preventDefault();
        event.returnValue = '';
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
  
    // ✅ เตือนเมื่อคลิกปิดฟอร์ม - ใช้ current value จาก ref
    const handleCloseForm = () => {
      if (isDirtyRef.current) {
        const confirmLeave = window.confirm('ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ');
        if (!confirmLeave) return;
      }
      setShow(false);
    };
  
    // ✅ ส่ง handleCloseForm ไปให้ parent component แค่ครั้งเดียว
    useEffect(() => {
      if (onCloseCallback) {
        onCloseCallback(() => handleCloseForm);
      }
    }, [onCloseCallback]);

  const handleSave = async (formData) => {
    setLoading(true);

    // เช็คว่ามี disease_id ซ้ำไหม
    if (existingIds.includes(formData.disease_id)) {
      setFocus('disease_id');
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລະຫັດປະເພດຢາ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/src/manager/disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease_id: formData.disease_id,
          disease_name: formData.disease_name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນພະຍາດແຂ້ວສຳເລັດແລ້ວ',
        })
      );

      await getList();
      reset();
      setShow(false);
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
           <Alerts/>

      <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <InputBox
          label="ລະຫັດພະຍາດແຂ້ວ"
          name="disease_id"
          type="text"
          placeholder="ປ້ອນລະຫັດພະຍາດແຂ້ວ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດພະຍາດແຂ້ວກ່ອນ' }}
          errors={errors}
          className="text-strokedark dark:text-bodydark3"
        />
        <InputBox
          label="ພະຍາດແຂ້ວ"
          name="disease_name"
          type="text"
          placeholder="ປ້ອນຊື່ພະຍາດແຂ້ວ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ພະຍາດແຂ້ວກ່ອນ' }}
          errors={errors}
          className="text-strokedark dark:text-bodydark3"
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full  py-4">
          
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};
export default CreateDisease;
