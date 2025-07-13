import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input';
import DatePicker from '@/components/DatePicker_two';
import Select from '@/components/Forms/Select';
import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import InputBox from '../../../components/Forms/Input_new';
import SelectBox from '../../../components/Forms/Select';
import ButtonBox from '../../../components/Button';
import BoxDate from '../../../components/Date';
import { usePrompt } from '@/hooks/usePrompt';

const CreatePatient = ({
  setShow,
  getList,
  existingIds,
  existingPhones1,
  existingPhones2,
  onCloseCallback,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextPatientId, setNextPatientId] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('020'); // ✅ เพิ่ม state สำหรับเบอร์โทร 1
  const [phoneNumber2, setPhoneNumber2] = useState('020'); // ✅ เพิ่ม state สำหรับเบอร์โทร 2

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    watch,
    formState: { isDirty, errors },
  } = useForm();
  const dob = watch('dob');

  // ✅ ใช้ useRef เพื่อเก็บ current value ของ isDirty
  const isDirtyRef = useRef(isDirty);

  // ✅ อัพเดต ref ทุกครั้งที่ isDirty เปลี่ยน
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // ✅ เตือนเมื่อมีการพยายามออกจากหน้าด้วย navigation (Back / เปลี่ยน route)
  usePrompt(
    'ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.',
    isDirty,
  );

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
      const confirmLeave = window.confirm(
        'ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ',
      );
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

  // ✅ แก้ไข useEffect สำหรับตั้งค่าเริ่มต้น
  useEffect(() => {
    setValue('phone1', '020', { shouldValidate: false, shouldDirty: false });
    setValue('phone2', '020', { shouldValidate: false, shouldDirty: false });
    // ✅ ตั้งค่า local state ให้ตรงกับ form
    setPhoneNumber1('020');
    setPhoneNumber2('020');
  }, [setValue]);

  const [gender, setGender] = useState('');

  // ดึงรหัสถัดไปเมื่อ component โหลด
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/next-patient-id',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNextPatientId(data.nextId);
        setValue('patient_id', data.nextId); // ตั้งค่ารหัสในฟอร์ม
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

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร 1 - แก้ไขแล้ว
  const handlePhone1Change = (e) => {
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
        // ✅ ถ้าตัวเลขที่ 4 ไม่ถูกต้อง ให้ใช้ค่าเดิมแทน (ไม่อัพเดท state)
        return;
      }
    }

    // จำกัดความยาวไม่เกิน 11 ตัว (020 + 8 ตัว)
    if (numericValue.length <= 11) {
      setPhoneNumber1(numericValue); // ✅ แก้ไขชื่อ state ให้ถูกต้อง
      // ✅ อัพเดทค่าใน react-hook-form ด้วย
      setValue('phone1', numericValue, {
        shouldValidate: true,
        shouldDirty: true,
      }); // ✅ แก้ไขชื่อ field
    }
  };

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร 2 - แก้ไขแล้ว
  const handlePhone2Change = (e) => {
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
        // ✅ ถ้าตัวเลขที่ 4 ไม่ถูกต้อง ให้ใช้ค่าเดิมแทน (ไม่อัพเดท state)
        return;
      }
    }

    // จำกัดความยาวไม่เกิน 11 ตัว (020 + 8 ตัว)
    if (numericValue.length <= 11) {
      setPhoneNumber2(numericValue); // ✅ แก้ไขชื่อ state ให้ถูกต้อง
      // ✅ อัพเดทค่าใน react-hook-form ด้วย
      setValue('phone2', numericValue, {
        shouldValidate: true,
        shouldDirty: true,
      }); // ✅ แก้ไขชื่อ field
    }
  };

  const handleSave = async (data) => {
    setLoading(true);

    if (existingIds.includes(data.patient_id)) {
      setFocus('patient_id'); // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລະຫັດຄົນເຈັບ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false); // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ
    } else if (existingPhones1.includes(data.phone1)) {
      setFocus('phone1'); // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ເບີໂທນີ້ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false); // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ
    } else if (existingPhones2.includes(data.phone2)) {
      setFocus('phone2'); // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ເບີໂທນີ້ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false); // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ
    } else if (data.phone1 === data.phone2) {
      setFocus('phone2'); // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ກະລຸໃສເບີໂທບໍ່ໃຫ້ຊຳ້ກັນ',
        }),
      );
      setLoading(false); // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ
    }

    try {
      const response = await fetch(
        'http://localhost:4000/src/manager/patient',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, gender }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ບັນທືກບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທືກຂໍ້ມູນສຳເລັດແລ້ວ',
        }),
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
        }),
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

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        <div className="">
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            ລະຫັດຄົນເຈັບ
          </label>
          <input
            type="text"
            value={nextPatientId}
            readOnly
            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('patient_id')} />
        </div>

        <InputBox
          label="ຊື່ຄົນເຈັບ"
          name="patient_name"
          type="text"
          placeholder="ປ້ອນຊຶ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຄົນເຈັບກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ນາມສະກຸນ"
          name="patient_surname"
          type="text"
          placeholder="ນາມສະກຸນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນນາມສະກຸນກ່ອນ' }}
          errors={errors}
        />

        <SelectBox
          label="ເພດ"
          name="ເພດ"
          options={['ຊາຍ', 'ຍິງ']}
          register={register}
          errors={errors}
          value={gender}
          onSelect={(e) => setGender(e.target.value)}
        />

        <BoxDate
          select={dob}
          register={register}
          errors={errors}
          name="dob"
          label="ວັນເດືອນປິເກີດ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນເດືອນປີເກີດ' }}
          setValue={setValue}
        />

        <div className="">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ເບີຕິດຕໍ່ 1
          </label>
          <input
            type="tel"
            value={phoneNumber1}
            onChange={handlePhone1Change}
            placeholder="0202xxxxxxx, 0205xxxxxxx, 0207xxxxxxx, 0209xxxxxxx"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <input
            type="hidden"
            {...register('phone1', {
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
                validFourthDigit: (value) => {
                  if (value.length >= 4) {
                    const fourthDigit = value.charAt(3);
                    if (!['2', '5', '7', '9'].includes(fourthDigit)) {
                      return 'ຕົວເລກທີ 4 ຕ້ອງເປັນ 2, 5, 7, ຫຼື 9 ເທົ່ານັ້ນ';
                    }
                  }
                  return true;
                },
              },
            })}
          />
          {errors.phone1 && (
            <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>
          )}
        </div>

        <div className="">
          <label className="block text-sm font-medium mb-2 text-black">
            ເບີຕິດຕໍ່ 2
          </label>
          <input
            type="tel"
            value={phoneNumber2}
            onChange={handlePhone2Change}
            placeholder="0202xxxxxxx, 0205xxxxxxx, 0207xxxxxxx, 0209xxxxxxx"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {/* Hidden input for form validation */}
          <input
            type="hidden"
            {...register('phone2', {
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
                validFourthDigit: (value) => {
                  if (value.length >= 4) {
                    const fourthDigit = value.charAt(3);
                    if (!['2', '5', '7', '9'].includes(fourthDigit)) {
                      return 'ຕົວເລກທີ 4 ຕ້ອງເປັນ 2, 5, 7, ຫຼື 9 ເທົ່ານັ້ນ';
                    }
                  }
                  return true;
                },
              },
            })}
          />
          {errors.phone2 && (
            <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>
          )}
        </div>

        <InputBox
          label="ບ້ານ"
          name="village"
          type="text"
          placeholder="ບ້ານ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນບ້ານກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ເມືອງ"
          name="district"
          type="text"
          placeholder="ເມືອງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນເມືອງກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ແຂວງ"
          name="province"
          type="text"
          placeholder="ແຂວງ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນແຂວງກ່ອນ' }}
          errors={errors}
        />

        <div className=" flex justify-end space-x-4 col-span-full py-4">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;
