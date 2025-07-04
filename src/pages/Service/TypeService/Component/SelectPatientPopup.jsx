import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Users, X } from 'lucide-react';
import SearchBox from '../../../../components/Forms/Search_New';

const SelectPatientPopup = ({ patients, onClose, onSelect, callback }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) => {
        const patientDataString = Object.values(patient)
          .filter((v) => v !== null && v !== undefined)
          .map((v) => String(v).toLowerCase())
          .join(' ');

        return patientDataString.includes(searchQuery.toLowerCase());
      });
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const handleConfirm = async () => {
    if (!selectedPatient) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/src/in/inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: selectedPatient.patient_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Inspection created:', data);
      callback(data?.data);

      if (onSelect) {
        onSelect({
          ...selectedPatient,
          inspectionId: data.in_id || data.id, 
          inspectionDate: new Date().toISOString().split('T')[0], 
        });
      }

      handleClose();
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`px-4 fixed inset-0 bg-black transition-opacity duration-300 ease-in-out flex items-center justify-center z-50 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`}
      >
        <div
          className={`bg-white rounded shadow-xl p-4 w-full md:max-w-lg lg:max-w-xl relative h-[680px] transition-all duration-300 transform flex flex-col ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className="flex items-center justify-between py-2 flex-shrink-0">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
              ເລືອກຄົນເຈັບ
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Section */}
          <div className=" border-b border-gray-100 flex-shrink-0">
            <div className="grid w-full">
              <SearchBox
                type="text"
                name="search"
                placeholder="ຄົ້ນຫາຊື່..."
                className="rounded border border-stroke dark:border-strokedark"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            <div className="py-4 flex items-center justify-between text-sm text-gray-500">
              <span>ທັງໝົດ {filteredPatients.length} ຄົນ</span>
              {selectedPatient && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>ເລືອກແລ້ວ</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-2">
            {filteredPatients.length > 0 ? (
              <div className="divide-y divide-stroke">
                {[...filteredPatients]
                  .sort((a, b) =>
                    a.patient_id === 'PT0'
                      ? -1
                      : b.patient_id === 'PT0'
                        ? 1
                        : 0,
                  )
                  .map((patient) => (
                    <div
                      key={patient.patient_id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        selectedPatient?.patient_id === patient.patient_id
                          ? 'bg-purple-50 border-r-4 border-purple-800'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            selectedPatient?.patient_id === patient.patient_id
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-stone-00 text-stone-400'
                          }`}
                        >
                          <User className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              ລະຫັດຄົນເຈັບ: {patient.patient_id}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                patient.gender === 'ຊາຍ'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-pink-100 text-pink-800'
                              }`}
                            >
                              {patient.gender}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ຊື່ ແລະ ນາມສະກຸນ:{' '}
                            <span className="font-mono">
                              {patient.patient_name} {patient.patient_surname}
                            </span>
                          </div>
                        </div>

                        {selectedPatient?.patient_id === patient.patient_id && (
                          <CheckCircle className="w-5 h-5 text-form-input" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className=" bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ</p>
                <p className="text-gray-400 text-sm mt-1">ລອງປ່ອນຄຳຄົ້ນຫາໃໝ່</p>
              </div>
            )}
          </div>

          {/* Fixed Footer Buttons */}
          <div className="border-t border-gray-200 bg-white flex-shrink-0 py-2">
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                disabled={loading}
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedPatient || loading}
                className={`px-4 py-2 text-white rounded shadow-sm transition-colors ${
                  selectedPatient && !loading
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-200 cursor-not-allowed'
                }`}
              >
                {loading ? 'ກຳລັງສົ່ງ...' : 'ຢືນຢັນ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectPatientPopup;
// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import SearchBox from '../../../../components/Forms/Search_New';

// const SelectPatientPopup = ({ patients, onClose, onSelect }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredPatients, setFilteredPatients] = useState(patients);

//   useEffect(() => {
//     setTimeout(() => setIsVisible(true), 50);
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, []);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(onClose, 200);
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredPatients(patients);
//     } else {
//       const filtered = patients.filter((patient) => {
//         const patientDataString = Object.values(patient)
//           .filter((v) => v !== null && v !== undefined)
//           .map((v) => String(v).toLowerCase())
//           .join(' ');

//         return patientDataString.includes(searchQuery.toLowerCase());
//       });
//       setFilteredPatients(filtered);
//     }
//   }, [searchQuery, patients]);

//   const handleConfirm = async () => {
//     if (!selectedPatient) return;

//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:4000/src/in/inspection', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patient_id: selectedPatient.patient_id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       // console.log('Inspection created:', data);

//       if (onSelect) {
//         onSelect(selectedPatient);
//       }

//       handleClose();
//     } catch (error) {
//       console.error('Error:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`px-4 fixed inset-0 bg-black transition-opacity duration-300 ease-in-out flex items-center justify-center z-50 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`}
//     >
//       <div
//         className={`bg-white p-4 rounded shadow-xl w-full md:max-w-lg lg:max-w-xl relative overflow-auto h-[600px] max-h-[100vh] transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
//             ເລືອກຄົນເຈັບ
//           </h2>
//           <button
//             onClick={handleClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="grid w-full py-2">
//           <SearchBox
//             type="text"
//             name="search"
//             placeholder="ຄົ້ນຫາຊື່..."
//             className="rounded border border-stroke dark:border-strokedark"
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//             }}
//           />
//         </div>

//         <div className="border border-purple-100 rounded overflow-hidden mb-4">
//           <ul className="h-[450px] md:-[500px] lg:h-[600px]  divide-y divide-purple-100">
//             {filteredPatients.length > 0 ? (
//               [...filteredPatients]
//                 .sort((a, b) =>
//                   a.patient_id === 'PT0' ? -1 : b.patient_id === 'PT0' ? 1 : 0,
//                 )
//                 .map((p) => (
//                   <li
//                     key={p.patient_id}
//                     onClick={() => setSelectedPatient(p)}
//                     className={`p-4 transition-colors cursor-pointer ${
//                       selectedPatient?.patient_id === p.patient_id
//                         ? 'bg-purple-200'
//                         : 'hover:bg-purple-100'
//                     }`}
//                   >
//                     <div className="font-medium">
//                       {p.patient_id} {p.patient_name} {p.patient_surname}{' '}
//                       {p.gender}
//                     </div>
//                   </li>
//                 ))
//             ) : (
//               <li className="p-4 text-center text-gray-500">
//                 ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ
//               </li>
//             )}
//           </ul>
//         </div>

//         <div className="sticky bottom-0 bg-white pt-2 pb-0 mt-auto">
//           <div className="flex justify-end space-x-2 border-t pt-4">
//             <button
//               onClick={handleClose}
//               className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//               disabled={loading}
//             >
//               ຍົກເລີກ
//             </button>
//             <button
//               onClick={handleConfirm}
//               disabled={!selectedPatient || loading}
//               className={`px-4 py-2 text-white rounded shadow-sm transition-colors ${
//                 selectedPatient && !loading
//                   ? 'bg-blue-500 hover:bg-blue-600'
//                   : 'bg-blue-200 cursor-not-allowed'
//               }`}
//             >
//               {loading ? 'ກຳລັງສົ່ງ...' : 'ຢືນຢັນ'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectPatientPopup;
