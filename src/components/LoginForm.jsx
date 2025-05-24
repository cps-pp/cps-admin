import React, { useState } from 'react';
import Logo from '../images/logo/cps.png';
import { useAuth } from '@/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm= () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    e.preventDefault();
    if (auth.login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('ຂໍ້ມູນບໍ່ຖືກຕ້ອງ');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-Third relative">
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md z-10">
        <div className="mb-8 flex justify-center">
          <img src={Logo} alt="Logo" width={220} className="mx-auto" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ຍິນດີຕ້ອນຮັບ</h1>
          <p className="text-gray-700 mt-1">ກະລຸນາລ໋ອກອິນເພື່ອເຂົ້າສູ່ລະບົບ</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="ຊື່ຜູ້ໃຊ້"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-strokedark p-4 pl-4 pr-10 border border-stroke rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />

          <input
            type="password"
            placeholder="ລະຫັດຜ່ານ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-strokedark p-4 pl-4 pr-10 border border-stroke rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-medium p-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            ເຂົ້າສູ່ລະບົບ
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
