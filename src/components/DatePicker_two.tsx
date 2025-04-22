import React, { useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { RegisterOptions, UseFormSetValue } from "react-hook-form";
// import "flatpickr/dist/flatpickr.min.css"; // Import CSS ของ Flatpickr
import { CalendarIcon } from "@heroicons/react/24/solid"; 

type DatePickerProps = {
  label?: string;
  select: string | any;
  register: any;
  errors?: any;
  name: string;
  formOptions?: RegisterOptions;
  setValue: UseFormSetValue<any>;
  className?: string;
  withTime?: boolean; // ✅ เพิ่มตรงนี้
};

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  select,
  register,
  errors,
  name,
  formOptions,
  setValue,
  className,
  withTime,  // Destructure className prop
}) => {
  useEffect(() => {
    register(name, formOptions);
  }, [register, name, formOptions]);

  return (
    <div className="w-full">
      {label && <label className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3">{label}</label>}

      <div className="relative">
        <Flatpickr
          className={`relative z-20 w-full mb-2 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize ${className}`}  // Apply className here
          placeholder="ເລືອກວັນເດືອນປີເກີດ (ວັນ/ເດືອນ/ປີ)"
          value={select}
          options={{
            enableTime: withTime || false, 
            noCalendar: false,
            time_24hr: true,
            dateFormat: withTime ? "d/m/Y H:i" : "d/m/Y", 
            allowInput: true,
            defaultHour: 0,
            defaultMinute: 0,
            prevArrow: '<span class="text-gray-600 dark:text-white">‹</span>',
            nextArrow: '<span class="text-gray-600 dark:text-white">›</span>',
          }}
          onChange={(date: Date[]) => {
            if (date.length > 0) {
              setValue(name, new Date(date[0]).toISOString());
            } else {
              setValue(name, "");
            }
          }}
        />

        {/* <CalendarIcon className="absolute right-3 top-4.5 h-5 w-5 text-gray-500 dark:text-gray-400" /> */}
      </div>

      {errors?.[name] && <span className="mt-1 text-sm text-red-500">{errors[name]?.message}</span>}
    </div>
  );
};

export default DatePicker;
