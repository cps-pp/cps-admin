import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input';
import DatePicker from '@/components/DatePicker_two';
import SelectID from '@/components/Forms/SelectID';
import Select from '@/components/Forms/Select';
import PriceInput from '@/components/Forms/PriceInput';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '../../../components/Forms/Input_new';
import PriceInputBox from '../../../components/Forms/PriceInput';
import SelectBox from '../../../components/Forms/Select';
import SelectBoxId from '../../../components/Forms/SelectID';
import ButtonBox from '../../../components/Button';
import BoxDate from '../../../components/Date';
import { usePrompt } from '@/hooks/usePrompt';

const CreateMedicines = ({
  setShow,
  getList,
  existingIds,
  onCloseCallback,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [selectEmpCreate, setSelectEmpCreate] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');

  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMedType, setSelectedMedType] = useState('');
  const [status, setStatus] = useState(''); // เก็บไว้แต่ไม่ส่งไป backend

  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextMedicinesId, setNextMedicinesId] = useState('');


  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  usePrompt(
    'ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.',
    isDirty,
  );


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


  // ดึงข้อมูลหมวดหมู่ยา
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/manager/category',
        );
        const data = await response.json();
        if (response.ok) {
          console.log('Categories loaded:', data.data);
          setCategories(
            data.data.map((cat) => ({
              medtype_id: cat.medtype_id,
              type_name: cat.type_name,
            })),
          );
        } else {
          console.error('Failed to fetch categories', data);
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນປະເພດຢາໄດ້',
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching categories', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີຟເວີ',
          }),
        );
      }
    };
    fetchCategories();
  }, [dispatch]);

  // ดึงข้อมูลพนักงาน
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await fetch('http://localhost:4000/src/manager/emp');
        const data = await response.json();
        if (response.ok) {
          console.log('Employees loaded:', data.data);
          setEmployees(
            data.data.map((em) => ({
              id: em.emp_id,
              name: em.emp_name,
              surname: em.emp_surname,
              role: em.role,
            })),
          );
        } else {
          console.error('Failed to fetch employees', data);
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້',
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching employees', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີຟເວີ',
          }),
        );
      }
    };
    fetchEmp();
  }, [dispatch]);

  // ตั้งค่าวันที่ปัจจุบัน
  useEffect(() => {
    const now = new Date().toISOString().split('T')[0];
    setValue('created_at', now);
  }, [setValue]);

  // ดึงรหัสถัดไป
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/next-medicines-id',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Next ID received:', data.nextId);
        setNextMedicinesId(data.nextId);
        setValue('med_id', data.nextId);
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

  const handleSave = async (formData) => {
    console.log('Form data received:', formData);
    
    setLoading(true);

    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData.med_id || !formData.med_name || !formData.qty || !formData.unit || !formData.price) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      if (!selectedMedType) {
        throw new Error('กรุณาเลือกประเภทยา');
      }

      if (!selectEmpCreate) {
        throw new Error('กรุณาเลือกพนักงานผู้สร้าง');
      }

      // เช็คว่ามี med_id ซ้ำไหม (ถ้ามี existingIds)
      if (existingIds && existingIds.includes(formData.med_id)) {
        setFocus('med_id');
        throw new Error('ລະຫັດຢານີ້มີໃນລະບົບແລ້ວ');
      }

      // เตรียมข้อมูลส่ง - ไม่ส่ง status เพราะ backend จะคำนวณเอง
      const dataToSend = {
        med_id: formData.med_id,
        med_name: formData.med_name.trim(),
        qty: parseInt(formData.qty) || 0,
        unit: formData.unit.trim(),
        price: parseFloat(formData.price) || 0,
        expired: formData.expired || null,
        medtype_id: selectedMedType,
        emp_id_create: selectEmpCreate,
        created_at: formData.created_at,
      };

      console.log('Data to send:', dataToSend);

      // ส่งข้อมูลไป backend
      const response = await fetch(
        'http://localhost:4000/src/manager/medicines',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataToSend),
        },
      );

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        // จัดการข้อผิดพาดจาก server
        let errorMessage = 'ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ';
        
        if (result.error) {
          errorMessage = result.error;
        } else if (result.details) {
          errorMessage = result.details;
        }
        
        throw new Error(errorMessage);
      }

      // สำเร็จ
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
        }),
      );

      // รีเฟรชรายการและปิดฟอร์ม
      if (getList) {
        await getList();
      }
      
      // รีเซ็ตฟอร์ม
        reset();
      setStatus('');
      setSelectedMedType('');
      setSelectEmpCreate('');
      
      // ปิดฟอร์ม
      setShow(false);

    } catch (error) {
      console.error('Save error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
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
          ເພີ່ມຂໍ້ມູນຢາ ແລະ ອຸປະກອນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        {/* แสดงรหัสที่สร้างอัตโนมัติ */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ລະຫັດຢາ ແລະ ອຸປະກອນ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nextMedicinesId}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          <input type="hidden" {...register('med_id')} />
        </div>

        <InputBox
          label="ຊື່ຢາ"
          name="med_name"
          type="text"
          placeholder="ປ້ອນຊື່ຢາ"
          register={register}
          formOptions={{ 
            required: 'ກະລຸນາປ້ອນຊື່ຢາ',
            minLength: { value: 2, message: 'ຊື່ຢາຕ້ອງມີຢ່າງນ້ອຍ 2 ຕົວອັກສອນ' }
          }}
          errors={errors}
        />

        <InputBox
          label="ຈຳນວນ"
          name="qty"
          type="number"
          placeholder="ປ້ອນຈຳນວນ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນຈຳນວນ',
            min: { value: 0, message: 'ຈຳນວນຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບ 0' },
            valueAsNumber: true
          }}
          errors={errors}
        />

        <InputBox
          label="ຫົວໜ່ວຍ"
          name="unit"
          type="text"
          placeholder="ປ້ອນຫົວໜ່ວຍ ເຊັ່ນ: ກັບ, ແຜງ, ຂວດ"
          register={register}
          formOptions={{ 
            required: 'ກະລຸນາປ້ອນຫົວໜ່ວຍ',
            minLength: { value: 1, message: 'ຫົວໜ່ວຍຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວອັກສອນ' }
          }}
          errors={errors}
        />

        <PriceInputBox
          label="ລາຄາຕໍ່ຫົວໜ່ວຍ"
          name="price"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບ 0' },
            valueAsNumber: true
          }}
          errors={errors}
        />


        <BoxDate

          register={register}
          errors={errors}
          name="expired"
          label="ວັນໝົດອາຍຸ"
          formOptions={{ required: false }}
          setValue={setValue}
        />

        <SelectBoxId
          label="ປະເພດຢາ"
          name="medtype_id"
          value={selectedMedType}
          options={categories.map((cat) => ({
            value: cat.medtype_id,
            label: cat.type_name,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => {
            setSelectedMedType(e.target.value);
          }}
        />

        <SelectBoxId
          label="ພະນັກງານ (ຜູ້ສ້າງ)"
          name="emp_id_create"
          value={selectEmpCreate}
          options={employees.map((emp) => ({
            label: `${emp.name} ${emp.surname} - ${emp.role}`,
            value: emp.id,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => {
            setSelectEmpCreate(e.target.value);
          }}
        />

        <BoxDate
          register={register}
          errors={errors}
          name="created_at"
          label="ວັນທີສ້າງ"

          formOptions={{ required: 'ກະລຸນາໃສ່ວັນທີສ້າງ' }}
          setValue={setValue}
        />


        <div className="flex justify-end space-x-4 col-span-full py-4">
      
          
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicines;
