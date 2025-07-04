import { Empty } from 'antd';
import {
  Calendar,
  User,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  RefreshCw,
  Filter,
  Bell,
  Users,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// ฟังก์ชันสำหรับการจัดการวันที่และเวลา
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isPast = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString).getTime() < new Date().getTime();
};

const isUpcoming = (dateString) => {
  if (!dateString) return false;
  const appointmentTime = new Date(dateString).getTime();
  const now = new Date().getTime();
  const thirtyMinutes = 30 * 60 * 1000;
  return appointmentTime <= now + thirtyMinutes && appointmentTime > now;
};

const getStatusColor = (status, dateString) => {
  if (status === 'ກວດແລ້ວ') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }
  if (status === 'ລໍຖ້າ') {
    if (isPast(dateString)) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (isUpcoming(dateString)) {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const getCardStyle = (dateString, status) => {
  if (status === 'ກວດແລ້ວ') {
    return 'border-emerald-200 ';
  }
  if (status === 'ລໍຖ້າ') {
    if (isPast(dateString)) {
      return 'border-red-200  ';
    }
    if (isUpcoming(dateString)) {
      return 'border-orange-200  ';
    }
    return 'border-blue-200 ';
  }
  return 'border-gray-200 ';
};

const ModernTodayAppointments = ({
  todayAppointments = [],
  handleCompleteAppointment,
  openPostponeModal,
  currentTime = new Date(),
  setCurrentTime = () => {},
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  // ย้าย state declarations ขึ้นมาด้านบน
  const [patientName, setPatientName] = useState([]);
  const [loading, setLoading] = useState(false);

  // อัปเดตเวลาปัจจุบัน
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoRefresh) {
        setCurrentTime(new Date());
      }
    }, 30000); // อัปเดตทุก 30 วินาที

    return () => clearInterval(interval);
  }, [isAutoRefresh, setCurrentTime]);

  // เพิ่ม useEffect สำหรับการดึงข้อมูลคนไข้
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Patient data fetched:', data.data); // เพิ่ม debug log
        setPatientName(data.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  // กรองข้อมูลตามสถานะ
  //   const filteredAppointments = todayAppointments.filter((appointment) => {
  //     if (filterStatus === 'all') return true;
  //     if (filterStatus === 'waiting') return appointment.status === 'ລໍຖ້າ';
  //     if (filterStatus === 'completed') return appointment.status === 'ກວດແລ້ວ';
  //     if (filterStatus === 'urgent')
  //       return (
  //         isPast(appointment.date_addmintted) && appointment.status === 'ລໍຖ້າ'
  //       );
  //     return true;
  //   });

  const filteredAppointments = todayAppointments.filter((a) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'waiting') return a.status === 'ລໍຖ້າ';
    if (filterStatus === 'completed') return a.status === 'ກວດແລ້ວ';
    if (filterStatus === 'urgent')
      return isPast(a.date_addmintted) && a.status === 'ລໍຖ້າ';
    return true;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const aTime = new Date(a.date_addmintted).getTime();
    const bTime = new Date(b.date_addmintted).getTime();

    const aPriority =
      a.status === 'ກວດແລ້ວ'
        ? 3
        : isUpcoming(a.date_addmintted)
          ? 0
          : isPast(a.date_addmintted)
            ? 2
            : 1;

    const bPriority =
      b.status === 'ກວດແລ້ວ'
        ? 3
        : isUpcoming(b.date_addmintted)
          ? 0
          : isPast(b.date_addmintted)
            ? 2
            : 1;

    return aPriority - bPriority || aTime - bTime;
  });
  const handleComplete = (appointmentId) => {
    if (handleCompleteAppointment) {
      handleCompleteAppointment(appointmentId);
    }
  };

  const handlePostpone = (appointmentId) => {
    if (openPostponeModal) {
      openPostponeModal(appointmentId);
    }
  };

  // สถิติสำหรับ header
  const stats = {
    total: todayAppointments.length,
    waiting: todayAppointments.filter((apt) => apt.status === 'ລໍຖ້າ').length,
    completed: todayAppointments.filter((apt) => apt.status === 'ກວດແລ້ວ')
      .length,
    urgent: todayAppointments.filter(
      (apt) => isPast(apt.date_addmintted) && apt.status === 'ລໍຖ້າ',
    ).length,
  };

  useEffect(() => {
    console.log('appointments:', todayAppointments);
    console.log('patientName:', patientName);
  }, [todayAppointments, patientName]);

  // ปรับปรุงฟังก์ชัน getPatientName
  const getPatientName = (patient_id) => {
    if (!patientName || patientName.length === 0) {
      return 'ກຳລັງໂຫລດ...';
    }

    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    console.log('Looking for patient_id:', patient_id, 'Found:', patient); // เพิ่ม debug log

    return patient
      ? `${patient.patient_name} ${patient.patient_surname}`
      : 'ບໍ່ພົບຊື່';
  };

  // ปรับปรุงฟังก์ชัน getPatientPhone
  const getPatientPhone = (patient_id) => {
    if (!patientName || patientName.length === 0) {
      return 'ກຳລັງໂຫລດ...';
    }

    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    return patient
      ? `${patient.phone1 || ''}${patient.phone2 ? ' / ' + patient.phone2 : ''}`
      : 'ບໍ່ພົບເບີໂທ';
  };

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-2 bg-white ">
            <div className="text-center  text-gray-500 dark:text-gray-400">
              <div className="w-32 h-32 flex items-center justify-center mx-auto ">
                <Empty description={false} />
              </div>
              <p className="text-lg">ບໍ່ພົບຂໍ້ມູນການນັດໝາຍໃນມື້ີນີ້</p>
              <p className="text-sm mt-2">ກະລຸນາກວດສອບນັດໝາຍ</p>
            </div>
          </div>
        ) : (
        
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.appoint_id}
                className={`bg-white rounded border border-stroke ${getCardStyle(appointment.date_addmintted, appointment.status)} p-4`}
              >
                {/* Header with time and status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Users className="w-5 h-5 text-secondary2" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-form-input">
                        {formatTime(appointment.date_addmintted)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ລະຫັດ {appointment.appoint_id}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status, appointment.date_addmintted)}`}
                  >
                    {appointment.status}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-form-input text-md">
                        {getPatientName(appointment.patient_id)}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="w-4 h-4" />
                       {getPatientPhone(appointment.patient_id)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* {isPast(appointment.date_addmintted) &&
                  appointment.status === 'ລໍຖ້າ' && (
                    <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">ເລີຍເວລາ</span>
                    </div>
                  )} */}

                {isUpcoming(appointment.date_addmintted) &&
                  appointment.status === 'ລໍຖ້າ' && (
                    <div className="mb-4 flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm font-medium">ໃກ້ຖືງເວລາ</span>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {appointment.status === 'ລໍຖ້າ' && (
                    <>
                      <button
                        onClick={() => handleComplete(appointment.appoint_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        ສຳເລັດ
                      </button>
                      <button
                        onClick={() => handlePostpone(appointment.appoint_id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary2 hover:bg-secondary2 text-white px-4 py-2 rounded text-sm font-medium transition-all"
                      >
                        <Clock className="w-4 h-4" />
                        ເລື່ອນ
                      </button>
                    </>
                  )}

                  {appointment.status === 'ກວດແລ້ວ' && (
                    <div className="flex-1 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded border border-emerald-200">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">ສຳເລັດແລ້ວ</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTodayAppointments;
