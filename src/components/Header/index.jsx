import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import Logo from '../../images/logo/cps-logo.png';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';

const Header = (props) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({  // <-- เพิ่มตรงนี้
    appointments: 0,
    nearExpiry: 0,
    expired: 0,
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {
    const handleRefresh = () => {
      fetchNotifications(); // 👉 โหลดข้อมูลแจ้งเตือนใหม่
    };

    window.addEventListener('refresh-notifications', handleRefresh);
    // โหลดแจ้งเตือนครั้งแรกตอน mount
    fetchNotifications();
    return () => window.removeEventListener('refresh-notifications', handleRefresh);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) return;

      try {
        const res = await axios.get(
          'http://localhost:4000/src/auth/authen/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // ฟังก์ชัน fetchNotifications ออกมาอยู่นอก useEffect เพื่อให้เรียกได้ทุกที่ใน component
  const fetchNotifications = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return;

    try {
      // ดึงข้อมูลนัดหมาย
      const appointmentRes = await axios.get(
        'http://localhost:4000/src/appoint/appointmentWang',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ดึงข้อมูลยา
      const medicineRes = await axios.get(
        'http://localhost:4000/src/manager/medicines',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ตรวจสอบโครงสร้างข้อมูล appointment
      let appointmentData = appointmentRes.data;
      if (appointmentData && typeof appointmentData === 'object' && !Array.isArray(appointmentData)) {
        appointmentData = appointmentData.appointments || appointmentData.data || appointmentData.result || Object.values(appointmentData)[0];
      }

      // ตรวจสอบโครงสร้างข้อมูล medicine
      let medicineData = medicineRes.data;
      if (medicineData && typeof medicineData === 'object' && !Array.isArray(medicineData)) {
        medicineData = medicineData.medicines || medicineData.data || medicineData.result || Object.values(medicineData)[0];
      }

      // นับจำนวนนัดหมาย
      const appointmentCount = Array.isArray(appointmentData) ? appointmentData.length : 0;

      // นับจำนวนยาใกล้หมดและหมด
      let nearExpiryCount = 0;
      let expiredCount = 0;

      if (Array.isArray(medicineData)) {
        medicineData.forEach((medicine) => {
          const quantity = parseInt(medicine.quantity) ||
            parseInt(medicine.stock) ||
            parseInt(medicine.amount) ||
            parseInt(medicine.qty) ||
            parseInt(medicine.remaining) || 0;

          if (quantity === 0) {
            expiredCount++;
          } else if (quantity <= 20) {
            nearExpiryCount++;
          }
        });
      } else {
        console.log('Medicine data is not an array:', typeof medicineData);
      }

      // อัพเดตสถานะแจ้งเตือน
      setNotifications({
        appointments: appointmentCount,
        nearExpiry: nearExpiryCount,
        expired: expiredCount,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // useEffect โหลดข้อมูลตอน mount และตั้ง interval รีเฟรชทุก 5 นาที
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // 5 นาที

    return () => clearInterval(interval);
  }, []);

  // useEffect ตั้ง listener รอรับ event 'refresh-notifications'
  useEffect(() => {
    const handleRefresh = () => {
      fetchNotifications();
    };

    window.addEventListener('refresh-notifications', handleRefresh);

    return () => {
      window.removeEventListener('refresh-notifications', handleRefresh);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('lo-LA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    });
    const weekday = date.toLocaleDateString('lo-LA', {
      weekday: 'long',
      timeZone: 'Asia/Bangkok',
    });

    return `${weekday} ${day}/${month}/${year} ${time}`;
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white shadow">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="lg:hidden p-2 rounded-md bg-slate-100  hover:from-slate-100 hover:to-indigo-100 border border-slate-200 transition-all duration-300 hover:shadow-sm group"
          >
            {props.sidebarOpen ? (
              <X className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Menu className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 border border-stroke px-4 py-2 rounded bg-gray-50">
            <Clock className="w-5 h-5 text-secondary2" />
            <span className="text-base text-form-strokedark font-semibold">
              {formatDateTime(currentTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded bg-slate-50 hover:bg-slate-100 border border-stroke transition-all duration-300 hover:shadow-md group"
              >
                <div className="w-8 h-8 bg-secondary2 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-md font-semibold text-form-input group-hover:text-secondary transition-colors duration-200">
                    {user.username} {user.role}
                  </div>

                </div>

                {showUserMenu ? (
                  <svg
                    className="w-4 h-4 text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 15 7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-75 bg-white backdrop-blur-md border border-stroke rounded shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-stroke">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-secondary2 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ອອກຈາກລະບົບ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-700 font-medium">
                ຍັງບໍ່ໄດ້ລ໋ອກອິນ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotificationMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotificationMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;

