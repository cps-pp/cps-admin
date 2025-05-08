import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import SelectID from '@/components/Forms/SelectID';
import Select from '@/components/Forms/Select';
import PriceInput from '@/components/Forms/PriceInput';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Loader from '@/common/Loader';
interface EditProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
  getList?: () => void;
}
const EditMedicines: React.FC<EditProps> = ({
  id,
  setShow,
  getList,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      med_name: '',
      qty: '',
      status: '',
      price: '',
      expired: '',
      medtype_id: '',
    },
  });

  const [categories, setCategories] = useState<
    {
      medtype_id: string;
      type_name: string;
    }[]
  >([]);
  const [selectedMedType, setSelectedMedType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/src/manager/category');
        const data = await response.json();
        if (response.ok) {
          setCategories(data.data);
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
    if (status) {
      setValue('status', status);
    }
  }, [status, setValue]);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/src/manager/medicines/${id}`,
        );
        const data = await response.json();
       
        if (response.ok) {
          setValue('med_name', data.data.med_name);
          setValue('qty', data.data.qty);
          setValue('price', data.data.price);
          setValue('expired', data.data.expired);
          setValue('status', data.data.status);
          setValue('medtype_id', data.data.medtype_id);
          setSelectedMedType(data.data.medtype_id);
          setStatus(data.data.status);


          // setValue('med_name', data.data.med_name);
          // setValue('qty', data.data.qty);
          // setValue('price', data.data.price); // ✅
          // setValue('expired', data.data.expired); // ✅
          // setValue('status', data.data.status); // ✅
          // setValue('medtype_id', data.data.medtype_id); // ✅
        } else {
          console.error('Failed to fetch medicine details', data);
        }
      } catch (error) {
        console.error('Error fetching medicine details', error);
      }
    };
    if (id) fetchMedicine();
  }, [id, setValue, fetching]);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/medicines/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            med_name: formData.med_name,
            qty: formData.qty,
            price: formData.price,
            expired: formData.expired,
            status: formData.status,
            medtype_id: selectedMedType,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Status ${response.status}`);


      dispatch(openAlert({
        type: 'success',
        title: 'ແກ້ໄຂສຳເລັດ',
        message: 'ແກ້ໄຂຂໍ້ມູນອັດຕາແລກປ່ຽນສຳເລັດແລ້ວ'
      }));

      if (getList) getList();
      setShow(false);
    } catch (err: any) {
      console.error(err);
     dispatch(openAlert({
       type: 'error',
       title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
       message:  'ເກີດຂໍ້ຜຶດພາດໃນການບັນທືກຂໍ້ມູນ'
     }));
    } finally {
      setLoading(false);
    }
  };

 if (loading) return <Loader/>
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂຂໍ້ມູນຢາ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2   xl:grid-cols-2 gap-4 mt-4 px-4"

      >
        <Input
          label="ຊື່ຢາ"
          name="med_name"
          type="text"
          placeholder="ປ້ອນຊື່ຢາ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຢາ' }}
          errors={errors}
        />
        <Input
          label="ຈຳນວນ"
          name="qty"
          type="number"
          placeholder="ປ້ອນຈຳນວນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
          errors={errors}
        />

        <PriceInput
          label="ລາຄາ"
          name="price"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />
        <DatePicker
          name="expired"
          label="ວັນໝົດອາຍຸ"
          register={register}
          errors={errors}
          setValue={setValue}
          select={getValues('expired')}
        />

        <Select
          label="ສະຖານະ"
          name="status"
          options={['ຍັງມີ', 'ໝົດ']}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => setStatus(e.target.value)}
        />

        <SelectID
          label="ປະເພດ"
          name="medtype_id"
          value={selectedMedType} 
          register={register} 
          errors={errors} 
          options={categories.map((cat) => ({
            value: cat.medtype_id,
            label: cat.type_name,
          }))}
          onSelect={(e) => setSelectedMedType(e.target.value)}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          {/* <button
            className="px-6 py-2 text-md font-medium uppercase text-red-500"
            type="button"
            onClick={() => setShow(false)}
          >
            ຍົກເລິກ
          </button> */}
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicines;
