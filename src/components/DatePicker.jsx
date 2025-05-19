import React, { useEffect, useState } from "react";

const Calendar = ({
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
  const [date, setDate] = useState("");
  const [time, setTime] = useState(withTime ? "00:00" : "");

  useEffect(() => {
    register(name, formOptions);
  }, [name, register, formOptions]);

  useEffect(() => {
    if (select) {
      const dt = new Date(select);
      if (!isNaN(dt)) {
        setDate(dt.toISOString().slice(0, 10));
        if (withTime) {
          const h = dt.getHours().toString().padStart(2, "0");
          const m = dt.getMinutes().toString().padStart(2, "0");
          setTime(`${h}:${m}`);
        }
      }
    } else {
      setDate("");
      if (withTime) setTime("00:00");
    }
  }, [select, withTime]);

  const updateValue = (newDate, newTime) => {
    if (!newDate) {
      setValue(name, "");
      return;
    }

    let isoString = "";
    if (withTime && newTime) {
      isoString = new Date(`${newDate}T${newTime}:00`).toISOString();
    } else {
      isoString = new Date(`${newDate}T00:00:00`).toISOString();
    }
    setValue(name, isoString);
  };

  const onDateChange = (e) => {
    setDate(e.target.value);
    updateValue(e.target.value, time);
  };
  const onTimeChange = (e) => {
    setTime(e.target.value);
    updateValue(date, e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3">
          {label}
        </label>
      )}
      <div className={`flex rounded border border-stroke bg-white dark:bg-form-input px-2 py-2 ${className}`}>
        <input
          type="date"
          className="mr-2 w-1/2 bg-transparent text-black dark:text-white outline-none"
          value={date}
          onChange={onDateChange}
          placeholder="yyyy-mm-dd"
        />
        {withTime && (
          <input
            type="time"
            className="w-1/2 bg-transparent text-black dark:text-white outline-none"
            value={time}
            onChange={onTimeChange}
          />
        )}
      </div>
      {errors?.[name] && (
        <span className="mt-1 text-sm text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  );
};

export default Calendar;

// import React, { useEffect } from "react";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_blue.css";

// const DatePickerJs = ({
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
//     register(name, formOptions);
//   }, [name, register, formOptions]);
// const handleChange = (date) => {
//   if (date) {
//     const localDateStr = date.format('YYYY-MM-DDTHH:mm:ssZ');
//     setValue(name, localDateStr);
//   } else {
//     setValue(name, '');
//   }
// };
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

//       {errors?.[name] && (
//         <span className="mt-1 text-sm text-red-500">
//           {errors[name]?.message}
//         </span>
//       )}
//     </div>
//   );
// };

// export default DatePickerJs;
