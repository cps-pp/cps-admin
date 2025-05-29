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



const CreatePatient = ({ setShow, getList, existingIds, existingPhones1, existingPhones2, onCloseCallback }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { isDirty, errors },
  } = useForm();

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

  const [gender, setGender] = useState('');

  const handleSave = async (data) => {
    setLoading(true);

    if (existingIds.includes(data.patient_id)) {
      setFocus('patient_id');  // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລະຫັດຄົນເຈັບ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false);  // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ

    } else if (existingPhones1.includes(data.phone1)) {
      setFocus('phone1');  // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ເບີໂທນີ້ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false);  // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ

    } else if (existingPhones2.includes(data.phone2)) {
      setFocus('phone2');  // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ເບີໂທນີ້ ມີໃນລະບົບແລ້ວ',
        }),
      );
      setLoading(false);  // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
      return; // หยุดการดำเนินการ

    } else if (data.phone1 === data.phone2) {
      setFocus('phone2');  // โฟกัสที่ช่องรหัสคนเจ็บ
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ກະລຸໃສເບີໂທບໍ່ໃຫ້ຊຳ້ກັນ',
        }),
      );
      setLoading(false);  // 🛑 เพิ่มตรงนี้ เพื่อให้โหลดหยุดและฟอร์มยังคงอยู่
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        <InputBox
          label="ລະຫັດຄົນເຈັບ"
          name="patient_id"
          type="text"
          placeholder="ປ້ອນລະຫັດຄົນເຈັບ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດຄົນເຈັບກ່ອນ' }}
          errors={errors}
        />
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
          select=""
          register={register}
          errors={errors}
          name="dob"
          label="ວັນເດືອນປິເກີດ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນເດືອນປີເກີດ' }}
          setValue={setValue}
        />
        <InputBox
          label="ເບີຕິດຕໍ່"
          name="phone1"
          type="tel"
          placeholder="ປ້ອນເບີຕິດຕໍ່"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ',
            pattern: {
              value: /^[0-9]+$/,
              message: 'ເບີຕິດຕໍ່ຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ',
            },
            minLength: {
              value: 8,
              message: 'ເບີຕິດຕໍ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວເລກ',
            },
          }}
          errors={errors}
        />
        <InputBox
          label="ເບີຕິດຕໍ່"
          name="phone2"
          type="tel"
          placeholder="ປ້ອນເບີຕິດຕໍ່"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນເບີຕິດຕໍ່ກ່ອນ',
            pattern: {
              value: /^[0-9]+$/,
              message: 'ເບີຕິດຕໍ່ຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ',
            },
            minLength: {
              value: 8,
              message: 'ເບີຕິດຕໍ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວເລກ',
            },
          }}
          errors={errors}
        />
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

        <div className="mt-4 flex justify-end space-x-4 col-span-full py-4">

          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;
