import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { openAlert } from '@/redux/reducer/alert';
import DatePicker from '@/components/DatePicker_two';
import InputBox from '../../../components/Forms/Input_new';
import SelectBox from '../../../components/Forms/Select';
import ButtonBox from '../../../components/Button';
<<<<<<< HEAD
import BoxDate from '../../../components/Date';
=======
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b

const CreateEmployee = ({ setShow, getList }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message = 'ທ່ານຍັງບໍ່ໄດ້ບັນທຶກຂໍ້ມູນ. ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ຫຼືບໍ?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async (data) => {
    setLoading(true);
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
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
