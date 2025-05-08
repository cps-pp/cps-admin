import {
    ReactNode,
    ChangeEvent,
    FocusEvent,
    useState,
    useCallback,
  } from 'react';
  
  type TFilterSelect = {
    label?: string;
    name: string;
    value?: string;
    options: Array<{ value: string | number; label: string }>;
    placeholder?: string;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    delay?: number;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
    onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
  };
  
  const FilterSelect = (props: TFilterSelect) => {
    const {
      label,
      name,
      value,
      options,
      placeholder = 'ເລືອກ...',
      children,
      className = '',
      disabled,
      delay = 500,
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
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8 10h8m-8 4h4m-9 4h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1z" 
              />
            </svg>
          </span>
          <select
            className={`w-full appearance-none rounded py-4 pl-11.5 pr-10 text-black focus-visible:outline-none dark:bg-form-input dark:text-white focus:border-primary disabled:cursor-not-allowed dark:focus:border-primary border ${
              disabled ? '' : ''
            } ${className}`}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg 
              className="fill-current" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 15.75C11.59 15.75 11.18 15.59 10.87 15.27L5.14997 9.55002C4.53997 8.94002 4.53997 7.96002 5.14997 7.35002C5.75997 6.74002 6.73997 6.74002 7.34997 7.35002L12 12L16.65 7.35002C17.26 6.74002 18.24 6.74002 18.85 7.35002C19.46 7.96002 19.46 8.94002 18.85 9.55002L13.13 15.27C12.82 15.59 12.41 15.75 12 15.75Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>
      </div>
    );
  };
  
  FilterSelect.displayName = 'FilterSelect';
  
  export default FilterSelect;