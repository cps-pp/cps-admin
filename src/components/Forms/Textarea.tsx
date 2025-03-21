import { ReactNode } from 'react';

type TTextarea = {
  label: string;
  name: string;
  value: string;
  onChange?: any;
  row?: number;
  children?: ReactNode;
};

const Textarea = ({
  label,
  name,
  value,
  onChange,
  row = 1,
  children,
}: TTextarea) => {
  return (
    <div className="mb-5.5">
      <label
        className="mb-3 block text-sm font-medium text-black dark:text-white"
        htmlFor="Username"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4.5 top-3">{children}</span>

        <textarea
          className="w-full rounded border border-stroke py-3 pl-4 text-black dark:bg-form-input dark:disabled:bg-meta-4 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary"
          name={name}
          id={name}
          rows={row}
          placeholder={`Write your ${name} here`}
          defaultValue={value}
          onChange={onChange}
        ></textarea>
      </div>
    </div>
  );
};

export default Textarea;
