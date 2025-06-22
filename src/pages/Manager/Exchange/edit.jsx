import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import PriceInput from '@/components/Forms/PriceInput';
import BoxDate from '../../../components/Date';

const EditExChange = ({ id, onClose, setShow, getList }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [hasDateChanged, setHasDateChanged] = useState(false); // ✅ เพิ่มตัวแปรนี้
  const dispatch = useAppDispatch();

  // ✅ ตั้งค่าวันที่เริ่มต้น
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setValue('ex_date', formattedDate);
  }, [setValue]);

  // ✅ ดึงข้อมูลมาแสดง
  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/src/manager/exchange/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('ex_type', data.data.ex_type);
        setValue('ex_rate', data.data.ex_rate);
        setValue('ex_date', data.data.ex_date);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      }
    };

    fetchListData();
  }, [id, setValue]);

  // ✅ บันทึกข้อมูล
  const handleSave = async (formData) => {
    setLoading(true);
    try {
      let finalDate = formData.ex_date;
      if (!hasDateChanged) {
        const today = new Date();
        finalDate = today.toISOString().split('T')[0];
      }

      const response = await fetch(
        `http://localhost:4000/src/manager/exchange/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ex_type: formData.ex_type,
            ex_rate: parseFloat(formData.ex_rate),
            ex_date: finalDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ແກ້ໄຂສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນອັດຕາແລກປ່ຽນສຳເລັດແລ້ວ',
        })
      );

      if (getList) getList();
      setShow(false);
    } catch (err) {
      console.error(err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
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
          ແກ້ໄຂ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ສະກຸນເງິນ"
          name="ex_type"
          type="text"
          placeholder="ປ້ອນສະກຸນເງິນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນສະກຸນເງິນກ່ອນ' }}
          errors={errors}
        />

        <PriceInput
          label="ລາຄາ"
          name="ex_rate"
          register={register}
          defaultValue={getValues('ex_rate')}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />

        <BoxDate
          name="ex_date"
          label="ວັນທີ"
          register={register}
          errors={errors}
          setValue={setValue}
          select={getValues('ex_date')}
          className="text-strokedark dark:text-bodydark3"
          onChange={() => setHasDateChanged(true)} // ✅ เมื่อมีการเปลี่ยนวันที่
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditExChange;
