import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import DatePicker from '@/components/DatePicker_two';
import SelectID from '@/components/Forms/SelectID';
import Select from '@/components/Forms/Select';
import PriceInput from '@/components/Forms/PriceInput';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';

interface CreateProps {
  setShow: (value: boolean) => void;
  getList: any;
}

const CreateMedicines: React.FC<CreateProps> = ({
  setShow,
  getList,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<
    {
      medtype_id: any;
      type_name: any;
      id: string;
      name: string;
    }[]
  >([]);
  const [selectedMedType, setSelectedMedType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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
        const response = await fetch('http://localhost:4000/src/manager/category');
        const data = await response.json();
        if (response.ok) {
          console.log('API Response:', data.data);
          setCategories(
            data.data.map((cat: { medtype_id: string; type_name: string }) => ({
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

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/manager/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          medtype_id: selectedMedType,
        }),
      });

        const result = await response.json();
           if (!response.ok) throw new Error(result.error || 'ບັນທຶກຂໍ້ມູບໍ່ສຳເລັດ');
     
           dispatch(
             openAlert({
               type: 'success',
               title: 'ສຳເລັດ',
               message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
             })
           );
     
           await getList();
           reset();
           setShow(false);
         } catch (error: any) {
           dispatch(
             openAlert({
               type: 'error',
               title: 'ເກີດຂໍ້ຜິດພາດ',
               message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
             })
           );
         } finally {
           setLoading(false);
         }
       };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center  border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-4 px-4"
      >
        <Input
          label="ລະຫັດ"
          name="med_id"
          type="text"
          placeholder="ປ້ອນຊື່ຢາ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ຢາ' }}
          errors={errors}
        />
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
        {/* <Input
          label="ລາຄາ"
          name="price"
          type="number"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລາຄາ' }}
          errors={errors}
        /> */}
        <DatePicker
          select=""
          register={register}
          errors={errors}
          name="expired"
          label="ວັນໝົດອາຍຸ"
          formOptions={{ required: 'ວັນໝົດອາຍຸ' }}
          setValue={setValue}
        />
        <Select
          label="ສະຖານະ"
          name="ສະຖານະ"
          options={['ຍັງມີ', 'ໝົດ']}
          register={register}
          errors={errors}
          value={status}
          onSelect={(e) => setStatus(e.target.value)}
        />

        <SelectID
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

        <div className="flex justify-end space-x-4 col-span-full  py-4">
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

export default CreateMedicines;
