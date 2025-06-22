import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import Select from '@/components/Forms/Select';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';

const EditSupplier = ({ id, onClose, setShow, getList }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('020'); // ✅ เพิ่ม state สำหรับเบอร์โทร

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message =
          'ທ່ານຍັງບໍ່ໄດ້ບັນທຶກຂໍ້ມູນ. ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ຫຼືບໍ?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // ถ้าผู้ใช้พยายามลบ "020" ให้เซ็ตกลับเป็น "020"
    if (!value.startsWith('020')) {
      value = '020';
    }
    
    // จำกัดให้ป้อนได้แค่ตัวเลข
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // ตรวจสอบตัวเลขตัวที่ 4 (หลัง 020) ต้องเป็น 2, 5, 7, หรือ 9
    if (numericValue.length > 3) {
      const fourthDigit = numericValue[3];
      const validStarters = ['2', '5', '7', '9'];
      
      if (!validStarters.includes(fourthDigit)) {
        // ถ้าตัวเลขตัวที่ 4 ไม่ถูกต้อง ให้คงค่าเดิมไว้
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

  useEffect(() => {
    const fetchSupplierData = async () => {
      
      try {
        const response = await fetch(`http://localhost:4000/src/manager/supplier/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setValue('company_name', data.data.company_name);
        setValue('address', data.data.address);
        setStatus(data.data.status || '');
        setValue('status', data.data.status);

        // ✅ จัดการเบอร์โทรพิเศษ - ถ้าไม่ขึ้นต้นด้วย 020 ให้เติม 020 ให้
        let phoneValue = data.data.phone || '020';
        if (!phoneValue.startsWith('020')) {
          phoneValue = '020' + phoneValue;
        }
        setPhoneNumber(phoneValue);
        setValue('phone', phoneValue);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: error.message || 'ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
          }),
        );
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [id, setValue, fetching, navigate, dispatch]);

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/src/manager/supplier/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          title: 'ແກ້ໄຂສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນຜູ້ສະໜອງສຳເລັດແລ້ວ',
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
          ແກ້ໄຂຂໍ້ມູນ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ຊື່ບໍລິສັດ"
          name="company_name"
          type="text"
          placeholder="ປ້ອນຊື່ບໍລິສັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ບໍລິສັດກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ທີ່ຢູ່"
          name="address"
          type="text"
          placeholder="ປ້ອນທີ່ຢູ່"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ' }}
          errors={errors}
        />
        
        {/* ✅ Custom Phone Input with 020 prefix and digit validation */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ເບີຕິດຕໍ່
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="020xxxxxxxx (ຕົວເລກທີ 4 ຕ້ອງເປັນ 2, 5, 7, ຫຼື 9)"
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
                validFourthDigit: (value) => {
                  if (value.length >= 4) {
                    const fourthDigit = value[3];
                    const validStarters = ['2', '5', '7', '9'];
                    if (!validStarters.includes(fourthDigit)) {
                      return 'ຕົວເລກທີ 4 ຫຼັງຈາກ 020 ຕ້ອງເປັນ 2, 5, 7, ຫຼື 9';
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
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplier;
