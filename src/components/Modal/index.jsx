import React from 'react';

const ConfirmModal = ({ show, setShow, message, handleConfirm }) => {
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.4)]">
        <div className="relative w-full max-w-md px-6 py-4 bg-white rounded shadow-lg dark:bg-boxdark sm:max-w-sm md:max-w-md lg:max-w-lg sm:px-6 lg:px-8 m-4 sm:m-6">
          {/* Close Button */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center mb-6">
            <svg
              className="mx-auto mb-4 text-red-600 w-14 h-14 dark:text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">{message}</h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
            >
              ຕົກລົງ
            </button>
            <button
              onClick={() => setShow(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto"
            >
              ຍົກເລິກ
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
    </>
  );
};

export default ConfirmModal;
