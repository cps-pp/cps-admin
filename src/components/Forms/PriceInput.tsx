import { FC } from "react";
import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";
import { useState } from "react";

// Define the specific type for your form
interface FormValues {
  med_name: string;
  qty: string;
  status: string;
  price: string;
  expired: string;
  medtype_id: string;
}

interface PriceInputProps {
  label?: string;
  name: keyof FormValues; 
  placeholder?: string;
//   register: UseFormRegister<FormValues>; 
  register?: any;
  errors?: FieldErrors<FormValues>;
  formOptions?: RegisterOptions<FormValues, keyof FormValues>; 
  className?: string;
  disabled?: boolean;
}

const PriceInput: FC<PriceInputProps> = ({ 
    label, 
    name, 
    placeholder, 
    register, 
    errors, 
    formOptions, 
    className,
    disabled 
  }) => {
    const [displayValue, setDisplayValue] = useState('');
  
    const formatNumber = (value: string) => {
      if (!value) return ''; 
  
      const numericValue = value.replace(/[^0-9]/g, ''); 
  
      const numberValue = parseFloat(numericValue); 
  
      return isNaN(numberValue) ? '' : numberValue.toLocaleString();
    };
  
    const registerMethod = register(name, {
      ...formOptions,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ''); 
  
        const formattedValue = formatNumber(rawValue);
        setDisplayValue(formattedValue);
  
        formOptions?.onChange?.(e);
      },
      setValueAs: (value: string) => {
        return value.replace(/[,]/g, '');
      },
    });
  
    return (
      <div>
        {label && (
          <label
            className="mb-3 block text-sm font-medium text-strokedark dark:text-bodydark3"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize
              ${errors?.[name] ? "border-red-500" : ""} ${className}`}
            type="text" 
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={displayValue}
            {...registerMethod}
          />
          {errors?.[name] && (
            <span className="text-red-500">{errors[name]?.message as string}</span>
          )}
        </div>
      </div>
    );
  };
  

export default PriceInput;