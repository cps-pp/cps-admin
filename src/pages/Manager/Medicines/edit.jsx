import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '../../../components/Forms/Input_new';
import PriceInputBox from '../../../components/Forms/PriceInput';
import SelectBoxId from '../../../components/Forms/SelectID';
import BoxDate from '../../../components/Date';


const EditMedicines = ({ id, setShow, getList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMedType, setSelectedMedType] = useState('');
  const [status, setStatus] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');
const [dataLoaded, setDataLoaded] = useState(false);
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

  useEffect(() => {
    async function fetchData() {
      const [catRes, empRes] = await Promise.all([
        fetch('http://localhost:4000/src/manager/category'),
        fetch('http://localhost:4000/src/manager/emp'),
      ]);
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(
          data.data.map((c) => ({
            medtype_id: c.medtype_id,
            type_name: c.type_name,
          })),
        );
      }
      if (empRes.ok) {
        const data = await empRes.json();
        setEmployees(
          data.data.map((e) => ({
            id: e.emp_id,
            name: e.emp_name,
            surname: e.emp_surname,
            role: e.role,
          })),
        );
      }
    }
    fetchData();
  }, []);
useEffect(() => {
  async function fetchMedicine() {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${id}`,
      );
      const result = await res.json();
      console.log('Fetched data:', result);
      
      if (res.ok) {
        const med = result.data;
        console.log('Medicine data:', med); 
        
        reset({
          med_id: med.med_id,
          med_name: med.med_name,
          qty: med.qty,
          status: med.status,
          price: med.price,
          unit: med.unit,
          expired: med.expired,
          medtype_id: med.medtype_id,
          emp_id_create: med.emp_id_create,
          created_at: med.created_at,
        });
        setSelectedMedType(med.medtype_id);
        setStatus(med.status);
      }
    } catch (err) {
      console.error('Error fetching medicine:', err);
    } finally {
      setLoading(false);
    }
  }
  
  if (id) { 
    fetchMedicine();
  }

}, [id, reset]);
  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        status,
        medtype_id: selectedMedType,
        emp_id_updated: selectEmpUpdate,
        update_by: new Date().toISOString(),
      };
      const res = await fetch(
        `http://localhost:4000/src/manager/medicines/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'ແກ້ໄຂຂໍ້ມູນບໍ່ສໍາເລັດ');

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນສໍາເລັດ',
        }),
      );
      await getList();
      setShow(false);
    } catch (error) {
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

  if (loading) return <Loader />;

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
          label="ລະຫັດ"
          name="med_id"
          type="text"
          register={register}
          errors={errors}
          disabled
        />
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
        <PriceInputBox
          label="ລາຄາ"
          name="price"
          register={register}
          defaultValue={getValues('price')}
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
          label="ສະຖານະ"
          name="status"
          options={['ຍັງມີ', 'ໝົດ']}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => setStatus(e.target.value)}
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
          onSelect={(e) => setSelectedMedType(e.target.value)}
        />
        <SelectBoxId
          label="ພະນັກງານ (ແກ້ໄຂ)"
          name="emp_id_updated"
          value={selectEmpUpdate}
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} ${emp.surname} - ${emp.role}`,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => setSelectEmpUpdate(e.target.value)}
        />
        <BoxDate
          register={register}
          errors={errors}
          name="update_by"
          label="ວັນທີແກ້ໄຂ"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີ' }}
          setValue={setValue}
          select=""
        />
        <div className="flex justify-end space-x-4 col-span-full py-4">
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
          ```{' '}
        </div>
      </form>
    </div>
  );
};

export default EditMedicines;
