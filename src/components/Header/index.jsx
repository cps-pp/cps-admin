import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import Logo from '../../images/logo/cps-logo.png';
import axios from 'axios';

const Header = (props) => {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 transition-all duration-300 hover:shadow-md group"
          >
            {props.sidebarOpen ? (
              <X className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Menu className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 ">
          {/* User Profile Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded  bg-slate-50 hover:bg-slate-100 border border-stroke transition-all duration-300 hover:shadow-md group"
              >
                <div className="w-8 h-8 bg-secondary2 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-md font-semibold text-form-input group-hover:text-secondary transition-colors duration-200">
                    {user.username}  {user.role}
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

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Logo from '../../images/logo/cps-logo.png';

// const Header = (props) => {
//   const [user, setUser] = useState(null);

//   return (
//     <header className="sticky top-0 z-10 flex w-full bg-white drop-shadow-1 ">
//       <div className="flex flex-grow items-center justify-between px-4 py-8 md:py-6 lg:py-6 shadow-2 ">
//         <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
//           <button
//             aria-controls="sidebar"
//             onClick={(e) => {
//               e.stopPropagation();
//               props.setSidebarOpen(!props.sidebarOpen);
//             }}
//             className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
//           >
//             <span className="relative block h-5.5 w-5.5 cursor-pointer">
//               <span className="du-block absolute right-0 h-full w-full">
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!w-full delay-300'
//                   }`}
//                 ></span>
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && 'delay-400 !w-full'
//                   }`}
//                 ></span>
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!w-full delay-500'
//                   }`}
//                 ></span>
//               </span>
//               <span className="absolute right-0 h-full w-full rotate-45">
//                 <span
//                   className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!h-0 !delay-[0]'
//                   }`}
//                 ></span>
//                 <span
//                   className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!h-0 !delay-200'
//                   }`}
//                 ></span>
//               </span>
//             </span>
//           </button>

//           <div>
//             <Link className="block flex-shrink-0 lg:hidden" to="/dashboard">
//               <img
//                 src={Logo}
//                 alt="Logo"
//                 className="w-[60px] h-[60px] lg:w-[35px] lg:h-[60px] object-contain hidden dark:block"
//               />
//             </Link>
//           </div>
//         </div>

//         <div className="hidden sm:block">
//           <div className="relative">
//             <button className="absolute left-0 top-1/2 -translate-y-1/2">
//               {/* Optional Search Icon */}
//             </button>

//             {/* Optional Search Input */}
//             {/* <input
//               type="text"
//               placeholder="Type to search..."
//               className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
//             /> */}
//           </div>
//         </div>

//         <div className="flex items-center gap-3 2xsm:gap-7">
//           <ul className="flex items-center gap-2 2xsm:gap-4 list-none">
//             {/* <DarkModeSwitcher /> */}
//             {/* <DropdownNotification /> */}
//           </ul>
//           {/* <DropdownUser user={user} /> */}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
