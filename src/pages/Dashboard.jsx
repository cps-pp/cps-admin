import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, } from 'recharts';
import CardDataStats from '../components/CardDataStats';
import MonthChart from '../components/Charts/MonthChart';
import { getAppointments } from '@/api/getAppointments';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useNavigate } from 'react-router-dom';
import { FollowHeader } from './Follow/column/follow';
import ExchangeRateModal from '../components/exchange_chack/ExchangeRateModal'; // เพิ่ม import


const Dashboard = () => {
  const [patients, setPatients] = useState(null);
  const [patient, setPatient] = useState(0); // ถ้ามี
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]); // เพิ่มตัวแปรนี้
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({ baht: 0, yuan: 0, dollar: 0 });
  const [exchangeData, setExchangeData] = useState([]); // เพิ่มตัวแปรนี้
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
// แก้ไขฟังก์ชัน checkTodayExchangeRates
const checkTodayExchangeRates = async () => {
  try {
    setExchangeCheckLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`http://localhost:4000/src/manager/today/${today}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Today exchange rates check:', data);
    
    const requiredCurrencies = ['BATH', 'Dollar', 'YUAN'];
    const existingCurrencies = data.data ? data.data.map(item => item.ex_type) : [];
    const missing = requiredCurrencies.filter(currency => !existingCurrencies.includes(currency));
    
    if (missing.length > 0) {
      setMissingExchangeRates(missing);
      setShowExchangeModal(true);
    } else {
      // บันทึกว่าตรวจสอบวันนี้แล้ว
      localStorage.setItem('lastExchangeCheck', today);
      await fetchExchangeRates();
    }
    
  } catch (error) {
    console.error('Error checking today exchange rates:', error);
    setMissingExchangeRates(['BATH', 'Dollar', 'YUAN']);
    setShowExchangeModal(true);
  } finally {
    setExchangeCheckLoading(false);
  }
};

// แก้ไขฟังก์ชัน handleSubmitExchangeRates
const handleSubmitExchangeRates = async (rates) => {
  const mapToCode = {
    'BATH': 'BATH',
    'Dollar': 'Dollar',
    'YUAN': 'YUAN'
  };

  const payload = {
    rates: Object.entries(rates).map(([label, rate]) => ({
      ex_type: mapToCode[label],
      ex_rate: parseFloat(rate)
    }))
  };

  try {
    const res = await fetch(`http://localhost:4000/src/manager/update-rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

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

// ฟังก์ชันดึงข้อมูลอัตราแลกเปลี่ยน
const fetchExchangeRates = async () => {
  try {
    const response = await fetch('http://localhost:4000/src/manager/exchange');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    
    console.log('Raw API Response:', data);
    
    if (data && data.data) {
      const rates = { baht: 0, yuan: 0, dollar: 0 };
      
      data.data.forEach((item, index) => {
        const typeCheck = item.ex_type?.trim();
        
        switch(typeCheck) {
          case 'BATH':
            rates.baht = item.ex_rate || 0;
            break;
          case 'Dollar':
            rates.dollar = item.ex_rate || 0;
            break;
          case 'YUAN':
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

// ฟังก์ชันตรวจสอบว่าควรเช็คอัตราแลกเปลี่ยนหรือไม่ (เช็คจากฐานข้อมูล)
const shouldCheckExchangeRates = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Checking database for today rates:', today);
    
    const response = await fetch(`http://localhost:4000/src/exchange/today/${today}`);
    
    if (!response.ok) {
      console.log('API error, assume need to check');
      return true;
    }
    
    const data = await response.json();
    console.log('Database check result:', data);
    
    const requiredCurrencies = ['BATH', 'Dollar', 'YUAN'];
    const existingCurrencies = data.data ? data.data.map(item => item.ex_type) : [];
    const missing = requiredCurrencies.filter(currency => !existingCurrencies.includes(currency));
    
    const needToCheck = missing.length > 0;
    console.log('Required:', requiredCurrencies, 'Existing:', existingCurrencies, 'Missing:', missing, 'Need to check:', needToCheck);
    
    return needToCheck;
    
  } catch (error) {
    console.error('Error checking database:', error);
    return true; // ถ้า error ให้เช็ค
  }
}; 

// useEffect หลัก - เรียกทุกครั้งที่ component mount หรือ re-render
useEffect(() => {
  const initializeApp = async () => {
    console.log('App initializing...');
    
    const needToCheck = await shouldCheckExchangeRates();
    
    if (needToCheck) {
      console.log('Need to check exchange rates');
      await checkTodayExchangeRates();
    } else {
      console.log('Already have rates for today, fetching existing rates');
      await fetchExchangeRates();
    }
  };
  
  initializeApp();
}, []); // ไม่มี dependency เพื่อให้รันแค่ครั้งเดียวตอน mount

// เพิ่ม useEffect สำหรับตรวจสอบเมื่อผู้ใช้กลับมาที่หน้า
useEffect(() => {
  const handleVisibilityChange = async () => {
    if (!document.hidden) {
      const needToCheck = await shouldCheckExchangeRates();
      if (needToCheck) {
        console.log('Page became visible and need to check rates');
        await checkTodayExchangeRates();
      }
    }
  };

  const handleFocus = async () => {
    const needToCheck = await shouldCheckExchangeRates();
    if (needToCheck) {
      console.log('Window focused and need to check rates');  
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
      const response = await fetch('http://localhost:4000/src/manager/patient/dashboard');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      // กำหนดจำนวนผู้ป่วย
      setPatient(data.data.length);

      // กำหนดข้อมูลที่แสดงในตาราง
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
          'http://localhost:4000/src/manager/patient',
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

  // ✅ ย้าย useEffect นี้ไปไว้หลัง fetchPatientName เพื่อให้ข้อมูลพร้อม
  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const response = await fetch('http://localhost:4000/src/manager/patient');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPatientName(data.data);
        setPatientsList(data.data);  
      } catch (error) {
        console.error('Error fetching patient names:', error);
      }
    };
    fetchPatientName();
  }, []);


// เพิ่ม useEffect สำหรับดึงข้อมูลยา
useEffect(() => {
  const fetchMedicines = async () => {
    try {
      setMedicineLoading(true);
      const response = await fetch('http://localhost:4000/src/manager/medicines');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      if (data && data.data) {
        setMedicines(data.data);
        
        // แยกยาที่ใกล้หมดและหมด
        const lowStock = data.data.filter(med => med.status === 'ໃກ້ໝົດ');
        const outOfStock = data.data.filter(med => med.status === 'ໝົດ');
        
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

// เพิ่ม useEffect สำหรับดึงข้อมูลประเภทยา
useEffect(() => {
  const fetchMedicineTypes = async () => {
    try {
      const response = await fetch('http://localhost:4000/src/manager/category');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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

// ปรับปรุงฟังก์ชัน getExchangeRateDisplay ให้แสดงผลแบบกระชับขึ้น
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

  // ✅ ปรับปรุงฟังก์ชัน getTodayPendingAppointments ให้เรียงลำดับตามเวลา
  const getTodayPendingAppointments = () => {
    if (!appointments || appointments.length === 0) return [];

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const todayAppts = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date_addmintted);
      return appointmentDate >= todayStart &&
        appointmentDate <= todayEnd &&
        appointment.status === 'ລໍຖ້າ';
    });

    // ✅ เรียงลำดับตามเวลา (จากเวลาน้อยไปมาก)
    const sortedTodayAppts = todayAppts.sort((a, b) => {
      const timeA = new Date(a.date_addmintted).getTime();
      const timeB = new Date(b.date_addmintted).getTime();
      return timeA - timeB; // เรียงจากเวลาน้อยไปมาก
    });

    return sortedTodayAppts;
  };

  const todayPendingAppointments = getTodayPendingAppointments();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/src/appoint/appointment',
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
        const response = await fetch('http://localhost:4000/src/manager/emp');
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
        const response = await fetch('http://localhost:4000/src/manager/emp');
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



  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

 // เพิ่มฟังก์ชันสำหรับหาชื่อประเภทยา
  const getTypeName = (medtype_id) => {
    const type = medicineTypes.find((type) => type.medtype_id === medtype_id);
    return type ? type.type_name : 'ບໍ່ພົບປະເພດ';
  };

  // ฟังก์ชันสำหรับสถานะยา
  const getStatusClass = (status) => {
    switch (status) {
      case 'ໃກ້ໝົດ':
        return 'bg-yellow-100 text-yellow-700';
      case 'ໝົດ':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };



  // ฟังก์ชันจัดรูปแบบที่อยู่
  const formatAddress = (village, district, province) => {
    const addressParts = [];

    if (village && village.trim()) {
      addressParts.push(`ບ້ານ${village.trim()}`);
    }

    if (district && district.trim()) {
      addressParts.push(`ເມືອງ${district.trim()}`);
    }

    if (province && province.trim()) {
      addressParts.push(`ແຂວງ${province.trim()}`);
    }

    return addressParts.length > 0 ? addressParts.join(', ') : '-';
  };

  // ฟังก์ชันจัดรูปแบบที่อยู่แบบย่อ (สำหรับตาราง)
  const formatAddressShort = (village, district, province) => {
    const parts = [];

    if (village && village.trim()) {
      parts.push(village.trim());
    }
    if (district && district.trim()) {
      parts.push(district.trim());
    }
    if (province && province.trim()) {
      parts.push(province.trim());
    }

    return parts.length > 0 ? parts.join(', ') : '-';
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
    navigate('/manager/emp'); // เปลี่ยนเส้นทางตามที่ต้องการ
  };

  const handleExchangeManagement = () => {
    navigate('/manager/exchange'); // เปลี่ยนเส้นทางไปหน้าจัดการอัตราแลกเปลี่ยน
  };

  return (
    <>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="ລາຍຮັບທັງໝົດ"
          total={<span className="text-2xl text-black-2">60,000,000 ກີບ</span>}
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
              d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
            />
          </svg>
        </CardDataStats>

        
        {/* Card อัตราแลกเปลี่ยน - ปรับปรุงให้แสดงข้อมูลจริง */}
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

        {/* 2. Card คนเจ็บ */}
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

          {/* 3. Card ท่านหมอ */}
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

      <div className="grid grid-cols-2 gap-8 mt-6">

        {/* Appointments Section - Right Side */}
        <div className="rounded bg-white pt-1 shadow-md ">
          <div className="flex items-center justify-between px-4 pb-4">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
              ນັດໝາຍມື້ນີ້ ({getTodayDate()})
            </h2>
            <div className="text-sm text-yellow-600 dark:text-gray-400">
              ລໍຖ້າກວດ: {todayPendingAppointments.length} ລາຍການ
            </div>
            <button
              onClick={() => navigate('/followpat')}
              className="bg-secondary hover:bg-secondary2 text-white px-4 py-2  text-sm rounded transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              ກວດສອບນັດໝາຍ
            </button>
          </div>

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
             {/*     <th className="px-4 py-3 text-form-input  font-semibold">
                    ສະຖານະ
                  </th> */}
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
                        {new Date(appointment.date_addmintted).toLocaleString('en-US',
                          { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' }
                        )}
                      </td>
                 {/*     <td className="px-4 py-3">
                        <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800">
                          {appointment.status}
                        </span>
                      </td> */}
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
        {/* Patient Section - Left Side */}
        <div className="rounded bg-white pt-4 shadow-md  ">
          <div className="flex items-center justify-between  px-4 pb-4 ">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
              ລາຍຊື່ຄົນເຈັບເພີ່ມລ່າສຸດ
            </h2>
          </div>

         <div className="overflow-x-auto  ">
          <table className="w-full min-w-max table-auto  ">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ລະຫັດຄົນເຈັບ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ຊື່-ນາມສະກຸນ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ເພດ
                  </th>
                  <th className="px-4 py-3 text-form-input  font-semibold">
                    ທີ່ຢູ່
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      ກຳລັງໂຫຼດຂໍ້ມູນ...
                    </td>
                  </tr>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.slice(0, 3).map((patient, index) => (
                    <tr key={index} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4">{patient.patient_id}</td>
                      <td className="px-4 py-4">{patient.patient_name} {patient.patient_surname}</td>
                      <td className="px-4 py-4">{patient.gender}</td>
                      <td className="px-4 py-4" title={formatAddress(patient.village, patient.district, patient.province)}>
                        {formatAddressShort(patient.village, patient.district, patient.province)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      ບໍ່ມີຂໍ້ມູນຄົນເຈັບ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Link to view all patients */}
          <div className="px-4 py-3  flex justify-center">
            <button
              onClick={handlePatientManagement}
              className="text-primary hover:text-primary-dark text-md font-semibold hover:underline transition-colors duration-200"
            >
              ເບຶ່ງຄົນເຈັບທັງໝົດ →
            </button>
          </div>
        </div>
      </div>
      
      {/* Medicines Section */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="rounded bg-white pt-1 shadow-md col-span-2">
          <div className="flex items-center justify-between px-4 pb-4">
            <h2 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
              ⚠️ລາຍການຢາ ແລະ ອຸປະກອນທີ່ໃກ້ໝົດ ແລະ ໝົດແລ້ວ
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-yellow-600 dark:text-gray-400">
                ໃກ້ໝົດ: {lowStockMedicines.length} ລາຍການ
              </div>
              <div className="text-sm text-red-600">
                ໝົດ: {outOfStockMedicines.length} ລາຍການ
              </div>
              <button
                onClick={() => navigate('/perorder')}
                className="bg-secondary hover:bg-secondary2 text-white px-4 py-2 text-sm rounded transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.781 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                ສັ່ງຊື້ຢາ ແລະ ອຸປະກອນ
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 text-form-input font-semibold">ລະຫັດຢາ</th>
                  <th className="px-4 py-3 text-form-input font-semibold">ຊື່ຢາ</th>
                  <th className="px-4 py-3 text-form-input font-semibold">ປະເພດຢາ</th>
                  <th className="px-4 py-3 text-form-input font-semibold">ຈຳນວນ</th>
                  <th className="px-4 py-3 text-form-input font-semibold">ຫົວໜ່ວຍ</th>
                  <th className="px-4 py-3 text-form-input font-semibold">ສະຖານະ</th>
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
                  [...lowStockMedicines, ...outOfStockMedicines].map((medicine, index) => (
                    <tr
                      key={index}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">{medicine.med_id}</td>
                      <td className="px-4 py-4">{medicine.med_name}</td>
                      <td className="px-4 py-4">{getTypeName(medicine.medtype_id)}</td>
                      <td className="px-4 py-4">{medicine.qty}</td>
                      <td className="px-4 py-4">{medicine.unit}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(medicine.status)}`}
                        >
                          {medicine.status}
                        </span>
                      </td>

                    </tr>
                  ))

                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

       {/* Loading indicator สำหรับการตรวจสอบอัตราแลกเปลี่ยน */}
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

