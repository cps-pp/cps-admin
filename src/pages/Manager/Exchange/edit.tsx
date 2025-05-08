import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';

interface EditProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
  getList?: () => void;
}

const EditExChange: React.FC<EditProps> = ({
  id,
  onClose,
  setShow,
  getList,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/manager/exchange/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('ex_type', data.data.ex_type);
        setValue('ex_rate', data.data.ex_rate);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      }
    };

    fetchListData();
  }, [id, setValue, fetching]);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/exchange/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ex_type: formData.ex_type,
            ex_rate: formData.ex_rate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

        dispatch(
          openAlert({
            type: 'success',
            title: 'ແກ້ໄຂສຳເລັດ',
            message: 'ແກ້ໄຂຂໍ້ມູນອັດຕາແລກປ່ຽນສຳເລັດແລ້ວ',
          }),
        );

        if (getList) getList();

        setShow(false);


    } catch (err: any) {

      console.error(err);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ',
          message: err.message || 'ເກີດຂໍ້ຜຶດພາດໃນການບັນທືກຂໍ້ມູນ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts/>
      <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ສະກຸນເງິນ"
          name="ex_type"
          type="text"
          placeholder="ປ້ອນສະກຸນເງິນ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນສະກຸນເງິນກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ຈຳນວນເລດ"
          name="ex_rate"
          type="text"
          placeholder="ປ້ອນເລດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຈຳນວນກ່ອນ' }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          <button
            className="px-6 py-2 text-md font-medium text-red-500"
            type="button"
            onClick={() => navigate('/manager/exchange')}
          >
            ຍົກເລິກ
          </button>
          <Button variant="save" type="submit">
            ບັນທຶກ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditExChange;
