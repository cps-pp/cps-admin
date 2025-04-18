import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import App from './App';
import './css/style.css';
import './css/notoLaoLooped.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import 'flatpickr/dist/flatpickr.min.css';
import { AuthProvider } from './AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.Fragment>
    <Provider store={store}>
      <Router>
      <AuthProvider>                              
        <App />
      </AuthProvider>
      </Router>
    </Provider>
  </React.Fragment>,
);
