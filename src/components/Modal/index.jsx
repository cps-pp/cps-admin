import React from 'react';

const ConfirmModal = ({ show, setShow, message, handleConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setShow(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 w-6 h-6 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-1 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2 font-en">
            Delete
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShow(false)}
              className="flex-1 px-4 py-2 text-slate-500 bg-slate-100 rounded  hover:bg-slate-200"
            >
              ຍົກເລິກ
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ຕົກລົງ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

// import React from 'react';

// const ConfirmModal = ({ show, setShow, message, handleConfirm }) => {
//   if (!show) return null;

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.4)]">
//         <div className="relative w-full max-w-md px-6 py-4 bg-white rounded shadow-lg dark:bg-boxdark sm:max-w-sm md:max-w-md lg:max-w-lg sm:px-6 lg:px-8 m-4 sm:m-6">
//           {/* Close Button */}
//           <button
//             onClick={() => setShow(false)}
//             className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>

//           <div className="text-center mb-6">
//             <svg
//               className="mx-auto mb-4 text-red-600 w-14 h-14 dark:text-red-500"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//               />
//             </svg>
//             <h3 className="text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">{message}</h3>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
//             <button
//               onClick={handleConfirm}
//               className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
//             >
//               ຕົກລົງ
//             </button>
//             <button
//               onClick={() => setShow(false)}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto"
//             >
//               ຍົກເລິກ
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
//     </>
//   );
// };

// export default ConfirmModal;
