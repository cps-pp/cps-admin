import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import InputBox from '../../../components/Forms/Input_new';
import ButtonBox from '../../../components/Button';
import { usePrompt } from '@/hooks/usePrompt';

const CreateCategory = ({ setShow, getListCategory, existingIds, onCloseCallback }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  // ✅ แก้ไขฟังก์ชันล้างข้อมูล
  const handleClearForm = () => {
    // ล้างข้อมูลฟอร์มและรีเซ็ต isDirty
    reset({
      medtype_id: '',
      type_name: ''
    }), 

    // อัพเดต ref ให้เป็น false ทันที
    isDirtyRef.current = false;
  };

  const handleSave = async (formData) => {
    setLoading(true);

    if (existingIds.includes(formData.medtype_id)) {
      setFocus('medtype_id');
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
      const response = await fetch('http://localhost:4000/src/manager/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_name: formData.type_name,
          medtype_id: formData.medtype_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນປະເພດຢາສຳເລັດແລ້ວ',
        })
      );

      setShow(false);
      await getListCategory();
      reset();

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-strokedark">
      <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <InputBox
          label="ລະຫັດປະເພດ"
          name="medtype_id"
          type="text"
          placeholder="ປ້ອນລະຫັດປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດປະເພດກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ຊື່ປະເພດ"
          name="type_name"
          type="text"
          placeholder="ປ້ອນຊື່ປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ປະເພດກ່ອນ' }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 py-4">
          <ButtonBox
            variant="cancel"
            type="button"
            onClick={handleClearForm}
            disabled={loading}
          >
            ລ້າງຂໍ້ມູນ
          </ButtonBox>

          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;

