import React, { useState, useEffect, useRef } from 'react'; 
import { useForm } from 'react-hook-form';
import ButtonBox from '../../../components/Button';
import InputBox from '../../../components/Forms/Input_new';
import PriceInputBox from '../../../components/Forms/PriceInput';
import SelectBox from '../../../components/Forms/Select';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import { usePrompt } from '@/hooks/usePrompt';

const CreateServiceList = ({ setShow, getList, existingIds = [], onCloseCallback }) => {
  const { register, handleSubmit, reset, setFocus, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      ser_id: '',
      ser_name: '',
      price: '',
      ispackage: 'NOT' // ตั้งค่าเริ่มต้น
    }
  });
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  // ลบ state ispackage ออก เพราะใช้ react-hook-form ควบคุมแทน
  // const [ispackage, setPack] = useState('NOT');

  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  usePrompt('ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.', isDirty);

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

    if (existingIds.includes(formData.ser_id)) {
      setFocus('ser_id');
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລະຫັດປະເພດຢາ ມີໃນລະບົບແລ້ວ',
        })
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/src/manager/servicelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ser_id: formData.ser_id,
          ser_name: formData.ser_name,
          price: formData.price,
          ispackage: formData.ispackage, // ใช้ค่าจาก formData แทน state
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
          message: 'ບັນທຶກຂໍ້ມູນລາຍການສຳເລັດແລ້ວ',
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

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="grid grid-cols-1 gap-4 mt-4 px-4">
        <InputBox
          label="ລະຫັດ"
          name="ser_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ຊື່ລາຍການ"
          name="ser_name"
          type="text"
          placeholder="ປ້ອນຊື່ລາຍການ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ລາຍການກ່ອນ' }}
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
        
        {/* วิธีที่ 2: หาก SelectBox ยังไม่ทำงาน ให้ใช้ select ธรรมดา */}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ແພັກເກັດ
          </label>
          <select
            {...register('ispackage', { required: 'ກະລຸນາເລືອກປະເພດ' })}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="NOT">NOT </option>
            <option value="PACKAGE">PACKAGE </option>
          </select>
          {errors.ispackage && (
            <p className="text-red-500 text-sm mt-1">{errors.ispackage.message}</p>
          )}
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

