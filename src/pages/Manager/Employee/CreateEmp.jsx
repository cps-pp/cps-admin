import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import { useAppDispatch } from '@/redux/hook';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { openAlert } from '@/redux/reducer/alert';
import DatePicker from '@/components/DatePicker_two';
import InputBox from '../../../components/Forms/Input_new';
import SelectBox from '../../../components/Forms/Select';
import ButtonBox from '../../../components/Button';
import BoxDate from '../../../components/Date';
import { usePrompt } from '@/hooks/usePrompt';


const CreateEmployee = ({ setShow, getList, existingIds, onCloseCallback }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { isDirty, errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');

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
    reset({
      emp_id: '',
      emp_name: '',
      emp_surname: '',
      dob: '',
      phone: '',
      address: '',
    });
    setGender('');
    setRole('');
    isDirtyRef.current = false;
  };


  const handleSave = async (data) => {
    setLoading(true);

    // เช็คว่ามี emp_id ซ้ำไหม
    if (existingIds.includes(data.emp_id)) {
      setFocus('emp_id');
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
      const response = await fetch('http://localhost:4000/src/manager/emp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role, gender }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ບັນທຶກຂໍ້ມູບໍ່ສຳເລັດ');

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນພະນັກງານສຳເລັດແລ້ວ',
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
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-4"
      >
        <InputBox
          label="ລະຫັດຫມໍ"
          name="emp_id"
          type="text"
          placeholder="ປ້ອນລະຫັດທ່ານຫມໍ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດທ່ານຫມໍກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ຊື່ທ່ານຫມໍ"
          name="emp_name"
          type="text"
          placeholder="ປ້ອນຊຶ່ທ່ານຫມໍ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ທ່ານຫມໍກ່ອນ' }}
          errors={errors}
        />
        <InputBox
          label="ນາມສະກຸນ"
          name="emp_surname"
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
          name="phone"
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
          label="ທີ່ຢູ່"
          name="address"
          type="text"
          placeholder="ປ້ອນທີ່ຢູ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ' }}
          errors={errors}
        />
        <SelectBox
          label="ຕຳແໜ່ງ"
          name="ຕຳແໜ່ງ"
          options={['ທ່ານຫມໍ', 'ຜູ້ຊ່ວຍທ່ານຫມໍ']}
          register={register}
          errors={errors}
          value={role}
          onSelect={(e) => setRole(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-4 col-span-full py-4">
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

export default CreateEmployee;
