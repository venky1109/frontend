import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import { useWebSocket } from './hooks/useWebSocket';
import logo from './assets/ManaKiranaLogoWithName.gif';


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
          window.innerWidth < 640 ? "top-[6rem]" : "bottom-4"
        } left-2 right-2 border border-b-5 border-orange-600 bg-yellow-100 shadow-lg rounded-md p-2 flex items-center sm:justify-between`}
      >
        {/* Logo & Text */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="ManaKirana logo"
            className="w-14 h-auto sm:w-16 lg:w-20 border border-yellow-600 rounded-md"
          />
          <p className="text-gray-800 text-sm sm:text-md">
            Install <span className="font-bold text-green-600">APP</span> for better experience!
          </p>
        </div>
      
        {/* Install & Close Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleInstallClick}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Install
          </button>
          
          {/* Close (X) Button */}
          <button
            onClick={handleDismissBanner}
            className="text-gray-600 hover:text-gray-800 text-mb font-semibold focus:outline-none"
          >
            ✖
          </button>
        </div>
      </div>
      
      )}

    </div>
  );
};

export default App;
