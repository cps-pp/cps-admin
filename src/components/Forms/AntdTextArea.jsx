import { Input } from 'antd';

const { TextArea } = Input;

const AntdTextArea = ({ label, name, placeholder, register, formOptions, errors, rows = 4, maxLength }) => {
  return (
    <div className="mb-5.5 ">
      <label className="mb-1 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <TextArea
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name, formOptions)}
        className="w-full   font-lao appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default AntdTextArea;
