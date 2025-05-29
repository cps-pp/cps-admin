import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '../../../components/Forms/Input_new';
import ButtonBox from '../../../components/Button';
import PriceInputBox from '../../../components/Forms/PriceInput';
import { usePrompt } from '@/hooks/usePrompt';

const CreateExChange = ({ setShow, getList, existingIds, onCloseCallback }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

    // เช็คว่ามี ex_id ซ้ำไหม
    if (existingIds.includes(formData.ex_id)) {
      setFocus('ex_id');
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
      const response = await fetch(
        'http://localhost:4000/src/manager/exchange',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ex_id: formData.ex_id,
            ex_type: formData.ex_type,
            ex_rate: formData.ex_rate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTimeout(async () => {
        setShow(false);
        await getList();
        reset();

        dispatch(
          openAlert({
            type: 'success',
            title: 'ສຳເລັດ',
            message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
          }),
        );

        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 gap-4 px-4 pt-4"
      >
        <InputBox
          label="ລະຫັດອັດຕາແລກປ່ຽນ"
          name="ex_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ສະກຸນເງິນ"
          name="ex_type"
          type="text"
          placeholder="ປ້ອນສະກຸນເງິນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນສະກຸນເງິນກ່ອນ' }}
          errors={errors}
        />

        <PriceInputBox
          label="ຈຳນວນເລດ"
          name="ex_rate"
          placeholder="ປ້ອນເລດ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ກະລຸນາປ້ອນເລດກ່ອນ 0' },
          }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
        
          <ButtonBox variant="save" type="submit">
            ບັນທຶກ
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateExChange;

