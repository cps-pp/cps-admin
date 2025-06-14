import React, { useState, useEffect } from 'react';
import Logo from '../../../images/logo/cps.png';
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
import SelectBoxId from '../../../components/Forms/SelectID';

const BillPopup = ({
  isOpen,
  onClose,
  patientData,
  inspectionData,
  services = [],
  medicines = [],
}) => {
  if (!isOpen) return null;

  // Payment states
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [invoiceData, setInvoiceData] = useState(null);
  const [exchange, setExchange] = useState([]);
  const [selectedExType, setSelectedExType] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Exchange rates (default values)
  const [exchangeRates, setExchangeRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('KIP');

  const [isMixedPayment, setIsMixedPayment] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [displayCashAmount, setDisplayCashAmount] = useState('');
  const [displayTransferAmount, setDisplayTransferAmount] = useState('');
  const totalServiceCost = services.reduce(
    (total, service) => total + service.price * service.qty,
    0,
  );

  const totalMedicineCost = medicines.reduce(
    (total, medicine) => total + medicine.price * medicine.qty,
    0,
  );

  const grandTotal = totalServiceCost + totalMedicineCost;

  const totalInSelectedCurrency = (() => {
    if (selectedCurrency === 'KIP') {
      return grandTotal;
    }
    const rate = exchangeRates[selectedCurrency] || 1;
    return grandTotal / rate;
  })();

  // Now we can use totalInSelectedCurrency safely
  const totalMixedAmount =
    parseFloat(cashAmount || 0) + parseFloat(transferAmount || 0);
  const isAmountSufficient = isMixedPayment
    ? totalMixedAmount >= totalInSelectedCurrency
    : parseFloat(receivedAmount || 0) >= totalInSelectedCurrency;

  // Calculate change amount
  const changeAmount = receivedAmount
    ? Math.max(0, parseFloat(receivedAmount) - totalInSelectedCurrency)
    : 0;

  // Calculate change in KIP for display
  const changeAmountInKIP =
    selectedCurrency === 'KIP'
      ? changeAmount
      : changeAmount * (exchangeRates[selectedCurrency] || 1);

  useEffect(() => {
    if (isOpen && !invoiceData) {
      generateInvoice();
    }
  }, [isOpen]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchEx = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/manager/exchange',
        );
        const data = await response.json();
        if (response.ok) {
          console.log('API Response:', data.data);
          const exchangeData = data.data.map((cat) => ({
            ex_id: cat.ex_id,
            ex_type: cat.ex_type,
            ex_rate: cat.ex_rate,
          }));
          setExchange(exchangeData);

          // Update exchange rates state
          const rates = {};
          exchangeData.forEach((ex) => {
            rates[ex.ex_type] = ex.ex_rate;
          });
          setExchangeRates((prev) => ({ ...prev, ...rates }));
        } else {
          console.error('Failed to fetch exchange rates', data);
        }
      } catch (error) {
        console.error('Error fetching exchange rates', error);
      }
    };
    fetchEx();
  }, []);

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

  const formatCurrency = (amount, currency = 'KIP') => {
    if (currency === 'KIP') {
      return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ';
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleExchangeSelect = (e) => {
    const selectedExId = e.target.value;
    setSelectedExType(selectedExId);

    const selectedEx = exchange.find((ex) => ex.ex_id == selectedExId);
    if (selectedEx) {
      setSelectedCurrency(selectedEx.ex_type);
    }
  };

  const generateInvoice = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/src/invoice/invoice',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: grandTotal,
            in_id: inspectionData?.in_id,
          }),
        },
      );

      if (response.ok) {
        const resData = await response.json();
        const invoice = resData.data;

        console.log('Invoice API:', invoice); // ✅ ต้องแสดง object ที่มี invoice_id
        console.log('Invoice ID:', invoice.invoice_id); // ✅ แสดงค่า invoice_id
        setInvoiceData(invoice);
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  };
//  const handlePaymentConfirm = async () => {
  
//   setIsProcessing(true);
//   const selectedEx = exchange.find((ex) => ex.ex_id == selectedExType);
//   const exRateValue = selectedEx ? selectedEx.ex_rate : 1;
  
//   try {
//     if (isMixedPayment) {
//       // สำหรับการชำระแบบผสม - ส่ง 2 รายการ
//       const payments = [];
      
//       // เพิ่มการชำระด้วยเงินสดถ้ามี
//       if (parseFloat(cashAmount || 0) > 0) {
//         payments.push({
//           invoice_id: invoiceData.invoice_id,
//           paid_amount: parseFloat(cashAmount),
//           pay_type: 'CASH',
//           ex_id: selectedExType,
//           ex_rate: exRateValue,
//         });
//       }
      
//       // เพิ่มการชำระด้วยการโอนถ้ามี
//       if (parseFloat(transferAmount || 0) > 0) {
//         payments.push({
//           invoice_id: invoiceData.invoice_id,
//           paid_amount: parseFloat(transferAmount),
//           pay_type: 'TRANSFER',
//           ex_id: selectedExType,
//           ex_rate: exRateValue,
//         });
//       }
      
//       // ส่ง payment แต่ละรายการ
//       for (const payment of payments) {
//         const response = await fetch(
//           'http://localhost:4000/src/payment/payment',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payment),
//           }
//         );
        
//         if (!response.ok) {
//           const errorData = await response.text();
//           console.error('Payment error:', errorData);
//           throw new Error('Payment failed');
//         }
//       }
      
//     } else {
//       // การชำระแบบปกติ (แค่วิธีเดียว)
//       const response = await fetch(
//         'http://localhost:4000/src/payment/payment',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             invoice_id: invoiceData.invoice_id,
//             paid_amount: parseFloat(receivedAmount),
//             pay_type: paymentType.toUpperCase(),
//             ex_id: selectedExType,
//             ex_rate: exRateValue,
//           }),
//         }
//       );

//       if (!response.ok) {
//         // const errorData = await response.text();
//         // console.error('Payment error:', errorData);
//         // throw new Error('Payment failed');
//       }
//     }
    
//     // สำเร็จแล้ว
//     setShowPaymentPopup(false);
//     onClose();
//     setInvoiceData(null);
    
//   } catch (error) {
//     console.error('Payment failed:', error);
//     // alert('การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
//   } finally {
//     setIsProcessing(false);
//   }
// };
  


  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    const selectedEx = exchange.find((ex) => ex.ex_id == selectedExType);
    const exRateValue = selectedEx ? selectedEx.ex_rate : 1;
    
    try {
      if (isMixedPayment) {
        // สำหรับการชำระแบบผสม - ส่ง 2 รายการ
        const payments = [];
        
        // เพิ่มการชำระด้วยเงินสดถ้ามี
        if (parseFloat(cashAmount || 0) > 0) {
          payments.push({
            invoice_id: invoiceData.invoice_id,
            paid_amount: parseFloat(cashAmount),
            pay_type: 'CASH',
            ex_id: selectedExType,
            ex_rate: exRateValue,
          });
        }
        
        // เพิ่มการชำระด้วยการโอนถ้ามี
        if (parseFloat(transferAmount || 0) > 0) {
          payments.push({
            invoice_id: invoiceData.invoice_id,
            paid_amount: parseFloat(transferAmount),
            pay_type: 'TRANSFER',
            ex_id: selectedExType,
            ex_rate: exRateValue,
          });
        }
        
        // ส่ง payment แต่ละรายการ
        for (const payment of payments) {
          const response = await fetch(
            'http://localhost:4000/src/payment/payment',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payment),
            }
          );
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('Payment error:', errorData);
            throw new Error('Payment failed');
          }
        }
        
      } else {
        // การชำระแบบปกติ (แค่วิธีเดียว)
        const response = await fetch(
          'http://localhost:4000/src/payment/payment',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              invoice_id: invoiceData.invoice_id,
              paid_amount: parseFloat(receivedAmount),
              pay_type: paymentType.toUpperCase(),
              ex_id: selectedExType,
              ex_rate: exRateValue,
            }),
          }
        );

        if (!response.ok) {
          // const errorData = await response.text();
          // console.error('Payment error:', errorData);
          // throw new Error('Payment failed');
        }
      }
      
      // สำเร็จแล้ว
      setShowPaymentPopup(false);
      onClose();
      setInvoiceData(null);
      
    } catch (error) {
      console.error('Payment failed:', error);
      // alert('การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsProcessing(false);
    }
  };


return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header - Hidden on print */}
        <div className="flex justify-between items-center p-6 border-b border-gray-50 print:hidden">
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-200"
            >
              <Printer className="mr-2" size={16} />
              ພິມ
            </button>
            <button
              onClick={onClose}
              className="text-form-strokedark hover:text-form-input p-2 rounded transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-8 print:p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start pb-2 print:justify-between print:items-start">
            <div className="flex-shrink-0 print:flex-shrink-0">
              <img src={Logo} alt="CPS Logo" width={200} className="h-auto" />
            </div>

            <div className="text-right print:text-right print:max-w-md">
              <h1 className="text-2xl font-bold text-form-input mb-4 text-left print:text-left">
                ໃບບິນການປິ່ນປົວ
              </h1>
              <div className="space-y-2 text-sm print:space-y-2">
                <div className="flex justify-between items-center min-w-[200px] print:justify-between print:items-center">
                  <span className="text-form-strokedark">ເລກທີໃບບິນ:</span>
                  <span className="font-semibold text-form-input ml-4 print:ml-4">
                    {invoiceData?.invoice_id}
                  </span>
                </div>
                <div className="flex justify-between items-center print:justify-between print:items-center">
                  <span className="text-form-strokedark">ວັນທີອອກໃບບິນ:</span>
                  <span className="font-semibold text-form-input ml-4 print:ml-4">
                    {formatDate(new Date())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 print:grid-cols-2 print:gap-4">
            <div className="bg-gray-50 p-5 print:bg-white ">
              <h3 className="font-semibold text-form-input mb-2 flex items-center text-lg print:text-base">
                ຂໍ້ມູນຄົນເຈັບ
              </h3>
              <div className="space-y-3 print:space-y-2">
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ລະຫັດຄົນເຈັບ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_id}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.in_id}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ຊື່-ນາມສະກູນ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.patient_name || ''}{' '}
                    {patientData?.patient_surname || ''}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ເພດ:</span>
                  <span className="font-medium text-form-input">
                    {patientData?.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 print:bg-white ">
              <h3 className="font-semibold text-form-input mb-2 flex items-center text-lg print:text-base">
                ຂໍ້ມູນການປິ່ນປົວ
              </h3>
              <div className="space-y-3 print:space-y-2">
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ວັນທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {formatDate(inspectionData?.date)}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ອາການເບື່ອງຕົ້ນ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.symptom}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ການວິເຄາະ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.diseases_now}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ການກວດ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.checkup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Services and Medicines Table */}
          <div className="mb-8 print:mb-4">
            <h3 className="font-semibold text-form-input mb-4 text-lg print:text-base print:mb-2">
              ລາຍການບໍລິການທັງໝົດ:
            </h3>
            <div className="overflow-x-auto border border-stroke rounded mb-6 print:mb-3">
              <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded print:text-sm">
                <thead>
                  <tr className="text-left bg-gray border border-stroke print:bg-gray-100">
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລຳດັບ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຍການ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ຈຳນວນ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຄາ/ຫົວ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຄາລວມ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr
                      key={`service-${index}`}
                      className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800 print:hover:bg-transparent"
                    >
                      <td className="px-4 py-3 text-form-strokedark tex-right print:px-2 print:py-1">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-form-input font-medium print:px-2 print:py-1">
                        {service.name || service.ser_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center text-form-strokedark print:px-2 print:py-1">
                        {service.qty}
                      </td>
                      <td className="px-4 py-3 text-right text-form-strokedark print:px-2 print:py-1">
                        {formatCurrency(service.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-form-input font-semibold print:px-2 print:py-1">
                        {formatCurrency(service.price * service.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-form-input mb-4 text-lg print:text-base print:mb-2">
              ລາຍການຈ່າຍຢາ ແລະ ອຸປະກອນ:
            </h3>
            <div className="overflow-x-auto border border-stroke rounded">
              <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded print:text-sm">
                <thead>
                  <tr className="text-left bg-gray border border-stroke print:bg-gray-100">
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລຳດັບ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຍການ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ຈຳນວນ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຄາ/ຫົວ
                    </th>
                    <th className="border-b border-stroke px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຄາລວມ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr
                      key={`medicine-${index}`}
                      className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800 print:hover:bg-transparent"
                    >
                      <td className="px-4 py-3 text-form-strokedark print:px-2 print:py-1">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-form-input font-medium print:px-2 print:py-1">
                        {medicine.name || medicine.med_name}
                      </td>
                      <td className="px-4 py-3 text-center text-form-strokedark print:px-2 print:py-1">
                        {medicine.qty}
                      </td>
                      <td className="px-4 py-3 text-right text-form-strokedark print:px-2 print:py-1">
                        {formatCurrency(medicine.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-form-input font-semibold print:px-2 print:py-1">
                        {formatCurrency(medicine.price * medicine.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {inspectionData?.note && (
            <div className="mb-8 print:mb-4">
              <h3 className="font-semibold text-form-input mb-3 text-lg print:text-base print:mb-2">
                ໝາຍເຫດ:
              </h3>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded print:bg-white print:border-gray-300 print:p-2">
                <p className="text-form-strokedark leading-relaxed print:text-sm">
                  {inspectionData.note}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="bg-gray-50 p-6 space-y-4 print:bg-white  print:p-4 print:space-y-2">
                {/* Subtotals */}
                {services.length > 0 && (
                  <div className="flex justify-between text-sm print:text-sm">
                    <span className="text-form-strokedark">ລວມບໍລິການ:</span>
                    <span className="font-semibold text-form-input">
                      {formatCurrency(totalServiceCost)}
                    </span>
                  </div>
                )}

                {medicines.length > 0 && (
                  <div className="flex justify-between text-sm print:text-sm">
                    <span className="text-form-strokedark">ລວມຢາ:</span>
                    <span className="font-semibold text-form-input">
                      {formatCurrency(totalMedicineCost)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-300 pt-4 print:pt-2">
                  <div className="flex justify-between text-lg print:text-base">
                    <span className="font-bold text-form-input">
                      ລາຄາລວມທັງໝົດ:
                    </span>
                    <span className="font-bold text-blue-600 text-xl print:text-lg">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {invoiceData && (
                  <>
                    <div className="border-t border-gray-300 pt-4 ">
                      <div className="flex justify-between items-center pt-2 ">
                        <span className="text-form-strokedark ">ສະຖານະ:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold  ${
                            invoiceData.status === 'paid'
                              ? 'bg-green-100 text-green-800 '
                              : invoiceData.status === 'partial'
                                ? 'bg-yellow-100 text-yellow-800  '
                                : 'bg-red-100 text-red-800  '
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

          <div className="flex justify-end mt-6 print:hidden">
            <button
              onClick={() => setShowPaymentPopup(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
            >
              ຊຳລະເງິນ
            </button>
          </div>

          {/* Payment Popup */}
          {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 print:hidden">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">ຊຳລະເງິນ</h3>
                  <button onClick={() => setShowPaymentPopup(false)}>
                    <X size={20} />
                  </button>
                </div>

                {/* Payment Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    ວິທີຊຳລະ
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setPaymentType('cash');
                        setIsMixedPayment(false);
                        setCashAmount('');
                        setTransferAmount('');
                        setDisplayCashAmount('');
                        setDisplayTransferAmount('');
                      }}
                      className={`px-4 py-2 rounded ${
                        paymentType === 'cash' && !isMixedPayment
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ສົດ
                    </button>
                    <button
                      onClick={() => {
                        setPaymentType('transfer');
                        setIsMixedPayment(false);
                        setCashAmount('');
                        setTransferAmount('');
                        setDisplayCashAmount('');
                        setDisplayTransferAmount('');
                      }}
                      className={`px-4 py-2 rounded ${
                        paymentType === 'transfer' && !isMixedPayment
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ໂອນ
                    </button>
                    <button
                      onClick={() => {
                        setIsMixedPayment(true);
                        setDisplayAmount('');
                        setReceivedAmount('');
                      }}
                      className={`px-4 py-2 rounded ${
                        isMixedPayment
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ສົດ + ໂອນ
                    </button>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    ເລືອກສະກຸນເງິນ
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => {
                        setSelectedCurrency('KIP');
                        setSelectedExType(null);
                        // Clear all amounts when currency changes
                        setDisplayAmount('');
                        setReceivedAmount('');
                        setCashAmount('');
                        setTransferAmount('');
                        setDisplayCashAmount('');
                        setDisplayTransferAmount('');
                      }}
                      className={`px-4 py-2 rounded ${
                        selectedCurrency === 'KIP'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      ກີບ
                    </button>
                  </div>

                  <SelectBoxId
                    label="ປະເພດເງິນ (ອື່ນໆ)"
                    name="currency"
                    value={selectedExType || ''}
                    options={exchange
                      .filter((ex) => ex.ex_type !== 'KIP')
                      .map((ex) => ({
                        label: `${ex.ex_type} (Rate: ${ex.ex_rate})`,
                        value: ex.ex_id,
                      }))}
                    onSelect={(e) => {
                      handleExchangeSelect(e);
                      // Clear all amounts when currency changes
                      setDisplayAmount('');
                      setReceivedAmount('');
                      setCashAmount('');
                      setTransferAmount('');
                      setDisplayCashAmount('');
                      setDisplayTransferAmount('');
                    }}
                    disabled={selectedCurrency === 'KIP'}
                  />
                </div>

                {/* Amount Input - Single Payment */}
                {!isMixedPayment && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      ຈຳນວນເງິນທີ່ຮັບ ({selectedCurrency})
                    </label>
                    <input
                      type="text"
                      value={displayAmount}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');

                        const isValidInput =
                          selectedCurrency === 'KIP'
                            ? /^\d*$/.test(rawValue)
                            : /^\d*\.?\d*$/.test(rawValue);

                        if (isValidInput) {
                          let formattedValue;

                          if (selectedCurrency === 'KIP') {
                            formattedValue =
                              Number(rawValue).toLocaleString('en-US');
                          } else {
                            const parts = rawValue.split('.');
                            const integerPart = Number(
                              parts[0] || 0,
                            ).toLocaleString('en-US');
                            formattedValue =
                              parts.length > 1
                                ? `${integerPart}.${parts[1]}`
                                : integerPart;
                          }

                          setDisplayAmount(formattedValue);
                          setReceivedAmount(rawValue);
                        }
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={selectedCurrency === 'KIP' ? '0' : '0.00'}
                    />
                  </div>
                )}

                {/* Mixed Payment Input */}
                {isMixedPayment && (
                  <div className="mb-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ຈຳນວນເງິນສົດ ({selectedCurrency})
                      </label>
                      <input
                        type="text"
                        value={displayCashAmount}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, '');

                          const isValidInput =
                            selectedCurrency === 'KIP'
                              ? /^\d*$/.test(rawValue)
                              : /^\d*\.?\d*$/.test(rawValue);

                          if (isValidInput) {
                            let formattedValue;

                            if (selectedCurrency === 'KIP') {
                              formattedValue =
                                Number(rawValue).toLocaleString('en-US');
                            } else {
                              const parts = rawValue.split('.');
                              const integerPart = Number(
                                parts[0] || 0,
                              ).toLocaleString('en-US');
                              formattedValue =
                                parts.length > 1
                                  ? `${integerPart}.${parts[1]}`
                                  : integerPart;
                            }

                            setDisplayCashAmount(formattedValue);
                            setCashAmount(rawValue);
                          }
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={selectedCurrency === 'KIP' ? '0' : '0.00'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ຈຳນວນເງິນໂອນ ({selectedCurrency})
                      </label>
                      <input
                        type="text"
                        value={displayTransferAmount}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, '');

                          const isValidInput =
                            selectedCurrency === 'KIP'
                              ? /^\d*$/.test(rawValue)
                              : /^\d*\.?\d*$/.test(rawValue);

                          if (isValidInput) {
                            let formattedValue;

                            if (selectedCurrency === 'KIP') {
                              formattedValue =
                                Number(rawValue).toLocaleString('en-US');
                            } else {
                              const parts = rawValue.split('.');
                              const integerPart = Number(
                                parts[0] || 0,
                              ).toLocaleString('en-US');
                              formattedValue =
                                parts.length > 1
                                  ? `${integerPart}.${parts[1]}`
                                  : integerPart;
                            }

                            setDisplayTransferAmount(formattedValue);
                            setTransferAmount(rawValue);
                          }
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={selectedCurrency === 'KIP' ? '0' : '0.00'}
                      />
                    </div>

                    {/* Mixed Payment Summary */}
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm text-gray-600 mb-1">
                        ລວມຈຳນວນທີ່ຮັບ:
                      </div>
                      <div className="font-semibold text-blue-600">
                        {formatCurrency(
                          Math.ceil(totalMixedAmount),
                          selectedCurrency,
                        )}{' '}
                        {selectedCurrency}
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Amount Display */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">ຍອດທີ່ຕ້ອງຊຳລະ</h4>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">
                      {formatCurrency(
                        Math.ceil(totalInSelectedCurrency),
                        selectedCurrency,
                      )}{' '}
                      {selectedCurrency}
                    </div>
                  </div>
                </div>

                {/* Change Amount Display - Only show if amount is sufficient */}
                {isAmountSufficient && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">ເງິນທອນ</h4>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-semibold text-green-700">
                        {(() => {
                          const totalReceived = isMixedPayment
                            ? totalMixedAmount
                            : parseFloat(receivedAmount || 0);
                          const changeAmount =
                            totalReceived - totalInSelectedCurrency;
                          let changeInKIP;

                          if (selectedCurrency === 'KIP') {
                            changeInKIP = changeAmount;
                          } else {
                            const currentEx = exchange.find(
                              (ex) => ex.ex_id === selectedExType,
                            );
                            const rate = currentEx ? currentEx.ex_rate : 1;
                            changeInKIP = Math.ceil(changeAmount * rate);
                          }

                          return formatCurrency(changeInKIP, 'KIP');
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning for insufficient amount */}
                {!isAmountSufficient &&
                  (isMixedPayment
                    ? cashAmount || transferAmount
                    : receivedAmount) && (
                    <div className="mb-4">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-red-700 font-semibold">
                          <span className="text-red-500">⚠️</span>
                          <span>ເງິນບໍ່ພໍ</span>
                        </div>
                        <div className="text-sm mt-1 text-red-600">
                          ຂາດອີກ:{' '}
                          {(() => {
                            const totalReceived = isMixedPayment
                              ? totalMixedAmount
                              : parseFloat(receivedAmount || 0);
                            const shortage =
                              totalInSelectedCurrency - totalReceived;
                            return formatCurrency(
                              Math.ceil(shortage),
                              selectedCurrency,
                            );
                          })()}{' '}
                          {selectedCurrency}
                        </div>
                      </div>
                    </div>
                  )}

                <button
                  onClick={handlePaymentConfirm}
                  disabled={isProcessing || !isAmountSufficient}
                  className={`w-full py-3 rounded text-white ${
                    isProcessing || !isAmountSufficient
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isProcessing
                    ? 'ກຳລັງດຳເນີນການ...'
                    : !isAmountSufficient
                      ? 'ເງິນບໍ່ພໍ'
                      : 'ຢືນຢັນການຊຳລະ'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPopup;
