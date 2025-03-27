import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Forms/Input_two";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";

const CreateExChange: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:4000/manager/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "ບັນທຶກບໍ່ສຳເລັດ");
      }

      reset();
      navigate("/manager/exchange");
    } catch (error: any) {
      alert(error.message || "ມີຂໍ້ຜິດພາດ");
    }
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
    <div className="flex items-center  border-b border-stroke px-4 dark:border-strokedark pb-4">
      <BackButton className="" />
      <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-6">
        ເພີ່ມຂໍ້ມູນ
      </h1>
    </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4 px-4 pt-4">
      <Input
        label="ລະຫັດອັດຕາແລກປ່ຽນ"
        name="ex_id"
        type="text"
        placeholder="ປ້ອນລະຫັດ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນລະຫັດກ່ອນ" }}
        errors={errors}
      />
      <Input
        label="ສະກຸນເງິນ"
        name="ex_type"
        type="text"
        placeholder="ປ້ອນສະກຸນເງິນ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນສະກຸນເງິນກ່ອນ" }}
        errors={errors}
      />
      <Input
        label="ຈຳນວນເລດ"
        name="ex_rate"
        type="text"
        placeholder="ປ້ອນເລດ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນເລດຫກ່ອນ" }}
        errors={errors}
      />
      
      
        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <button className="px-6 py-2 text-md font-medium uppercase text-red-500" type="button" onClick={() => navigate("/manager/exchange")}>
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

export default CreateExChange;