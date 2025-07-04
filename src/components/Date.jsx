import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';

dayjs.extend(utc);

const BoxDate = ({
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

      <div className="relative">
        <Flatpickr
          className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize ${className}`}
          placeholder={
            withTime ? 'ເລືອກວັນ/ເວລາ (ວ/ດ/ປ)' : 'ເລືອກວັນເດືອນປີ (ວ/ດ/ປ)'
          }
          value={select}
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
              const localDate = dates[0];
              setValue(name, localDate);
            } else {
              setValue(name, '');
            }
          }}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={setToday}
            className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
          >
            <svg
              className="w-5 h-5 text-blue-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
              />
            </svg>
            ມື້ນີ້
          </button>

          <button
            type="button"
            onClick={clearDate}
            className="px-3 py-1 text-sm rounded bg-slate-200 text-slate-700 hover:bg-slate-300 flex items-center gap-1"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            ລ້າງ
          </button>
        </div>
      </div>

      {errors && errors[name] && (
        <span className="mt-1 text-sm text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );
};

export default BoxDate;

// import React, { useEffect } from "react";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_blue.css";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);

// const  BoxDate = ({
//   label,
//   name,
//   select,
//   register,
//   setValue,
//   formOptions,
//   errors,
//   className = "",
//   withTime = false,
// }) => {
//   useEffect(() => {
//     if (register && name) {
//       register(name, formOptions);
//     }
//   }, [name, register, formOptions]);

//   return (
//     <div className="w-full">
//       {label && (
//         <label className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3">
//           {label}
//         </label>
//       )}

//       <div className="relative">
//         <Flatpickr
//           className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize ${className}`}
//           placeholder={
//             withTime
//               ? "ເລືອກວັນ/ເວລາ (ວ/ດ/ປ)"
//               : "ເລືອກວັນເດືອນປີ (ວ/ດ/ປ)"
//           }
//           value={select}
//           options={{
//             enableTime: withTime,
//             time_24hr: true,
//             dateFormat: withTime ? "d/m/Y H:i" : "d/m/Y",
//             allowInput: true,
//             defaultHour: 0,
//             defaultMinute: 0,
//             prevArrow: '<span class="text-gray-600 dark:text-white">‹</span>',
//             nextArrow: '<span class="text-gray-600 dark:text-white">›</span>',
//           }}
//           onChange={(dates) => {
//             if (dates.length > 0) {
//               const isoDate = dates[0].toISOString();
//               setValue(name, isoDate);
//             } else {
//               setValue(name, "");
//             }
//           }}
//         />
//       </div>

//       {errors && errors[name] && (
//         <span className="mt-1 text-sm text-red-500">{errors[name]?.message}</span>
//       )}
//     </div>
//   );
// };

// export default BoxDate;
