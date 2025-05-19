import React, { useEffect } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import moment from 'moment';

const DatePickerBox = ({
  label,
  name,
  select,
  register,
  setValue,
  formOptions,
  errors,
  className = '',
  withTime = false,
}) => {
  useEffect(() => {
    if (register && name && formOptions) {
      register(name, formOptions);
    }
  }, [register, name, formOptions]);

  const handleChange = (date) => {
    if (date) {
      setValue(name, date.toISOString());
    } else {
      setValue(name, '');
    }
  };

  // Fix: Check if select has a valid value before passing to moment
  const dateValue = select && select !== '' ? moment(select) : null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3">
          {label}
        </label>
      )}
      <AntdDatePicker
        className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize ${className}`}
        showTime={withTime}
        value={dateValue}
        onChange={handleChange}
        format={withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'}
        placeholder={
          withTime ? 'ເລືອກວັນ/ເວລາ (ວ/ດ/ປ)' : 'ເລືອກວັນເດືອນປີ (ວ/ດ/ປ)'
        }
      />
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};

export default DatePickerBox;