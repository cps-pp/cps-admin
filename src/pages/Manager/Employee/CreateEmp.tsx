import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { iconAdd } from '@/configs/icon';
import { useNavigate } from 'react-router-dom';

const CreatePatient: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log('Submitted Data:', data);
  };

  return (
    <div className="rounded-xl bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-xl font-bold">ເພີ່ມຂໍ້ມູນຄົນເຈັບ</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="translate-all inline-flex cursor-pointer items-center justify-center rounded bg-slate-500 px-4 py-2 text-center font-medium text-white outline-none duration-150 ease-linear hover:bg-opacity-90 hover:shadow-lg focus:outline-none active:bg-slate-600"
          >
            ກັບຄືນ
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-4"
      >
        {/* Patient Name */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ຊື່ຜູ້ປ່ວຍ
          </label>
          <input
            {...register('patient_name')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="ຊື່ຜູ້ປ່ວຍ"
          />
        </div>

        {/* Patient Surname */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ນາມສະກຸນ
          </label>
          <input
            {...register('patient_surname')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="ນາມສະກຸນ"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ເພດ
          </label>
          <select
            {...register('gender')}
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
          >
            <option value="male">ຊາຍ</option>
            <option value="female">ຍິງ</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ວັນເກີດ
          </label>
          <input
            {...register('dob')}
            type="date"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
          />
        </div>

        {/* Phone 1 */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ເບີໂທ 1
          </label>
          <input
            {...register('phone1')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="020xxxxxxx"
          />
        </div>

        {/* Phone 2 */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ເບີໂທ 2
          </label>
          <input
            {...register('phone2')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="020xxxxxxx"
          />
        </div>

        {/* Village */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ບ້ານ
          </label>
          <input
            {...register('village')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="ຊື່ບ້ານ"
          />
        </div>

        {/* District */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ເມືອງ
          </label>
          <input
            {...register('district')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="ເມືອງ"
          />
        </div>

        {/* Province */}
        <div>
          <label className="mb-2 block text-sm font-medium dark:text-gray-400 dark:text-whit">
            ແຂວງ
          </label>
          <input
            {...register('province')}
            type="text"
            className="w-full rounded  dark:border-strokedark border-stroke py-3 px-4 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border"
            placeholder="ແຂວງ"
          />
        </div>

        {/* Submit Button */}
      </form>

      <div className="mt-8 flex justify-end space-x-4 px-4 py-4">
        <button
          className="px-6 py-2 text-sm font-bold uppercase text-red-500"
          type="button"
          onClick={() => navigate('/manager/patient')}
        >
          Cancel
        </button>
        <Button variant="save" type="submit">
          ບັນທຶກ
        </Button>
      </div>
    </div>
  );
};

export default CreatePatient;
