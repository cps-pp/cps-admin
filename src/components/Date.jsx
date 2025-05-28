import React, { useEffect } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const  BoxDate = ({
  label,
  name,
  select,
  register,
  setValue,
  formOptions,
  errors,
  className = "",
  withTime = false,
}) => {
  useEffect(() => {
    if (register && name) {
      register(name, formOptions);
    }
  }, [name, register, formOptions]);


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
            withTime
              ? "ເລືອກວັນ/ເວລາ (ວ/ດ/ປ)"
              : "ເລືອກວັນເດືອນປີ (ວ/ດ/ປ)"
          }
          value={select}
          options={{
            enableTime: withTime,
            time_24hr: true,
            dateFormat: withTime ? "d/m/Y H:i" : "d/m/Y",
            allowInput: true,
            defaultHour: 0,
            defaultMinute: 0,
            prevArrow: '<span class="text-gray-600 dark:text-white">‹</span>',
            nextArrow: '<span class="text-gray-600 dark:text-white">›</span>',
          }}
          onChange={(dates) => {
            if (dates.length > 0) {
              const isoDate = dates[0].toISOString();
              setValue(name, isoDate);
            } else {
              setValue(name, "");
            }
          }}
        />
      </div>

      {errors && errors[name] && (
        <span className="mt-1 text-sm text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  );
};

export default BoxDate;
