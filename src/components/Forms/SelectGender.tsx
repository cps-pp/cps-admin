import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type SelectGenderProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: any;
};

const SelectGender: React.FC<SelectGenderProps> = ({ label, name, register, errors }) => {
  return (
    <div className="w-full">

      <label htmlFor={name} className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <select
        {...register(name, { required: "ກະລຸນາເລືອກເພດ" })}
        id={name}
        className="w-full rounded border border-stroke dark:border-bodydark2 py-3 px-4.5 text-black dark:text-white focus:border-primary focus-visible:outline-none dark:bg-strokedark  dark:focus:border-primary"
      >
        <option value="">ກະລຸນາເລືອກ</option>
        <option value="male">ຊາຍ</option>
        <option value="female">ຍິງ</option>
      </select>

      {errors?.[name] && (
        <span className="mt-1 text-sm text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  );
};

export default SelectGender;
