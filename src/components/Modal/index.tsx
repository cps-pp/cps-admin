import React from 'react';

interface IConfirmModal {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  handleConfirm: () => void;
}

const ConfirmModal: React.FC<IConfirmModal> = ({ show, setShow, message, handleConfirm }) => {
  return (
    <>
      {show && (
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
      )}
    </>
  );
};

export default ConfirmModal;


// interface IModalConfirmModal {
//   show: boolean;
//   setShow: any;
//   title?: string;
//   message: string;
//   handleConfirm: any;
// }

// export default function ConfirmModal({
//   show,
//   setShow,
//   // title,
//   message,
//   handleConfirm,
// }: IModalConfirmModal) {
//   return (
//     <>
//       {show ? (
//         <>
//           <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(34,37,64,0.8)]">
//             <div className="relative my-6 mx-auto w-[700px] px-4">
//               {/*content*/}
//               <div className="relative z-10 flex flex-col w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
//                 <div className="p-4 md:p-5 text-center">
//                   <svg
//                     className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                     />
//                   </svg>
//                   <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//                     {message}
//                   </h3>
//                   <button
//                     onClick={handleConfirm}
//                     type="button"
//                     className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
//                   >
//                     Yes, I'm sure
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShow(false)}
//                     className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-black"
//                   >
//                     No, cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//       ) : null}
//     </>
//   );
// }
