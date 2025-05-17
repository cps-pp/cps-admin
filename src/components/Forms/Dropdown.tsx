import {
  ReactNode,
  ChangeEvent,
  FocusEvent,
  useState,
  useCallback,
} from 'react';

type TDropdown = {
  label?: string;
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  delay?: number;
  autoFocus?: boolean;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
};

const Dropdown = (props: TDropdown) => {
  const {
    label,
    name,
    value,
    options,
    placeholder = '',
    className = '',
    disabled,
    delay = 300,
    autoFocus,
    children,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const [timer, setTimer] = useState<number | null>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
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
        <label
          className="mb-2.5 block text-black dark:text-white"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`w-full appearance-none rounded border border-bodydark1 dark:border-strokedark text-strokedark dark:text-bodydark3 py-4 px-4 pr-10 dark:bg-form-input focus:outline-none focus:border-primary cursor-pointer ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {children}
      </div>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
