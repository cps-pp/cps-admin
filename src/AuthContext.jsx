import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    // Load user profile if token exists
    const token = localStorage.getItem('token');
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
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        })
        .catch((error) => {
          console.error('Profile load error:', error);
          localStorage.removeItem('token');
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
      const response = await axios.post('https://zkk8zxq6-4000.asse.devtunnels.ms/src/auth/authen/login', {
        username,
        password
      });

      if (response.data.result === 'ok') {
        const token = response.data.token;
        const userData = response.data.user;

        // เก็บ token
        localStorage.setItem('token', token);

        // ตั้งค่า axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // ตั้งค่า user
        setUser(userData);

        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Server error';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};