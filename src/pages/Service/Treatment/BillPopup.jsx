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
  Banknote,
  CreditCard as TransferIcon,
} from 'lucide-react';
import SelectBoxId from '../../../components/Forms/SelectID';
import { useDispatch } from 'react-redux';
import { openAlert } from '@/redux/reducer/alert';
// const BillPopup = ({
//   isOpen,
//   onClose,
//   patientData,
//   inspectionData,
//   services = [],
//   medicines = [],
// }) => {
//   if (!isOpen) return null;
//   // Payment states
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false);
//   const [paymentType, setPaymentType] = useState('cash');
//   const [paymentStatus, setPaymentStatus] = useState('pending');
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [exchange, setExchange] = useState([]);
//   const [selectedExType, setSelectedExType] = useState(null);
//   const [receivedAmount, setReceivedAmount] = useState('');
//   const [displayAmount, setDisplayAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Exchange rates (default values)
//   const [exchangeRates, setExchangeRates] = useState({});
//   const [selectedCurrency, setSelectedCurrency] = useState('KIP');

//   const [isMixedPayment, setIsMixedPayment] = useState(false);
//   const [cashAmount, setCashAmount] = useState('');
//   const [transferAmount, setTransferAmount] = useState('');
//   const [displayCashAmount, setDisplayCashAmount] = useState('');
//   const [displayTransferAmount, setDisplayTransferAmount] = useState('');

//   const totalServiceCost = services.reduce(
//     (total, service) => total + service.price * service.qty,
//     0,
//   );

//   const totalMedicineCost = medicines.reduce(
//     (total, medicine) => total + medicine.price * medicine.qty,
//     0,
//   );

//   const grandTotal = totalServiceCost + totalMedicineCost;

//   // Helper function to round currency properly
//   const roundCurrency = (amount, currency) => {
//     if (currency === 'KIP') {
//       return Math.ceil(amount); // Always round up for KIP
//     } else if (currency === 'THB' || currency === 'USD') {
//       // For THB and USD, round up if decimal >= 0.5
//       const decimalPart = amount - Math.floor(amount);
//       if (decimalPart >= 0.5) {
//         return Math.ceil(amount);
//       } else {
//         return parseFloat(amount.toFixed(2)); // Keep original decimal if < 0.5
//       }
//     }
//     return parseFloat(amount.toFixed(2));
//   };

//   const totalInSelectedCurrency = (() => {
//     if (selectedCurrency === 'KIP') {
//       return grandTotal;
//     }
//     const rate = exchangeRates[selectedCurrency] || 1;
//     const convertedAmount = grandTotal / rate;
//     return roundCurrency(convertedAmount, selectedCurrency);
//   })();

//   // Calculate amounts in all currencies for display
//   const getAmountInAllCurrencies = () => {
//     const kipAmount = grandTotal;
//     const currencies = {};

//     currencies['KIP'] = Math.ceil(kipAmount);

//     // Add other currencies
//     exchange.forEach((ex) => {
//       if (ex.ex_type !== 'KIP') {
//         const convertedAmount = kipAmount / ex.ex_rate;
//         currencies[ex.ex_type] = roundCurrency(convertedAmount, ex.ex_type);
//       }
//     });

//     return currencies;
//   };

//   const allCurrencyAmounts = getAmountInAllCurrencies();

//   // Now we can use totalInSelectedCurrency safely
//   const totalMixedAmount =
//     parseFloat(cashAmount || 0) + parseFloat(transferAmount || 0);
//   const isAmountSufficient = isMixedPayment
//     ? totalMixedAmount >= totalInSelectedCurrency
//     : parseFloat(receivedAmount || 0) >= totalInSelectedCurrency;

//   // Calculate change amount
//   const changeAmount = receivedAmount
//     ? Math.max(0, parseFloat(receivedAmount) - totalInSelectedCurrency)
//     : 0;

//   // Calculate change in KIP for display
//   const changeAmountInKIP =
//     selectedCurrency === 'KIP'
//       ? changeAmount
//       : changeAmount * (exchangeRates[selectedCurrency] || 1);

//   useEffect(() => {
//     if (isOpen && !invoiceData) {
//       generateInvoice();
//     }
//   }, [isOpen]);

//   // Fetch exchange rates
//   useEffect(() => {
//     const fetchEx = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:4000/src/manager/exchange',
//         );
//         const data = await response.json();
//         if (response.ok) {
//           console.log('API Response:', data.data);
//           const exchangeData = data.data.map((cat) => ({
//             ex_id: cat.ex_id,
//             ex_type: cat.ex_type,
//             ex_rate: cat.ex_rate,
//           }));
//           setExchange(exchangeData);

//           // Update exchange rates state
//           const rates = {};
//           exchangeData.forEach((ex) => {
//             rates[ex.ex_type] = ex.ex_rate;
//           });
//           setExchangeRates((prev) => ({ ...prev, ...rates }));
//         } else {
//           console.error('Failed to fetch exchange rates', data);
//         }
//       } catch (error) {
//         console.error('Error fetching exchange rates', error);
//       }
//     };
//     fetchEx();
//   }, []);

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

//   const formatCurrency = (amount, currency = 'KIP') => {
//     if (currency === 'KIP') {
//       return new Intl.NumberFormat('lo-LA').format(Math.ceil(amount)) + ' ກີບ';
//     } else if (currency === 'THB') {
//       return (
//         new Intl.NumberFormat('en-US', {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(amount) + ' ບາດ'
//       );
//     } else if (currency === 'USD') {
//       return (
//         new Intl.NumberFormat('en-US', {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(amount) + ' ໂດລາ'
//       );
//     }
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   const handleExchangeSelect = (e) => {
//     const selectedExId = e.target.value;
//     setSelectedExType(selectedExId);

//     const selectedEx = exchange.find((ex) => ex.ex_id == selectedExId);
//     if (selectedEx) {
//       setSelectedCurrency(selectedEx.ex_type);
//     }
//   };

//   const generateInvoice = async () => {
//     try {
//       const response = await fetch(
//         'http://localhost:4000/src/invoice/invoice',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             total: grandTotal,
//             in_id: inspectionData?.in_id,
//           }),
//         },
//       );

//       if (response.ok) {
//         const resData = await response.json();
//         const invoice = resData.data;

//         console.log('Invoice API:', invoice);
//         console.log('Invoice ID:', invoice.invoice_id);
//         setInvoiceData(invoice);
//       }
//     } catch (error) {
//       console.error('Failed to generate invoice:', error);
//     }
//   };
//   const handlePaymentConfirm = async () => {
//     setIsProcessing(true);
//     const selectedEx = exchange.find((ex) => ex.ex_id == selectedExType);
//     const exRateValue = selectedEx ? selectedEx.ex_rate : 1;

//     try {
//       if (isMixedPayment) {
//         // สำหรับการชำระแบบผสม - ส่ง 2 รายการ
//         const payments = [];

//         // เพิ่มการชำระด้วยเงินสดถ้ามี
//         if (parseFloat(cashAmount || 0) > 0) {
//           payments.push({
//             invoice_id: invoiceData.invoice_id,
//             paid_amount: parseFloat(cashAmount),
//             pay_type: 'CASH',
//             ex_id: selectedExType,
//             ex_rate: exRateValue,
//           });
//         }

//         // เพิ่มการชำระด้วยการโอนถ้ามี
//         if (parseFloat(transferAmount || 0) > 0) {
//           payments.push({
//             invoice_id: invoiceData.invoice_id,
//             paid_amount: parseFloat(transferAmount),
//             pay_type: 'TRANSFER',
//             ex_id: selectedExType,
//             ex_rate: exRateValue,
//           });
//         }

//         // ส่ง payment แต่ละรายการทีละรายการ (Sequential)
//         for (let i = 0; i < payments.length; i++) {
//           const payment = payments[i];

//           // Add a small delay between requests to ensure different timestamps
//           if (i > 0) {
//             await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
//           }

//           const response = await fetch(
//             'http://localhost:4000/src/payment/payment',
//             {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(payment),
//             },
//           );

//           if (!response.ok) {
//             const errorData = await response.json();
//             console.error('Payment error:', errorData);

//             // Show specific error message to user
//             alert(`ການຊຳລະລົ້ມເຫລວ: ${errorData.message || 'Unknown error'}`);
//             return;
//           }

//           const result = await response.json();
//           console.log(`Payment ${i + 1} successful:`, result);
//         }
//       } else {
//         // การชำระแบบปกติ (แค่วิธีเดียว)
//         const response = await fetch(
//           'http://localhost:4000/src/payment/payment',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               invoice_id: invoiceData.invoice_id,
//               paid_amount: parseFloat(receivedAmount),
//               pay_type: paymentType.toUpperCase(),
//               ex_id: selectedExType,
//               ex_rate: exRateValue,
//             }),
//           },
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error('Payment error:', errorData);
//           // alert(`ການຊຳລະລົ້ມເຫລວ: ${errorData.message || 'Unknown error'}`);
//           return;
//         }

//         const result = await response.json();
//         console.log('Payment successful:', result);
//       }

//       console.log('All payments completed successfully');
//       setShowPaymentPopup(false);
//       onClose();
//       setInvoiceData(null);

//       setPaymentType('cash');
//       setIsMixedPayment(false);
//       setCashAmount('');
//       setTransferAmount('');
//       setDisplayAmount('');
//       setDisplayCashAmount('');
//       setDisplayTransferAmount('');
//       setReceivedAmount('');
//     } catch (error) {
//       console.error('Payment failed:', error);
//       // alert(`ເກີດຂໍ້ຜິດພາດ: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
const BillPopup = ({
  isOpen,
  onClose,
  patientData,
  inspectionData,
  services = [],
  medicines = [],
isRefundMode = false,
  invoiceData,
}) => {
  if (!isOpen) return null;
  // Payment states
  const isInvoiceCancelled = invoiceData?.status === 'CANCEL';
  const isInvoicePaid = invoiceData?.status === 'PAID';
  const shouldShowPaymentButtons = !isInvoiceCancelled && !isInvoicePaid;
  const dispatch = useDispatch();

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('pending');
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

  // const totalMedicineCost = medicines.reduce(
  //   (total, medicine) => total + (medicine.total || 0),
  //   0,
  // );

  const totalMedicineCost = medicines.reduce(
    (total, medicine) => total + medicine.price * medicine.qty,
    0,
  );
  const grandTotal = totalServiceCost + totalMedicineCost;

  // Helper function to round currency properly
  const roundCurrency = (amount, currency) => {
    if (currency === 'KIP') {
      return Math.ceil(amount); // Always round up for KIP
    } else if (currency === 'THB' || currency === 'USD') {
      // For THB and USD, round up if decimal >= 0.5
      const decimalPart = amount - Math.floor(amount);
      if (decimalPart >= 0.5) {
        return Math.ceil(amount);
      } else {
        return parseFloat(amount.toFixed(2)); // Keep original decimal if < 0.5
      }
    }
    return parseFloat(amount.toFixed(2));
  };

  const totalInSelectedCurrency = (() => {
    if (selectedCurrency === 'KIP') {
      return grandTotal;
    }
    const rate = exchangeRates[selectedCurrency] || 1;
    const convertedAmount = grandTotal / rate;
    return roundCurrency(convertedAmount, selectedCurrency);
  })();

  // Calculate amounts in all currencies for display
  const getAmountInAllCurrencies = () => {
    const kipAmount = grandTotal;
    const currencies = {};

    currencies['KIP'] = Math.ceil(kipAmount);

    // Add other currencies
    exchange.forEach((ex) => {
      if (ex.ex_type !== 'KIP') {
        const convertedAmount = kipAmount / ex.ex_rate;
        currencies[ex.ex_type] = roundCurrency(convertedAmount, ex.ex_type);
      }
    });

    return currencies;
  };

  const allCurrencyAmounts = getAmountInAllCurrencies();

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

  // ลบ useEffect ที่เรียก generateInvoice ออก เพราะตอนนี้รับ invoiceData จาก parent แล้ว

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
      return new Intl.NumberFormat('lo-LA').format(Math.ceil(amount)) + ' ກີບ';
    } else if (currency === 'THB') {
      return (
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ' ບາດ'
      );
    } else if (currency === 'USD') {
      return (
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ' ໂດລາ'
      );
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    const selectedEx = exchange.find((ex) => ex.ex_id == selectedExType);
    const exRateValue = selectedEx ? selectedEx.ex_rate : 1;

    try {
      if (isMixedPayment) {
        const payments = [];

        if (parseFloat(cashAmount || 0) > 0) {
          payments.push({
            invoice_id: invoiceData.invoice_id,
            paid_amount: parseFloat(cashAmount),
            pay_type: 'CASH',
            ex_id: selectedExType,
            ex_rate: exRateValue,
          });
        }

        if (parseFloat(transferAmount || 0) > 0) {
          payments.push({
            invoice_id: invoiceData.invoice_id,
            paid_amount: parseFloat(transferAmount),
            pay_type: 'TRANSFER',
            ex_id: selectedExType,
            ex_rate: exRateValue,
          });
        }

        for (let i = 0; i < payments.length; i++) {
          const payment = payments[i];

          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100)); 
          }

          const response = await fetch(
            'http://localhost:4000/src/payment/payment',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payment),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Payment error:', errorData);

            alert(`ການຊຳລະລົ້ມເຫລວ: ${errorData.message || 'Unknown error'}`);
            return;
          }

          const result = await response.json();
          console.log(`Payment ${i + 1} successful:`, result);
        }
      } else {
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
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Payment error:', errorData);
          // alert(`ການຊຳລະລົ້ມເຫລວ: ${errorData.message || 'Unknown error'}`);
          return;
        }

        const result = await response.json();
        console.log('Payment successful:', result);
      }

      console.log('All payments completed successfully');
      setShowPaymentPopup(false);
      onClose();

      setPaymentType('cash');
      setIsMixedPayment(false);
      setCashAmount('');
      setTransferAmount('');
      setDisplayAmount('');
      setDisplayCashAmount('');
      setDisplayTransferAmount('');
      setReceivedAmount('');
    } catch (error) {
      console.error('Payment failed:', error);
      // alert(`ເກີດຂໍ້ຜິດພາດ: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const handlePayLater = () => {
    dispatch(
      openAlert({
        type: 'success',
        title: 'ສຳເລັດ',
        message: 'ໃບບິນຖືກສ້າງແລ້ວ ທ່ານສາມາດຊຳລະໄດ້ທີຫຼັງ',
      }),
    );

    onClose?.();

    onRefresh?.();
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
                ໃບບິນ
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
                  <span className="text-form-strokedark">ພະຍາດປັດຈຸບັດ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.diseases_now}
                  </span>
                </div>
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ບົ່ງມະຕິ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.checkup}
                  </span>
                </div>
              
              </div>
            </div>
          </div>

          <div className="mb-4 print:mb-4">
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

          {inspectionData?.note && (
            <div className="mb-4 print:mb-4">
              <h3 className="font-semibold text-form-input mb-3 text-lg print:text-base print:mb-2">
                ໝາຍເຫດ:
              </h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded print:bg-white print:border-gray-300 print:p-2">
                <p className="text-form-strokedark leading-relaxed print:text-sm">
                  {inspectionData.note}
                </p>
              </div>
            </div>
          )}
         

          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="bg-blue-50 p-4 space-y-2 print:bg-white mb-4  print:p-4 print:space-y-2">
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

           {shouldShowPaymentButtons && (
    <div className="flex justify-end gap-4">
      {!isRefundMode && (
        <button
          onClick={handlePayLater}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded"
        >
          ຊຳລະພາຍຫຼັງ
        </button>
      )}
      
      <button
        onClick={() => setShowPaymentPopup(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
      >
        ຊຳລະເງິນ
      </button>
    </div>
  )}

          {/* Payment Popup */}
          {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 print:hidden p-4">
              <div className="bg-white p-6 rounded max-w-4xl w-full max-h-[95vh] overflow-y-auto ">
                <div className="flex justify-between items-center mb-4 border-b border-stroke pb-4">
                  <h3 className="text-xl font-semibold text-form-input">
                    ຊຳລະເງິນ
                  </h3>
                  <button
                    onClick={() => setShowPaymentPopup(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Total Amount Display - Show all currencies */}
                    <div>
                      <h4 className="text-md font-medium mb-2 text-form-input">
                        ຍອດທີ່ຕ້ອງຊຳລະ
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(allCurrencyAmounts).map(
                          ([currency, amount]) => (
                            <div
                              key={currency}
                              className={`flex justify-between items-center p-2 rounded border ${
                                currency === 'KIP'
                                  ? ' bg-gradient-to-r from-blue-50 to-indigo-50 border-stroke text-lg'
                                  : ' border-stroke'
                              }`}
                            >
                              <span className="font-medium text-gray-700 text-sm">
                                {currency}:
                              </span>
                              <span className="font-bold text-form-strokedark">
                                {formatCurrency(amount, currency)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Payment Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-form-input">
                        ເລືອກປະເພດການຊຳລະ
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setPaymentType('cash');
                            setIsMixedPayment(false);
                            setCashAmount('');
                            setTransferAmount('');
                            setDisplayCashAmount('');
                            setDisplayTransferAmount('');
                          }}
                          className={`flex flex-col items-center p-3 rounded border-2 transition-all ${
                            paymentType === 'cash' && !isMixedPayment
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Banknote size={20} className="mb-1" />
                          <span className="text-xs font-medium">ເງິນສົດ</span>
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
                          className={`flex flex-col items-center p-3 rounded border-2 transition-all ${
                            paymentType === 'transfer' && !isMixedPayment
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <TransferIcon size={20} className="mb-1" />
                          <span className="text-xs font-medium">ໂອນເງິນ</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMixedPayment(true);
                            setDisplayAmount('');
                            setReceivedAmount('');
                          }}
                          className={`flex flex-col items-center p-3 rounded border-2 transition-all ${
                            isMixedPayment
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex mb-1">
                            <Banknote size={14} />
                            <span className="text-xs mx-1">+</span>
                            <TransferIcon size={14} />
                          </div>
                          <span className="text-xs font-medium">
                            ເງີນສົດ + ໂອນ
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Amount Input - Single Payment */}
                    {!isMixedPayment && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-form-input">
                          ຈຳນວນເງິນທີ່ຮັບ
                        </label>
                        <input
                          type="text"
                          value={displayAmount}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            const isValidInput = /^\d*$/.test(rawValue);

                            if (isValidInput) {
                              const formattedValue =
                                Number(rawValue).toLocaleString('en-US');
                              setDisplayAmount(formattedValue);
                              setReceivedAmount(rawValue);
                            }
                          }}
                          className="w-full border-2 border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />

                        {/* Exact Amount Button */}
                        <button
                          onClick={() => {
                            const exactAmount =
                              Math.ceil(grandTotal).toString();
                            const formattedAmount =
                              Number(exactAmount).toLocaleString('en-US');
                            setDisplayAmount(formattedAmount);
                            setReceivedAmount(exactAmount);
                          }}
                          className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          ຮັບເງິນເຕັມຈຳນວນ (
                          {formatCurrency(Math.ceil(grandTotal), 'KIP')})
                        </button>
                      </div>
                    )}

                    {/* Mixed Payment Input */}
                    {isMixedPayment && (
                      <div className="p-4 bg-slate-50 rounded border border-stroke">
                        <h4 className="font-medium text-md mb-3">
                          💳 ການຊຳລະເງິນຫຼາຍຊ່ອງທາງ
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">
                              ເງິນສົດ
                            </label>
                            <input
                              type="text"
                              value={displayCashAmount}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /,/g,
                                  '',
                                );
                                const isValidInput = /^\d*$/.test(rawValue);

                                if (isValidInput) {
                                  const formattedValue =
                                    Number(rawValue).toLocaleString('en-US');
                                  setDisplayCashAmount(formattedValue);
                                  setCashAmount(rawValue);
                                }
                              }}
                              className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-600">
                              ເງິນໂອນ
                            </label>
                            <input
                              type="text"
                              value={displayTransferAmount}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /,/g,
                                  '',
                                );
                                const isValidInput = /^\d*$/.test(rawValue);

                                if (isValidInput) {
                                  const formattedValue =
                                    Number(rawValue).toLocaleString('en-US');
                                  setDisplayTransferAmount(formattedValue);
                                  setTransferAmount(rawValue);
                                }
                              }}
                              className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Exact Amount Button for Mixed Payment */}
                        <button
                          onClick={() => {
                            const exactAmount =
                              Math.ceil(grandTotal).toString();
                            const formattedAmount =
                              Number(exactAmount).toLocaleString('en-US');
                            setDisplayCashAmount(formattedAmount);
                            setCashAmount(exactAmount);
                            setDisplayTransferAmount('0');
                            setTransferAmount('0');
                          }}
                          className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          💰 ຮັບເງິນເຕັມຈຳນວນ (
                          {formatCurrency(Math.ceil(grandTotal), 'KIP')})
                        </button>

                        {/* Mixed Payment Summary */}
                        <div className="mt-3 p-3 bg-white rounded border border-stroke">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              ລວມທີ່ຮັບ:
                            </span>
                            <span className="font-semibold text-form-input">
                              {formatCurrency(
                                Math.ceil(totalMixedAmount),
                                'KIP',
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Change Amount Display */}
                    {isAmountSufficient && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-form-input">
                          ເງິນທອນ
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-200">
                          <div className="text-center">
                            <span className="text-xl font-bold text-green-700">
                              {(() => {
                                const totalReceived = isMixedPayment
                                  ? totalMixedAmount
                                  : parseFloat(receivedAmount || 0);
                                const changeAmount = totalReceived - grandTotal; // Always calculate change in KIP
                                return formatCurrency(
                                  Math.max(0, Math.ceil(changeAmount)),
                                  'KIP',
                                );
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Warning for insufficient amount */}
                    {!isAmountSufficient &&
                      (isMixedPayment
                        ? cashAmount || transferAmount
                        : receivedAmount) && (
                        <div>
                          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded border border-red-200">
                            <div className="flex items-center gap-3 text-red-700">
                              <span className="text-xl">⚠️</span>
                              <div>
                                <div className="font-semibold">
                                  ເງິນຍັງບໍ່ຄົບຈຳນວນ!
                                </div>
                                <div className="text-sm mt-1">
                                  ຂາດອີກ:{' '}
                                  {(() => {
                                    const totalReceived = isMixedPayment
                                      ? totalMixedAmount
                                      : parseFloat(receivedAmount || 0);
                                    const shortage = grandTotal - totalReceived; // Calculate shortage in KIP
                                    return formatCurrency(
                                      Math.ceil(shortage),
                                      'KIP',
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Confirm Button - Full Width at Bottom */}
                <div className="mt-6 pt-4 border-t border-stroke">
                  <button
                    onClick={handlePaymentConfirm}
                    disabled={isProcessing || !isAmountSufficient}
                    className={`w-full py-3 rounded text-white font-semibold text-lg transition-all ${
                      isProcessing || !isAmountSufficient
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isProcessing
                      ? 'ກຳລັງດຳເນີນການ....'
                      : !isAmountSufficient
                        ? ' ເງິນບໍ່ຄົບຈຳນວນ'
                        : ' ຢືນຢັນການຊຳລະ'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPopup;
