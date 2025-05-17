import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/Forms/Input_two';
import React, { useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import PriceInput from '@/components/Forms/PriceInput';

interface CreateProps {
  setShow: (value: boolean) => void;
  getList: any;
}

const CreateExChange: React.FC<CreateProps> = ({ setShow, getList }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:4000/src/manager/exchange',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ex_id: formData.ex_id,
            ex_type: formData.ex_type,
            ex_rate: formData.ex_rate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTimeout(async () => {
        setShow(false);
        await getList();
        reset();

        dispatch(
          openAlert({
            type: 'success',
            title: 'ສຳເລັດ',
            message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
          }),
        );

        setLoading(false);
      }, 500);
    } catch (error: any) {
      setLoading(false);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1  gap-4 px-4 pt-4"
      >
        <Input
          label="ລະຫັດອັດຕາແລກປ່ຽນ"
          name="ex_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ສະກຸນເງິນ"
          name="ex_type"
          type="text"
          placeholder="ປ້ອນສະກຸນເງິນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນສະກຸນເງິນກ່ອນ' }}
          errors={errors}
        />

        <PriceInput
          label="ຈຳນວນເລດ"
          name="ex_rate"
          placeholder="ປ້ອນເລດ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ກະລຸນາປ້ອນເລດກ່ອນ 0' },
          }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          {/* <button
            className="px-6 py-2 text-md font-medium uppercase text-red-500"
            type="button"
            onClick={() => navigate('/manager/exchange')}
          >
            ຍົກເລິກ
          </button> */}
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateExChange;
