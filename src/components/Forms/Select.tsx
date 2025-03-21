import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type TSelectProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: string[];
  errors: Record<string, any>;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
};

const Select = ({
  label,
  name,
  register,
  options,
  errors,
  value = '',
  onSelect,
}: TSelectProps) => {
  return (
    <div className="">
      <label className="mb-3 block text-sm font-medium  text-strokedark dark:text-bodydark3">{label}</label>

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          {...register(name, { required: true })}
          value={value}
          onChange={onSelect}
          className="relative z-20 w-full  text-strokedark dark:text-bodydark3 appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary capitalize"
        >
          <option value="" disabled>
            ເລືອກ{name}
          </option>

          {options.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
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
              ></path>
            </g>
          </svg>
        </span>
      </div>

      {errors[name]?.type === 'required' && (
        <span className="text-red-500">ກະລຸນາເລືອກ {name}</span>
      )}
    </div>
  );
};

export default Select;


// import React from 'react';
// import { UseFormRegister } from 'react-hook-form';

// type TSelectProps = {
//   label: string;
//   name: string;
//   select?: string;
//   register: UseFormRegister<any>;
//   options: string[];
//   errors: Record<string, any>;
//   onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
// };

// const Select = ({ label, name, register, options, errors, select = '', onSelect }: TSelectProps) => {
//   return (
//     <div className="mb-5.5">
//       <label className="mb-2.5 block text-black dark:text-white">{label}</label>

//       <div className="relative z-20 bg-transparent dark:bg-form-input">
//         <select
//           {...register(name, { required: true })}
//           value={select}
//           onChange={onSelect} 
//           className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize"
//         >
//           <option value="" disabled>
//             Select {name}
//           </option>

//           {options.map((value, index) => (
//             <option key={index} value={value}>
//               {value}
//             </option>
//           ))}
//         </select>

//         <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
//           <svg
//             className="fill-current"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <g opacity="0.8">
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
//                 fill=""
//               ></path>
//             </g>
//           </svg>
//         </span>
//       </div>

//       {errors[name]?.type === 'required' && (
//         <span className="text-red-500">Please select {name}</span>
//       )}
//     </div>
//   );
// };

// export default Select;



//-------------------------------------------------------
