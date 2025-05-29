import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
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

const CreateMedicines = ({ setShow, getList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [selectEmpCreate, setSelectEmpCreate] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');

  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMedType, setSelectedMedType] = useState('');
  const [status, setStatus] = useState('');

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
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/manager/category',
        );
        const data = await response.json();
        if (response.ok) {
          console.log('API Response:', data.data);
          setCategories(
            data.data.map((cat) => ({
              medtype_id: cat.medtype_id,
              type_name: cat.type_name,
            })),
          );
        } else {
          console.error('Failed to fetch categories', data);
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await fetch('http://localhost:4000/src/manager/emp');
        const data = await response.json();
        if (response.ok) {
          console.log('API Response:', data.data);
          setEmployees(
            data.data.map((em) => ({
              id: em.emp_id,
              name: em.emp_name,
              surname: em.emp_surname,
              role: em.role,
            })),
          );
        } else {
          console.error('Failed to fetch categories', data);
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchEmp();
  }, []);

  useEffect(() => {
    const now = new Date().toISOString().split('T')[0]; // Format เป็น YYYY-MM-DD
    setValue('created_at', now);
  }, [setValue]);

  const handleSave = async (formData) => {
    setLoading(true);

    // เตรียมข้อมูลก่อนส่ง
    const dataToSend = {
      med_id: formData.med_id,
      med_name: formData.med_name,
      qty: parseInt(formData.qty), // แปลงเป็น number
      status: status || 'ຍັງມີ', // ค่า default ถ้าไม่ได้เลือก
      unit: formData.unit,
      price: parseFloat(formData.price), // แปลงเป็น number
      expired: formData.expired || null, // ให้เป็น null ถ้าไม่มีค่า
      medtype_id: selectedMedType,
      emp_id_create: selectEmpCreate,
      created_at: formData.created_at,
    };

    console.log('Data to send:', dataToSend);

    try {
      const response = await fetch(
        'http://localhost:4000/src/manager/medicines',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Server error:', result);
        throw new Error(result.error || 'ບັນທຶກຂໍ້ມູບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
        }),
      );

      await getList();
      reset();
      setShow(false);

      // รีเซ็ต state
      setStatus('');
      setSelectedMedType('');
      setSelectEmpCreate('');
    } catch (error) {
      console.error('Error:', error);
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        <InputBox
          label="ລະຫັດ"
          name="med_id"
          type="text"
          placeholder="ປ້ອນລະຫັດເຊັ່ນ: M01"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດ' }}
          errors={errors}
        />

        <InputBox
          label="ຊື່"
          name="med_name"
          type="text"
          placeholder="ປ້ອນຊື່ຢາ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຢາ' }}
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
            min: { value: 1, message: 'ຈຳນວນຕ້ອງຫຼາຍກວ່າ 0' },
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

        <PriceInputBox
          label="ລາຄາຕໍ່ເມັດ"
          name="price"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />

        <BoxDate
          select=""
          register={register}
          errors={errors}
          name="expired"
          label="ວັນໝົດອາຍຸ"
          formOptions={{ required: false }}
          setValue={setValue}
        />

        <SelectBoxId
          label="ສະຖານະ"
          name="status"
          options={[
            { label: 'ຍັງມີ', value: 'ຍັງມີ' },
            { label: 'ໝົດ', value: 'ໝົດ' },
          ]}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => setStatus(e.target.value)}
          isRequired={true}
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
          formOptions={{ required: 'ກະລຸນາເລືອກປະເພດ' }}
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
          onSelect={(e) => setSelectEmpCreate(e.target.value)}
          formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }}
        />

        <BoxDate
          register={register}
          errors={errors}
          name="created_at"
          label="ວັນທີສ້າງ"
          select=""
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນທີສ້າງ' }}
          setValue={setValue}
        />

        <div className="flex justify-end space-x-4 col-span-full py-4">
          <ButtonBox
            variant="cancel"
            type="button"
            onClick={() => setShow(false)}
          >
            ຍົກເລີກ
          </ButtonBox>
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicines;
