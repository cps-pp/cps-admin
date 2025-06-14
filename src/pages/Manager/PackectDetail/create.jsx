import React, { useState, useEffect, useRef } from 'react'; 
import { useForm } from 'react-hook-form';
import ButtonBox from '../../../components/Button';
import InputBox from '../../../components/Forms/Input_new';
import PriceInputBox from '../../../components/Forms/PriceInput';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import { usePrompt } from '@/hooks/usePrompt';

const CreateServiceList = ({ setShow, getList, existingIds = [], onCloseCallback }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      ser_id: '',
      ser_name: '',
      price: '',
      ispackage: 'PACKAGE' // ตั้งค่าเป็น PACKAGE เสมอ
    }
  });
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextServiceId, setNextServiceId] = useState('');

  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  usePrompt('ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.', isDirty);

  // ดึงรหัสถัดไปเมื่อ component โหลด
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch('http://localhost:4000/src/manager/servicelist/next-package-id');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setNextServiceId(data.nextId);
        setValue('ser_id', data.nextId); // ตั้งค่ารหัสในฟอร์ม
        
      } catch (error) {
        console.error('Error fetching next ID:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງລະຫັດໃໝ່ໄດ້',
          })
        );
      } finally {
        setLoadingNextId(false);
      }
    };

    fetchNextId();
  }, [dispatch, setValue]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleCloseForm = () => {
    if (isDirtyRef.current) {
      const confirmLeave = window.confirm('ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ');
      if (!confirmLeave) return;
    }
    setShow(false);
  };

  useEffect(() => {
    if (onCloseCallback) {
      onCloseCallback(() => handleCloseForm);
    }
  }, [onCloseCallback]);

  const handleSave = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/src/manager/servicelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ser_id: formData.ser_id,
          ser_name: formData.ser_name,
          price: formData.price,
          ispackage: 'PACKAGE', // บีบบังคับให้เป็น PACKAGE เสมอ
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setShow(false);
      await getList();
      reset();
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນແພັກເກັດສຳເລັດແລ້ວ',
        })
      );
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

  if (loading || loadingNextId) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ເພີ່ມແພັກເກັດບໍລິການ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="grid grid-cols-1 gap-4 mt-4 px-4">
        
        {/* แสดงรหัสที่สร้างอัตโนมัติ (แบบ read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ລະຫັດແພັກເກັດ
          </label>
          <input
            type="text"
            value={nextServiceId}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('ser_id')} />
        </div>

        <InputBox
          label="ຊື່แພັກເກັດ"
          name="ser_name"
          type="text"
          placeholder="ປ້ອນຊື່แພັກເກັດບໍລິການ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່แພັກເກັດກ່ອນ' }}
          errors={errors}
        />

        <PriceInputBox
          label="ລາຄາ"
          name="price"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />

        {/* แสดงประเภทแบบ read-only */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ປະເພດ
          </label>
          <input
            type="text"
            value="ແພັກເກັດດັດແຂ້ວ"
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('ispackage')} />
        </div>

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateServiceList;