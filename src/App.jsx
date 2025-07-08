// import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
// import { useEffect, useMemo } from 'react';
// import { ROUTES } from './configs/routes';
// import DefaultLayout from './layout/DefaultLayout';
// import LoginForm from './components/LoginForm';
// import NotFound from './pages/NotFound';
// import PageTitle from './components/PageTitle';
// import { useAuth } from './AuthContext';
// import HomePreOrder from './pages/Manager/test/HomePreOrder';

// function App() {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const { user } = useAuth();

//   const restrictedPathsForAdmin = [
//     '/manager/employee',
//     '/manager/servicelist',
//     '/manager/packetdetail',
//   ];

//   const filteredRoutes = useMemo(() => {
//     if (!user) return [];

//     return ROUTES.filter((item) => {
//       if (item.role && !item.role.includes(user.role)) {
//         return false;
//       }
//       if (user.role === 'admin' && restrictedPathsForAdmin.includes(item.path)) {
//         return false;
//       }
//       return true;
//     });
//   }, [user]);
// useEffect(() => {
//   if (!token && pathname !== '/login') {
//     navigate('/login');
//   } else if (token && pathname === '/') {
//     navigate('/login'); 
//   }
// }, [token, pathname, navigate]);



//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return (
//     <Routes>
//       {/* <Route path="/test" element={<HomePreOrder />} /> */}
//       <Route path="/login" element={<LoginForm />} />

//       {token && (
//         <Route path="/" element={<DefaultLayout />}>
//           {filteredRoutes.map((item, index) => (
//             <Route
//               key={index}
//               index={index === 0}
//               path={item.path}
//               element={
//                 <>
//                   <PageTitle title={item.title} />
//                   {item.component}
//                 </>
//               }
//             />
//           ))}

//           {/* ✅ Block admin access to restricted routes */}
//           {user?.role === 'admin' &&
//             restrictedPathsForAdmin.map((path) => (
//               <Route
//                 key={path}
//                 path={path}
//                 element={<Navigate to="/dashboard" replace />}
//               />
//             ))}
//         </Route>
//       )}

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;


// import React, { useEffect } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';

// import DefaultLayout from './layout/DefaultLayout';
// import NotFound from '@/pages/NotFound';
// import PageTitle from './components/PageTitle';
// import { ROUTES } from './configs/routes';

// function AppRoutes() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return (
//     <Routes>
//       <Route path="/" element={<DefaultLayout />}>
//         {ROUTES.map((item, index) => (
//           <Route
//             key={index}
//             index={index === 0}
//             path={item.path}
//             element={
//               <>
//                 <PageTitle title={item.title} />
//                 {item.component}
//               </>
//             }
//           />
//         ))}
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// function App() {
//   return <AppRoutes />;
// }

// export default App;



import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DefaultLayout from './layout/DefaultLayout';

import SignIn from '@/pages/Authentication/SignIn';
import NotFound from '@/pages/NotFound';
import PageTitle from './components/PageTitle';
import { ROUTES } from './configs/routes';

function AppRoutes() {
  const { pathname } = useLocation();
  const { user } = useAuth(); // ✅ เปลี่ยนจาก role เป็น user

  const isLoggedIn = !!user;
  const role = user?.role; // ✅ เช็ค role ภายใน

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn />}
      />

      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']} role={role}>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        {ROUTES.filter((item) => {
          if (
            role === 'admin' &&
            ['/manager/employee', '/manager/servicelist'].includes(item.path)
          ) {
            return false;
          }
          return true;
        }).map((item, index) => (
          <Route
            key={index}
            index={index === 0}
            path={item.path}
            element={
              <>
                <PageTitle title={item.title} />
                {item.component}
              </>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );

}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
