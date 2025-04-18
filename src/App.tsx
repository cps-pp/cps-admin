import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DefaultLayout from './layout/DefaultLayout';

import SignIn from '@/pages/Authentication/SignIn';
import NotFound from '@/pages/NotFound';
import { ROUTES, IRoute } from './configs/routes';
import PageTitle from './components/PageTitle';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <Routes>
        {/* Redirect จาก / ไปยัง /dashboard หรือหน้าแรกของคุณ */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/login" element={<SignIn />} />

        {/* กำหนด DefaultLayout เป็น parent route และลบ children={undefined} */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          {/* Routes ทั้งหมดจะเป็น child routes ของ DefaultLayout */}
          {ROUTES.map((item: IRoute, index: number) => (
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
    </AuthProvider>
  );
}

export default App;


// import { useEffect, useState } from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';

// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import DefaultLayout from './layout/DefaultLayout';
// import { ROUTES, IRoute } from './configs/routes';

// function App() {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 0);
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return loading ? (
//     <Loader />
//   ) : (
//     <DefaultLayout>
//       <Routes>
//         {ROUTES.map((item: IRoute, index: number) => (
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
//       </Routes>
//     </DefaultLayout>
//   );
// }

// export default App;
