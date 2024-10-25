// import { useEffect, useRef, useState } from 'react';
// import { FaUserCircle } from 'react-icons/fa'; // WhatsApp Icon
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import SearchBox from './SearchBox';
// import logo from '../assets/ManaKiranaLogoWithName.gif';
// import LoginScreen from './LoginScreen';
// import Account from './Account';
// import ContactUsBanner from './ContactUsBanner';
// // import HomeConfig from '../HomeConfig.json';

// const Header = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const navbarRef = useRef(null);
//   const userIconRef = useRef(null);
//   const loginFormRef = useRef(null);
//   const accountFormRef = useRef(null);

//   const [showLoginForm, setShowLoginForm] = useState(false);
//   const [showAccountForm, setShowAccountForm] = useState(false);

//   // const [whatsappNumber] = useState(HomeConfig.whatsappNumber?.[0] || 'No Number Available');
//   // const [phoneNumber] = useState(HomeConfig.phoneNumber?.[0] || 'No Number Available' )

//   const toggleLoginForm = () => {
//     setShowLoginForm((prev) => !prev);
//     setShowAccountForm(false);
//   };

//   const toggleAccountForm = () => {
//     setShowAccountForm((prev) => !prev);
//     setShowLoginForm(false); 
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         !loginFormRef.current?.contains(event.target) &&
//         !accountFormRef.current?.contains(event.target) &&
//         !userIconRef.current?.contains(event.target)
//       ) {
//         setShowLoginForm(false);
//         setShowAccountForm(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showLoginForm, showAccountForm]);

//   return (
//     <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
//       <nav className="container mx-auto flex items-center justify-between p-2 lg:p-1" ref={navbarRef}>
//         <div className="flex items-center space-x-2 w-full">
//           <Link to="/" className="flex-shrink-0 relative">
//             <img src={logo} alt="ManaKirana logo" className="w-24 h-20 sm:w-20 lg:w-24" />
//           </Link>


// <div className="flex-grow flex mr-5 space-x-1">
//     <SearchBox />
// </div>
// <div className="hidden md:flex">
//     <ContactUsBanner />
//   </div>

//           {/* Icons for Desktop Mode */}
//           <div className="hidden lg:flex items-center space-x-4">
//             {userInfo ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleAccountForm}
//                   ref={userIconRef}
//                   className="text-xl text-green-700 focus:outline-none"
//                 >
//                   <FaUserCircle size={45} />
//                 </button>

//                 {showAccountForm && (
//                   <div
//                     ref={accountFormRef}
//                     className="absolute right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
//                   >
//                     <Account onClose={() => setShowAccountForm(false)} />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="relative">
//                 <button
//                   onClick={toggleLoginForm}
//                   ref={userIconRef}
//                   className="text-xl text-green-700 focus:outline-none"
//                 >
//                   <FaUserCircle size={45} />
//                 </button>

//                 {showLoginForm && (
//                   <div
//                     ref={loginFormRef}
//                     className="absolute right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
//                   >
//                     <LoginScreen onClose={() => setShowLoginForm(false)} />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;


// import { useEffect, useRef, useState } from 'react';
// import { FaUserCircle } from 'react-icons/fa'; // WhatsApp Icon
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import SearchBox from './SearchBox';
// import logo from '../assets/ManaKiranaLogoWithName.gif';
// import LoginScreen from './LoginScreen';
// import Account from './Account';
// import ContactUsBanner from './ContactUsBanner';

// const Header = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const navbarRef = useRef(null);
//   const userIconRef = useRef(null);
//   const loginFormRef = useRef(null);
//   const accountFormRef = useRef(null);

//   const [showLoginForm, setShowLoginForm] = useState(false);
//   const [showAccountForm, setShowAccountForm] = useState(false);

//   const toggleLoginForm = () => {
//     setShowLoginForm((prev) => !prev);
//     setShowAccountForm(false);
//   };

//   const toggleAccountForm = () => {
//     setShowAccountForm((prev) => !prev);
//     setShowLoginForm(false); 
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         !loginFormRef.current?.contains(event.target) &&
//         !accountFormRef.current?.contains(event.target) &&
//         !userIconRef.current?.contains(event.target)
//       ) {
//         setShowLoginForm(false);
//         setShowAccountForm(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showLoginForm, showAccountForm]);

//   return (
//     <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
//       <nav className="container mx-auto flex items-center justify-between p-2 lg:p-4" ref={navbarRef}>
//         <div className="flex items-center space-x-2 w-full">
//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0 relative">
//             <img src={logo} alt="ManaKirana logo" className="w-14 h-auto sm:w-16 lg:w-20" />
//           </Link>

//           {/* Search Box */}
//           <div className="flex-grow">
//             <div className="w-full sm:w-24 lg:w-full">
//               <SearchBox />
//             </div>
//           </div>

//           {/* Contact Us Banner - Hidden in mobile, visible on md and larger */}
//           <div className="hidden md:flex">
//             <ContactUsBanner />
//           </div>

//           {/* User Account Icon - Hidden in mobile, visible on md and larger */}
//           <div className="hidden lg:flex items-center space-x-4">
//             {userInfo ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleAccountForm}
//                   ref={userIconRef}
//                   className="text-xl text-green-700 focus:outline-none"
//                 >
//                   <FaUserCircle size={45} />
//                 </button>

//                 {showAccountForm && (
//                   <div
//                     ref={accountFormRef}
//                     className="absolute right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
//                   >
//                     <Account onClose={() => setShowAccountForm(false)} />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="relative">
//                 <button
//                   onClick={toggleLoginForm}
//                   ref={userIconRef}
//                   className="text-xl text-green-700 focus:outline-none"
//                 >
//                   <FaUserCircle size={45} />
//                 </button>

//                 {showLoginForm && (
//                   <div
//                     ref={loginFormRef}
//                     className="absolute right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
//                   >
//                     <LoginScreen onClose={() => setShowLoginForm(false)} />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // WhatsApp Icon
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBox from './SearchBox';
import logo from '../assets/ManaKiranaLogoWithName.gif';
import LoginScreen from './LoginScreen';
import Account from './Account';
import ContactUsBanner from './ContactUsBanner';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navbarRef = useRef(null);
  const userIconRef = useRef(null);
  const loginFormRef = useRef(null);
  const accountFormRef = useRef(null);

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm((prev) => !prev);
    setShowAccountForm(false);
  };

  const toggleAccountForm = () => {
    setShowAccountForm((prev) => !prev);
    setShowLoginForm(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !loginFormRef.current?.contains(event.target) &&
        !accountFormRef.current?.contains(event.target) &&
        !userIconRef.current?.contains(event.target)
      ) {
        setShowLoginForm(false);
        setShowAccountForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginForm, showAccountForm]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-21 md:h-21 lg:h-21">
      <nav className="container mx-auto flex items-center justify-between p-2 lg:p-2 mt-0" ref={navbarRef}>
        <div className="flex items-center space-x-1 w-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 relative">
            <img src={logo} alt="ManaKirana logo" className="w-14 h-auto sm:w-16 lg:w-20" />
          </Link>

          {/* Search Box */}
          <div className="flex-grow">
            <div className="w-full sm:w-48 lg:w-full">
              <SearchBox />
            </div>
          </div>

          {/* Contact Us Banner - Hidden in mobile, visible on md and larger */}
          <div className="hidden md:flex">
            <ContactUsBanner />
          </div>

          <div className="hidden md:flex items-center space-x-4">
  {userInfo ? (
    <div className="mr-5 ml-5 relative flex flex-col items-center"> {/* Center-align vertically and horizontally */}
      {/* Button for logged-in user with green icon */}
      <button
        onClick={toggleAccountForm}
        ref={userIconRef}
        className="text-xl text-yellow-700 focus:outline-none flex justify-center"
      >
        <FaUserCircle size={40} />
      </button>
      <div className="flex items-center space-x-1">
  <div className="text-green-900 text-md font-semibold">Hi</div>
  <div className="text-green-900 text-md font-semibold">{userInfo.name}</div>
</div>




      {/* Account form */}
      {showAccountForm && (
        <div
          ref={accountFormRef}
          className="absolute mt-16 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
        >
          <Account onClose={() => setShowAccountForm(false)} />
        </div>
      )}
    </div>
  ) : (
    <div className="relative flex flex-col items-center"> {/* Center-align vertically and horizontally */}
      {/* Button for non-logged-in user with grey icon */}
      <button
        onClick={toggleLoginForm}
        ref={userIconRef}
        className="text-xl text-gray-500 focus:outline-none flex justify-center"
      >
        <FaUserCircle size={40} />
      </button>

      {/* Login form */}
      {showLoginForm && (
        <div
          ref={loginFormRef}
          className="absolute right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
        >
          <LoginScreen onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </div>
  )}
</div>


        </div>
      </nav>
    </header>
  );
};

export default Header;
