import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/index';
import { Outlet, useLocation } from 'react-router-dom';
import Alerts from '@/components/Alerts';
import Header from '../components/Header';

const DefaultLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const excludesRoute = ['/auth'];

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {!excludesRoute.includes(pathname) ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div className="mx-auto max-w-screen-3xl p-4 md:p-6 3xl:p-10 relative">
                <Outlet />
                <Alerts />
              </div>
            </main>
          </div>
        </div>
      ) : (
        <main>
          {/* children would go here if used */}
          <Alerts />
        </main>
      )}
    </div>
  );
};

export default DefaultLayout;

// import React, { useState, ReactNode } from 'react';
// import Header from '../components/Header/index';
// import Sidebar from '../components/Sidebar/index';
// import { Outlet, useLocation } from 'react-router-dom';
// import Alerts from '@/components/Alerts';

// // const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const DefaultLayout: React.FC = () => {
//   const location = useLocation();
//   const { pathname } = location;
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const excludesRoute = ['/auth'];

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       {!excludesRoute.includes(pathname) ? (
//         <div className="flex h-screen overflow-hidden">
//           <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//             <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//             <main>
//               <div className="mx-auto max-w-screen-3xl p-4 md:p-6 3xl:p-10 relative">
//               <Outlet />
//                 <Alerts />
//               </div>
//             </main>
//           </div>
//         </div>
//       ) : (
//         <main>
//           {/* {children} */}
//           <Alerts />
//         </main>
//       )}
//     </div>
//   );
// };

// export default DefaultLayout;
