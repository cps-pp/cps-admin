import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { URLBaseLocal } from './lib/MyURLAPI';
import { ACCESS_TOKEN_KEY } from './utils/constants';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => { },
  loading: false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(user)
  useEffect(() => {
    // Load user profile if token exists
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      // ตั้งค่า axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get(`${URLBaseLocal}/src/auth/authen/profile`)
        .then(res => {
          if (res.data?.result === 'ok') {
            setUser(res.data.user);
            console.log('🔐 Loaded user:', res.data.user);
          } else {
            // Token ไม่ valid
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            delete axios.defaults.headers.common['Authorization'];
          }
        })
        .catch((error) => {
          console.error('Profile load error:', error);
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${URLBaseLocal}/src/auth/authen/login`, {
        username,
        password
      });

      const data = response.data; // ✅ แก้ตรงนี้

      if (data.result === 'ok') {
        const token = data.token;
        const userData = data.user;

        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);

        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error?.response?.data?.message || error.message || 'Server error'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role, // ✅ เพิ่มตรงนี้
        isAuthenticated: !!user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log(context)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};