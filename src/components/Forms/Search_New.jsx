import { useState, useCallback } from 'react';

const SearchBox = (props) => {
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

  const [timer, setTimer] = useState(null);

  const handleChange = useCallback(
    (e) => {
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => {
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
          <svg
            className="w-6 h-6 dark:text-stock"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </span>
        <input
          className={`w-full rounded py-4 pl-11.5 pr-10 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border ${className}`}
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SearchBox;
