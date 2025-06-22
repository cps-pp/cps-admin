import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import BoxDate from '../../components/Date';
import InputBox from '../../components/Forms/Input_new';
import SelectBoxId from '../../components/Forms/SelectID';
import ButtonBox from '../../components/Button';
import { usePrompt } from '@/hooks/usePrompt';

const OrderCreate = ({ setShow, getList, existingIds, onCloseCallback }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setFocus,
    formState: { isDirty, errors },
  } = useForm();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [emp, setEmp] = useState('');
  const [sup, setSup] = useState('');
  const [med, setMed] = useState('');
  const [selectMed, setSelectMed] = useState('');
  const [selectSup, setSelectSup] = useState('');
  const [selectEmpCreate, setSelectEmpCreate] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');
  const [medicine, setMedicine] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // ✅ เพิ่ม state สำหรับ auto-generate ID
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [nextPreorderId, setNextPreorderId] = useState('');
  
  const selectedDate = watch('preorder_date');

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

  // ✅ ดึงรหัสถัดไปเมื่อ component โหลด
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/preorder/next-preorder-id'
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNextPreorderId(data.nextId);
        setValue('preorder_id', data.nextId); // ตั้งค่ารหัสในฟอร์ม
      } catch (error) {
        console.error('Error fetching next preorder ID:', error);
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

  useEffect(() => {
    const fetchMed = async () => {
      try {
        const res = await fetch('http://localhost:4000/src/manager/medicines');
        const data = await res.json();
        if (res.ok) {
          setMedicine(data.data);
        }
      } catch (error) {
        console.error('Error fetching medicine:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນຢາໄດ້',
          }),
        );
      }
    };

    const fetchSup = async () => {
      try {
        const res = await fetch('http://localhost:4000/src/manager/supplier');
        const data = await res.json();
        if (res.ok) {
          setSupplier(data.data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ສະໜອງໄດ້',
          }),
        );
      }
    };

    const fetchEmp = async () => {
      try {
        const res = await fetch('http://localhost:4000/src/manager/emp');
        const data = await res.json();
        if (res.ok) {
          const transformedData = data.data.map((emp) => ({
            id: emp.emp_id,
            name: emp.emp_name,
            surname: emp.emp_surname,
            role: emp.role,
          }));
          setEmployees(transformedData);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້',
          }),
        );
      }
    };

    fetchMed();
    fetchSup();
    fetchEmp();
  }, [dispatch]);

  useEffect(() => {
    const now = new Date().toISOString();
    setValue('created_at', now);
  }, [setValue]);

  const handleSave = async (data) => {
    setLoading(true);


    const payload = {
      preorder_id: data.preorder_id,
      preorder_date: data.preorder_date,
      status: 'ລໍຖ້າຈັດສົ່ງ', // ✅ เพิ่ม default status
      sup_id: data.supplier, // ✅ แปลงชื่อ field
      emp_id_create: data.emp_id_create // ✅ แปลงชื่อ field
    };

    console.log('Payload being sent:', payload); // ✅ Debug log

    try {
      const response = await fetch(
        'http://localhost:4000/src/preorder/preorder',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result); // ✅ Debug log
        throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ ✅',
        }),
      );

      await getList();
      reset();
      setShow(false);
    } catch (error) {
      console.error('Error saving data:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
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
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4"
      >
        {/* ✅ แทนที่ InputBox ด้วย read-only input แบบ auto-generate */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            ລະຫັດອໍເດີ້
          </label>
          <input
            type="text"
            value={nextPreorderId}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('preorder_id')} />
        </div>

        <BoxDate
          name="preorder_date"
          label="ວັນທີສັ່ງຊື້"
          register={register}
          errors={errors}
          select={selectedDate}
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີວັນທີສັ່ງຊື້' }}
          setValue={setValue}
          withTime={false}
        />


        <SelectBoxId
          label="ຜູ້ສະໜອງ"
          name="supplier"
          value={selectSup}
          options={supplier.map((s) => ({
            value: s.sup_id,
            label: `${s.company_name} ${s.address}`,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກຜູ້ສະໜອງ' }} // ✅ เพิ่ม validation
          onSelect={(e) => {
            setSelectSup(e.target.value);
            setSup(e.target.value);
          }}
        />


        <SelectBoxId
          label="ພະນັກງານ (ຜູ້ສ້າງ)"
          name="emp_id_create"
          value={selectEmpCreate}
          options={employees.map((emp) => ({
            label: `${emp.name} ${emp.surname} ${emp.role}`,
            value: emp.id,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }} // ✅ เพิ่ม validation
          onSelect={(e) => setSelectEmpCreate(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end space-x-4  py-4">

          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;
