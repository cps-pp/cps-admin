import { useState } from "react";

const FileUploadInput = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  errors,
  className,
  disabled,
  formOptions,
}) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  if (type === "file") {
    return (
      <div className="mb-4">
        {label && (
          <label
            className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={fileName}
            placeholder={placeholder || "ເລືອກໄຟລ..."}
            disabled={disabled}
            className={`w-full rounded border border-stroke bg-transparent py-3 px-4 pr-28 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white outline-none focus:border-primary dark:focus:border-primary ${
              errors?.[name] ? "border-red-500" : ""
            } ${className}`}
          />
          <label
            htmlFor={name}
            className="text-sm absolute right-1 rounded bg-primary px-2 py-2 text-white cursor-pointer hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark"
          >
            ເລືອກ
          </label>
          <input
            id={name}
            type="file"
            {...(register && register(name, formOptions))}
            className="absolute opacity-0 w-0 h-0"
            onChange={(e) => {
              handleFileChange(e);
              if (register) register(name, formOptions)?.onChange?.(e);
            }}
            disabled={disabled}
            accept=".doc,.docx,.pdf"
          />
        </div>
        {errors?.[name] && (
          <span className="text-red-500 block mt-1">{errors[name]?.message}</span>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {label && (
        <label
          className="mb-1 block text-sm font-medium text-strokedark dark:text-bodydark3"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded border border-stroke bg-transparent py-3 px-4 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white outline-none focus:border-primary dark:focus:border-primary ${
          errors?.[name] ? "border-red-500" : ""
        } ${className}`}
        {...(register && register(name, formOptions))}
      />
      {errors?.[name] && (
        <span className="text-red-500 block mt-1">{errors[name]?.message}</span>
      )}
    </div>
  );
};

export default FileUploadInput;
