import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Legend,
  Pie,
  Cell,
} from 'recharts';
import CardDataStats from '../components/CardDataStats';

import { useNavigate } from 'react-router-dom';
import { FollowHeader } from './Follow/column/follow';
import ExchangeRateModal from '../components/exchange_chack/ExchangeRateModal';
import { Calendar, Badge, List, Typography, Card } from 'antd';
import { ArrowRight, HandCoins } from 'lucide-react';
import { URLBaseLocal } from '../lib/MyURLAPI';
const { Text, Title } = Typography;
const Dashboard = () => {
  const [patients, setPatients] = useState(null);
  const [patient, setPatient] = useState(0); // ถ้ามี
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({
    baht: 0,
    yuan: 0,
    dollar: 0,
  });
  const [exchangeData, setExchangeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [patientsList, setPatientsList] = useState([]);

  // เพิ่ม state สำหรับยา
  const [medicines, setMedicines] = useState([]);
  const [medicineTypes, setMedicineTypes] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [outOfStockMedicines, setOutOfStockMedicines] = useState([]);
  const [medicineLoading, setMedicineLoading] = useState(true);

  // เพิ่ม State Variables ที่จำเป็น
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [missingExchangeRates, setMissingExchangeRates] = useState([]);
  const [exchangeCheckLoading, setExchangeCheckLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    today: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const [paymentTypeStats, setPaymentTypeStats] = useState({
    cash: 0,
    transfer: 0,
  });

  const fetchPayments = async () => {
    try {
      setPaymentLoading(true);
         const response = await fetch(
        `${URLBaseLocal}/src/report/payment`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPayments(data.data);

      // ✅ แก้ไขตรงนี้
      const total = data.data.reduce((sum, payment) => {
        return sum + (parseFloat(payment.paid_amount) || 0);
      }, 0);
      setTotalRevenue(total);

      calculateRevenueStats(data.data);
      calculatePaymentTypeStats(data.data);
      prepareChartData(data.data);

      // คำนวณรายได้รวม
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setTotalRevenue(0);
      setPaymentStats({
        today: 0,
        thisMonth: 0,
        thisYear: 0,
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // ===== อัพเดท ฟังก์ชันคำนวณสถิติรายได้ =====
  const calculateRevenueStats = (paymentData) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const stats = {
      today: 0,
      thisMonth: 0,
      thisYear: 0,
    };

    paymentData.forEach((payment) => {
      const amount = parseFloat(payment.paid_amount) || 0;
      const paymentDate = new Date(payment.pay_date);
      const paymentDateStr = paymentDate.toISOString().split('T')[0];

      // รายได้วันนี้
      if (paymentDateStr === todayStr) {
        stats.today += amount;
      }

      // รายได้เดือนนี้
      if (
        paymentDate.getMonth() === thisMonth &&
        paymentDate.getFullYear() === thisYear
      ) {
        stats.thisMonth += amount;
      }

      // รายได้ปีนี้
      if (paymentDate.getFullYear() === thisYear) {
        stats.thisYear += amount;
      }
    });

    setPaymentStats(stats);
  };

  // ===== เพิ่ม ฟังก์ชันคำนวณสถิติประเภทการชำระ =====
  const calculatePaymentTypeStats = (paymentData) => {
    const typeStats = {
      cash: 0,
      transfer: 0,
    };

    paymentData.forEach((payment) => {
      const amount = parseFloat(payment.paid_amount) || 0;
      if (payment.pay_type === 'CASH') {
        typeStats.cash += amount;
      } else if (payment.pay_type === 'TRANSFER') {
        typeStats.transfer += amount;
      }
    });

    setPaymentTypeStats(typeStats);
  };

  // ===== อัพเดท ฟังก์ชันเตรียมข้อมูลสำหรับ Chart =====
  const prepareChartData = (paymentData) => {
    // ข้อมูลรายได้รายวัน (7 วันล่าสุด)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dailyTotal = paymentData
        .filter((payment) => {
          const paymentDate = new Date(payment.pay_date);
          return paymentDate.toISOString().split('T')[0] === dateStr;
        })
        .reduce(
          (sum, payment) => sum + (parseFloat(payment.paid_amount) || 0),
          0,
        );

      // แยกตามประเภทการชำระ
      const cashTotal = paymentData
        .filter((payment) => {
          const paymentDate = new Date(payment.pay_date);
          return (
            paymentDate.toISOString().split('T')[0] === dateStr &&
            payment.pay_type === 'CASH'
          );
        })
        .reduce(
          (sum, payment) => sum + (parseFloat(payment.paid_amount) || 0),
          0,
        );

      const transferTotal = paymentData
        .filter((payment) => {
          const paymentDate = new Date(payment.pay_date);
          return (
            paymentDate.toISOString().split('T')[0] === dateStr &&
            payment.pay_type === 'TRANSFER'
          );
        })
        .reduce(
          (sum, payment) => sum + (parseFloat(payment.paid_amount) || 0),
          0,
        );

      last7Days.push({
        date: date.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
        }),
        revenue: dailyTotal,
        cash: cashTotal,
        transfer: transferTotal,
      });
    }
    setDailyRevenue(last7Days);

    // ข้อมูลรายได้รายเดือน (6 เดือนล่าสุด)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthlyTotal = paymentData
        .filter((payment) => {
          const paymentDate = new Date(payment.pay_date);
          return (
            paymentDate.getMonth() === month &&
            paymentDate.getFullYear() === year
          );
        })
        .reduce(
          (sum, payment) => sum + (parseFloat(payment.paid_amount) || 0),
          0,
        );

      last6Months.push({
        month: date.toLocaleDateString('th-TH', {
          month: 'short',
          year: 'numeric',
        }),
        revenue: monthlyTotal,
      });
    }
    setMonthlyRevenue(last6Months);
  };

  // ===== เพิ่ม ฟังก์ชันสำหรับข้อมูล Pie Chart =====
  const getPaymentTypeChartData = () => {
    const total = paymentTypeStats.cash + paymentTypeStats.transfer;
    if (total === 0) return [];

    return [
      {
        name: 'ເງິນສົດ',
        value: paymentTypeStats.cash,
        percentage: ((paymentTypeStats.cash / total) * 100).toFixed(1),
      },
      {
        name: 'ໂອນເງິນ',
        value: paymentTypeStats.transfer,
        percentage: ((paymentTypeStats.transfer / total) * 100).toFixed(1),
      },
    ];
  };
  useEffect(() => {
    fetchPayments();
  }, []);

  const checkTodayExchangeRates = async () => {
    try {
      setExchangeCheckLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${URLBaseLocal}/src/manager/today/${today}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Today exchange rates check:', data);

      const requiredCurrencies = ['THB', 'USD', 'CNY'];
      const existingCurrencies = data.data
        ? data.data.map((item) => item.ex_type)
        : [];
      const missing = requiredCurrencies.filter(
        (currency) => !existingCurrencies.includes(currency),
      );

      if (missing.length > 0) {
        setMissingExchangeRates(missing);
        setShowExchangeModal(true);
      } else {
        localStorage.setItem('lastExchangeCheck', today);
        await fetchExchangeRates();
      }
    } catch (error) {
      console.error('Error checking today exchange rates:', error);
      setMissingExchangeRates(['THB', 'USD', 'CNY']);
      setShowExchangeModal(true);
    } finally {
      setExchangeCheckLoading(false);
    }
  };

  const handleSubmitExchangeRates = async (rates) => {
    const mapToCode = {
      THB: 'THB',
      USD: 'USD',
      CNY: 'CNY',
    };

    const payload = {
      rates: Object.entries(rates).map(([label, rate]) => ({
        ex_type: mapToCode[label],
        ex_rate: parseFloat(rate),
      })),
    };

    try {
      const res = await fetch(
        `${URLBaseLocal}/src/manager/update-rates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');

      // บันทึกว่าตรวจสอบวันนี้แล้ว
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('lastExchangeCheck', today);

      // ปิด modal และดึงข้อมูลใหม่
      setShowExchangeModal(false);
      await fetchExchangeRates();
    } catch (error) {
      console.error('Error submitting exchange rates:', error);
      throw error;
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `${URLBaseLocal}/src/manager/exchange`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      console.log('Raw API Response:', data);

      if (data && data.data) {
        const rates = { baht: 0, yuan: 0, dollar: 0 };

        data.data.forEach((item, index) => {
          const typeCheck = item.ex_type?.trim();

          switch (typeCheck) {
            case 'THB':
              rates.baht = item.ex_rate || 0;
              break;
            case 'USD':
              rates.dollar = item.ex_rate || 0;
              break;
            case 'CNY':
              rates.yuan = item.ex_rate || 0;
              break;
          }
        });

        setExchangeRates(rates);
        setExchangeData(data.data);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setExchangeRates({ baht: 0, dollar: 0, yuan: 0 });
      setExchangeData([]);
    }
  };

  const shouldCheckExchangeRates = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      console.log('Checking database for today rates:', today);

      const response = await fetch(
        `${URLBaseLocal}/src/exchange/today/${today}`,
      );

      if (!response.ok) {
        console.log('API error, assume need to check');
        return true;
      }

      const data = await response.json();
      console.log('Database check result:', data);

      const requiredCurrencies = ['THB', 'USD', 'CNY'];
      const existingCurrencies = data.data
        ? data.data.map((item) => item.ex_type)
        : [];
      const missing = requiredCurrencies.filter(
        (currency) => !existingCurrencies.includes(currency),
      );

      const needToCheck = missing.length > 0;
      console.log(
        'Required:',
        requiredCurrencies,
        'Existing:',
        existingCurrencies,
        'Missing:',
        missing,
        'Need to check:',
        needToCheck,
      );

      return needToCheck;
    } catch (error) {
      console.error('Error checking database:', error);
      return true; // ถ้า error ให้เช็ค
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // console.log('App initializing...');

      const needToCheck = await shouldCheckExchangeRates();

      if (needToCheck) {
        // console.log('Need to check exchange rates');
        await checkTodayExchangeRates();
      } else {
        // console.log('Already have rates for today, fetching existing rates');
        await fetchExchangeRates();
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        const needToCheck = await shouldCheckExchangeRates();
        if (needToCheck) {
          // console.log('Page became visible and need to check rates');
          await checkTodayExchangeRates();
        }
      }
    };

    const handleFocus = async () => {
      const needToCheck = await shouldCheckExchangeRates();
      if (needToCheck) {
        // console.log('Window focused and need to check rates');
        await checkTodayExchangeRates();
      }
    };

    // ตรวจสอบเมื่อหน้าเว็บ visible อีกครั้ง
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ตรวจสอบเมื่อ window ได้รับ focus
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${URLBaseLocal}/src/manager/patient/dashboard`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPatient(data.data.length);
        setFilteredPatients(data.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${URLBaseLocal}/src/manager/patient`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPatients(data.data.length);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);

  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const response = await fetch(
          `${URLBaseLocal}/src/manager/patient`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPatientName(data.data);
        setPatientsList(data.data);
      } catch (error) {
        console.error('Error fetching patient names:', error);
      }
    };
    fetchPatientName();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setMedicineLoading(true);
        const response = await fetch(
          `${URLBaseLocal}/src/manager/medicines`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          setMedicines(data.data);

          // กำหนดเกณฑ์สำหรับยาที่ใกล้หมด (เช่น น้อยกว่าหรือเท่ากับ 50)
          const LOW_STOCK_THRESHOLD = 50;

          // แยกยาตามจำนวน (qty) แทนที่จะดูจากสถานะ
          const lowStock = data.data.filter((med) => {
            const qty = parseInt(med.qty) || 0;
            return (
              qty > 0 && qty <= LOW_STOCK_THRESHOLD && med.status === 'ຍັງມີ'
            );
          });

          const outOfStock = data.data.filter((med) => {
            const qty = parseInt(med.qty) || 0;
            return qty === 0 || med.status === 'ໝົດ';
          });

          console.log('ยาที่ใกล้หมด (qty <= 50):', lowStock);
          console.log('ยาที่หมด (qty = 0):', outOfStock);

          setLowStockMedicines(lowStock);
          setOutOfStockMedicines(outOfStock);
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setMedicines([]);
        setLowStockMedicines([]);
        setOutOfStockMedicines([]);
      } finally {
        setMedicineLoading(false);
      }
    };
    fetchMedicines();
  }, []);
  const getTypeName = (medtype_id) => {
    const type = medicineTypes.find((type) => type.medtype_id === medtype_id);
    return type ? type.type_name : 'ບໍ່ພົບປະເພດ';
  };

  useEffect(() => {
    const fetchMedicineTypes = async () => {
      try {
        const response = await fetch(
          `${URLBaseLocal}/src/manager/category`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          setMedicineTypes(data.data);
        }
      } catch (error) {
        console.error('Error fetching medicine types:', error);
        setMedicineTypes([]);
      }
    };
    fetchMedicineTypes();
  }, []);

  const getStatusByQty = (qty, originalStatus) => {
    const quantity = parseInt(qty) || 0;

    if (quantity === 0 || originalStatus === 'ໝົດ') {
      return 'ໝົດ';
    } else if (quantity <= 50) {
      return 'ໃກ້ໝົດ';
    } else {
      return 'ຍັງມີ';
    }
  };

  const getStatusClass = (qty, originalStatus) => {
    const status = getStatusByQty(qty, originalStatus);

    switch (status) {
      case 'ຍັງມີ':
        return 'bg-green-100 text-green-800';
      case 'ໃກ້ໝົດ':
        return 'bg-yellow-100 text-yellow-800';
      case 'ໝົດ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExchangeRateDisplay = () => {
    const rates = [];

    if (exchangeRates.baht > 0) {
      rates.push(`฿${exchangeRates.baht.toLocaleString()}`);
    }

    if (exchangeRates.dollar > 0) {
      rates.push(`$${exchangeRates.dollar.toLocaleString()}`);
    }

    if (exchangeRates.yuan > 0) {
      rates.push(`¥${exchangeRates.yuan.toLocaleString()}`);
    }

    if (rates.length === 0) {
      return 'ບໍ່ມີຂໍ້ມູນ';
    }

    // แสดงแบบแยกบรรทัดด้วย <br />
    return rates.join('|');
  };

  const getTodayPendingAppointments = () => {
    if (!appointments || appointments.length === 0) return [];

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    const todayAppts = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date_addmintted);
      return (
        appointmentDate >= todayStart &&
        appointmentDate <= todayEnd &&
        appointment.status === 'ລໍຖ້າ'
      );
    });

    const sortedTodayAppts = todayAppts.sort((a, b) => {
      const timeA = new Date(a.date_addmintted).getTime();
      const timeB = new Date(b.date_addmintted).getTime();
      return timeA - timeB;
    });

    return sortedTodayAppts;
  };

  const todayPendingAppointments = getTodayPendingAppointments();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${URLBaseLocal}/src/appoint/appointment`,
        );
        const data = await response.json();

        console.log('Appointments data:', data);

        if (data && data.data) {
          setAppointments(data.data);
          setFilteredAppointments(data.data);
          setTotalCount(data.data.length);
          setDoneCount(
            data.data.filter((item) => item.status === 'ກວດແລ້ວ').length,
          );
          setWaitingCount(
            data.data.filter((item) => item.status === 'ລໍຖ້າ').length,
          );
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${URLBaseLocal}/src/manager/emp`);
        const data = await response.json();
        setDoctorCount(data.data.length);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URLBaseLocal}/src/manager/emp`);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setEmpName(data.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });
  };

  const formatPhoneNumbers = (phone1) => {
    const phones = [];
    if (phone1?.trim()) phones.push(phone1.trim());
    return phones.length ? phones : '-';
  };

  const getPatientById = (id) => {
    return patientsList.find((p) => p.patient_id === id);
  };

  const getPatientPhones = (id) => {
    const patient = getPatientById(id);
    return patient ? formatPhoneNumbers(patient.phone1, patient.phone2) : '-';
  };

  const getPatientName = (patient_id) => {
    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    return patient
      ? `${patient.patient_name} ${patient.patient_surname}`
      : 'ບໍ່ພົບຊື່';
  };

  const getDoctorName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? `${emp.emp_name} ${emp.emp_surname}` : 'ບໍ່ພົບຊື່';
  };

  const paginated = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handlePatientManagement = () => {
    navigate('/manager/patient');
  };

  const handleDoctorManagement = () => {
    navigate('/manager/employee');
  };

  const handleExchangeManagement = () => {
    navigate('/manager/exchange');
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lo-LA').format(amount);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="ລາຍຮັບທັງໝົດ"
          total={
            <span className="text-2xl text-black-2">
              {paymentLoading
                ? 'ກຳລັງໂຫລດ...'
                : `${formatCurrency(totalRevenue)} ກີບ`}
            </span>
          }
          rate={`ວັນນີ້: ${formatCurrency(paymentStats.today)} ກີບ`}
          levelUp={paymentStats.today > 0}
          levelDown={paymentStats.today === 0}
        >
          <HandCoins className="w-6 h-6 text-primary " />
        </CardDataStats>
        <div onClick={handleExchangeManagement} className="cursor-pointer">
          <CardDataStats
            title="ອັດຕາແລກປ່ຽນມື້ນີ້"
            total={
              <span className="text-xl font-semibold text-black-2 dark:text-white">
                {getExchangeRateDisplay()}
              </span>
            }
          >
            <svg
              className="w-6 h-6 text-primary dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.897-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardDataStats>
        </div>

        <div onClick={handlePatientManagement} className="cursor-pointer">
          <CardDataStats
            title="ຄົນເຈັບທັງໝົດ"
            total={
              <span className="text-2xl text-black-2">
                {patients !== null ? `${patients} ຄົນ` : 'ກຳລັງໂຫຼດ...'}
              </span>
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.7em"
              height="1.7em"
              viewBox="0 0 24 24"
              className="text-primary dark:text-white"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M14 3.5c3.771 0 5.657 0 6.828 1.245S22 7.993 22 12s0 6.01-1.172 7.255S17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.245S2 16.007 2 12s0-6.01 1.172-7.255S6.229 3.5 10 3.5z" />
                <path d="M5 15.5c1.609-2.137 5.354-2.254 7 0m-1.751-5.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M15 9.5h4m-4 4h2" />
              </g>
            </svg>
          </CardDataStats>
        </div>

        <div onClick={handleDoctorManagement} className="cursor-pointer">
          <CardDataStats
            title="ທ່ານຫມໍທັງໝົດ"
            total={
              <span className="2xl text-black-2">
                {doctorCount !== 0 ? `${doctorCount} ຄົນ` : 'ກຳລັງໂຫຼດ...'}
              </span>
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
              width="1.7em"
              height="1.7em"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.84,16.26C17.86,16.83 20,18.29 20,20V22H4V20C4,18.29 6.14,16.83 9.16,16.26L12,21L14.84,16.26M8,8H16V10A4,4 0 0,1 12,14A4,4 0 0,1 8,10V8M8,7L8.41,2.9C8.46,2.39 8.89,2 9.41,2H14.6C15.11,2 15.54,2.39 15.59,2.9L16,7H8M12,3H11V4H10V5H11V6H12V5H13V4H12V3Z" />
            </svg>
          </CardDataStats>
        </div>
      </div>
      <div className="mt-6">
        <div className="rounded-sm border border-stroke bg-white px-6 pt-6 pb-2.5 shadow-default xl:pb-1">
          <div className="mb-6 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-xl font-semibold text-form-input break-words">
                ລາຍຮັບລາຍວັນ (7 ວັນລ່າສຸດ)
              </h4>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis  width={80} tickFormatter={(value) => `${formatCurrency(value)}`} />
                <Tooltip
                  formatter={(value, name) => [
                    `${formatCurrency(value)} ກີບ`,
                    name === 'cash'
                      ? 'ເງິນສົດ'
                      : name === 'transfer'
                        ? 'ໂອນເງິນ'
                        : 'ລາຍຮັບລວມ',
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cash"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  name="ເງິນສົດ"
                />
                <Area
                  type="monotone"
                  dataKey="transfer"
                  stackId="1"
                  stroke="#5A3AB8"
                  fill="#5A3AB8"
                  name="ໂອນເງິນ"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* -------------- */}
      <div className="grid grid-cols-1 gap-8 mt-6">
        <div className="rounded bg-white pt-1 shadow-md ">
          <div className="flex items-center justify-between px-4 py-3 ">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
              ນັດໝາຍມື້ນີ້ ({getTodayDate()})
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-md text-slate-500">
                ລໍຖ້າກວດ: {todayPendingAppointments.length} ລາຍການ
              </div>

              <button
                onClick={() => navigate('/followpat')}
                className="bg-Third2 hover:bg-Third3 text-white px-4 py-2 text-sm rounded transition-colors duration-200 flex items-center gap-2"
              >
                ກວດສອບນັດໝາຍ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* -------------- */}
          <div className="overflow-x-auto  ">
            <table className="w-full min-w-max table-auto  ">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ຊື່ຄົນເຈັບ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ເບີໂທ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ວັທີ່ນັດໝາຍ
                  </th>

                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ລາຍລະອຽດ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ຊື່ທ່ານໝໍ
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={FollowHeader.length}
                      className="py-8 text-center text-gray-500"
                    >
                      ກຳລັງໂຫຼດຂໍ້ມູນ...
                    </td>
                  </tr>
                ) : todayPendingAppointments.length > 0 ? (
                  todayPendingAppointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">
                        {getPatientName(appointment.patient_id)}
                      </td>
                      <td className="px-4 py-4">
                        {getPatientPhones(appointment.patient_id)}
                      </td>
                      <td className="px-4 py-4">
                        {new Date(appointment.date_addmintted).toLocaleString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'Asia/Bangkok',
                          },
                        )}
                      </td>
                      <td className="px-4 py-4">{appointment.description}</td>
                      <td className="px-4 py-4">
                        {getDoctorName(appointment.emp_id)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={FollowHeader.length}
                      className="py-4 text-center text-gray-500"
                    >
                      ບໍ່ມີນັດໝາຍທີ່ລໍຖ້າສຳລັບມື້ນີ້
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="rounded bg-white pt-1 shadow-md col-span-2">
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
              ລາຍການຢາ ແລະ ອຸປະກອນທີ່ໃກ້ໝົດ ແລະ ໝົດແລ້ວ
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-md text-slate-500">
                ໃກ້ໝົດ: {lowStockMedicines.length} ລາຍການ
              </div>
              <div className="text-md text-red-600">
                ໝົດ: {outOfStockMedicines.length} ລາຍການ
              </div>
              <button
                onClick={() => navigate('/perorder')}
                className="bg-Third2 hover:bg-Third3 text-white px-4 py-2 text-sm rounded transition-colors duration-200 flex items-center gap-2"
              >
                ສັ່ງຊື້ຢາ ແລະ ອຸປະກອນ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ລະຫັດຢາ
                  </th>
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ຊື່ຢາ
                  </th>
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ປະເພດຢາ
                  </th>
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ຈຳນວນ
                  </th>
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ຫົວໜ່ວຍ
                  </th>
                  <th className="px-4 py-3 text-form-input font-semibold">
                    ສະຖານະ
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicineLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      ກຳລັງໂຫຼດຂໍ້ມູນ...
                    </td>
                  </tr>
                ) : (
                  [...lowStockMedicines, ...outOfStockMedicines].map(
                    (medicine, index) => (
                      <tr
                        key={index}
                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-4">{medicine.med_id}</td>
                        <td className="px-4 py-4">{medicine.med_name}</td>
                        <td className="px-4 py-4">
                          {getTypeName(medicine.medtype_id)}
                        </td>
                        <td className="px-4 py-4">{medicine.qty}</td>
                        <td className="px-4 py-4">{medicine.unit}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(medicine.qty, medicine.status)}`}
                          >
                            {getStatusByQty(medicine.qty, medicine.status)}
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {exchangeCheckLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>ກຳລັງຕົວດສອບອັດຕາແລກປ່ຽນ...</span>
            </div>
          </div>
        </div>
      )}
      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        onSubmit={handleSubmitExchangeRates}
        missingRates={missingExchangeRates}
      />
    </>
  );
};

export default Dashboard;
