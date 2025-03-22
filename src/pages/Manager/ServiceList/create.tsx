import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Forms/Input_two";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";

const CreateServiceList: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:4000/manager/servicelist", {
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
      navigate("/manager/serviceList");
    } catch (error: any) {
      alert(error.message || "ມີຂໍ້ຜິດພາດ");
    }
  };

  return (
    <div className="rounded bg-white pt-2 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4  dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium  text-strokedark dark:text-bodydark3">ເພີ່ມຂໍ້ມູນລາຍການບໍລິການ</h1>
        <BackButton className="mb-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4 px-4 pt-4">
      <Input
        label="ຊື່ລາຍການ"
        name="ser_name"
        type="text"
        placeholder="ປ້ອນຊຶ່ລາຍການ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນຊື່ລາຍການກ່ອນ" }}
        errors={errors}
      />
      <Input
        label="ລາຄາ"
        name="price"
        type="text"
        placeholder="ປ້ອນລາຄາ"
        register={register}
        formOptions={{ required: "ກະລຸນາປ້ອນລາຄາກ່ອນ" }}
        errors={errors}
      />
      
      
        <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
          <button className="px-6 py-2 text-md font-medium uppercase text-red-500" type="button" onClick={() => navigate("/manager/patient")}>
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

export default CreateServiceList;