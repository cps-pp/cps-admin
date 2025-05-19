import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import DefaultLayout from './layout/DefaultLayout';
import NotFound from '@/pages/NotFound';
import PageTitle from './components/PageTitle';
import { ROUTES } from './configs/routes';

function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        {ROUTES.map((item, index) => (
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
  return <AppRoutes />;
}

export default App;



// import React, { useEffect } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import DefaultLayout from './layout/DefaultLayout';

// import SignIn from '@/pages/Authentication/SignIn';
// import NotFound from '@/pages/NotFound';
// import PageTitle from './components/PageTitle';
// import { ROUTES } from './configs/routes';

// function AppRoutes() {
//   const { pathname } = useLocation();
//   const { role } = useAuth();

//   const isLoggedIn = Boolean(role);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />

//       <Route
//         path="/login"
//         element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignIn />}
//       />

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
//             <DefaultLayout />
//           </ProtectedRoute>
//         }
//       >
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
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }

// export default App;
