import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import Select from '@/components/Forms/Select';
import InputBox from '../../../components/Forms/Input_new';
import ButtonBox from '../../../components/Button';
import PriceInputBox from '../../../components/Forms/PriceInput';
import { usePrompt } from '@/hooks/usePrompt';

const CreateSupplier = ({ setShow, getList, existingIds, onCloseCallback }) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty  },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState('');
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextSupplierId, setNextSupplierId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('020'); // ✅ เพิ่ม state สำหรับเบอร์โทร

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

  // ✅ ตั้งค่าเริ่มต้นให้ phone field เมื่อ component โหลด
  useEffect(() => {
    setValue('phone', '020', { shouldValidate: false, shouldDirty: false });
  }, [setValue]);

  // ดึงรหัสถัดไปเมื่อ component โหลด
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/next-supplier-id',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNextSupplierId(data.nextId);
        setValue('sup_id', data.nextId); // ตั้งค่ารหัสในฟอร์ม
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

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // ถ้าผู้ใช้พยายามลบ "020" ให้เซ็ตกลับเป็น "020"
    if (!value.startsWith('020')) {
      value = '020';
    }
    
    // จำกัดให้ป้อนได้แค่ตัวเลข
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // ✅ ตรวจสอบตัวเลขที่ 4 (หลัง 020) ต้องเป็น 2, 5, 7, หรือ 9 เท่านั้น
    if (numericValue.length >= 4) {
      const fourthDigit = numericValue.charAt(3);
      if (!['2', '5', '7', '9'].includes(fourthDigit)) {
        // ถ้าตัวเลขที่ 4 ไม่ถูกต้อง ให้ตัดออก
        return;
      }
    }
    
    // จำกัดความยาวไม่เกิน 11 ตัว (020 + 8 ตัว)
    if (numericValue.length <= 11) {
      setPhoneNumber(numericValue);
      // ✅ อัพเดทค่าใน react-hook-form ด้วย
      setValue('phone', numericValue, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleSave = async (formData) => {
    setLoading(true);

    // เช็คว่ามี sup_id ซ้ำไหม
    if (existingIds.includes(formData.sup_id)) {
      setFocus('sup_id');
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
      const response = await fetch('http://localhost:4000/src/manager/supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sup_id: formData.sup_id,
          company_name: formData.company_name,
          address: formData.address,
          phone: formData.phone,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນຜູ້ສະໜອງສຳເລັດແລ້ວ',
        })
      );

      setShow(false);
      await getList();
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

  if (loading || loadingNextId) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">

        {/* แสดงรหัสที่สร้างอัตโนมัติ (แบบ read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ລະຫັດຜູ້ສະໜອງ
          </label>
          <input
            type="text"
            value={nextSupplierId}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('sup_id')} />
        </div>
       
        <InputBox
          label="ຊື່ບໍລິສັດ"
          name="company_name"
          type="text"
          placeholder="ປ້ອນຊື່ບໍລິສັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ບໍລິສັດກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ທີ່ຢູ່"
          name="address"
          type="text"
          placeholder="ປ້ອນທີ່ຢູ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ' }}
          errors={errors}
        />
        
        {/* ✅ Custom Phone Input with 020 prefix - แทนที่ PriceInputBox */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ເບີຕິດຕໍ່
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="0202xxxxxxx, 0205xxxxxxx, 0207xxxxxxx, 0209xxxxxxx"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {/* Hidden input for form validation */}
          <input
            type="hidden"
            {...register('phone', {
              required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ',
              validate: {
                validLength: (value) => {
                  if (value.length !== 11) {
                    return 'ເບີຕິດຕໍ່ຕ້ອງມີ 11 ຕົວເລກ (020 + 8 ຕົວເລກ)';
                  }
                  return true;
                },
                startsWithPrefix: (value) => {
                  if (!value.startsWith('020')) {
                    return 'ເບີຕິດຕໍ່ຕ້ອງເລີ່ມຕົ້ນດ້ວຍ 020';
                  }
                  return true;
                },
                // ✅ เพิ่มการตรวจสอบตัวเลขที่ 4
                validFourthDigit: (value) => {
                  if (value.length >= 4) {
                    const fourthDigit = value.charAt(3);
                    if (!['2', '5', '7', '9'].includes(fourthDigit)) {
                      return 'ຕົວເລກທີ 4 ຕ້ອງເປັນ 2, 5, 7, ຫຼື 9 ເທົ່ານັ້ນ';
                    }
                  }
                  return true;
                }
              }
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <Select
          label="ສະຖານນະ"
          name="status"
          options={['ເປີດ', 'ປິດ']}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => {
            setStatus(e.target.value);
            setValue('status', e.target.value);
          }}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          

          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplier;
