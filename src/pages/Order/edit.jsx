import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '@/components/Forms/Input'; // แก้ไข path
import SelectBoxId from '@/components/Forms/SelectID'; // แก้ไข path
import BoxDate from '@/components/Date'; // แก้ไข path

const EditPreorder = ({ id, setShow, getList }) => {
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
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectEmpcreate, setSelectEmpcreate] = useState('');
  const [dateValue, setDateValue] = useState('');

  // Watch form values for debugging
  const watchedValues = watch();

  // Fetch suppliers and employees
  useEffect(() => {
    async function fetchData() {
      try {
        const [supRes, empRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/supplier'),
          fetch('http://localhost:4000/src/manager/emp'),
        ]);

        if (supRes.ok) {
          const data = await supRes.json();
          console.log('Suppliers data:', data);
          setSuppliers(
            data.data.map((s) => ({
              sup_id: s.sup_id,
              company_name: s.company_name,
              address: s.address,
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

  // Fetch preorder data
  useEffect(() => {
    async function fetchPreorder() {
      if (!id) {
        console.log('No ID provided');
        return;
      }

      setLoading(true);
      setDataLoaded(false);

      try {
        console.log('Fetching preorder with ID:', id);
        const res = await fetch(`http://localhost:4000/src/preorder/preorder/${id}`);
        const result = await res.json();
        console.log('API Response:', result);

        if (res.ok && result.data) {
          const preorder = result.data;
          console.log('Preorder data before processing:', preorder);

          // Format date if needed
          const formattedDate = preorder.preorder_date ?
            (preorder.preorder_date.includes('T') ?
              preorder.preorder_date.split('T')[0] :
              preorder.preorder_date) : '';

          // Set ค่าใน state และ form
          setDateValue(formattedDate);

          const formData = {
            preorder_id: preorder.preorder_id || '',
            preorder_date: formattedDate,
            status: preorder.status || '',
            sup_id: preorder.sup_id || '',
            emp_id_create: preorder.emp_id_create || '',
          };

          // console.log('Form data to reset:', formData);

          // Reset form with fetched data
          reset(formData);

          // Set state values
          setSelectedSupplier(preorder.sup_id || '');
          setSelectEmpcreate(preorder.emp_id_create || '');

          setDataLoaded(true);
        } else {
          console.error('API Error Details:', result);
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: result.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນສັ່ງຊື້ໄດ້',
            }),
          );
        }
      } catch (err) {
        console.error('Error fetching preorder:', err);
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

    fetchPreorder();
  }, [id, reset, dispatch, setValue]);

  const handleSave = async (formData) => {
    setLoading(true);

    try {
      console.log('Form data before save:', formData);
      console.log('Selected states:', { selectedSupplier, selectEmpcreate });

      const payload = {
        preorder_id: formData.preorder_id,
        preorder_date: formData.preorder_date,
        sup_id: selectedSupplier || formData.sup_id,
        emp_id_create: selectEmpcreate || formData.emp_id_create,
      };

      console.log('Payload to send:', payload);

      const res = await fetch(`http://localhost:4000/src/preorder/preorder/${id}`, {
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
          message: 'ແກ້ໄຂຂໍ້ມູນສັ່ງຊື້ສໍາເລັດ',
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
          ແກ້ໄຂຂໍ້ມູນສັ່ງຊື້
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        {/* รหัสสั่งซื้อ - ไม่สามารถแก้ไขได้ */}
        <InputBox
          label="ລະຫັດສັ່ງຊື້"
          name="preorder_id"
          type="text"
          register={register}
          errors={errors}
          disabled
        />

        {/* วันที่สั่งซื้อ - สามารถแก้ไขได้ */}
        <BoxDate
          register={register}
          errors={errors}
          name="preorder_date"
          label="ວັນທີສັ່ງຊື້"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີສັ່ງຊື້' }}
          select={dateValue} // ใช้ state value
          setValue={(name, value) => {
            setValue(name, value);
            setDateValue(value); // อัพเดท state ด้วย
          }}
        />


        {/* ผู้ส่งของ/ผู้จัดส่ง - สามารถแก้ไขได้ */}
        <SelectBoxId
          label="ເລືອກຜູ້ສະຫນອງ"
          name="sup_id"
          value={selectedSupplier}
          options={suppliers.map((sup) => ({
            value: sup.sup_id,
            label: `${sup.company_name} - ${sup.address}`,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກຜູ້ສະຫນອງ' }}
          onSelect={(e) => {
            const newSupplier = e.target.value;
            console.log('Supplier selected:', newSupplier);
            setSelectedSupplier(newSupplier);
            setValue('sup_id', newSupplier);
          }}
        />

        {/* พนักงาน - สามารถแก้ไขได้ */}
        <SelectBoxId
          label="ພະນັກງານ"
          name="emp_id_create"
          value={selectEmpcreate}
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
            setSelectEmpcreate(newEmp);
            setValue('emp_id_create', newEmp);
          }}
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

export default EditPreorder;