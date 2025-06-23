'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { Inheader } from './invocieheader';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { Plus, CreditCard } from 'lucide-react';
import ConfirmModal from '@/components/Modal';
import BillPopup from '../Service/Treatment/BillPopup';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const dispatch = useDispatch();
  const iconAdd = <Plus size={16} />;
  const iconPay = <CreditCard size={16} />;
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [billData, setBillData] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState(null);
  const [isRefundMode, setIsRefundMode] = useState(false);
  // const fetchInvoices = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('http://localhost:4000/src/invoice/invoice');
  //     const data = await response.json();
  //     setInvoices(data.data || []);
  //   } catch (error) {
  //     dispatch(
  //       openAlert({
  //         type: 'error',
  //         title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
  //         message: error.message || 'ເກີດຂໍ້ຜິດພາດ',
  //       }),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCancelInvoice = async () => {
    if (!selectedInvoiceId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/invoice/cancel/${selectedInvoiceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error('ບໍ່ສາມາດຍົກເລີກໃບບິນໄດ້');

      dispatch(
        openAlert({
          type: 'success',
          title: 'ຍົກເລີກໃບບິນ',
          message: 'ຍົກເລີກໃບບິນສຳເລັດແລ້ວ',
        }),
      );

      fetchInvoices();
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຍົກເລີກບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ',
        }),
      );
    } finally {
      setShowModal(false);
      setSelectedInvoiceId(null);
    }
  };
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/invoice/invoice');
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
          message: error.message || 'ເກີດຂໍ້ຜິດພາດ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceDetail = async (invoiceId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/src/invoice/invoice/${invoiceId}`,
      );
      const json = await res.json();

      if (json.resultCode === '200') {
        setBillData(json.data);

        if (json.data?.in_id) {
          await fetchInspectionDetails(json.data.in_id);
        }

        setShowBillPopup(true);
        setSelectedInvoiceData(json.data);
      } else {
        dispatch(
          openAlert({
            type: 'error',
            title: 'ດຶງໃບບິນບໍ່ສຳເລັດ',
            message: json.message || 'ຂໍອະໄພ ເກີດຂໍ້ຜິດພາດ',
          }),
        );
      }
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message,
        }),
      );
    }
  };

  // const fetchInvoiceDetail = async (invoiceId) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:4000/src/invoice/invoice/${invoiceId}`,
  //     );

  //     const json = await res.json();
  //     if (json.resultCode === '200') {
  //       setBillData(json.data);
  //       setShowBillPopup(true);
  //       setSelectedInvoiceData(json.data);
  //     } else {
  //       dispatch(
  //         openAlert({
  //           type: 'error',
  //           title: 'ດຶງໃບບິນບໍ່ສຳເລັດ',
  //           message: json.message || 'ຂໍອະໄພ ເກີດຂໍ້ຜິດພາດ',
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     dispatch(
  //       openAlert({
  //         type: 'error',
  //         title: 'ເກີດຂໍ້ຜິດພາດ',
  //         message: error.message,
  //       }),
  //     );
  //   }
  // };
  const fetchInspectionDetails = async (inspectionId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/report/inspection`,
      );
      const data = await response.json();

      if (response.ok) {
        let inspection = null;

        if (data.detail && Array.isArray(data.detail)) {
          inspection = data.detail.find((item) => item.in_id === inspectionId);
        } else if (data.data && Array.isArray(data.data)) {
          inspection = data.data.find((item) => item.in_id === inspectionId);
        } else if (Array.isArray(data)) {
          inspection = data.find((item) => item.in_id === inspectionId);
        }

        console.log('Found inspection:', inspection);
        setInspectionDetails(inspection);

        if (inspection) {
          setBillData((prevData) => ({
            ...prevData,
            ...inspection,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
    }
  };
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) =>
      invoice.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [invoices, searchQuery]);

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          className: 'bg-yellow-100 text-yellow-700',
          text: 'ລໍຕິິ່ນຊຳລະ',
        };
      case 'PAID':
        return {
          className: 'bg-green-100 text-green-700',
          text: 'ຊຳລະແລ້ວ',
        };
      case 'CANCEL':
        return {
          className: 'bg-red-100 text-red-500',
          text: 'CANCEL',
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-700',
          text: status,
        };
    }
  };

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການໃບບິນທັງໝົດ
          </h1>
        </div>

        {/* Search */}
        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາລະຫັດໃບບິນ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {Inheader.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 tracking-wide text-form-input font-semibold"
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice, idx) => {
                  const statusInfo = getStatusDisplay(invoice.status);
                  return (
                    <tr
                      key={idx}
                      className="border-b text-md border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2">{invoice.invoice_id}</td>
                      <td className="px-4 py-2">
                        {new Date(invoice.date).toLocaleString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </td>

                      <td className="px-4 py-2 text-left">
                        <span
                          className={`inline-block rounded-full px-3 mt-3 py-1 text-center text-sm font-medium ${
                            invoice.status === 'UNPAID'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>

                      <td className="px-4 py-2">{invoice.in_id}</td>
                      <td className="px-4 py-2">
                        {(invoice.total * 1).toLocaleString()}
                      </td>

                      <td className="px-4 py-2">{invoice.emp_id_create}</td>
                      <td className="px-4 py-2">{invoice.emp_id_updated}</td>
                      <td className="px-4 py-2 text-center ">
                        <td className="px-4 py-2 text-center ">
                          <div className="flex flex-wrap gap-2">
                            {invoice.status !== 'CANCEL' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoiceId(invoice.invoice_id);
                                  setShowModal(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded "
                              >
                                ຍົກເລີກ
                              </button>
                            )}

                            {invoice.status !== 'CANCEL' &&
                              invoice.status !== 'PAID' && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoiceId(invoice.invoice_id);
                                    fetchInvoiceDetail(invoice.invoice_id);
                                    setIsRefundMode(true); // ตั้งค่าเป็น refund mode
                                    setShowBillPopup(true); // เปิด popup
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm rounded"
                                >
                                  ຊຳລະເງີນ
                                </button>
                              )}

                            {invoice.status === 'CANCEL' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoiceId(invoice.invoice_id);
                                  fetchInvoiceDetail(invoice.invoice_id);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded"
                              >
                                ເບິ່ງ
                              </button>
                            )}
                          </div>
                        </td>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    ບໍ່ພົບຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showBillPopup && billData && (
        <BillPopup
          isOpen={showBillPopup}
          onClose={() => {
            setShowBillPopup(false);
            setInspectionDetails(null);
            setIsRefundMode(false); // รีเซ็ต refund mode
          }}
          patientData={billData}
          inspectionData={inspectionDetails || billData}
          services={billData?.services || []}
          medicines={billData?.medicines || []}
          invoiceData={billData}
          isRefundMode={isRefundMode}
        />
      )}

      <TablePaginationDemo
        count={filteredInvoices.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານແນ່ໃຈບໍ່ຈະຍົກເລິກໃບບິນ？"
        handleConfirm={handleCancelInvoice}
      />
    </>
  );
};

export default InvoicePage;

// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import { useDispatch } from 'react-redux';
// import { openAlert } from '@/redux/reducer/alert';
// import TablePaginationDemo from '@/components/Tables/Pagination_two';
// import { Inheader } from './invocieheader';
// import Button from '@/components/Button';
// import Search from '@/components/Forms/Search';
// import { Plus } from 'lucide-react';
// import ConfirmModal from '@/components/Modal';

// const InvoicePage = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const dispatch = useDispatch();
//   const iconAdd = <Plus size={16} />;
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

//   const fetchInvoices = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/src/invoice/invoice');
//       const data = await response.json();
//       setInvoices(data.data || []);
//     } catch (error) {
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
//           message: error.message || 'ເກີດຂໍ້ຜິດພາດ',
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const handleCancelInvoice = async () => {
//     if (!selectedInvoiceId) return;

//     try {
//       const response = await fetch(
//         `http://localhost:4000/src/invoice/cancel/${selectedInvoiceId}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//         },
//       );

//       if (!response.ok) throw new Error('ບໍ່ສາມາດຍົກເລີກໃບບິນໄດ້');

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ຍົກເລີກໃບບິນ',
//           message: 'ຍົກເລີກໃບບິນສຳເລັດແລ້ວ',
//         }),
//       );

//       fetchInvoices();
//     } catch (error) {
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ຍົກເລີກບໍ່ສຳເລັດ',
//           message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ',
//         }),
//       );
//     } finally {
//       setShowModal(false);
//       setSelectedInvoiceId(null);
//     }
//   };

//   const filteredInvoices = useMemo(() => {
//     return invoices.filter((invoice) =>
//       invoice.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()),
//     );
//   }, [invoices, searchQuery]);

//   const paginatedInvoices = filteredInvoices.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   return (
//     <>
//       <div className="rounded bg-white pt-4 dark:bg-boxdark">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
//           <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
//             ຈັດການໃບບິນທັງໝົດ
//           </h1>
//           {/* <div className="flex items-center gap-2">
//             <Button
//               onClick={() => setShowAddCategoryModal(true)}
//               icon={iconAdd}
//               className="bg-primary"
//             >
//               ເພີ່ມຂໍ້ມູນໃບບິນ
//             </Button>
//           </div> */}
//         </div>

//         {/* Search */}
//         <div className="grid w-full gap-4 p-4">
//           <Search
//             type="text"
//             name="search"
//             placeholder="ຄົ້ນຫາລະຫັດໃບບິນ..."
//             className="rounded border border-stroke dark:border-strokedark"
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Table */}
//      <div className="overflow-x-auto  shadow-md">
//           <table className="w-full min-w-max table-auto  ">
//               <thead>
//                 <tr className="text-left bg-gray border border-stroke">
//                   {Inheader.map((header, index) => (
//                     <th
//                       key={index}
//                       className="px-4 py-3 tracking-wide text-form-input  font-semibold"
//                     >
//                       {header.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedInvoices.length > 0 ? (
//                   paginatedInvoices.map((invoice, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-b text-md border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="px-4 py-2">{invoice.invoice_id}</td>
//                       <td className="px-4 py-2">
//                         {new Date(invoice.date).toLocaleString('en-US', {
//                           day: '2-digit',
//                           month: '2-digit',
//                           year: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           second: '2-digit',
//                           hour12: false,
//                         })}
//                       </td>

//                       <td
//                         className={`inline-block rounded-full px-3 mt-3 py-1 text-center text-sm font-medium ${
//                           invoice.status === 'CANCEL'
//                             ? 'bg-red-100 text-red-500'
//                             : 'bg-yellow-100 text-yellow-700'
//                         }`}
//                       >
//                         {invoice.status}
//                       </td>

//                       <td className="px-4 py-2">{invoice.in_id}</td>
//                       <td className="px-4 py-2">
//                         {' '}
//                         {(invoice.total * 1).toLocaleString()}
//                       </td>

//                       <td className="px-4 py-2">{invoice.emp_id_create}</td>
//                       <td className="px-4 py-2">{invoice.emp_id_updated}</td>
//                       <td className="px-4 py-2 text-center">
//                         <Button
//                           onClick={() => {
//                             setSelectedInvoiceId(invoice.invoice_id);
//                             setShowModal(true);
//                           }}
//                           className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded"
//                         >
//                           ຍົກເລີກ
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center py-4 text-gray-500">
//                       ບໍ່ພົບຂໍ້ມູນ
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//         </div>

//       </div>
//          <TablePaginationDemo
//             count={filteredInvoices.length}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             onPageChange={(_, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value, 10));
//               setPage(0);
//             }}
//           />
//       <ConfirmModal
//         show={showModal}
//         setShow={setShowModal}
//         message="ທ່ານແນ່ໃຈບໍ່ຈະຍົກເລິກໃບບິນ？"
//         handleConfirm={handleCancelInvoice}
//       />
//     </>
//   );
// };

// export default InvoicePage;
// // 'use client';

// // import React, { useEffect, useState, useMemo } from 'react';
// // import { useDispatch } from 'react-redux';
// // import { openAlert } from '@/redux/reducer/alert';
// // import TablePaginationDemo from '@/components/Tables/Pagination_two';
// // import { Inheader } from './invocieheader';
// // import Button from '@/components/Button';
// // import Search from '@/components/Forms/Search';
// // import { Plus, Eye } from 'lucide-react';
// // import ConfirmModal from '@/components/Modal';
// // import BillPopup from '../Service/Treatment/BillPopup';

// // const InvoicePage = () => {
// //   const [invoices, setInvoices] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

// //   // States for BillPopup
// //   const [showBillPopup, setShowBillPopup] = useState(false);
// //   const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
// //   const [patientData, setPatientData] = useState(null);
// //   const [inspectionData, setInspectionData] = useState(null);
// //   const [services, setServices] = useState([]);
// //   const [medicines, setMedicines] = useState([]);

// //   const dispatch = useDispatch();
// //   const iconAdd = <Plus size={16} />;
// //   const iconView = <Eye size={16} />;

// //   const fetchInvoices = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch('http://localhost:4000/src/invoice/invoice');
// //       const data = await response.json();
// //       setInvoices(data.data || []);
// //     } catch (error) {
// //       dispatch(
// //         openAlert({
// //           type: 'error',
// //           title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
// //           message: error.message || 'ເກີດຂໍ້ຜິດພາດ',
// //         }),
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Function to fetch invoice details for BillPopup
// //  const fetchInvoiceDetails = async (invoiceId) => {
// //   try {
// //     if (!invoiceId) throw new Error("Missing invoiceId");

// //     // Fetch invoice details
// //     const invoiceResponse = await fetch(`http://localhost:4000/src/invoice/invoice/${invoiceId}`);
// //     const invoiceResult = await invoiceResponse.json();

// //     if (!invoiceResponse.ok || !invoiceResult.data) {
// //       throw new Error('ไม่สามารถดึงข้อมูลใบบิลได้');
// //     }

// //     const invoice = invoiceResult.data;

// //     // ใช้ patient_id จาก invoice แทน in_id
// //     if (!invoice.patient_id) throw new Error("ไม่มี patient_id ในข้อมูล invoice");

// //     // Fetch inspection data ล่าสุดของ patient_id (GET /inspection/:patient_id)
// //     const inspectionResponse = await fetch(`http://localhost:4000/src/inspection/${invoice.patient_id}`);
// //     const inspectionResult = await inspectionResponse.json();

// //     if (!inspectionResponse.ok || !inspectionResult.data) {
// //       throw new Error('ไม่สามารถดึงข้อมูลการตรวจได้');
// //     }

// //     const inspection = inspectionResult.data;

// //     // Fetch patient data
// //     const patientResponse = await fetch(`http://localhost:4000/src/patient/${inspection.patient_id}`);
// //     const patientResult = await patientResponse.json();

// //     if (!patientResponse.ok || !patientResult.data) {
// //       throw new Error('ไม่สามารถดึงข้อมูลผู้ป่วยได้');
// //     }

// //     // Fetch services and medicines data
// //     const servicesResponse = await fetch(`http://localhost:4000/src/inspection/services/${inspection.in_id}`);
// //     const servicesResult = await servicesResponse.json();

// //     const medicinesResponse = await fetch(`http://localhost:4000/src/inspection/medicines/${inspection.in_id}`);
// //     const medicinesResult = await medicinesResponse.json();

// //     // Set data for BillPopup
// //     setSelectedInvoiceData(invoice);
// //     setPatientData(patientResult.data);
// //     setInspectionData(inspection);
// //     setServices(servicesResult.data || []);
// //     setMedicines(medicinesResult.data || []);

// //     setShowBillPopup(true);

// //   } catch (error) {
// //     dispatch(
// //       openAlert({
// //         type: 'error',
// //         title: 'เกิดข้อผิดพลาด',
// //         message: error.message || 'ไม่สามารถแสดงใบบิลได้',
// //       }),
// //     );
// //   }
// // };

// //   const handleViewInvoice = (invoice) => {
// //     fetchInvoiceDetails(invoice.invoice_id);
// //   };

// //   const handleCancelInvoice = async () => {
// //     if (!selectedInvoiceId) return;

// //     try {
// //       const response = await fetch(
// //         `http://localhost:4000/src/invoice/cancel/${selectedInvoiceId}`,
// //         {
// //           method: 'PUT',
// //           headers: { 'Content-Type': 'application/json' },
// //         },
// //       );

// //       if (!response.ok) throw new Error('ບໍ່ສາມາດຍົກເລີກໃບບິນໄດ້');

// //       dispatch(
// //         openAlert({
// //           type: 'success',
// //           title: 'ຍົກເລີກໃບບິນ',
// //           message: 'ຍົກເລີກໃບບິນສຳເລັດແລ້ວ',
// //         }),
// //       );

// //       fetchInvoices();
// //     } catch (error) {
// //       dispatch(
// //         openAlert({
// //           type: 'error',
// //           title: 'ຍົກເລີກບໍ່ສຳເລັດ',
// //           message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ',
// //         }),
// //       );
// //     } finally {
// //       setShowModal(false);
// //       setSelectedInvoiceId(null);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchInvoices();
// //   }, []);

// //   const filteredInvoices = useMemo(() => {
// //     return invoices.filter((invoice) =>
// //       invoice.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()),
// //     );
// //   }, [invoices, searchQuery]);

// //   const paginatedInvoices = filteredInvoices.slice(
// //     page * rowsPerPage,
// //     page * rowsPerPage + rowsPerPage,
// //   );

// //   return (
// //     <>
// //       <div className="rounded bg-white pt-4 dark:bg-boxdark">
// //         {/* Header */}
// //         <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
// //           <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
// //             ຈັດການໃບບິນທັງໝົດ
// //           </h1>
// //         </div>

// //         {/* Search */}
// //         <div className="grid w-full gap-4 p-4">
// //           <Search
// //             type="text"
// //             name="search"
// //             placeholder="ຄົ້ນຫາລະຫັດໃບບິນ..."
// //             className="rounded border border-stroke dark:border-strokedark"
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //           />
// //         </div>

// //         {/* Table */}
// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <p className="text-center py-4">ກຳລັງໂຫຼດ...</p>
// //           ) : (
// //             <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
// //               <thead>
// //                 <tr className="text-left bg-secondary2 text-white">
// //                   {Inheader.map((header, index) => (
// //                     <th
// //                       key={index}
// //                       className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300"
// //                     >
// //                       {header.name}
// //                     </th>
// //                   ))}

// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {paginatedInvoices.length > 0 ? (
// //                   paginatedInvoices.map((invoice, idx) => (
// //                     <tr
// //                       key={idx}
// //                       className="border-b text-md border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
// //                       onClick={() => handleViewInvoice(invoice)}
// //                     >
// //                       <td className="px-4 py-2">{invoice.invoice_id}</td>
// //                       <td className="px-4 py-2">
// //                         {new Date(invoice.date).toLocaleString('en-US', {
// //                           day: '2-digit',
// //                           month: '2-digit',
// //                           year: 'numeric',
// //                           hour: '2-digit',
// //                           minute: '2-digit',
// //                           second: '2-digit',
// //                           hour12: false,
// //                         })}
// //                       </td>

// //                       <td
// //                         className={`inline-block rounded-full px-3 mt-3 py-1 text-center text-sm font-medium ${
// //                           invoice.status === 'CANCEL'
// //                             ? 'bg-red-100 text-red-500'
// //                             : 'bg-yellow-100 text-yellow-700'
// //                         }`}
// //                       >
// //                         {invoice.status}
// //                       </td>

// //                       <td className="px-4 py-2">{invoice.in_id}</td>
// //                       <td className="px-4 py-2">
// //                         {(invoice.total * 1).toLocaleString()}
// //                       </td>

// //                       <td className="px-4 py-2">{invoice.emp_id_create}</td>
// //                       <td className="px-4 py-2">{invoice.emp_id_updated}</td>
// //                       <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
// //                         <div className="flex gap-2">
// //                           <Button
// //                             onClick={() => handleViewInvoice(invoice)}
// //                             className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-sm rounded"
// //                           >
// //                             ຊຳລະເງຶນ
// //                           </Button>
// //                           <Button
// //                             onClick={() => {
// //                               setSelectedInvoiceId(invoice.invoice_id);
// //                               setShowModal(true);
// //                             }}
// //                             className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded"
// //                           >
// //                             ຍົກເລີກ
// //                           </Button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="9" className="text-center py-4 text-gray-500">
// //                       ບໍ່ພົບຂໍ້ມູນ
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>

// //       <TablePaginationDemo
// //         count={filteredInvoices.length}
// //         page={page}
// //         rowsPerPage={rowsPerPage}
// //         onPageChange={(_, newPage) => setPage(newPage)}
// //         onRowsPerPageChange={(e) => {
// //           setRowsPerPage(parseInt(e.target.value, 10));
// //           setPage(0);
// //         }}
// //       />

// //       <ConfirmModal
// //         show={showModal}
// //         setShow={setShowModal}
// //         message="ທ່ານແນ່ໃຈບໍ່ຈະຍົກເລິກໃບບິນ？"
// //         handleConfirm={handleCancelInvoice}
// //       />

// //       {/* BillPopup */}
// //       <BillPopup
// //         isOpen={showBillPopup}
// //         onClose={() => {
// //           setShowBillPopup(false);
// //           setSelectedInvoiceData(null);
// //           setPatientData(null);
// //           setInspectionData(null);
// //           setServices([]);
// //           setMedicines([]);
// //           // Refresh invoices after payment
// //           fetchInvoices();
// //         }}
// //         patientData={patientData}
// //         inspectionData={inspectionData}
// //         services={services}
// //         medicines={medicines}
// //       />
// //     </>
// //   );
// // };

// // export default InvoicePage;
