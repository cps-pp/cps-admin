import { FC, ReactNode } from "react";
import { UseFormRegister, FieldValues, FieldErrors, RegisterOptions } from "react-hook-form";

interface InputProps {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value?: any;
  children?: ReactNode;
  disabled?: boolean;
  register?: any;
  errors?: any;
  formOptions?: RegisterOptions;
  className?: string;
}

const Input: FC<InputProps> = ({ label, type = "text", placeholder, register, name, errors,className , disabled, formOptions }) => {
  return (
    <div className="">
      {label && (
        <label
          className="mb-3 block text-sm font-medium  text-strokedark dark:text-bodydark3"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative">
      <input
          className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize
            ${errors?.[name] ? "border-red-500" : ""} ${className}`} // Add className here
          disabled={disabled}
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, formOptions)}
        />
        {errors?.[name] && (
              <span className="text-red-500">{errors[name]?.message}</span>
        )}
      </div>
    </div>
  );
};

export default Input;
