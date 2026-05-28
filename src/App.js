import React, {  Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import FloatingCartIcon from './components/FloatingCartIcon';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import { useWebSocket } from './hooks/useWebSocket';
// import logo from './assets/ManaKiranaLogoWithName4.mp4';
// import Loader from './components/Loader';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Header = React.lazy(() => import('./components/Header'));
const Footer = React.lazy(() => import('./components/Footer'));
const FloatingCartIcon = React.lazy(() => import('./components/FloatingCartIcon'));
const Loader = React.lazy(() => import('./components/Loader'));




const App = () => {
  

  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
    // useWebSocket(); 
  useWebSocket(!loading); 
  
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
      // e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e); // Save the event for later use
      setShowInstallBanner(true); // Show the custom banner
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    setTimeout(() => {
      setLoading(false);
    }, 100); 

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [dispatch]);
  


  // const handleInstallClick = async () => {
  //   if (deferredPrompt) {
  //     deferredPrompt.prompt(); // Show the native install prompt
  //     const choiceResult = await deferredPrompt.userChoice;
  //     console.log('User choice:', choiceResult.outcome);

  //     if (choiceResult.outcome === 'accepted') {
  //       console.log('User accepted the install prompt');
  //     } else {
  //       console.log('User dismissed the install prompt');
  //     }

  //     setDeferredPrompt(null); // Reset the deferred prompt
  //     setShowInstallBanner(false); // Hide the banner
  //   }
  // };
const handleInstallClick = async () => {
  if (deferredPrompt) {
    setShowInstallBanner(false);       // ✅ Hide your custom banner
    await deferredPrompt.prompt();     // ✅ Required to show native prompt
    setDeferredPrompt(null);           // ✅ Clean up
  }
};
  const handleDismissBanner = () => {
    setShowInstallBanner(false); // Hide the banner
  };
  const hideFloatingCart =
    location.pathname === '/cart' ||
    location.pathname === '/placeorder' ||
    location.pathname.startsWith('/order/');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {/* <Suspense fallback={<div>Loading...</div>}>     */}
            <Loader />
        {/* </Suspense> */}

      </div>
    );
  }

  return (
    <div className="select-none min-h-screen flex flex-col  ">
      <ToastContainer />
        <Suspense fallback={<div />}>
     <Header />
     </Suspense>
     
     <main className="flex-grow py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <Outlet />
        </div>
      </main>
      <Suspense fallback={null}>
      {!hideFloatingCart && <FloatingCartIcon />}
      </Suspense>
      <Footer className="mt-auto" />
      {/* Custom Install Banner */}
      {showInstallBanner && (
        <div
        className={`fixed ${
          window.innerWidth < 640 ? "top-[5.5rem]" : "bottom-4"
        } left-3 right-3 flex items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-white/85 p-2 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-md sm:left-auto sm:right-4 sm:w-[22rem]`}
      >
        {/* Logo & Text */}
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src="/images/icon-192.png"
            alt="ManaKirana logo"
            className="h-11 w-11 flex-none rounded-full border border-emerald-100 bg-white object-contain p-0.5 shadow-sm"
          />
          <p className="min-w-0 text-xs leading-4 text-slate-700">
            Install <span className="font-semibold text-emerald-700">app</span> for better experience.
          </p>
        </div>
      
        {/* Install & Close Buttons */}
        <div className="flex flex-none items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-normal text-white shadow-sm transition hover:bg-emerald-600"
          >
            Install
          </button>
          
          {/* Close (X) Button */}
          <button
            onClick={handleDismissBanner}
            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
            aria-label="Dismiss install prompt"
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
