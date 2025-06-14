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
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMedType, setSelectedMedType] = useState('');
  const [status, setStatus] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');
  const [updateDate, setUpdateDate] = useState('');

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

  // Fetch medicine data
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
        const res = await fetch(`http://localhost:4000/src/manager/medicines/${id}`);
        const result = await res.json();
        console.log('API Response:', result);

        if (res.ok && result.data) {
          const med = result.data;
          console.log('Medicine data before processing:', med);

          // Format date if needed
          const formattedExpired = med.expired ?
            (med.expired.includes('T') ?
              med.expired.split('T')[0] :
              med.expired) : '';

          const formData = {
            med_id: med.med_id || '',
            med_name: med.med_name || '',
            qty: med.qty || '',
            status: med.status || '',
            price: med.price || '',
            unit: med.unit || '',
            expired: formattedExpired,
            medtype_id: med.medtype_id || '',
            emp_id_create: med.emp_id_create || '',
            created_at: med.created_at || '',
          };

          console.log('Form data to reset:', formData);

          // Reset form with fetched data
          reset(formData);

          // Set individual field values explicitly
          setValue('price', med.price || '');
          setValue('status', med.status || '');
          setValue('medtype_id', med.medtype_id || '');

          // Set state values
          setSelectedMedType(med.medtype_id || '');
          setStatus(med.status || '');

          // Debug log
          setTimeout(() => {
            console.log('Values after reset:', getValues());
            console.log('Watched values:', watchedValues);
            console.log('State values:', {
              selectedMedType: med.medtype_id,
              status: med.status,
              price: med.price
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
            message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
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
      console.log('Selected states:', { selectedMedType, status, selectEmpUpdate });

      const payload = {
        ...formData,
        status: status || formData.status,
        medtype_id: selectedMedType || formData.medtype_id,
        emp_id_updated: selectEmpUpdate,
        update_by: new Date().toISOString(),
      };

      console.log('Payload to send:', payload);

      const res = await fetch(`http://localhost:4000/src/manager/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

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

        {/* Try using InputBox instead of PriceInputBox for debugging */}
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
          label="ເລືອກສະຖານະ"
          name="status"

          value={status}
          options={[
            { value: "ຍັງມີ", label: "ຍັງມີ" },
            { value: "ໝົດ", label: "ໝົດ" }
          ]}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກສະຖານະ' }}
          onSelect={(e) => {
            const newStatus = e.target.value;
            console.log('Status selected:', newStatus);
            setStatus(newStatus);
            setValue('status', newStatus);
          }}
        />

        <SelectBoxId
          label="ປະເພດ"
          name="ປະເພດ"
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
          onSelect={(e) => {
            const newEmp = e.target.value;
            console.log('Employee selected:', newEmp);
            setSelectEmpUpdate(newEmp);
            setValue('emp_id_updated', newEmp); // Sync with form
          }}
        />

        <BoxDate
          register={register}
          errors={errors}
          name="update_by"
          label="ວັນທີແກ້ໄຂ"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີ' }}
          setValue={(fieldName, value) => {
            console.log('BoxDate setValue called:', fieldName, value);
            setUpdateDate(value);
            setValue(fieldName, value);
          }}
          select={updateDate}
        />

        <div className="flex justify-end space-x-4 col-span-full py-4">
          <Button
            variant="cancel"
            type="button"
            onClick={() => setShow(false)}
            disabled={loading}
          >
            ຍົກເລີກ
          </Button>
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>

        </div>
      </form>

    </div>
  );
};

export default EditMedicines;
