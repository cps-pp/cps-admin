import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  closeAlert,
  selectMessage,
  selectShow,
  selectTitle,
  selectType,
} from '@/redux/reducer/alert';

const spinnerIcon = (
  <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
);

const warningIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21H23L12 2ZM13 16H11V18H13V16ZM13 10H11V14H13V10Z"
      fill="#FBBF24"
    />
  </svg>
);
const successIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
      fill="#34D399"
    />
  </svg>
);
const errorIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
      fill="#F87171"
    />
  </svg>
);

const TYPE = {
  loading: {
    icon: spinnerIcon,
    containerStyle: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
    iconStyle: 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200',
    titleStyle: 'text-blue-800 dark:text-blue-200',
    messageStyle: 'text-blue-700 dark:text-blue-300',
    closeButtonStyle: 'text-blue-500 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-800',
  },
  warning: {
    icon: warningIcon,
    containerStyle: 'bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-700',
    iconStyle: 'bg-amber-100 text-amber-500 dark:bg-amber-800 dark:text-amber-200',
    titleStyle: 'text-amber-800 dark:text-amber-200',
    messageStyle: 'text-amber-700 dark:text-amber-300',
    closeButtonStyle: 'text-amber-500 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-800',
  },
  success: {
    icon: successIcon,
    containerStyle: 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700',
    iconStyle: 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200',
    titleStyle: 'text-green-800 dark:text-green-200',
    messageStyle: 'text-green-700 dark:text-green-300',
    closeButtonStyle: 'text-green-500 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-800',
  },
  error: {
    icon: errorIcon,
    containerStyle: 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700',
    iconStyle: 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200',
    titleStyle: 'text-red-800 dark:text-red-200',
    messageStyle: 'text-red-700 dark:text-red-300',
    closeButtonStyle: 'text-red-500 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800',
  },
};

const Alerts = () => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectShow);
  const type = useAppSelector(selectType);
  const title = useAppSelector(selectTitle);
  const message = useAppSelector(selectMessage);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (type !== 'loading') {
        const t = setTimeout(() => dispatch(closeAlert()), 3000);
        return () => clearTimeout(t);
      }
    } else {
      const t = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [show, type, dispatch]);

  if (!show && !isVisible) return null;

  const visibilityClass = show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10';
  const cfg = TYPE[type] || TYPE.warning;

  return (
    <div
      className={`fixed top-4 left-5 z-50 w-full max-w-sm transition-all duration-300 ${visibilityClass}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <div className={`${cfg.containerStyle} shadow-lg rounded border p-4 flex items-start`}>
        <div className={`${cfg.iconStyle} p-2 rounded-full flex-shrink-0 mr-3`}>
          {cfg.icon}
        </div>
        <div className="flex-grow">
          {title && <h3 className={`${cfg.titleStyle} font-medium mb-1`}>{title}</h3>}
          {message && <p className={`${cfg.messageStyle} text-sm`}>{message}</p>}
        </div>
        {type !== 'loading' && (
          <button
            onClick={() => dispatch(closeAlert())}
            className={`${cfg.closeButtonStyle} p-1 rounded-full flex-shrink-0 -mt-1 -mr-1 transition-colors duration-150`}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alerts;
