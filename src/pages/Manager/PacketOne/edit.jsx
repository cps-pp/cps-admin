import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "@/common/Loader";
import InputBox from "@/components/Forms/Input_new";
import PriceInputBox from "@/components/Forms/PriceInput";
import ButtonBox from "@/components/Button";
import { useAppDispatch } from "@/redux/hook";
import { openAlert } from "@/redux/reducer/alert";

const EditPacket = ({ setShow, getList, id }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/src/manager/packet/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setValue('packet_id', data.packet_id);
        setValue('packet_name', data.packet_name);
        setValue('price', data.price);
        setLoading(false);
        console.log('API Response:', data.data);
        
      } catch (error) {
        console.error('Error fetching packet data:', error);
      }
    };

    fetchData();
  }, [id, setValue]);


  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/src/manager/packet/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            packet_id: formData.packet_id,
          packet_name: formData.packet_name,
          price: formData.price,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShow(false);
      await getList();
      dispatch(openAlert({
        type: 'success',
        title: 'ສຳເລັດ',
        message: 'ແກ້ໄຂແພັກເກັດສຳເລັດແລ້ວ',
      }));
    } catch (error) {
      dispatch(openAlert({
        type: 'error',
        title: 'ເກີດຂໍ້ຜິດພາດ',
        message: 'ບໍ່ສາມາດແກ້ໄຂແພັກເກັດໄດ້',
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ແກ້ໄຂແພັກເກັດ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleUpdate)} className="grid grid-cols-1 gap-4 mt-4 px-4">
        <InputBox
          label="ລະຫັດແພັກເກັດ"
          name="packet_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນລະຫັດ" }}
          errors={errors}
          disabled={true}
        />
        <InputBox
          label="ຊື່ແພັກເກັດ"
          name="packet_name"
          type="text"
          placeholder="ປ້ອນຊື່ແພັກເກັດ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນຊື່ແພັກເກັດ" }}
          errors={errors}
        />
        <PriceInputBox
          label="ລາຄາ"
          name="price"
          placeholder="ປ້ອນລາຄາ"
          register={register}
          formOptions={{
            required: 'ກະລຸນາປ້ອນລາຄາ',
            min: { value: 0, message: 'ລາຄາຕ້ອງເປັນບວກ' },
          }}
          errors={errors}
        />
        <div className="mt-8 flex justify-end space-x-4 col-span-full py-4">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການແກ້ໄຂ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default EditPacket;
