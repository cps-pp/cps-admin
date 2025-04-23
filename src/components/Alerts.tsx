





import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import {
  closeAlert,
  selectMessage,
  selectShow,
  selectTitle,
  selectType,
} from '@/redux/reducer/alert'

type AlertType = 'loading' | 'warning' | 'success' | 'error'

// Spinner icon for loading state
const spinnerIcon = (
  <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
)

// Warning, success, error icons (unchanged)
const warningIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21H23L12 2ZM13 16H11V18H13V16ZM13 10H11V14H13V10Z"
      fill="#FBBF24"
    />
  </svg>
)
const successIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
      fill="#34D399"
    />
  </svg>
)
const errorIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
      fill="#F87171"
    />
  </svg>
)

// Configuration for each alert type
const TYPE: Record<AlertType, {
  icon: JSX.Element
  containerStyle: string
  iconStyle: string
  titleStyle: string
  messageStyle: string
  closeButtonStyle: string
}> = {
  loading: {
    icon: spinnerIcon,
    containerStyle: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
    iconStyle: 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200',
    titleStyle: 'text-blue-800 dark:text-blue-200',
    messageStyle: 'text-blue-700 dark:text-blue-300',
    closeButtonStyle:
      'text-blue-500 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-800',
  },
  warning: {
    icon: warningIcon,
    containerStyle:
      'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700',
    iconStyle:
      'bg-amber-100 text-amber-500 dark:bg-amber-800 dark:text-amber-200',
    titleStyle: 'text-amber-800 dark:text-amber-200',
    messageStyle: 'text-amber-700 dark:text-amber-300',
    closeButtonStyle:
      'text-amber-500 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-800',
  },
  success: {
    icon: successIcon,
    containerStyle:
      'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700',
    iconStyle:
      'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200',
    titleStyle: 'text-green-800 dark:text-green-200',
    messageStyle: 'text-green-700 dark:text-green-300',
    closeButtonStyle:
      'text-green-500 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-800',
  },
  error: {
    icon: errorIcon,
    containerStyle: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700',
    iconStyle:
      'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200',
    titleStyle: 'text-red-800 dark:text-red-200',
    messageStyle: 'text-red-700 dark:text-red-300',
    closeButtonStyle:
      'text-red-500 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800',
  },
}

const Alerts: React.FC = () => {
  const dispatch = useAppDispatch()
  const show = useAppSelector(selectShow)
  const type = useAppSelector(selectType) as AlertType
  const title = useAppSelector(selectTitle)
  const message = useAppSelector(selectMessage)

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // For loading, do not auto-close
      if (type !== 'loading') {
        const t = setTimeout(() => dispatch(closeAlert()), 3000)
        return () => clearTimeout(t)
      }
    } else {
      // fade out
      const t = setTimeout(() => setIsVisible(false), 500)
      return () => clearTimeout(t)
    }
  }, [show, type, dispatch])

  if (!show && !isVisible) return null

  const visibilityClass = show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
  const cfg = TYPE[type] || TYPE.warning

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
        {/* Hide close button during loading */}
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
  )
}

export default Alerts


// import { useAppDispatch, useAppSelector } from '@/redux/hook';
// import {
//   closeAlert,
//   selectMessage,
//   selectShow,
//   selectTitle,
//   selectType,
// } from '@/redux/reducer/alert';

// const warningIcon = (
//   <svg
//     width="19"
//     height="16"
//     viewBox="0 0 19 16"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
//       fill="#FBBF24"
//     ></path>
//   </svg>
// );
// const successIcon = (
//   <svg
//     width="16"
//     height="12"
//     viewBox="0 0 16 12"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
//       fill="white"
//       stroke="white"
//     ></path>
//   </svg>
// );
// const errorIcon = (
//   <svg
//     width="13"
//     height="13"
//     viewBox="0 0 13 13"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
//       fill="#ffffff"
//       stroke="#ffffff"
//     ></path>
//   </svg>
// );

// const Alerts = () => {
//   const dispatch = useAppDispatch();
//   const show = useAppSelector(selectShow);
//   const type = useAppSelector(selectType);
//   const title = useAppSelector(selectTitle);
//   const message = useAppSelector(selectMessage);

//   const TYPE: any = {
//     warning: {
//       icon: warningIcon,
//       iconStyle: 'bg-warning bg-opacity-30',
//       titleStyle: 'text-[#9D5425]',
//       messageStyle: 'text-[#9D5425]',
//       borderStyle: 'border-warning bg-warning shadow-yellow-700',
//     },
//     success: {
//       icon: successIcon,
//       iconStyle: 'bg-[#34D399]',
//       titleStyle: 'text-black dark:text-[#34D399]',
//       messageStyle: 'text-black dark:text-[#34D399]',
//       borderStyle: 'border-[#34D399] bg-[#34D399] shadow-green-700',
//     },
//     error: {
//       icon: errorIcon,
//       iconStyle: 'bg-[#F87171]',
//       titleStyle: 'text-[#B45454]',
//       messageStyle: 'text-[#CD5D5D]',
//       borderStyle: 'border-[#F87171] bg-[#F87171] shadow-red-900',
//     },
//   };

//   return (
//     <>
//       {show && (
//         <div className="bottom-10 sticky mx-5 lg:mx-0 z-99">
//           <div className="relative mx-auto min-w-[320px] max-w-[700px] flex flex-col gap-7.5 rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
//             <div
//               className={
//                 TYPE[type].borderStyle +
//                 ' flex border-l-6 bg-white px-7 py-8 shadow-[5px_5px_15px_1px] dark:bg-[#1B1B24] md:p-9'
//               }
//             >
//               <div
//                 className="absolute top-3 right-3 cursor-pointer"
//                 onClick={() => dispatch(closeAlert())}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="2em"
//                   height="2em"
//                   viewBox="0 0 16 16"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"
//                   />
//                 </svg>
//               </div>
//               <div
//                 className={
//                   TYPE[type].iconStyle +
//                   ' mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg'
//                 }
//               >
//                 {TYPE[type].icon}
//               </div>
//               <div className="w-full">
//                 <h5
//                   className={
//                     TYPE[type].titleStyle + ' mb-2 text-lg font-semibold'
//                   }
//                 >
//                   {title}
//                 </h5>
//                 <p className={TYPE[type].messageStyle + ' leading-relaxed'}>
//                   {message}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Alerts;
