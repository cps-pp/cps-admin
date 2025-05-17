import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DefaultLayout from './layout/DefaultLayout';

import SignIn from '@/pages/Authentication/SignIn';
import NotFound from '@/pages/NotFound';
import { ROUTES, IRoute } from './configs/routes';
import PageTitle from './components/PageTitle';

function AppRoutes() {
  const { pathname } = useLocation();
  const { role } = useAuth();
  
  // console.log('Current path:', pathname);
  // console.log('Current role state:', role);
  
  const isLoggedIn = Boolean(role);
  // console.log('Is logged in?', isLoggedIn);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // return <SignIn />; 

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} /> */}

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn />}
      />

      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
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
