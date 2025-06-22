import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '../../../components/Forms/Input_new';

import SelectBoxId from '../../../components/Forms/SelectID';
import BoxDate from '../../../components/Date';


const EditMedicines = ({ id, setShow, getList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMedType, setSelectedMedType] = useState('');
  const [selectEmpCreate, setSelectEmpCreate] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Watch form values for debugging
  const watchedValues = watch();

  // Fetch categories and employees
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, empRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/category'),
          fetch('http://localhost:4000/src/manager/emp'),
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          console.log('Categories data:', data);
          setCategories(
            data.data.map((c) => ({
              medtype_id: c.medtype_id,
              type_name: c.type_name,
            })),
          );
        }

        if (empRes.ok) {
          const data = await empRes.json();
          console.log('Employees data:', data);
          setEmployees(
            data.data.map((e) => ({
              id: e.emp_id,
              name: e.emp_name,
              surname: e.emp_surname,
              role: e.role,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetchData();
  }, []);

// EditMedicines.jsx - แก้ไขส่วน useEffect ที่ fetch ข้อมูล
useEffect(() => {
  async function fetchMedicine() {
    if (!id) {
      console.log('No ID provided');
      return;
    }

    setLoading(true);
    setDataLoaded(false);

    try {
      console.log('Fetching medicine with ID:', id);
      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${id}`,
      );
      const result = await res.json();
      console.log('API Response:', result);

      if (res.ok && result.data) {
        // ✅ แก้ไข: รองรับทั้งกรณีที่ได้ array หรือ object
        let med;
        if (Array.isArray(result.data)) {
          // หากได้ array มา ให้หา medicine ที่ med_id ตรงกับ id ที่ต้องการ
          med = result.data.find(medicine => medicine.med_id === id);
          if (!med) {
            throw new Error('ไม่พบข้อมูลยาที่ต้องการแก้ไข');
          }
        } else {
          // หากได้ object มา ให้ใช้เลย
          med = result.data;
        }
        
        console.log('Medicine data before processing:', med);

        // Format dates if needed
        const formattedExpired = med.expired
          ? med.expired.includes('T')
            ? med.expired.split('T')[0]
            : med.expired
          : '';

        const formattedCreatedAt = med.created_at
          ? med.created_at.includes('T')
            ? med.created_at.split('T')[0]
            : med.created_at
          : '';

        const formData = {
          med_name: med.med_name || '',
          qty: med.qty || '',
          price: med.price || '',
          unit: med.unit || '',
          expired: formattedExpired,
          medtype_id: med.medtype_id || '',
          emp_id_create: med.emp_id_create || '',
          created_at: formattedCreatedAt,
        };

        console.log('Form data to reset:', formData);

        // Reset form with fetched data
        reset(formData);

        // Set individual field values explicitly
        setValue('price', med.price || '');
        setValue('medtype_id', med.medtype_id || '');
        setValue('emp_id_create', med.emp_id_create || '');
        setValue('created_at', formattedCreatedAt);

        // Set state values
        setSelectedMedType(med.medtype_id || '');
        setSelectEmpCreate(med.emp_id_create || '');
        setCreatedAt(formattedCreatedAt);

        // Debug log
        setTimeout(() => {
          console.log('Values after reset:', getValues());
          console.log('Watched values:', watchedValues);
          console.log('State values:', {
            selectedMedType: med.medtype_id,
            selectEmpCreate: med.emp_id_create,
            createdAt: formattedCreatedAt,
            price: med.price,
          });
        }, 200);

        setDataLoaded(true);
      } else {
        console.error('API Error Details:', result);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: result.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຢາໄດ້',
          }),
        );
      }
    } catch (err) {
      console.error('Error fetching medicine:', err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
        }),
      );
    } finally {
      setLoading(false);
    }
  }

  fetchMedicine();
}, [id, reset, dispatch, setValue]);

  const handleSave = async (formData) => {
    setLoading(true);

    try {
      console.log('Form data before save:', formData);
      console.log('Selected states:', {
        selectedMedType,
        selectEmpCreate,
        createdAt,
      });

      const payload = {
        ...formData,

        medtype_id: selectedMedType || formData.medtype_id,
        emp_id_create: selectEmpCreate || formData.emp_id_create,
        created_at: createdAt || formData.created_at,
      };

      console.log('Payload to send:', payload);

      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();
      console.log('Save response:', result);

      if (!res.ok) {
        throw new Error(result.error || 'ແກ້ໄຂຂໍ້ມູນບໍ່ສໍາເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນສໍາເລັດ',
        }),
      );
      window.dispatchEvent(new Event('refresh-notifications'));
      await getList();
      setShow(false);
    } catch (error) {
      console.error('Save error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching data
  if (loading && !dataLoaded) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ແກ້ໄຂຂໍ້ມູນຢາ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >


        <InputBox
          label="ຊື່ຢາ"
          name="med_name"
          type="text"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຢາ' }}
          errors={errors}
        />

        <InputBox
          label="ຈຳນວນ"
          name="qty"
          type="number"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
          errors={errors}
        />


        <InputBox
          label="ລາຄາ"
          name="price"
          type="number"
          step="0.01"
          register={register}

          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />

        <InputBox
          label="ຫົວໜ່ວຍ"
          name="unit"
          type="text"
          placeholder="ປ້ອນຫົວໜ່ວຍເຊັ່ນ: ກັບ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຫົວໜ່ວຍ' }}
          errors={errors}
        />

        <BoxDate
          register={register}
          errors={errors}
          name="expired"
          label="ວັນໝົດອາຍຸ"
          formOptions={{ required: false }}
          select={getValues('expired')}
          setValue={setValue}
        />



        <SelectBoxId
          label="ປະເພດ"
          name="medtype_id"
          value={selectedMedType}
          options={categories.map((cat) => ({
            value: cat.medtype_id,
            label: cat.type_name,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກປະເພດ' }}
          onSelect={(e) => {
            const newMedType = e.target.value;
            console.log('MedType selected:', newMedType);
            setSelectedMedType(newMedType);
            setValue('medtype_id', newMedType);
          }}
        />

        <SelectBoxId
          label="ພະນັກງານ (ຜູ້ສ້າງ)"
          name="emp_id_create"
          value={selectEmpCreate}
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} ${emp.surname} - ${emp.role}`,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }}
          onSelect={(e) => {
            const newEmp = e.target.value;
            console.log('Employee selected:', newEmp);
            setSelectEmpCreate(newEmp);
            setValue('emp_id_create', newEmp);
          }}
        />

        <BoxDate
          register={register}
          errors={errors}
          name="created_at"
          label="ວັນທີສ້າງ"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີສ້າງ' }}
          setValue={(fieldName, value) => {
            console.log('BoxDate setValue called:', fieldName, value);
            setCreatedAt(value);
            setValue(fieldName, value);
          }}
          select={createdAt}
        />

        <div className="flex justify-end space-x-4 col-span-full py-4">

          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>

        </div>
      </form>

    </div>
  );
};

export default EditMedicines;
