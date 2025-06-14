// import {
//   X,
//   Printer,
//   FileText,
//   Plus,
//   User,
//   CreditCard,
//   Hash,
//   Receipt,
//   CheckCircle,
// } from 'lucide-react';
// import Logo from '../../../images/logo/cps.png';
// import React, { useState, useEffect } from 'react';
// const BillPopup = ({
//   isOpen,
//   onClose,
//   patientData,
//   inspectionData,
//   services = [],
//   medicines = [],
// }) => {
//   if (!isOpen) return null;
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentType, setPaymentType] = useState('CASH');

//   const [partialAmount, setPartialAmount] = useState(0);
//   const [paymentStatus, setPaymentStatus] = useState('pending');
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [paymentData, setPaymentData] = useState(null);
//   const [invoiceList, setInvoiceList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Currency exchange states
//   const [exchangeRates, setExchangeRates] = useState([]);
//   const [selectedCurrency, setSelectedCurrency] = useState('LAK');
//   const [currentExchangeRate, setCurrentExchangeRate] = useState(1);

//   const totalServiceCost = services.reduce(
//     (total, service) => total + service.price * service.qty,
//     0,
//   );

//   const totalMedicineCost = medicines.reduce(
//     (total, medicine) => total + medicine.price * medicine.qty,
//     0,
//   );

//   const grandTotal = totalServiceCost + totalMedicineCost;
//   const convertedGrandTotal = grandTotal * currentExchangeRate;

//   const processPayment = async () => {
//     // if (!invoiceData?.invoice_id || !paymentAmount) {
//     //   alert('กรุณากรอกจำนวนเงิน');
//     //   return;
//     // }

//     const amount = parseFloat(paymentAmount);
//     const remainingDebt = invoiceData.debt_amount || invoiceData.debt || 0;

//     // if (amount <= 0 || amount > remainingDebt) {
//     //   alert('จำนวนเงินไม่ถูกต้อง');
//     //   return;
//     // }

//     setLoading(true);
//     try {
//       const paymentPayload = {
//         invoice_id: invoiceData.invoice_id,
//         paid_amount: Math.round(amount),
//         pay_type: paymentType,
//         ex_id:
//           exchangeRates.find((rate) => rate.ex_type === selectedCurrency)
//             ?.ex_id || 1,
//         ex_rate: currentExchangeRate,
//       };

//       const response = await fetch(
//         'http://localhost:4000/src/payment/payment',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(paymentPayload),
//         },
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Payment processed:', data);

//         const newDebtAmount = remainingDebt - amount;
//         const updatedInvoice = {
//           ...invoiceData,
//           debt_amount: newDebtAmount,
//           debt: newDebtAmount,
//           status: newDebtAmount === 0 ? 'paid' : 'partial',
//         };

//         setInvoiceData(updatedInvoice);
//         setPaymentAmount('');
//         setShowPaymentModal(false);

//         await fetchPaymentHistory();
//         await fetchInvoiceList();

//         alert('ชำระเงินสำเร็จ');
//       } else {
//         const errorData = await response.json();
//         console.error('Payment failed:', errorData);
//         // alert('ບໍ່ສາມາດຊຳລະເງິນໄດ້: ' + (errorData.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       alert('ເກີດຂໍ້ຜິດພາດໃນການຊຳລະເງິນ');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (invoiceData?.invoice_id) {
//       fetchPaymentHistory();
//     }
//   }, [invoiceData?.invoice_id]);

//   // ----------------------------------------------------------------------
//   // Invoice API Functions
//   const fetchInvoiceList = async () => {
//     try {
//       const response = await fetch(
//         'http://localhost:4000/src/invoice/invoice',
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setInvoiceList(data.data || []);
//         // Check if invoice already exists for this inspection
//         const existingInvoice = data.data?.find(
//           (inv) => inv.in_id === inspectionData?.in_id,
//         );
//         if (existingInvoice) {
//           setInvoiceData(existingInvoice);
//           setPaymentStatus(existingInvoice.status || 'pending');
//         }
//       } else {
//         console.error('Failed to fetch invoice list');
//       }
//     } catch (error) {
//       console.error('Error fetching invoice list:', error);
//     }
//   };

//   const createInvoice = async () => {
//     if (!inspectionData?.in_id) {
//       console.error('Inspection ID is required');
//       return;
//     }

//     setLoading(true);
//     try {
//       const invoicePayload = {
//         total: Math.round(convertedGrandTotal),
//         in_id: inspectionData.in_id,
//       };

//       const response = await fetch(
//         'http://localhost:4000/src/invoice/invoice',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(invoicePayload),
//         },
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Invoice created:', data);

//         // Create invoice data structure
//         const newInvoice = {
//           invoice_id: data.invoice_id || `INV-${Date.now()}`,
//           in_id: inspectionData.in_id,
//           total: Math.round(convertedGrandTotal),
//           pay_amount: Math.round(convertedGrandTotal),
//           debt_amount: Math.round(convertedGrandTotal),
//           debt: Math.round(convertedGrandTotal),
//           status: 'pending',
//           ex_rate: currentExchangeRate,
//           ex_type: selectedCurrency,
//           date: new Date().toISOString(),
//           ...data,
//         };

//         setInvoiceData(newInvoice);
//         await fetchInvoiceList(); // Refresh the list
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to create invoice:', errorData);
//         alert(
//           'ບໍ່ສາມາດສ້າງໃບແຈ້ງໜີ້ໄດ້: ' + (errorData.message || 'Unknown error'),
//         );
//       }
//     } catch (error) {
//       console.error('Error creating invoice:', error);
//       alert('ເກີດຂໍ້ຜິດພາດໃນການສ້າງໃບແຈ້ງໜີ້');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelInvoice = async (invoiceId) => {
//     if (!invoiceId) {
//       console.error('Invoice ID is required');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `http://localhost:4000/src/invoice/cancel/${invoiceId}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Invoice cancelled:', data);

//         // Update local state
//         setInvoiceData((prev) => ({
//           ...prev,
//           status: 'cancelled',
//         }));

//         setPaymentStatus('cancelled');
//         await fetchInvoiceList(); // Refresh the list
//         alert('ໃບແຈ້ງໜີ້ຖືກຍົກເລີກແລ້ວ');
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to cancel invoice:', errorData);
//         alert(
//           'ບໍ່ສາມາດຍົກເລີກໃບແຈ້ງໜີ້ໄດ້: ' +
//             (errorData.message || 'Unknown error'),
//         );
//       }
//     } catch (error) {
//       console.error('Error cancelling invoice:', error);
//       alert('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກໃບແຈ້ງໜີ້');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch exchange rates when component mounts
//   useEffect(() => {
//     if (isOpen) {
//       fetchExchangeRates();
//       fetchInvoiceList();
//     }
//   }, [isOpen]);

//   // Update exchange rate when currency changes
//   useEffect(() => {
//     const selectedRate = exchangeRates.find(
//       (rate) => rate.ex_type === selectedCurrency,
//     );
//     if (selectedRate) {
//       setCurrentExchangeRate(selectedRate.ex_rate);
//     } else {
//       setCurrentExchangeRate(1); // Default for LAK
//     }
//   }, [selectedCurrency, exchangeRates]);

//   const fetchExchangeRates = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         'http://localhost:4000/src/manager/exchange',
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setExchangeRates(data.data);
//       } else {
//         console.error('Failed to fetch exchange rates');
//         // Set default LAK rate if API fails
//         setExchangeRates([{ ex_type: 'LAK', ex_rate: 1 }]);
//       }
//     } catch (error) {
//       console.error('Error fetching exchange rates:', error);
//       // Set default LAK rate if API fails
//       setExchangeRates([{ ex_type: 'LAK', ex_rate: 1 }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate Invoice when component mounts (only if no existing invoice)
//   useEffect(() => {
//     if (isOpen && !invoiceData) {
//       // Don't auto-create, let user decide
//       console.log('Ready to create invoice');
//     }
//   }, [isOpen]);

//   // Update invoice when currency changes (only for pending invoices)
//   useEffect(() => {
//     if (invoiceData && invoiceData.status === 'pending') {
//       const updatedInvoice = {
//         ...invoiceData,
//         total: Math.round(convertedGrandTotal),
//         pay_amount: Math.round(convertedGrandTotal),
//         debt_amount: Math.round(convertedGrandTotal),
//         debt: Math.round(convertedGrandTotal),
//         ex_rate: currentExchangeRate,
//         ex_type: selectedCurrency,
//       };
//       setInvoiceData(updatedInvoice);
//     }
//   }, [selectedCurrency, currentExchangeRate, convertedGrandTotal]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('lo-LA', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatCurrency = (amount, currency = selectedCurrency) => {
//     const formattedNumber = new Intl.NumberFormat('lo-LA').format(amount);

//     switch (currency) {
//       case 'USD':
//         return `$${formattedNumber}`;
//       case 'THB':
//         return `${formattedNumber} ฿`;
//       case 'LAK':
//       default:
//         return `${formattedNumber} ກີບ`;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
//         {/* Header - Hidden on print */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-50 print:hidden">
//           <h2 className="text-xl font-semibold text-form-input flex items-center">
//             <Receipt className="mr-3 text-form-strokedark" size={24} />
//             ໃບບິນການປິ່ນປົວ
//           </h2>
//           <div className="flex space-x-3">
//             {/* Invoice Management Buttons */}
//             {!invoiceData && (
//               <button
//                 onClick={createInvoice}
//                 disabled={loading}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-200 disabled:opacity-50"
//               >
//                 <Plus className="mr-2" size={16} />
//                 {loading ? 'ກຳລັງສ້າງ...' : 'ສ້າງໃບແຈ້ງໜີ້'}
//               </button>
//             )}

//             {invoiceData && invoiceData.status === 'pending' && (
//               <button
//                 onClick={() => cancelInvoice(invoiceData.invoice_id)}
//                 disabled={loading}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-200 disabled:opacity-50"
//               >
//                 <X className="mr-2" size={16} />
//                 {loading ? 'ກຳລັງຍົກເລີກ...' : 'ຍົກເລີກໃບແຈ້ງໜີ້'}
//               </button>
//             )}

//             <button
//               onClick={handlePrint}
//               className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded flex items-center transition-colors duration-200"
//             >
//               <Printer className="mr-2" size={16} />
//               ພິມ
//             </button>
//             <button
//               onClick={onClose}
//               className="text-form-strokedark hover:text-form-input p-2 rounded transition-colors duration-200"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Bill Content */}
//         <div className="p-8 print:p-6">
//           {/* Header Section */}
//           <div className="flex justify-between items-start mb-2 pb-6 ">
//             <div className="flex-shrink-0">
//               <img src={Logo} alt="CPS Logo" width={200} className="h-auto" />
//             </div>

//             <div className="text-right">
//               <h1 className="text-2xl font-bold text-form-input mb-4">
//                 ໃບບິນການປິ່ນປົວ
//               </h1>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between items-center min-w-[200px]">
//                   <span className="text-form-strokedark">ເລກທີໃບບິນ:</span>
//                   <span className="font-semibold text-form-input ml-4">
//                     {invoiceData?.invoice_id || 'ຍັງບໍ່ມີໃບແຈ້ງໜີ້'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-form-strokedark">ວັນທີອອກໃບບິລ:</span>
//                   <span className="font-semibold text-form-input ml-4">
//                     {formatDate(invoiceData?.date || new Date())}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Patient & Treatment Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div className="bg-gray-50 p-5">
//               <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
//                 <User className="mr-2 text-form-strokedark" size={18} />
//                 ຂໍ້ມູນຄົນເຈັບ
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ລະຫັດຄົນເຈັບ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.patient_id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.in_id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ຊື່-ນາມສະກູນ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.patient_name || ''}{' '}
//                     {patientData?.patient_surname || ''}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ເພດ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-5 ">
//               <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
//                 <Hash className="mr-2 text-form-strokedark" size={18} />
//                 ຂໍ້ມູນການປິ່ນປົວ
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ວັນທີປິ່ນປົວ:</span>
//                   <span className="font-medium text-form-input">
//                     {formatDate(inspectionData?.date)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ອາການເບື່ອງຕົ້ນ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.symptom}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ການວິເຄາະ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.diseases_now}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ການກວດ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.checkup}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Combined Services and Medicines Table */}
//           <div className="mb-8">
//             <h3 className="font-semibold text-form-input mb-4 text-lg">
//               ລາຍການບໍລິການ ແລະ ຢາທີ່ໃຊ້:
//             </h3>
//             <div className="overflow-x-auto border border-stroke rounded">
//               <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded">
//                 <thead>
//                   <tr className="text-left bg-secondary2 text-white">
//                     <th className="border-b border-gray-200 px-4 py-3 text-left  ">
//                       ລຳດັບ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-left  ">
//                       ລາຍການ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-center  ">
//                       ຈຳນວນ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-right  ">
//                       ລາຄາ/ຫົວ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-right  ">
//                       ລາຄາລວມ
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Services */}
//                   {services.map((service, index) => (
//                     <tr
//                       key={`service-${index}`}
//                       className="border-b border-stroke  hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="px-4 py-3 text-form-strokedark">
//                         {index + 1}
//                       </td>

//                       <td className="px-4 py-3 text-form-input font-medium">
//                         {service.name || service.ser_name || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-center text-form-strokedark">
//                         {service.qty}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-strokedark">
//                         {formatCurrency(service.price * currentExchangeRate)}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-input font-semibold">
//                         {formatCurrency(
//                           service.price * service.qty * currentExchangeRate,
//                         )}
//                       </td>
//                     </tr>
//                   ))}

//                   {/* Medicines */}
//                   {medicines.map((medicine, index) => (
//                     <tr
//                       key={`medicine-${index}`}
//                       className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="px-4 py-3 text-form-strokedark">
//                         {services.length + index + 1}
//                       </td>

//                       <td className="px-4 py-3 text-form-input font-medium">
//                         {medicine.name || medicine.med_name}
//                       </td>
//                       <td className="px-4 py-3 text-center text-form-strokedark">
//                         {medicine.qty}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-strokedark">
//                         {formatCurrency(medicine.price * currentExchangeRate)}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-input font-semibold">
//                         {formatCurrency(
//                           medicine.price * medicine.qty * currentExchangeRate,
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Notes */}
//           {inspectionData?.note && (
//             <div className="mb-8">
//               <h3 className="font-semibold text-form-input mb-3 text-lg">
//                 ໝາຍເຫດ:
//               </h3>
//               <div className="bg-purple-50 border border-purple-200 p-4 rounded">
//                 <p className="text-form-strokedark  leading-relaxed">
//                   {inspectionData.note}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Summary Section */}
//           <div className=" pt-6">
//             <div className="flex justify-end">
//               <div className="w-full max-w-md">
//                 <div className="bg-gray-50 p-6 space-y-4">
//                   {/* Subtotals */}
//                   {services.length > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-form-strokedark">ລວມບໍລິການ:</span>
//                       <span className="font-semibold text-form-input">
//                         {formatCurrency(totalServiceCost * currentExchangeRate)}
//                       </span>
//                     </div>
//                   )}

//                   {medicines.length > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-form-strokedark">ລວມຢາ:</span>
//                       <span className="font-semibold text-form-input">
//                         {formatCurrency(
//                           totalMedicineCost * currentExchangeRate,
//                         )}
//                       </span>
//                     </div>
//                   )}

//                   <div className="border-t border-gray-300 pt-4">
//                     <div className="flex justify-between text-lg">
//                       <span className="font-bold text-form-input">
//                         ລາຄາລວມທັງໝົດ:
//                       </span>
//                       <span className="font-bold text-blue-600 text-xl">
//                         {formatCurrency(convertedGrandTotal)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Payment Info */}
//                   {invoiceData && (
//                     <>
//                       <div className="border-t border-gray-300 pt-4 space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-form-strokedark">
//                             ຈຳນວນເງິນທີ່ຊຳລະ:
//                           </span>
//                           <span className="font-semibold text-green-600">
//                             {formatCurrency(
//                               (invoiceData.pay_amount || invoiceData.total) -
//                                 (invoiceData.debt_amount ||
//                                   invoiceData.debt ||
//                                   0),
//                             )}
//                           </span>
//                         </div>

//                         <div className="flex justify-between text-sm">
//                           <span className="text-form-strokedark">
//                             ຄົງເຫຼືອ:
//                           </span>
//                           <span className="font-semibold text-red-600">
//                             {formatCurrency(
//                               invoiceData.debt_amount || invoiceData.debt || 0,
//                             )}
//                           </span>
//                         </div>

//                         {paymentData && (
//                           <div className="flex justify-between text-sm">
//                             <span className="text-form-strokedark">
//                               ເລກການຊຳລະ:
//                             </span>
//                             <span className="font-semibold text-form-input">
//                               {paymentData.pay_id}
//                             </span>
//                           </div>
//                         )}

//                         <div className="flex justify-between items-center pt-2">
//                           <span className="text-form-strokedark">ສະຖານະ:</span>
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               invoiceData.status === 'paid'
//                                 ? 'bg-green-100 text-green-800'
//                                 : invoiceData.status === 'partial'
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : invoiceData.status === 'cancelled'
//                                     ? 'bg-gray-100 text-gray-800'
//                                     : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {invoiceData.status === 'paid'
//                               ? 'ຊຳລະແລ້ວ'
//                               : invoiceData.status === 'partial'
//                                 ? 'ຊຳລະບາງສ່ວນ'
//                                 : invoiceData.status === 'cancelled'
//                                   ? 'ຍົກເລີກແລ້ວ'
//                                   : 'ຍັງບໍ່ຊຳລະ'}
//                           </span>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setShowPaymentModal(true)}
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-200 disabled:opacity-50 w-fit"
//           >
//             <CreditCard className="mr-2" size={16} />
//             ຊຳລະເງິນ
//           </button>

//           {/* <div className="flex items-center gap-3">
//             <input
//               type="number"
//               min={0}
//               max={convertedGrandTotal}
//               value={partialAmount}
//               onChange={(e) => setPartialAmount(Number(e.target.value))}
//               className="border border-form-strokedark rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="ປ້ອນຈຳນວນເງິນ"
//             />
//             <button
//               onClick={() => handlePartialPayment(partialAmount)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium shadow-md transition-all duration-200"
//             >
//               ຈ່າຍຕາມຈຳນວນທີປ້ອນ
//             </button>
//           </div> */}

//           {paymentHistory.length > 0 && (
//             <div className="mb-8">
//               <h3 className="font-semibold text-form-input mb-4 text-lg flex items-center">
//                 <History className="mr-2 text-form-strokedark" size={18} />
//                 ປະຫວັດການຊຳລະເງິນ
//               </h3>
//               <div className="overflow-x-auto border border-stroke rounded">
//                 <table className="w-full min-w-max table-auto border-collapse">
//                   <thead>
//                     <tr className="text-left bg-blue-50">
//                       <th className="border-b border-gray-200 px-4 py-3 text-left">
//                         ວັນທີ
//                       </th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left">
//                         ເລກການຊຳລະ
//                       </th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-right">
//                         ຈຳນວນເງິນ
//                       </th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-center">
//                         ປະເພດ
//                       </th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-center">
//                         ສະຖານະ
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paymentHistory.map((payment, index) => (
//                       <tr
//                         key={payment.pay_id || index}
//                         className="border-b border-stroke hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-3 text-form-strokedark">
//                           {formatDate(payment.pay_date || payment.date)}
//                         </td>
//                         <td className="px-4 py-3 text-form-input font-medium">
//                           {payment.pay_id}
//                         </td>
//                         <td className="px-4 py-3 text-right text-form-input font-semibold">
//                           {formatCurrency(
//                             payment.paid_amount || payment.amount,
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
//                             {payment.pay_type || 'CASH'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
//                             ສຳເລັດ
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {showPaymentModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
//               <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold text-form-input">
//                       ຊຳລະເງິນ
//                     </h3>
//                     <button
//                       onClick={() => setShowPaymentModal(false)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-form-input mb-2">
//                         ຈຳນວນເງິນຄົງເຫຼືອ
//                       </label>
//                       <div className="text-lg font-bold text-red-600">
//                         {formatCurrency(
//                           invoiceData?.debt_amount || invoiceData?.debt || 0,
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-form-input mb-2">
//                         ຈຳນວນເງິນທີ່ຕ້ອງການຊຳລະ
//                       </label>
//                       <input
//                         type="text"
//                         value={paymentAmount.toLocaleString()}
//                         onChange={(e) => setPaymentAmount(e.target.value)}
//                         className="w-full border border-form-strokedark rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="ກະລຸນາໃສ່ຈຳນວນເງິນ"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-4">
//                       {/* Currency Selector */}
//                       <div className="flex flex-wrap items-center gap-4">
//                         <label className="block text-sm font-medium text-form-input">
//                           ສະກຸນເງິນ:
//                         </label>
//                         <select
//                           value={selectedCurrency}
//                           onChange={(e) => setSelectedCurrency(e.target.value)}
//                           disabled={loading}
//                           className="border border-form-strokedark rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
//                         >
//                           <option value="LAK">LAK (ກີບ)</option>
//                           {exchangeRates
//                             .filter((rate) => rate.ex_type !== 'LAK')
//                             .map((rate) => (
//                               <option key={rate.ex_type} value={rate.ex_type}>
//                                 {rate.ex_type}{' '}
//                                 {rate.ex_type === 'USD'
//                                   ? '($)'
//                                   : rate.ex_type === 'THB'
//                                     ? '(฿)'
//                                     : ''}
//                               </option>
//                             ))}
//                         </select>
//                         {loading && (
//                           <span className="text-sm text-gray-500">
//                             ກຳລັງໂຫລດອັດຕາແລກປ່ຽນ...
//                           </span>
//                         )}
//                         {selectedCurrency !== 'LAK' && (
//                           <span className="text-sm text-gray-600">
//                             ອັດຕາແລກປ່ຽນ: ={' '}
//                             {currentExchangeRate.toLocaleString()}{' '}
//                             {selectedCurrency}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-form-input mb-2">
//                         ປະເພດການຊຳລະ
//                       </label>
//                       <select
//                         value={paymentType}
//                         onChange={(e) => setPaymentType(e.target.value)}
//                         className="w-full border border-form-strokedark rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="CASH">ເງິນສົດ</option>
//                         <option value="CARD">ບັດເຄຣດິດ</option>
//                         <option value="TRANSFER">ໂອນເງິນ</option>
//                         <option value="OTHER">ອື່ນໆ</option>
//                       </select>
//                     </div>

//                     <div className="flex space-x-3 pt-4">
//                       <button
//                         onClick={() => setShowPaymentModal(false)}
//                         className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded transition-colors"
//                       >
//                         ຍົກເລີກ
//                       </button>
//                       <button
//                         onClick={processPayment}
//                         disabled={loading || !paymentAmount}
//                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
//                       >
//                         {loading ? 'ກຳລັງດຳເນີນການ...' : 'ຊຳລະເງິນ'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* Footer */}
//           <div className="mt-12 pt-6 border-t border-gray-200 text-center">
//             <div className="space-y-2">
//               <p className="text-form-input font-medium text-lg">
//                 ຂອບໃຈທີ່ມາໃຊ້ບໍລິການ CPS Client Dental
//               </p>
//               <p className="text-form-strokedark text-sm">
//                 ໂທລະສັບ: 021-888999 | ອີເມວ: info@cps-dental.la
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillPopup;
// import {
//   X,
//   Printer,
//   FileText,
//   User,
//   CreditCard,
//   Hash,
//   Receipt,
//   CheckCircle,
// } from 'lucide-react';
// import Logo from '../../../images/logo/cps.png';
// import React, { useState, useEffect } from 'react';

// const BillPopup = ({
//   isOpen,
//   onClose,
//   patientData,
//   inspectionData,
//   services = [],
//   medicines = [],
// }) => {
//   if (!isOpen) return null;
//   const [partialAmount, setPartialAmount] = useState(0);

//   const [paymentStatus, setPaymentStatus] = useState('pending');
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [paymentData, setPaymentData] = useState(null);

//   const totalServiceCost = services.reduce(
//     (total, service) => total + service.price * service.qty,
//     0,
//   );

//   const totalMedicineCost = medicines.reduce(
//     (total, medicine) => total + medicine.price * medicine.qty,
//     0,
//   );

//   const grandTotal = totalServiceCost + totalMedicineCost;

//   // Generate Invoice when component mounts
//   useEffect(() => {
//     if (isOpen && !invoiceData) {
//       generateInvoice();
//     }
//   }, [isOpen]);

//   const generateInvoice = () => {
//     const newInvoice = {
//       invoice_id: `INV-${Date.now()}`,
//       pay_id: null,
//       date: new Date().toISOString(),
//       pay_amount: grandTotal,
//       debt_amount: grandTotal,
//       debt: grandTotal,
//       status: 'pending',
//       ex_rate: 1,
//       ex_type: 'LAK',
//     };
//     setInvoiceData(newInvoice);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('lo-LA', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ';
//   };

//   const handlePayment = async () => {
//     setPaymentStatus('processing');

//     try {
//       const newPayment = {
//         pay_id: `PAY-${Date.now()}`,
//         in_id: inspectionData?.in_id,
//         date: new Date().toISOString(),
//         amount: grandTotal,
//         debt: 0,
//         status: 'completed',
//       };

//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       const updatedInvoice = {
//         ...invoiceData,
//         pay_id: newPayment.pay_id,
//         debt_amount: 0,
//         debt: 0,
//         status: 'paid',
//       };

//       setPaymentData(newPayment);
//       setInvoiceData(updatedInvoice);
//       setPaymentStatus('completed');

//       setTimeout(() => {
//         setPaymentStatus('pending');
//         onClose();
//       }, 2000);
//     } catch (error) {
//       console.error('Payment failed:', error);
//       setPaymentStatus('failed');
//       setTimeout(() => setPaymentStatus('pending'), 3000);
//     }
//   };

//   const handlePartialPayment = (amount) => {
//     if (amount <= 0 || amount > grandTotal) {
//       alert('ຈຳນວນເງິນບໍ່ຖືກຕ້ອງ');
//       return;
//     }

//     setPaymentStatus('processing');

//     setTimeout(() => {
//       const newPayment = {
//         pay_id: `PAY-${Date.now()}`,
//         in_id: inspectionData?.in_id,
//         date: new Date().toISOString(),
//         amount: amount,
//         debt: grandTotal - amount,
//         status: amount === grandTotal ? 'paid' : 'partial',
//       };

//       const updatedInvoice = {
//         ...invoiceData,
//         pay_id: newPayment.pay_id,
//         debt_amount: grandTotal - amount,
//         debt: grandTotal - amount,
//         status: newPayment.status,
//       };

//       setPaymentData(newPayment);
//       setInvoiceData(updatedInvoice);
//       setPaymentStatus('completed');
//     }, 2000);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
//         {/* Header - Hidden on print */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-50 print:hidden">
//           <h2 className="text-xl font-semibold text-form-input flex items-center">
//             <Receipt className="mr-3 text-form-strokedark" size={24} />
//             ໃບບິນການປິ່ນປົວ
//           </h2>
//           <div className="flex space-x-3">
//             <button
//               onClick={handlePrint}
//               className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded flex items-center transition-colors duration-200"
//             >
//               <Printer className="mr-2" size={16} />
//               ພິມ
//             </button>
//             <button
//               onClick={onClose}
//               className="text-form-strokedark hover:text-form-input p-2 rounded transition-colors duration-200"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Bill Content */}
//         <div className="p-8 print:p-6">
//           {/* Header Section */}
//           <div className="flex justify-between items-start mb-8 pb-6 ">
//             <div className="flex-shrink-0">
//               <img src={Logo} alt="CPS Logo" width={200} className="h-auto" />
//             </div>

//             <div className="text-right">
//               <h1 className="text-2xl font-bold text-form-input mb-4">
//                 ໃບບິນການປິ່ນປົວ
//               </h1>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between items-center min-w-[200px]">
//                   <span className="text-form-strokedark">ເລກທີໃບບິນ:</span>
//                   <span className="font-semibold text-form-input ml-4">
//                     {invoiceData?.invoice_id || 'N/A'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-form-strokedark">ວັນທີອອກໃບບິນ:</span>
//                   <span className="font-semibold text-form-input ml-4">
//                     {formatDate(new Date())}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Patient & Treatment Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div className="bg-gray-50 p-5">
//               <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
//                 <User className="mr-2 text-form-strokedark" size={18} />
//                 ຂໍ້ມູນຄົນເຈັບ
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ລະຫັດຄົນເຈັບ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.patient_id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.in_id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ຊື່-ນາມສະກູນ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.patient_name || ''}{' '}
//                     {patientData?.patient_surname || ''}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ເພດ:</span>
//                   <span className="font-medium text-form-input">
//                     {patientData?.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-5 ">
//               <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
//                 <Hash className="mr-2 text-form-strokedark" size={18} />
//                 ຂໍ້ມູນການປິ່ນປົວ
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ວັນທີປິ່ນປົວ:</span>
//                   <span className="font-medium text-form-input">
//                     {formatDate(inspectionData?.date)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ອາການເບື່ອງຕົ້ນ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.symptom}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ການວິເຄາະ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.diseases_now}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-form-strokedark">ການກວດ:</span>
//                   <span className="font-medium text-form-input">
//                     {inspectionData?.checkup}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Combined Services and Medicines Table */}
//           <div className="mb-8">
//             <h3 className="font-semibold text-form-input mb-4 text-lg">
//               ລາຍການບໍລິການ ແລະ ຢາທີ່ໃຊ້:
//             </h3>
//             <div className="overflow-x-auto border border-stroke rounded">
//               <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded">
//                 <thead>
//                   <tr className="text-left bg-secondary2 text-white">
//                     <th className="border-b border-gray-200 px-4 py-3 text-left  ">
//                       ລຳດັບ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-left  ">
//                       ລາຍການ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-center  ">
//                       ຈຳນວນ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-right  ">
//                       ລາຄາ/ຫົວ
//                     </th>
//                     <th className="border-b border-gray-200 px-4 py-3 text-right  ">
//                       ລາຄາລວມ
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Services */}
//                   {services.map((service, index) => (
//                     <tr
//                       key={`service-${index}`}
//                       className="border-b border-stroke  hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="px-4 py-3 text-form-strokedark">
//                         {index + 1}
//                       </td>

//                       <td className="px-4 py-3 text-form-input font-medium">
//                         {service.name || service.ser_name || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-center text-form-strokedark">
//                         {service.qty}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-strokedark">
//                         {formatCurrency(service.price)}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-input font-semibold">
//                         {formatCurrency(service.price * service.qty)}
//                       </td>
//                     </tr>
//                   ))}

//                   {/* Medicines */}
//                   {medicines.map((medicine, index) => (
//                     <tr
//                       key={`medicine-${index}`}
//                       className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
//                     >
//                       <td className="px-4 py-3 text-form-strokedark">
//                         {services.length + index + 1}
//                       </td>

//                       <td className="px-4 py-3 text-form-input font-medium">
//                         {medicine.name || medicine.med_name}
//                       </td>
//                       <td className="px-4 py-3 text-center text-form-strokedark">
//                         {medicine.qty}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-strokedark">
//                         {formatCurrency(medicine.price)}
//                       </td>
//                       <td className="px-4 py-3 text-right text-form-input font-semibold">
//                         {formatCurrency(medicine.price * medicine.qty)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Notes */}
//           {inspectionData?.note && (
//             <div className="mb-8">
//               <h3 className="font-semibold text-form-input mb-3 text-lg">
//                 ໝາຍເຫດ:
//               </h3>
//               <div className="bg-purple-50 border border-purple-200 p-4 rounded">
//                 <p className="text-form-strokedark  leading-relaxed">
//                   {inspectionData.note}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Summary Section */}
//           <div className=" pt-6">
//             <div className="flex justify-end">
//               <div className="w-full max-w-md">
//                 <div className="bg-gray-50 p-6 space-y-4">
//                   {/* Subtotals */}
//                   {services.length > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-form-strokedark">ລວມບໍລິການ:</span>
//                       <span className="font-semibold text-form-input">
//                         {formatCurrency(totalServiceCost)}
//                       </span>
//                     </div>
//                   )}

//                   {medicines.length > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-form-strokedark">ລວມຢາ:</span>
//                       <span className="font-semibold text-form-input">
//                         {formatCurrency(totalMedicineCost)}
//                       </span>
//                     </div>
//                   )}

//                   <div className="border-t border-gray-300 pt-4">
//                     <div className="flex justify-between text-lg">
//                       <span className="font-bold text-form-input">
//                         ລາຄາລວມທັງໝົດ:
//                       </span>
//                       <span className="font-bold text-blue-600 text-xl">
//                         {formatCurrency(grandTotal)}
//                       </span>
//                     </div>
//                   </div>

//                   {invoiceData && (
//                     <>
//                       <div className="border-t border-gray-300 pt-4 space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-form-strokedark">
//                             ຈຳນວນເງິນທີ່ຊຳລະ:
//                           </span>
//                           <span className="font-semibold text-green-600">
//                             {formatCurrency(
//                               invoiceData.pay_amount - invoiceData.debt_amount,
//                             )}
//                           </span>
//                         </div>

//                         <div className="flex justify-between text-sm">
//                           <span className="text-form-strokedark">
//                             ຄົງເຫຼືອ:
//                           </span>
//                           <span className="font-semibold text-red-600">
//                             {formatCurrency(invoiceData.debt_amount)}
//                           </span>
//                         </div>

//                         {paymentData && (
//                           <div className="flex justify-between text-sm">
//                             <span className="text-form-strokedark">
//                               ເລກການຊຳລະ:
//                             </span>
//                             <span className="font-semibold text-form-input">
//                               {paymentData.pay_id}
//                             </span>
//                           </div>
//                         )}

//                         <div className="flex justify-between items-center pt-2">
//                           <span className="text-form-strokedark">ສະຖານະ:</span>
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               invoiceData.status === 'paid'
//                                 ? 'bg-green-100 text-green-800'
//                                 : invoiceData.status === 'partial'
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {invoiceData.status === 'paid'
//                               ? 'ຊຳລະແລ້ວ'
//                               : invoiceData.status === 'partial'
//                                 ? 'ຊຳລະບາງສ່ວນ'
//                                 : 'ຍັງບໍ່ຊຳລະ'}
//                           </span>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-10 print:hidden">
//             <div className="flex flex-col gap-6 items-end">
//               <button
//                 onClick={handlePayment}
//                 disabled={
//                   paymentStatus === 'processing' ||
//                   paymentStatus === 'completed' ||
//                   (invoiceData && invoiceData.status === 'paid')
//                 }
//                 className={`flex items-center gap-2 px-6 py-3 rounded shadow-md text-white font-semibold text-sm md:text-base transition-all duration-300
//         ${
//           paymentStatus === 'completed' ||
//           (invoiceData && invoiceData.status === 'paid')
//             ? 'bg-green-500 cursor-default'
//             : paymentStatus === 'processing'
//               ? 'bg-yellow-500 animate-pulse cursor-wait'
//               : paymentStatus === 'failed'
//                 ? 'bg-red-500'
//                 : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
//         }
//       `}
//               >
//                 {paymentStatus === 'completed' ||
//                 (invoiceData && invoiceData.status === 'paid') ? (
//                   <CheckCircle size={18} />
//                 ) : (
//                   <CreditCard size={18} />
//                 )}
//                 {paymentStatus === 'pending' && 'ຊຳລະເງິນເຕັມຈຳນວນ'}
//                 {paymentStatus === 'processing' && 'ກຳລັງດຳເນີນການ...'}
//                 {paymentStatus === 'completed' && 'ຊຳລະເງິນສຳເລັດ'}
//                 {paymentStatus === 'failed' && 'ຊຳລະເງິນບໍ່ສຳເລັດ'}
//                 {invoiceData && invoiceData.status === 'paid' && 'ຊຳລະແລ້ວ'}
//               </button>

//               {paymentStatus === 'pending' &&
//                 invoiceData?.status !== 'paid' && (
//                   <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="number"
//                         min={0}
//                         max={grandTotal}
//                         value={partialAmount}
//                         onChange={(e) =>
//                           setPartialAmount(Number(e.target.value))
//                         }
//                         className="border border-form-strokedark rounded px-4 py-2 w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="ປ້ອນຈຳນວນເງິນ"
//                       />
//                       <button
//                         onClick={() => handlePartialPayment(partialAmount)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium shadow-md transition-all duration-200"
//                       >
//                         ຈ່າຍຕາມຈຳນວນທີປ້ອນ
//                       </button>
//                     </div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillPopup;

import {
  X,
  Printer,
  FileText,
  User,
  CreditCard,
  Hash,
  Receipt,
  CheckCircle,
} from 'lucide-react';
import Logo from '../../../images/logo/cps.png';
import React, { useState, useEffect } from 'react';

const BillPopup = ({
  isOpen,
  onClose,
  patientData,
  inspectionData,
  services = [],
  medicines = [],
}) => {
  if (!isOpen) return null;
  const [partialAmount, setPartialAmount] = useState(0);
const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [invoiceData, setInvoiceData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const totalServiceCost = services.reduce(
    (total, service) => total + service.price * service.qty,
    0,
  );

  const totalMedicineCost = medicines.reduce(
    (total, medicine) => total + medicine.price * medicine.qty,
    0,
  );

  const grandTotal = totalServiceCost + totalMedicineCost;

  // Generate Invoice when component mounts
  useEffect(() => {
    if (isOpen && !invoiceData) {
      generateInvoice();
    }
  }, [isOpen]);

  const generateInvoice = async () => {
    try {
      const response = await fetch('http://localhost:4000/src/invoice/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: grandTotal,
          in_id: inspectionData?.in_id
        })
      });

      if (response.ok) {
        const invoiceResponse = await response.json();
        setInvoiceData(invoiceResponse);
      } else {
        // Fallback to local generation if API fails
        const newInvoice = {
          invoice_id: `INV-${Date.now()}`,
          pay_id: null,
          date: new Date().toISOString(),
          pay_amount: grandTotal,
          debt_amount: grandTotal,
          debt: grandTotal,
          status: 'pending',
          ex_rate: 1,
          ex_type: 'LAK',
        };
        setInvoiceData(newInvoice);
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      // Fallback to local generation
      const newInvoice = {
        invoice_id: `INV-${Date.now()}`,
        pay_id: null,
        date: new Date().toISOString(),
        pay_amount: grandTotal,
        debt_amount: grandTotal,
        debt: grandTotal,
        status: 'pending',
        ex_rate: 1,
        ex_type: 'LAK',
      };
      setInvoiceData(newInvoice);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ';
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');

    try {
      const newPayment = {
        pay_id: `PAY-${Date.now()}`,
        in_id: inspectionData?.in_id,
        date: new Date().toISOString(),
        amount: grandTotal,
        debt: 0,
        status: 'completed',
      };

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedInvoice = {
        ...invoiceData,
        pay_id: newPayment.pay_id,
        debt_amount: 0,
        debt: 0,
        status: 'paid',
      };

      setPaymentData(newPayment);
      setInvoiceData(updatedInvoice);
      setPaymentStatus('completed');

      setTimeout(() => {
        setPaymentStatus('pending');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
      setTimeout(() => setPaymentStatus('pending'), 3000);
    }
  };

  const handlePartialPayment = (amount) => {
    if (amount <= 0 || amount > grandTotal) {
      alert('ຈຳນວນເງິນບໍ່ຖືກຕ້ອງ');
      return;
    }

    setPaymentStatus('processing');

    setTimeout(() => {
      const newPayment = {
        pay_id: `PAY-${Date.now()}`,
        in_id: inspectionData?.in_id,
        date: new Date().toISOString(),
        amount: amount,
        debt: grandTotal - amount,
        status: amount === grandTotal ? 'paid' : 'partial',
      };

      const updatedInvoice = {
        ...invoiceData,
        pay_id: newPayment.pay_id,
        debt_amount: grandTotal - amount,
        debt: grandTotal - amount,
        status: newPayment.status,
      };

      setPaymentData(newPayment);
      setInvoiceData(updatedInvoice);
      setPaymentStatus('completed');
    }, 2000);
  };
  useEffect(() => {
    if (isOpen && !invoiceData) {
      generateInvoice();
    }
  }, [isOpen]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header - Hidden on print */}
        <div className="flex justify-center items-center p-6 border-b border-gray-50 print:hidden">
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-form-strokedark hover:bg-form-input text-white px-4 py-2 rounded flex items-center transition-colors duration-200"
            >
              <Printer className="mr-2" size={16} />
              ພິມ
            </button>
            <button
              onClick={onClose}
              className="text-form-strokedark hover:text-form-input p-2 rounded transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-8 print:p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8 pb-6 ">
            <div className="flex-shrink-0">
              <img src={Logo} alt="CPS Logo" width={200} className="h-auto" />
            </div>

            <div className="text-right">
              <h1 className="text-2xl font-bold text-form-input mb-4">
                ໃບບິນການປິ່ນປົວ
              </h1>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center min-w-[200px]">
                  <span className="text-form-strokedark">ເລກທີໃບບິນ:</span>
                  <span className="font-semibold text-form-input ml-4">
                    {invoiceData?.invoice_id || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-form-strokedark">ວັນທີອອກໃບບິນ:</span>
                  <span className="font-semibold text-form-input ml-4">
                    {formatDate(new Date())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient & Treatment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-5">
              <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
                <User className="mr-2 text-form-strokedark" size={18} />
                ຂໍ້ມູນຄົນເຈັບ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ລະຫັດຄົນເຈັບ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.in_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ຊື່-ນາມສະກູນ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_name || ''}{' '}
                    {patientData?.patient_surname || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ເພດ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 ">
              <h3 className="font-semibold text-form-input mb-4 flex items-center text-lg">
                <Hash className="mr-2 text-form-strokedark" size={18} />
                ຂໍ້ມູນການປິ່ນປົວ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ວັນທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {formatDate(inspectionData?.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ອາການເບື່ອງຕົ້ນ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.symptom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ການວິເຄາະ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.diseases_now}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-form-strokedark">ການກວດ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.checkup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          {services.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-form-input mb-4 text-lg">
                ລາຍການບໍລິການ:
              </h3>
              <div className="overflow-x-auto border border-stroke rounded">
                <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded ">
                  <thead>
                    <tr className="text-left bg-secondary2 text-white ">
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ລຳດັບ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ຊື່ບໍລິການ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center  ">
                        ຈຳນວນ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາ/ຫົວ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາລວມ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr
                        key={`service-${index}`}
                        className="border-b border-stroke  hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-form-strokedark">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-form-input font-medium">
                          {service.name || service.ser_name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center text-form-strokedark">
                          {service.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-form-strokedark">
                          {formatCurrency(service.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-form-input font-semibold">
                          {formatCurrency(service.price * service.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Medicines Table */}
          {medicines.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-form-input mb-4 text-lg">
                ລາຍການຢາທີ່ໃຊ້:
              </h3>
              <div className="overflow-x-auto border border-stroke rounded">
                <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded">
                  <thead>
                    <tr className="text-left bg-secondary2 text-white">
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ລຳດັບ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left  ">
                        ຊື່ຢາ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center  ">
                        ຈຳນວນ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາ/ຫົວ
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-right  ">
                        ລາຄາລວມ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine, index) => (
                      <tr
                        key={`medicine-${index}`}
                        className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-form-strokedark">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-form-input font-medium">
                          {medicine.name || medicine.med_name}
                        </td>
                        <td className="px-4 py-3 text-center text-form-strokedark">
                          {medicine.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-form-strokedark">
                          {formatCurrency(medicine.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-form-input font-semibold">
                          {formatCurrency(medicine.price * medicine.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {inspectionData?.note && (
            <div className="mb-8">
              <h3 className="font-semibold text-form-input mb-3 text-lg">
                ໝາຍເຫດ:
              </h3>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                <p className="text-form-strokedark  leading-relaxed">
                  {inspectionData.note}
                </p>
              </div>
            </div>
          )}

          {/* Summary Section */}
          <div className=" pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="bg-gray-50 p-6 space-y-4">
                  {/* Subtotals */}
                  {services.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-form-strokedark">ລວມບໍລິການ:</span>
                      <span className="font-semibold text-form-input">
                        {formatCurrency(totalServiceCost)}
                      </span>
                    </div>
                  )}

                  {medicines.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-form-strokedark">ລວມຢາ:</span>
                      <span className="font-semibold text-form-input">
                        {formatCurrency(totalMedicineCost)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-form-input">
                        ລາຄາລວມທັງໝົດ:
                      </span>
                      <span className="font-bold text-blue-600 text-xl">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {invoiceData && (
                    <>
                      <div className="border-t border-gray-300 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-form-strokedark">
                            ຈຳນວນເງິນທີ່ຊຳລະ:
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              invoiceData.pay_amount - invoiceData.debt_amount,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-form-strokedark">
                            ຄົງເຫຼືອ:
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(invoiceData.debt_amount)}
                          </span>
                        </div>

                        {paymentData && (
                          <div className="flex justify-between text-sm">
                            <span className="text-form-strokedark">
                              ເລກການຊຳລະ:
                            </span>
                            <span className="font-semibold text-form-input">
                              {paymentData.pay_id}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-form-strokedark">ສະຖານະ:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              invoiceData.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : invoiceData.status === 'partial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {invoiceData.status === 'paid'
                              ? 'ຊຳລະແລ້ວ'
                              : invoiceData.status === 'partial'
                                ? 'ຊຳລະບາງສ່ວນ'
                                : 'ຍັງບໍ່ຊຳລະ'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 print:hidden">
            <div className="flex flex-col gap-6 items-end">
              <button
                onClick={handlePayment}
                disabled={
                  paymentStatus === 'processing' ||
                  paymentStatus === 'completed' ||
                  (invoiceData && invoiceData.status === 'paid')
                }
                className={`flex items-center gap-2 px-6 py-3 rounded shadow-md text-white font-semibold text-sm md:text-base transition-all duration-300
        ${
          paymentStatus === 'completed' ||
          (invoiceData && invoiceData.status === 'paid')
            ? 'bg-green-500 cursor-default'
            : paymentStatus === 'processing'
              ? 'bg-yellow-500 animate-pulse cursor-wait'
              : paymentStatus === 'failed'
                ? 'bg-red-500'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }
      `}
              >
                {paymentStatus === 'completed' ||
                (invoiceData && invoiceData.status === 'paid') ? (
                  <CheckCircle size={18} />
                ) : (
                  <CreditCard size={18} />
                )}
                {paymentStatus === 'pending' && 'ຊຳລະເງິນເຕັມຈຳນວນ'}
                {paymentStatus === 'processing' && 'ກຳລັງດຳເນີນການ...'}
                {paymentStatus === 'completed' && 'ຊຳລະເງິນສຳເລັດ'}
                {paymentStatus === 'failed' && 'ຊຳລະເງິນບໍ່ສຳເລັດ'}
                {invoiceData && invoiceData.status === 'paid' && 'ຊຳລະແລ້ວ'}
              </button>

        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPopup
