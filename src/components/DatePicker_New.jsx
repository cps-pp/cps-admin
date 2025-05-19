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
    const localDateStr = date.format('YYYY-MM-DDTHH:mm:ssZ');
    setValue(name, localDateStr);
  } else {
    setValue(name, '');
  }
};

  const dateValue = select ? moment(select) : null;

useEffect(() => {
  console.log('DatePicker select changed:', select);
  if (select && !moment(select).isValid()) {
    console.warn('Invalid date provided to DatePickerBox:', select);
  }
}, [select]);

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
        value={dateValue && dateValue.isValid() ? dateValue : null}
        onChange={handleChange}
        format={withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'}
        placeholder={
          withTime ? 'เลือกวัน/เวลา (ว/ด/ป)' : 'เลือกวันเดือนปี (ว/ด/ป)'
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