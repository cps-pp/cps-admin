const ReadOnlyInputWithPopup = ({
  label,
  name,
  placeholder,
  value,
  onClick,
  className = "",
  error,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3"
        >
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <input
          id={name}
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly
          onClick={onClick}
          className={`w-full rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary text-black dark:text-white capitalize cursor-pointer
            ${error ? "border-red-500" : ""}
            ${className}`}
        />
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
};

export default ReadOnlyInputWithPopup;
