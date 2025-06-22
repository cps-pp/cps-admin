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
import BoxDate from '../../../components/Date';

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
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextExchangeId, setNextExchangeId] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // ✅ ใช้ useRef เพื่อเก็บ current value ของ isDirty

  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  usePrompt(
    'ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.',
    isDirty,
  );

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

  const handleCloseForm = () => {
    if (isDirtyRef.current) {
      const confirmLeave = window.confirm(
        'ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ',
      );
      if (!confirmLeave) return;
    }
    setShow(false);
  };

  useEffect(() => {
    if (onCloseCallback) {
      onCloseCallback(() => handleCloseForm);
    }
  }, [onCloseCallback]);

  // ✅ ตั้งค่าวันที่ปัจจุบัน
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // รูปแบบ YYYY-MM-DD
    setCurrentDate(formattedDate);
    setValue('ex_date', formattedDate); // ตั้งค่าวันที่ในฟอร์ม
  }, [setValue]);

  // ดึงรหัสถัดไปเมื่อ component โหลด
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/next-exchange-id',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNextExchangeId(data.nextId);
        setValue('ex_id', data.nextId); // ตั้งค่ารหัสในฟอร์ม
      } catch (error) {
        console.error('Error fetching next ID:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງລະຫັດໃໝ່ໄດ້',
          }),
        );
      } finally {
        setLoadingNextId(false);
      }
    };

    fetchNextId();
  }, [dispatch, setValue]);

  const handleSave = async (formData) => {
    setLoading(true);

    if (existingIds.includes(formData.ex_id)) {
      setFocus('ex_id');
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລະຫັດອັດຕາແລກປ່ຽນນີ້ ມີໃນລະບົບແລ້ວ ກະລຸນາປ້ອນໃຫ່ມ',
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
            ex_date: formData.ex_date,
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
          message: 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
      );
    }
  };

  if (loading || loadingNextId) return <Loader />;

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
        {/* แสดงรหัสที่สร้างอัตโนมัติ (แบบ read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ລະຫັດອັດຕາແລກປ່ຽນ
          </label>
          <input
            type="text"
            value={nextExchangeId}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('ex_id')} />
        </div>

        
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
        <BoxDate
          select=""
          register={register}
          errors={errors}
          name="ex_date"
          label="ວັນເດືອນປິເກີດ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນເດືອນປີເກີດ' }}
          setValue={setValue}
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
