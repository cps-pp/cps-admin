import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '@/components/Forms/Input';
import DatePicker from '@/components/DatePicker_two';
import Select from '@/components/Forms/Select';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import Loader from '@/common/Loader';
import InputBox from '../../../components/Forms/Input_new';
import SelectBox from '../../../components/Forms/Select';
import ButtonBox from '../../../components/Button';
import BoxDate from '../../../components/Date';

const EditPatient = ({ id, onClose, setShow, getList }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      patient_id: '',
      patient_name: '',
      patient_surname: '',
      gender: '',
      dob: '',
      phone1: '',
      phone2: '',
      village: '',
      district: '',
      province: '',
    },
  });

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [gender, setGender] = useState('');
  
  // ✅ เพิ่ม state สำหรับเบอร์โทร
  const [phoneNumber1, setPhoneNumber1] = useState('020');
  const [phoneNumber2, setPhoneNumber2] = useState('020');

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร 1
  const handlePhone1Change = (e) => {
    let value = e.target.value;
    
    // ถ้าผู้ใช้พยายามลบ "020" ให้เซ็ตกลับเป็น "020"
    if (!value.startsWith('020')) {
      value = '020';
    }
    
    // จำกัดให้ป้อนได้แค่ตัวเลข
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // ตรวจสอบว่าหลัง 020 ตัวที่ 4 ต้องเป็น 2, 5, 7, 9
    if (numericValue.length >= 4) {
      const fourthDigit = numericValue[3];
      if (!['2', '5', '7', '9'].includes(fourthDigit)) {
        return; // ไม่อัพเดทถ้าตัวที่ 4 ไม่ใช่ 2, 5, 7, 9
      }
    }
    
    // จำกัดความยาวไม่เกิน 11 ตัว (020 + 8 ตัว)
    if (numericValue.length <= 11) {
      setPhoneNumber1(numericValue);
      // ✅ อัพเดทค่าใน react-hook-form ด้วย
      setValue('phone1', numericValue, { shouldValidate: true, shouldDirty: true });
    }
  };

  // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงเบอร์โทร 2
  const handlePhone2Change = (e) => {
    let value = e.target.value;
    
    // ถ้าผู้ใช้พยายามลบ "020" ให้เซ็ตกลับเป็น "020"
    if (!value.startsWith('020')) {
      value = '020';
    }
    
    // จำกัดให้ป้อนได้แค่ตัวเลข
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // ตรวจสอบว่าหลัง 020 ตัวที่ 4 ต้องเป็น 2, 5, 7, 9
    if (numericValue.length >= 4) {
      const fourthDigit = numericValue[3];
      if (!['2', '5', '7', '9'].includes(fourthDigit)) {
        return; // ไม่อัพเดทถ้าตัวที่ 4 ไม่ใช่ 2, 5, 7, 9
      }
    }
    
    // จำกัดความยาวไม่เกิน 11 ตัว (020 + 8 ตัว)
    if (numericValue.length <= 11) {
      setPhoneNumber2(numericValue);
      // ✅ อัพเดทค่าใน react-hook-form ด้วย
      setValue('phone2', numericValue, { shouldValidate: true, shouldDirty: true });
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) {
        console.error('Patient ID is undefined');
        return;
      }
      try {
        const response = await fetch(`http://localhost:4000/src/manager/patient/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        reset(result.data);
        setGender(result.data.gender);
        
        // ✅ จัดการเบอร์โทรพิเศษ - ถ้าไม่ขึ้นต้นด้วย 020 ให้เติม 020 ให้
        let phone1Value = result.data.phone1 || '020';
        if (!phone1Value.startsWith('020')) {
          phone1Value = '020' + phone1Value;
        }
        setPhoneNumber1(phone1Value);
        setValue('phone1', phone1Value);

        let phone2Value = result.data.phone2 || '020';
        if (!phone2Value.startsWith('020')) {
          phone2Value = '020' + phone2Value;
        }
        setPhoneNumber2(phone2Value);
        setValue('phone2', phone2Value);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ດາວໂຫລດຂໍ້ມູນບໍ່ສຳເລັດ',
            message: 'ບໍ່ສາມາດສະແດງຂໍ້ມູນຂອງຄົນເຈັບໄດ້',
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, reset, fetching, dispatch, setValue]);

  useEffect(() => {
    if (gender) {
      setValue('gender', gender);
    }
  }, [gender, setValue]);

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/src/manager/patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Status ${res.status}`);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ແກ້ໄຂສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນຄົນເຈັບສຳເລັດແລ້ວ',
        }),
      );

      if (getList) getList();
      setShow(false);
    } catch (err) {
      console.error(err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜຶດພາດໃນການບັນທືກຂໍ້ມູນ',
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

     <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-4 px-4"

      >
       
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
          name="gender"
          options={['ຊາຍ', 'ຍິງ']}
          register={register}
          errors={errors}
          value={gender}
          onSelect={(e) => setGender(e.target.value)}

        />

        <BoxDate
          name="dob"
          label="ວັນເດືອນປີເກີດ"
          register={register}
          errors={errors}
          setValue={setValue}
          select={getValues('dob')}
          className="text-strokedark dark:text-bodydark3"


        />

        {/* ✅ Custom Phone1 Input with 020 prefix */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ເບີຕິດຕໍ່ 1
          </label>
          <input
            type="tel"
            value={phoneNumber1}
            onChange={handlePhone1Change}
            placeholder="0202xxxxxxx, 0205xxxxxxx, 0207xxxxxxx, 0209xxxxxxx"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {/* Hidden input for form validation */}
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
                    const fourthDigit = value[3];
                    if (!['2', '5', '7', '9'].includes(fourthDigit)) {
                      return 'ຫລັງ 020 ຕ້ອງຕາມດ້ວຍ 2, 5, 7, ຫຼື 9';
                    }
                  }
                  return true;
                }
              }
            })}
          />
          {errors.phone1 && (
            <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>
          )}
        </div>

        {/* ✅ Custom Phone2 Input with 020 prefix */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ເບີຕິດຕໍ່ 2
          </label>
          <input
            type="tel"
            value={phoneNumber2}
            onChange={handlePhone2Change}
            placeholder="0202xxxxxxx, 0205xxxxxxx, 0207xxxxxxx, 0209xxxxxxx"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                    return 'ເບີຕິດຕໍ່ຕ້ອງເລີ່ມຕົ້ນດ້ອຍ 020';
                  }
                  return true;
                },
                validFourthDigit: (value) => {
                  if (value.length >= 4) {
                    const fourthDigit = value[3];
                    if (!['2', '5', '7', '9'].includes(fourthDigit)) {
                      return 'ຫລັງ 020 ຕ້ອງຕາມດ້ວຍ 2, 5, 7, ຫຼື 9';
                    }
                  }
                  return true;
                }
              }
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

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
      
          <ButtonBox variant="save" type="submit">
            ບັນທຶກ
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;

