import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';

dayjs.extend(utc);

const DateTime = ({
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
    if (register && name) {
      register(name, formOptions);
    }
  }, [name, register, formOptions]);

const setToday = () => {
  const now = new Date();
  setValue(name, now);    
};

const clearDate = () => {
  setValue(name, null);   
};

  return (
  <div className="w-full">
  {label && (
    <label className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3">
      {label}
    </label>
  )}

  <div className="flex items-center gap-2">
    <Flatpickr
      className={`flex-1 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize ${className}`}
      placeholder={
        withTime ? 'ເລືອກວັນ/ເວລາ (ວ/ດ/ປ)' : 'ເລືອກວັນເດືອນປີ (ວ/ດ/ປ)'
      }
      value={select ? new Date(select) : null}
      options={{
        enableTime: withTime,
        time_24hr: true,
        dateFormat: withTime ? 'd/m/Y H:i' : 'd/m/Y',
        allowInput: true,
        defaultHour: 0,
        defaultMinute: 0,
        prevArrow: '<span class="text-gray-600 dark:text-white">‹</span>',
        nextArrow: '<span class="text-gray-600 dark:text-white">›</span>',
      }}
     onChange={(dates) => {
  if (dates.length > 0) {
  
    const isoDate = dates[0].toISOString();
    setValue(name, isoDate, { shouldValidate: true, shouldDirty: true });
  } else {
    setValue(name, '', { shouldValidate: true, shouldDirty: true });
  }
}}

    />

    {/* <button
      type="button"
      onClick={setToday}
      className="flex items-center text-xs gap-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow"
      title="ເລືອກມື້ນີ້"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6 2a1 1 0 100 2h1v1a1 1 0 102 0V4h2v1a1 1 0 102 0V4h1a1 1 0 100-2h-1V1a1 1 0 10-2 0v1H9V1a1 1 0 10-2 0v1H6zM3 7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm2 0v2h2V7H5zm4 0v2h2V7H9zm4 0v2h2V7h-2zM5 11v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2z" />
      </svg>
      ມື້ນີ້
    </button> */}

    {/* ปุ่ม: ລ້າງ */}
    <button
      type="button"
      onClick={clearDate}
      className="flex items-center gap-1 text-xs px-2 py-4 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all shadow"
      title="ລ້າງວັນທີ"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      {/* ລ້າງ */}
    </button>
  </div>

  {/* ข้อความ error */}
  {errors && errors[name] && (
    <span className="mt-1 text-sm text-red-500">
      {errors[name]?.message}
    </span>
  )}
</div>

  );
};

export default DateTime;
