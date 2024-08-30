import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';

import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        // console.log('logging out')
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
<div className="min-h-screen flex flex-col ">
  <ToastContainer />
  <Header />

  <main className="flex-grow py-4">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Outlet />
    </div>
  </main>

  <FloatingCartIcon />
  
  <Footer className="mt-auto" />
</div>

  );
};

export default App;
