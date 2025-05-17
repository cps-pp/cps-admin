import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import SelectID from '@/components/Forms/SelectID';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import FileUploadInput from '@/components/Forms/FileUploadInput';

interface EditProps {
  setShow: (value: boolean) => void;
  getList: () => Promise<void>;
  id: string;
  onClose: () => void;
}

const EditImport: React.FC<EditProps> = ({ setShow, getList, id, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isDirty, errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [sup, setSup] = useState('');
  const [med, setMed] = useState('');
  const [selectMed, setSelectMed] = useState('');
  const [selectSup, setSelectSup] = useState('');
  const [selectEmpUpdate, setSelectEmpUpdate] = useState('');
  const [medicine, setMedicine] = useState<
    { med_id: string; med_name: string }[]
  >([]);
  const [supplier, setSupplier] = useState<
    { sup_id: string; company_name: string; address: string }[]
  >([]);
  const [employees, setEmployees] = useState<
    { id: string; name: string; surname: string; role: string }[]
  >([]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        const message =
          'ທ່ານຍັງບໍ່ໄດ້ບັນທືກຂໍ້ມູນ ຢືນຢັນວ່າຈະອອກຈາກໜ້ານີ້ແທ້ບໍ່?';
        event.preventDefault();
        event.returnValue = message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, supRes, empRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/medicines'),
          fetch('http://localhost:4000/src/manager/supplier'),
          fetch('http://localhost:4000/src/manager/emp'),
        ]);

        const [medData, supData, empData] = await Promise.all([
          medRes.json(),
          supRes.json(),
          empRes.json(),
        ]);

        if (medRes.ok) {
          setMedicine(
            medData.data.map((m: any) => ({
              med_id: m.med_id,
              med_name: m.med_name,
            })),
          );
        }

        if (supRes.ok) {
          setSupplier(
            supData.data.map((s: any) => ({
              sup_id: s.sup_id,
              company_name: s.company_name,
              address: s.address,
            })),
          );
        }

        if (empRes.ok) {
          setEmployees(
            empData.data.map((emp: any) => ({
              id: emp.emp_id,
              name: emp.emp_name,
              surname: emp.emp_surname,
              role: emp.role,
            })),
          );
        }
      } catch (error) {
        dispatch(
          openAlert({
            type: 'error',
            title: 'Error',
            message: 'ດຶງຂໍ້ມູນຜິດພາດ',
          }),
        );
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    const fetchImport = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/src/im/import/${id}`);
        const result = await res.json();

        if (res.ok) {
          const im = result.data ? result.data : result;

          reset({
            im_id: im.im_id,
            qty: im.qty,
            expired: im.expired,
            document: im.file,
            update_by: im.update_by,
            lot: im.lot,
            im_date: im.im_date,
            sup_id: im.sup_id,
            med_id: im.med_id,
            created_at: im.created_at,
          });

          setSelectSup(im.sup_id);
          setSup(im.sup_id);
          setSelectMed(im.med_id);
          setMed(im.med_id);
          setSelectEmpUpdate(im.update_by || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchImport();
  }, [id, reset]);

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('im_id', data.im_id);
      formData.append('im_date', data.im_date);
      formData.append('qty', data.qty);
      formData.append('expired', data.expired);
      formData.append('update_by', data.update_by);
      formData.append('lot', data.lot || '');
      if (data.document && data.document.length > 0) {
        formData.append('document', data.document[0]);
      }
      formData.append('emp_id_updated', selectEmpUpdate);
      formData.append('sup_id', sup);
      formData.append('med_id', med);

      const response = await fetch(
        `http://localhost:4000/src/im/import/${id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ບັນທືກບໍ່ສຳເລັດ');

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ',
        }),
      );

      await getList();
      reset();
      setShow(false);
      if (onClose) onClose();
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜີດພາດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  // {getValues('document') && typeof getValues('document') === 'string' && (
  //         <p className="mt-2 text-sm text-gray-600">
  //           ໄຟລເອກະສານປະຈຸບັນ: {getValues('document')}
  //         </p>
  //       )}
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3">
          ແກ້ໄຂ
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4"
      >
        <DatePicker
          name="im_date"
          label="ວັນທີ່ນຳເຂົ້າ"
          select={getValues('im_date')}
          register={register}
          setValue={setValue}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີ່' }}
        />
        <Input
          label="ຈຳນວນ"
          name="qty"
          type="text"
          placeholder="ປ້ອນຈຳນວນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
          errors={errors}
        />
        <Input
          label="ລ໋ອດການນຳເຂົ້າ"
          name="lot"
          type="number"
          placeholder="ປ້ອນລ໋ອດນຳເຂົ້າ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລ໋ອດນຳເຂົ້າ' }}
          errors={errors}
        />
        <DatePicker
          register={register}
          errors={errors}
          select={getValues('expired')}
          name="expired"
          label="ວັນໝົດອາຍຸ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນວັນໝົດອາຍຸ' }}
          setValue={setValue}
        />
        <FileUploadInput
          label="ໄຟລເອກະສານ"
          name="document"
          type="file"
          register={register}
          
          errors={errors}
          formOptions={{ required: false }}
        />
      

        <SelectID
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

        <SelectID
          label="ຢາ ແລະ ອຸປະກອນ"
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
        <SelectID
          label="ພະນັກງານ (ຜູ້ແກ້ໄຂ)"
          name="emp_id_updated"
          value={selectEmpUpdate}
          options={employees.map((emp) => ({
            label: `${emp.name} ${emp.surname} ${emp.role}`,
            value: emp.id,
          }))}
          register={register}
          errors={errors}
          onSelect={(e) => setSelectEmpUpdate(e.target.value)}
          isRequired={false}
        />
        <DatePicker
          register={register}
          errors={errors}
          select={getValues('update_by')}
          name="update_by"
          label="ວັນທີອັບເດດ"
          formOptions={{ required: 'ກະລຸນາໃສ່ວັນທີອັບເດດ' }}
          setValue={setValue}
        />
        <div className="mt-4 flex justify-end space-x-4 py-4 col-span-full">
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditImport;
