import React, { useState, useEffect } from 'react';
import Logo from '../../../images/logo/cps.png';
import {
  X,
  Printer,
  FileText,
  User,
  CreditCard,
  Wallet,
  Clock,
  Banknote,
  CreditCard as TransferIcon,
  BanknoteIcon,
} from 'lucide-react';
import SelectBoxId from '../../../components/Forms/SelectID';
import { useDispatch } from 'react-redux';
import { openAlert } from '@/redux/reducer/alert';
import { URLBaseLocal } from '../../../lib/MyURLAPI';

const BillPopup = ({
  isOpen,
  onClose,
  patientData,
  inspectionData,
  services = [],
  medicines = [],
  isRefundMode = false,
  invoiceData,
  onRefresh,
}) => {
  if (!isOpen) return null;
  // Payment states
  const isInvoiceCancelled = invoiceData?.status === 'CANCEL';
  const isInvoicePaid = invoiceData?.status === 'PAID';
  const shouldShowPaymentButtons = !isInvoiceCancelled && !isInvoicePaid;
  const dispatch = useDispatch();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');
  const [exchange, setExchange] = useState([]);
  const [selectedExType, setSelectedExType] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
  console.log(invoiceData);

  const totalMedicineCost = medicines.reduce(
    (total, medicine) => total + medicine.price * medicine.qty,
    0,
  );
  const grandTotal = totalServiceCost + totalMedicineCost;
  

  const roundCurrency = (amount, currency) => {
    if (currency === 'KIP') {
      return Math.ceil(amount);
    } else if (currency === 'THB' || currency === 'USD') {
      const decimalPart = amount - Math.floor(amount);
      if (decimalPart >= 0.5) {
        return Math.ceil(amount);
      } else {
        return parseFloat(amount.toFixed(2));
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

  const getAmountInAllCurrencies = () => {
    const kipAmount = grandTotal;
    const currencies = {};

    currencies['KIP'] = Math.ceil(kipAmount);

    exchange.forEach((ex) => {
      if (ex.ex_type !== 'KIP') {
        const convertedAmount = kipAmount / ex.ex_rate;
        currencies[ex.ex_type] = roundCurrency(convertedAmount, ex.ex_type);
      }
    });

    return currencies;
  };

  const allCurrencyAmounts = getAmountInAllCurrencies();
  const totalMixedAmount =
    parseFloat(cashAmount || 0) + parseFloat(transferAmount || 0);
  const isAmountSufficient = isMixedPayment
    ? totalMixedAmount >= totalInSelectedCurrency
    : parseFloat(receivedAmount || 0) >= totalInSelectedCurrency;
  const changeAmount = receivedAmount
    ? Math.max(0, parseFloat(receivedAmount) - totalInSelectedCurrency)
    : 0;


const currentBalance = invoiceData?.balance !== undefined ? invoiceData.balance : grandTotal;
const isDebt = currentBalance > 0;
const hasBalanceData = invoiceData?.balance !== undefined; // เช็คว่ามี balance data หรือไม่

// ฟังก์ชันคำนวณเงินทอน
const calculateChange = () => {
  const totalReceived = isMixedPayment
    ? totalMixedAmount
    : parseFloat(receivedAmount || 0);
  
  if (totalReceived > currentBalance) {
    return totalReceived - currentBalance;
  }
  return 0;
};

// ฟังก์ชันคำนวณยอดคงเหลือ
const calculateRemainingBalance = () => {
  const totalReceived = isMixedPayment
    ? totalMixedAmount
    : parseFloat(receivedAmount || 0);
  
  return Math.max(0, currentBalance - totalReceived);
};


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

          const response = await fetch(`${URLBaseLocal}/src/payment/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment),
          });

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
        const response = await fetch(`${URLBaseLocal}/src/payment/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice_id: invoiceData.invoice_id,
            paid_amount: parseFloat(receivedAmount),
            // paid_amount:
            //   invoiceData?.balance >= receivedAmount
            //     ? invoiceData?.balance - receivedAmount
            //     : receivedAmount - (receivedAmount - invoiceData?.balance),

            pay_type: paymentType.toUpperCase(),
            ex_id: selectedExType,
            ex_rate: exRateValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Payment error:', errorData);
          // alert(`ການຊຳລະລົ້ມເຫລວ: ${errorData.message || 'Unknown error'}`);
          return;
        }

        const result = await response.json();
      }
      onClose?.();
      onRefresh?.();

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
  // เพิ่ม console.log เพื่อตรวจสอบข้อมูล
  // console.log('Medicines data:', medicines);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-stroke print:hidden">
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded bg-pink-600 hover:bg-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Printer size={18} />
              <span className="text-sm font-medium">ພິມບີນ</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center  px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-600 shadow hover:shadow-md transition-all duration-200"
              title="ປິດ"
            >
              <X size={20} />
              <span className="text-md font-medium">ປິດ</span>
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-8 print:p-4 print:max-w-2xl">
          {/* Header Section */}
          <div className="flex justify-between items-start pb-2 print:justify-between print:items-start">
            <div className="flex-shrink-0 print:flex-shrink-0">
              <img src={Logo} alt="CPS Logo" width={180} className="h-auto" />
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
                
                <div className="flex justify-between print:text-sm">
                  <span className="text-form-strokedark">ເລກທີປິ່ນປົວ:</span>
                  <span className="font-medium text-form-input">
                    {inspectionData?.in_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 print:grid-cols-2 print:gap-4">
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
          </div> */}

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
                      ລາຄາ
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
                      <td className="px-4 py-3 text-left text-form-strokedark print:px-2 print:py-1">
                        {service.qty}
                      </td>
                      <td className="px-4 py-3 text-left text-form-strokedark print:px-2 print:py-1">
                        {formatCurrency(service.price)}
                      </td>
                      <td className="px-4 py-3 text-left text-form-input font-semibold print:px-2 print:py-1">
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
                  <tr className="text-left bg-slate-200 border border-slate-300 print:bg-gray-100">
                    <th className="border-b border-slate-300 px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລຳດັບ
                    </th>
                    <th className="border-b border-slate-300 px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຍການ
                    </th>
                    <th className="border-b border-slate-300 px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ຈຳນວນ
                    </th>
                    <th className="border-b border-slate-300 px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
                      ລາຄາ
                    </th>

                    <th className="border-b border-slate-300 px-4 py-3 text-form-input font-semibold text-left print:px-2 print:py-2">
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
                      <td className="px-4 py-3 text-left text-form-strokedark print:px-2 print:py-1">
                        {medicine.qty ?? 0}
                      </td>
                      <td className="px-4 py-3 text-left text-form-strokedark print:px-2 print:py-1">
                        {formatCurrency(medicine.price ?? 0)}
                      </td>

                      <td className="px-4 py-3 text-left text-form-input font-semibold print:px-2 print:py-1">
                        {formatCurrency(
                          medicine.total || medicine.qty * medicine.price,
                        )}
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
              <div className=" p-4 space-y-2 print:bg-white mb-4  print:p-4 print:space-y-2">
                {/* Subtotals */}
                {services.length > 0 && (
                  <div className="flex justify-between text-md print:text-sm">
                    <span className="text-form-strokedark">ລວມບໍລິການ:</span>
                    <span className="font-semibold text-form-input">
                      {formatCurrency(totalServiceCost)}
                    </span>
                  </div>
                )}

                {medicines.length > 0 && (
                  <div className="flex justify-between text-md print:text-sm">
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
                    <span className="font-bold text-blue-800 text-md print:text-lg">
                      {/* {formatCurrency(grandTotal)} */}
                      <p> {formatCurrency(invoiceData.total)}</p>
{/* <p>ຈ່າຍແລ້ວ: {formatCurrency(invoiceData.total_paid || 0)}</p>
<p>ຄ້າງຈ່າຍ: {formatCurrency(invoiceData.balance || invoiceData.total)}</p> */}
                    </span>
                  </div>
                </div>

                {invoiceData && (
                  <>
                    <div className="border-t border-gray-300 print:hidden ">
                      <div className="flex justify-between items-center pt-2 ">
                        <span className="text-form-strokedark ">ສະຖານະ:</span>
                        <span
                          className={`px-3 py-2 rounded-full text-xs font-semibold  ${
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
            <div className="flex justify-end gap-4 mt-2 print:hidden">
              {!isRefundMode && (
                <button
                  onClick={handlePayLater}
                  className="bg-emerald-600 text-white px-6 py-3 rounded flex items-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  ຊຳລະພາຍຫຼັງ
                </button>
              )}

              <button
                onClick={() => setShowPaymentPopup(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded flex items-center gap-2"
              >
                <BanknoteIcon className="w-5 h-5" />
                ຊຳລະເງິນ
              </button>
            </div>
          )}

          {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 print:hidden p-4">
              <div className="bg-white p-6 rounded max-w-4xl w-full max-h-[95vh] overflow-y-auto">
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
                    {/* Balance Status Display */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="text-md font-medium mb-2 text-form-input">
                        ສະຖານະບິນ
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">ຍອດລວມ:</span>
                          <span className="font-semibold">
                            {formatCurrency(grandTotal, 'KIP')}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-md text-red-600">
                            ຍອດຄົງເຫຼືອ:
                          </span>
                          <span
                            className={`font-bold text-lg  ${isDebt ? 'text-red-600' : 'text-green-600'}`}
                          >
                            {formatCurrency(currentBalance, 'KIP')}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {Object.entries(allCurrencyAmounts).map(
                            ([currency, amount]) => (
                              <div
                                key={currency}
                                className={`flex justify-between items-center p-2 rounded border ${
                                  currency === 'KIP'
                                    ? ' font-bold text-form-strokedar'
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

                        {/* Payment Amount Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <button
                            onClick={() => {
                              const halfAmount = Math.ceil(
                                currentBalance / 2,
                              ).toString();
                              const formattedAmount =
                                Number(halfAmount).toLocaleString('en-US');
                              setDisplayAmount(formattedAmount);
                              setReceivedAmount(halfAmount);
                            }}
                            className="py-2 px-4 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            ຊຳລະ 50% (
                            {formatCurrency(
                              Math.ceil(currentBalance / 2),
                              'KIP',
                            )}
                            )
                          </button>
                          <button
                            onClick={() => {
                              const fullAmount =
                                Math.ceil(currentBalance).toString();
                              const formattedAmount =
                                Number(fullAmount).toLocaleString('en-US');
                              setDisplayAmount(formattedAmount);
                              setReceivedAmount(fullAmount);
                            }}
                            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            ຊຳລະເຕັມ (
                            {formatCurrency(Math.ceil(currentBalance), 'KIP')})
                          </button>
                        </div>

                        {/* Display Change or Remaining Balance */}
                        {receivedAmount && (
                          <div className="mt-4">
                            {calculateChange() > 0 ? (
                              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-200">
                                <div className="text-center">
                                  <div className="text-sm text-green-600 mb-1">
                                    ເງິນທອນ
                                  </div>
                                  <span className="text-xl font-bold text-green-700">
                                    {formatCurrency(
                                      Math.ceil(calculateChange()),
                                      'KIP',
                                    )}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-gradient-to-r from-red-50 to-red-50 rounded border border-red-200">
                                <div className="text-center">
                                  <div className="text-sm text-red-600 mb-1">
                                    ຍອດຄົງເຫຼືອ
                                  </div>
                                  <span className="text-xl font-bold text-red-700">
                                    {formatCurrency(
                                      Math.ceil(calculateRemainingBalance()),
                                      'KIP',
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mixed Payment Section */}
                    {isMixedPayment && (
                      <div className="p-4 bg-slate-50 rounded border border-stroke">
                        <h4 className="font-medium text-md mb-3">
                          * ການຊຳລະເງິນຫຼາຍຊ່ອງທາງ
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

                        {/* Mixed Payment Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <button
                            onClick={() => {
                              const halfAmount = Math.ceil(
                                currentBalance / 2,
                              ).toString();
                              const formattedAmount =
                                Number(halfAmount).toLocaleString('en-US');
                              setDisplayCashAmount(formattedAmount);
                              setCashAmount(halfAmount);
                              setDisplayTransferAmount('0');
                              setTransferAmount('0');
                            }}
                            className="py-2 px-4 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            50% ເງິນສົດ
                          </button>
                          <button
                            onClick={() => {
                              const fullAmount =
                                Math.ceil(currentBalance).toString();
                              const formattedAmount =
                                Number(fullAmount).toLocaleString('en-US');
                              setDisplayCashAmount(formattedAmount);
                              setCashAmount(fullAmount);
                              setDisplayTransferAmount('0');
                              setTransferAmount('0');
                            }}
                            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            ຊຳລະເຕັມ
                          </button>
                        </div>

                        <div className="mt-3 p-3 bg-white rounded border border-stroke">
                          <div className="flex justify-between items-center mb-2">
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

                          {/* Show change or remaining balance for mixed payment */}
                          {totalMixedAmount > 0 && (
                            <div className="flex justify-between items-center">
                              {totalMixedAmount > currentBalance ? (
                                <>
                                  <span className="text-sm text-green-600">
                                    ເງິນທອນ:
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(
                                      Math.ceil(
                                        totalMixedAmount - currentBalance,
                                      ),
                                      'KIP',
                                    )}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-sm text-red-600">
                                    ຍອດຄົງເຫຼືອ:
                                  </span>
                                  <span className="font-semibold text-red-600">
                                    {formatCurrency(
                                      Math.ceil(
                                        currentBalance - totalMixedAmount,
                                      ),
                                      'KIP',
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="mt-6 pt-4 border-t border-stroke">
                  <button
                    onClick={handlePaymentConfirm}
                    className="w-full py-3 rounded text-white font-semibold text-lg transition-all bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
                  >
                    ຢືນຢັນການຊຳລະ
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
