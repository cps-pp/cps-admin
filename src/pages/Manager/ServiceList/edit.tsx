import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import BackButton from '@/components/BackButton';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import PriceInput from '@/components/Forms/PriceInput';

interface EditProps {
  id: string;
  onClose: () => void;
  setShow: (value: boolean) => void;
  getList?: () => void;
}

const EditServicerList: React.FC<EditProps> = ({
  id,
  onClose,
  setShow,
  getList,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
  getValues,

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
          `http://localhost:4000/src/manager/servicelist/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('ser_name', data.data.ser_name);
        setValue('price', data.data.price);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching servicelist data:', error);
      }
    };

    fetchListData();
  }, [id, setValue, fetching]);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/servicelist/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ser_name: formData.ser_name,
            price: formData.price,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || `Status ${response.status}`);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ແກ້ໄຂສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນລາຍການສຳເລັດແລ້ວ',
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

  // if (loading) return <Loader/>;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center  border-b border-stroke  dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ຊື່ລາຍການ"
          name="ser_name"
          type="text"
          placeholder="ປ້ອນຊຶ່ລາຍການ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ລາຍການກ່ອນ' }}
          errors={errors}
        />
        <PriceInput
          label="ລາຄາ"
          name="price"
          register={register}
          defaultValue={getValues('price')}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງຫຼາຍກວ່າ 0' },
          }}
          errors={errors}
        />

        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          {/* <button
            className="px-6 py-2 text-md font-medium text-red-500"
            type="button"
            onClick={() => navigate('/manager/servicelist')}
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

export default EditServicerList;
