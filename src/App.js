import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import { useWebSocket } from './hooks/useWebSocket';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useWebSocket(); 
  const dispatch = useDispatch();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        // console.log('logging out')
        dispatch(logout());
      }
    }
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e); // Save the event for later use
      setShowInstallBanner(true); // Show the custom banner
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [dispatch]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the native install prompt
      const choiceResult = await deferredPrompt.userChoice;
      console.log('User choice:', choiceResult.outcome);

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      setDeferredPrompt(null); // Reset the deferred prompt
      setShowInstallBanner(false); // Hide the banner
    }
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false); // Hide the banner
  };

  return (
    <div className="select-none min-h-screen flex flex-col  ">
      <ToastContainer />
      <Header />

      <main className="flex-grow py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <Outlet />
        </div>
      </main>

      <FloatingCartIcon />
      
      <Footer className="mt-auto" />
      {/* Custom Install Banner */}
      {showInstallBanner && (
        <div
          className={`fixed ${
            window.innerWidth < 640 ? 'top-[6rem]' : 'bottom-4'
          } left-4 right-4 bg-white shadow-lg rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className="text-gray-800 mb-2 sm:mb-0 text-center sm:text-left">
            Install <span className="font-bold text-green-600">Manakirana</span> for a faster and better experience!
          </p>
          <div className="flex space-x-4 justify-center sm:justify-end">
            <button
              onClick={handleInstallClick}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Install Now
            </button>
            <button
              onClick={handleDismissBanner}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
