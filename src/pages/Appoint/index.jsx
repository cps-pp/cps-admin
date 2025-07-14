// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Search from '@/components/Forms/Search';
// import { Empty } from 'antd';
// import TablePaginationDemo from '@/components/Tables/Pagination_two';
// import { Eye } from 'lucide-react';

// const ReportFollowPatient = () => {
//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const navigate = useNavigate();
//   useEffect(() => {
//     const visiblePatients = patients.filter((p) => p.patient_id !== 'PT0');

//     if (searchQuery.trim() === '') {
//       setFilteredPatients(visiblePatients);
//     } else {
//       const filtered = visiblePatients.filter(
//         (patient) =>
//           patient.patient_name
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//       setFilteredPatients(filtered);
//     }
//   }, [searchQuery, patients]);

//   const fetchPatients = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:4000/src/report/patient');
//       const data = await response.json();
//       if (data.resultCode === '200') {
//         const filtered = (data.data || []).filter(
//           (p) => p.patient_id !== 'PT0',
//         );
//         setPatients(filtered);
//         setFilteredPatients(filtered);
//       }
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredPatients(patients);
//     } else {
//       const filtered = patients.filter(
//         (patient) =>
//           patient.patient_name
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//       setFilteredPatients(filtered);
//     }
//   }, [searchQuery, patients]);

//   const handleRowClick = (patient) => {
//     navigate(`/follow-treatment/detail/${patient.patient_id}`, {
//       state: { patient },
//     });
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedPatients = filteredPatients.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   return (
//     <>
//     <div className="rounded bg-white pt-4 border border-stroke">
//       <div className="flex items-center justify-between border-b border-stroke px-4 pb-4">
//         <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
//           ລາຍຊື່ຄົນເຈັບ
//         </h1>
//       </div>

//       <div className="grid w-full gap-4 p-4">
//         <Search
//           type="text"
//           name="search"
//           placeholder="ຄົ້ນຫາຊື່ຄົນເຈັບ..."
//           className="rounded border border-stroke"
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-max table-auto">
//           <thead>
//             <tr className="text-left bg-gray border border-stroke text-form-input">
//               <th className="px-4 py-3">ລະຫັດຄົນເຈັບ</th>
//               <th className="px-4 py-3">ຊື່</th>
//               <th className="px-4 py-3">ເພດ</th>
//               <th className="px-4 py-3">ວັນເກີດ</th>
//               <th className="px-4 py-3">ເບີໂທ 1</th>
//               <th className="px-4 py-3">ເບີໂທ 2</th>
//               <th className="px-4 py-3">ທີ່ຢູ່</th>
//               <th className="px-4 py-3">ຈັດການ</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedPatients.length > 0 ? (
//               paginatedPatients.map((patient, index) => (
//                 <tr
//                   key={index}
//                   className="border-b border-stroke hover:bg-secondary2/5 cursor-pointer"
//                   onClick={() => handleRowClick(patient)}
//                 >
//                   <td className="px-4 py-4">{patient.patient_id}</td>
//                   <td className="px-4 py-4">
//                     {patient.patient_name} {patient.patient_surname}
//                   </td>
//                   <td className="px-4 py-4">{patient.gender}</td>
//                   <td className="px-4 py-4">
//                     {new Date(patient.dob).toLocaleDateString('en-GB')}
//                   </td>
//                   <td className="px-4 py-4">{patient.phone1}</td>
//                   <td className="px-4 py-4">{patient.phone2 || '-'}</td>
//                   <td className="px-4 py-4">
//                     {patient.village} {patient.district} {patient.province}
//                   </td>
//                   <td className="px-4 py-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(
//                           `/follow-treatment/detail/${patient.patient_id}`,
//                         );
//                       }}
//                       className="inline-flex items-center px-3 py-1 text-md font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
//                     >
//                      <Eye className="w-4 h-4" />  ເບີ່ງ
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={8} className="py-4 text-center text-gray-500">
//                   <div className="text-center">
//                     <div className="w-32 h-32 flex items-center justify-center mx-auto">
//                       <Empty description={false} />
//                     </div>
//                     <p className="text-lg">ບໍ່ພົບຂໍ້ມູນ</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//     </div>
//       <TablePaginationDemo
//         count={filteredPatients.length}
//         page={page}
//         onPageChange={handlePageChange}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleRowsPerPageChange}
//       />
//     </>
//   );
// };

// export default ReportFollowPatient;
