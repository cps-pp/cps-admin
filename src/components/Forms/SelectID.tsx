import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  errors?: FieldErrors;
  value?: string;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select: React.FC<SelectProps> = ({
  label,
  name,
  register,
  options,
  errors,
  value = '',
  onSelect,
}) => {
  // Check if there's a value to determine error display
  const hasValue = Boolean(value);

  return (
    <div className="mb-5.5">
      <label 
        htmlFor={name} 
        className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3"
      >
        {label}
      </label>
      
      <div className="relative z-20 bg-transparent dark:bg-form-input ">
        <select
          id={name}
          {...register(name, { 
            required: {
              value: !hasValue,
              message: `ກະລຸນາເລືອກ${label}`
            },
            onChange: onSelect
          })}
          value={value}
          className=" text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary capitalize"
        >
          <option value="" disabled>
            ເລືອກ{label}
          </option>
          {options.map((option, index) => (
            <option key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow icon */}
        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
      
      {/* Error message */}
      {errors?.[name] && (
        <span className="text-red-500 text-xs mt-1">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default Select;