import {
  ReactNode,
  ChangeEvent,
  FocusEvent,
  useState,
  useCallback,
} from 'react';

type TSearch = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  delay?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
};

const Search = (props: TSearch) => {
  const {
    type = 'text',
    label,
    name,
    value,
    placeholder,
    children,
    className = '',
    disabled,
    autoComplete = 'off',
    delay = 500,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const [timer, setTimer] = useState<number | null>(null); // ✅ Fix

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (timer) clearTimeout(timer);

      const newTimer = window.setTimeout(() => {
        if (onChange) onChange(e);
      }, delay);

      setTimer(newTimer);
    },
    [onChange, delay, timer]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2.5 block text-black dark:text-white" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-6 h-6 dark:text-stock" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </span>
        <input
          className={`w-full rounded  py-4 pl-11.5 pr-10 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border ${
            disabled ? '' : ''
          } ${className}`}
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
};

Search.displayName = 'Search';

export default Search;

// import {
//   ReactNode,
//   ChangeEvent,
//   FocusEvent,
//   useState,
//   useCallback,
// } from 'react';

// type TSearch = {
//   type?: string;
//   label?: string;
//   name: string;
//   placeholder?: string;
//   value?: any;
//   children?: ReactNode;
//   className?: string;
//   disabled?: boolean;
//   autoComplete?: string;
//   delay?: number;
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
//   onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
//   onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
// };

// const Search = (props: TSearch) => {
//   const {
//     type = 'text',
//     label,
//     name,
//     value,
//     placeholder,
//     children,
//     className = '',
//     disabled,
//     autoComplete = 'off',
//     delay = 500, // 0.5 s
//     onChange,
//     onBlur,
//     onFocus,
//   } = props;

//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   const handleChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       if (timer) clearTimeout(timer);

//       const newTimer = setTimeout(() => {
//         if (onChange) onChange(e);
//       }, delay);
//       setTimer(newTimer);
//     },
//     [timer, onChange],
//   );

//   return (
//     <div className="max-w-[300px] w-full">
//       {label && (
//         <label
//           className="mb-2.5 block text-black dark:text-white"
//           htmlFor={name}
//         >
//           {label}
//         </label>
//       )}
//       <div className="relative">
//         {children && (
//           <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
//             {children}
//           </span>
//         )}
//         <input
//           className={`w-full rounded py-4 pr-10 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border ${
//             disabled
//               ? 'border-gray-300'
//               : 'border-gray-400 dark:border-gray-700'
//           } ${children ? 'pl-11.5' : 'pl-3'} ${className}`}
//           disabled={disabled}
//           id={name}
//           type={type}
//           name={name}
//           placeholder={placeholder || value}
//           value={value}
//           autoComplete={autoComplete}
//           onChange={handleChange}
//           onBlur={onBlur}
//           onFocus={onFocus}
//         />
//         <div className="absolute inset-y-0 right-3 flex items-center text-slate-500 pointer-events-none">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="w-6 h-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// Search.displayName = 'Search';

// export default Search;
