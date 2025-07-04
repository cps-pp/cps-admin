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
  const [currencyType, setCurrencyType] = useState(''); // เก็บค่า ex_type สำหรับแสดง
  const dispatch = useAppDispatch();

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
        
        // เก็บค่า ex_type สำหรับแสดงเท่านั้น (ไม่ให้แก้ไข)
        setCurrencyType(data.data.ex_type);
        setValue('ex_rate', data.data.ex_rate);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange data:', error);
        setLoading(false);
      }
    };

    fetchListData();
  }, [id, setValue]);

  // ✅ บันทึกข้อมูล
  const handleSave = async (formData) => {
    setLoading(true);
    try {
      // ใช้วันที่ปัจจุบันเสมอ
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];

      const response = await fetch(
        `http://localhost:4000/src/manager/exchange/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ex_type: currencyType, // ใช้ค่าเดิมที่ล็อกไว้
            ex_rate: parseFloat(formData.ex_rate),
            ex_date: currentDate, // ใช้วันที่ปัจจุบันเสมอ
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
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-strokedark ">
            ສະກຸນເງິນ
          </label>
          <div className="w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white">
            {currencyType}
          </div>
        </div>

        <PriceInput
          label="ແກ້ໄຂຈຳນວນເລດ"
          name="ex_rate"
          register={register}
          defaultValue={getValues('ex_rate')}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
          className="text-secondary font-semibold"
        />

        <div className="mb-4 mt-2">
          <label className="mb-1 block text-sm font-medium text-strokedark ">
            ວັນທີ
          </label>
          <div className="w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white">
            {new Date().toLocaleDateString('en-GB')}
          </div>
          <p className="mt-3 text-sm text-gray-500">
           <span className="text-red-500">*</span> ລະບົບຈະໃຊ້ວັນທີປັດຈຸບັນໂດຍອັດຕະໂນມັດ
          </p>
        </div>

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