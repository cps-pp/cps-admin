<<<<<<< HEAD
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import BoxDate from '../../components/Date';
import InputBox from '../../components/Forms/Input_new';
import SelectBoxId from '../../components/Forms/SelectID';
import ButtonBox from '../../components/Button';

const OrderCreate = ({ setShow, getList }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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
  const selectedDate = watch('preorder_date');

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message =
          'ທ່ານຍັງບໍ່ໄດ້ບັນທຶກຂໍ້ມູນ. ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ຫຼືບໍ?';
        event.preventDefault();
        event.returnValue = message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

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
    try {
      const payload = {
        preorder_id: data.preorder_id,
        preorder_date: data.preorder_date,
        qty: parseInt(data.qty),
        status: 'ລໍຖ້າ',
        lot: data.lot || 1,
        sup_id: sup,
        med_id: med,
        emp_id_create: selectEmpCreate,
        created_at: data.created_at,
      };

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

      if (!response.ok) throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');

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
          message: 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
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
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4"
      >
        <InputBox
          label="ລະຫັດ"
          name="preorder_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດ' }}
          errors={errors}
        />
        
         <BoxDate
          name="preorder_date"
          label="ວັນທີນັດໝາຍ"
          register={register}
          errors={errors}
          select={selectedDate}
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີນັດໝາຍ' }}
          setValue={setValue}
          withTime={false}
        />
        <InputBox
          label="ຈຳນວນ"
          name="qty"
          type="text"
          placeholder="ປ້ອນຈຳນວນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
          errors={errors}
        />
        <InputBox
          label="ລ໋ອດການນຳເຂົ້າ"
          name="lot"
          type="number"
          placeholder="ປ້ອນຈຳນວນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
          errors={errors}
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
          onSelect={(e) => {
            setSelectSup(e.target.value);
            setSup(e.target.value);
          }}
        />
        <SelectBoxId
          label="ຢາ"
          name="medicine"
          value={selectMed}
          options={medicine.map((m) => ({
            value: m.med_id,
            label: m.med_name,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => {
            setSelectMed(e.target.value);
            setMed(e.target.value);
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
          onSelect={(e) => setSelectEmpCreate(e.target.value)}
        />
        <BoxDate
          name="created_at"
          label="ວັນທີ່"
          select=""
          register={register}
          setValue={setValue}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີ' }}
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
=======
// const OrderCreate = () => {
//     return ( <div>

// const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/src/manager/medicines');

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setMedicines(data.data);
//       setFilteredMedicines(data.data);
//     } catch (error) {
//       console.error('Error fetching medicines:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/src/manager/supplier');

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setSuppliers(data.data);
//       setFilteredSuppliers(data.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//     </div> );
// }
 
// export default OrderCreate;
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b
