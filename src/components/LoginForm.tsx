import React, { useState } from 'react';
import Logo from '../images/logo/cps-logo.png'
import { useAuth } from '@/AuthContext';
import { useNavigate } from 'react-router-dom';
// const useAuth = () => {
//   return {
//     login: (username: string, password: string) => {
//       // Simple validation - in a real app this would connect to your auth system
//       return username === 'admin' && password === 'password';
//     }
//   };
// };

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.login(username, password)) {
      // นำทางไปยัง dashboard แทนการเปลี่ยนสถานะ isLoggedIn
      navigate('/dashboard');
    } else {
      setError(' ຂໍ້ມູນບໍ່ຖືກຕ້ອງ');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Login Successful!</h2>
          <p className="text-gray-600">You have successfully logged in.</p>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg w-full"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-strokedark relative">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-200 to-transparent opacity-30" /> */}
      <div className="absolute bottom-0 right-0 w-full h-50 bg-gradient-to-t from-indigo-200 to-transparent opacity-10" />
      
      <div className="mb-12 z-10">
      <img src={Logo} alt="Logo" width={260} />
      </div>
      
      {/* Card container */}
      <div className="relative bg-white p-8 rounded-md shadow-xl w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ຍິນດີຕ້ອນຮັບ</h1>
          <p className="text-gray-500 mt-1">ກະລຸນາລ໋ອກອິນເພື່ອເຂົ້າສູ່ລະບົບ</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-4 pl-4 pr-10 border border-stroke rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 pl-4 pr-10 border border-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;