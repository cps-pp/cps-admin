import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '@/components/Forms/Input';
import SelectBoxId from '@/components/Forms/SelectID';

const EditPreorder = ({ id, setShow, getList }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectEmpcreate, setSelectEmpcreate] = useState('');
  const [preorderData, setPreorderData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [supRes, empRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/supplier'),
          fetch('http://localhost:4000/src/manager/emp'),
        ]);

        if (supRes.ok) {
          const data = await supRes.json();
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

  useEffect(() => {
    async function fetchPreorder() {
      if (!id) return;

      setLoading(true);
      setDataLoaded(false);

      try {
        const res = await fetch(`http://localhost:4000/src/preorder/preorder/${id}`);
        const result = await res.json();

        if (res.ok && result.data) {
          const preorder = result.data;
          setPreorderData(preorder);

          const formattedDate = preorder.preorder_date
            ? preorder.preorder_date.split('T')[0]
            : '';

          const formData = {
            preorder_id: preorder.preorder_id || '',
            preorder_date: formattedDate,
            sup_id: preorder.sup_id || '',
            emp_id_create: preorder.emp_id_create || '',
          };

          reset(formData);
          setSelectedSupplier(preorder.sup_id || '');
          setSelectEmpcreate(preorder.emp_id_create || '');

          setDataLoaded(true);
        } else {
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: result.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນສັ່ງຊື້ໄດ້',
            }),
          );
        }
      } catch (err) {
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
  }, [id, dispatch, reset]);

  const handleSave = async (formData) => {
    setLoading(true);

    try {
      const payload = {
        preorder_id: preorderData.preorder_id,
        preorder_date: preorderData.preorder_date,
        sup_id: selectedSupplier || formData.sup_id,
        emp_id_create: selectEmpcreate || formData.emp_id_create,
      };

      const res = await fetch(`http://localhost:4000/src/preorder/preorder/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'ແກ້ໄຂຂໍ້ມູນບໍ່ສໍາເລັດ');

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

  if (loading && !dataLoaded) return <Loader />;

  if (!preorderData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-600">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
            ແກ້ໄຂຂໍ້ມູນສັ່ງຊື້
          </h1>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4 space-y-4">
          <InputBox
            label="ລະຫັດສັ່ງຊື້"
            name="preorder_id"
            type="text"
            register={register}
            errors={errors}
            disabled
          />

          <InputBox
            label="ວັນທີສັ່ງຊື້"
            name="preorder_date"
            type="date"
            register={register}
            errors={errors}
            disabled
          />

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
              setSelectedSupplier(newSupplier);
              setValue('sup_id', newSupplier);
            }}
          />

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
              setSelectEmpcreate(newEmp);
              setValue('emp_id_create', newEmp);
            }}
          />

          <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
            <Button variant="save" type="submit" disabled={loading}>
              {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPreorder;