
// src/pages/Authentication/SignIn.tsx
import React from 'react';
import LoginForm from '@/components/LoginForm';

const SignIn: React.FC = () => {
  return (
    <div className=" ">
      <LoginForm />
    </div>
  );
};

export default SignIn;



// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SignIn: React.FC = () => {
//   const navigate = useNavigate();

//   const handleSignin = (e: React.FormEvent) => {
//     e.preventDefault();
//     navigate('/dashboard'); // ไปหน้าหลักโดยไม่ต้องใช้รหัสผ่าน
//   };

//   useEffect(() => {
//     navigate('/dashboard'); // ถ้าเข้า SignIn แล้วให้ไปหน้าหลักเลย
//   }, [navigate]);

//   return (
//     <div className="border-stroke bg-white dark:border-strokedark dark:bg-boxdark h-screen flex items-center justify-center">
//       <form
//         onSubmit={handleSignin}
//         className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96"
//       >
//         <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;
