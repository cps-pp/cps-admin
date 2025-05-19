import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Input from "@/components/Forms/Input";
import PriceInput from "@/components/Forms/PriceInput";
import Loader from "@/common/Loader";
import { useAppDispatch } from "@/redux/hook";
import { openAlert } from "@/redux/reducer/alert";
import InputBox from "../../../components/Forms/Input_new";
import PriceInputBox from "../../../components/Forms/PriceInput";
import ButtonBox from "../../../components/Button";

const CreateServiceList = ({ setShow, getList }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/manager/servicelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ser_id: formData.ser_id,
          ser_name: formData.ser_name,
          price: formData.price,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShow(false);
      await getList();
      reset();
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນລາຍການສຳເລັດແລ້ວ',
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message:  'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className="grid grid-cols-1 gap-4 mt-4 px-4">
        <InputBox
          label="ລະຫັດ"
          name="ser_id"
          type="text"
          placeholder="ປ້ອນລະຫັດ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນລະຫັດກ່ອນ" }}
          errors={errors}
        />
        <InputBox
          label="ຊື່ລາຍການ"
          name="ser_name"
          type="text"
          placeholder="ປ້ອນຊຶ່ລາຍການ"
          register={register}
          formOptions={{ required: "ກະລຸນາປ້ອນຊື່ລາຍການກ່ອນ" }}
          errors={errors}
        />
        <PriceInputBox
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
        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default CreateServiceList;
