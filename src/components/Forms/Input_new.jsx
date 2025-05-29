

const InputBox = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  errors,
  className = "",
  disabled = false,
  formOptions = {},
}) => {
  return (
    <div>
      {label && (
        <label
          className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`relative z-20 w-full  appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize
          ${errors && errors[name] ? "border-blue-500" : ""} ${className}`}
          {...(register ? register(name, formOptions) : {})}
        />
        {errors && errors[name] && (
          <span className="text-red-500">{errors[name]?.message}</span>
        )}
      </div>
    </div>
  );
};

export default InputBox;
