import { ReactNode, forwardRef } from 'react';
import { RegisterOptions } from 'react-hook-form';

type TInput = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value?: any;
  children?: ReactNode;
  disabled?: boolean;
  register?: any;
  errors?: any;
  formOptions?: RegisterOptions;
};

const Input = forwardRef<HTMLInputElement, TInput>(
  (
    {
      type = 'text',
      label,
      name,
      value,
      placeholder,
      children,
      disabled,
      register,
      errors,
      formOptions,
    },
  ) => {
    return (
      <div className="mb-5.5">
        {label && (
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {children && (
            <span className="absolute left-4.5 top-4">{children}</span>
          )}
          <input
            className={
              (children ? 'pl-11.5' : '') +
              ' w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none  dark:disabled:bg-meta-4 dark:text-white dark:focus:border-primary'
            }
            disabled={disabled}
            id={name}
            type={type}
            name={name}
            placeholder={placeholder || value}
            defaultValue={value}
            {...register(name, formOptions)}
          />
          {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;

// import { ReactNode } from 'react';

// type TInput = {
//   type?: string;
//   label?: string;
//   name: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   value: any | string;
//   children?: ReactNode;
//   date?: Date;
//   disabled?: boolean;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; //  onKeyDown prop

// };

// const Input = ({
//   type = 'text',
//   label,
//   name,
//   onChange,
//   value,
//   placeholder,
//   children,
//   disabled,
//   onKeyDown, //  onKeyDown
// }: TInput) => {
//   return (
//     <div className="mb-5.5">
//       <label
//         className="mb-3 block text-sm font-medium text-black dark:text-white"
//         htmlFor={name}
//       >
//         {label}
//       </label>
//       <div className="relative">
//         <span className="absolute left-4.5 top-4">{children}</span>
//         <input
//           className={
//             (children ? 'pl-11.5' : '') +
//             ' w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:text-white dark:focus:border-primary'
//           }
//           disabled={disabled}
//           id={name}
//           type={type}
//           name={name}
//           placeholder={placeholder || value}
//           defaultValue={value}
//           onChange={onChange}
//           onKeyDown={onKeyDown}
//         />
//       </div>
//     </div>
//   );
// };

// export default Input;
