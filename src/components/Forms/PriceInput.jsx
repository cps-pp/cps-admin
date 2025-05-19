import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const PriceInputBox = ({
  label,
  name,
  placeholder,
  register,
  errors,
  formOptions,
  className,
  disabled,
  defaultValue,
  control,
  getValues
}) => {
  const formatNumber = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    const numberValue = parseFloat(numericValue);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString();
  };

  const initialValue = defaultValue ? String(defaultValue) : '';
  const [displayValue, setDisplayValue] = useState(formatNumber(initialValue));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized || defaultValue !== undefined) {
      let valueToUse = defaultValue;

      if (getValues && !valueToUse) {
        try {
          const formValue = getValues(name);
          if (formValue) valueToUse = formValue;
        } catch (e) {
          console.log('Error getting value from form:', e);
        }
      }

      if (valueToUse) {
        setDisplayValue(formatNumber(String(valueToUse)));
        setIsInitialized(true);
      }
    }
  }, [defaultValue, getValues, name, isInitialized]);

  const registerMethod = register
    ? register(name, {
        ...formOptions,
        value: defaultValue,
        onChange: (e) => {
          const rawValue = e.target.value.replace(/[^0-9]/g, '');
          const formattedValue = formatNumber(rawValue);
          setDisplayValue(formattedValue);

          if (formOptions && formOptions.onChange) {
            formOptions.onChange(e);
          }
        },
        setValueAs: (value) => {
          const str = typeof value === 'string' ? value : String(value);
          return str.replace(/,/g, '');
        },
      })
    : {};

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
        {control ? (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ''}
            render={({ field }) => (
              <input
                className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize
                    ${errors?.[name] ? 'border-red-500' : ''} ${className}`}
                type="text"
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={displayValue}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  const formattedValue = formatNumber(rawValue);
                  setDisplayValue(formattedValue);
                  field.onChange(rawValue);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
        ) : (
          <input
            className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize
                ${errors?.[name] ? 'border-red-500' : ''} ${className}`}
            type="text"
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={displayValue}
            {...registerMethod}
          />
        )}
        {errors?.[name] && (
          <span className="text-red-500">{errors[name]?.message}</span>
        )}
      </div>
    </div>
  );
};

export default PriceInputBox;
