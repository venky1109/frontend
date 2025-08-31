import {  useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link ,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import LoginScreen from "./LoginScreen";
import Account from "./Account";
import ContactUsBanner from "./ContactUsBanner";
import logo from "../assets/ManaKiranaLogoWithName4.mp4";
import SelectLocation from "./SelectLocation";  // Import the component
import ClickOutsideWrapper from './ClickOutsideWrapper';


let toggleAccountFormExternally;

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navbarRef = useRef(null);
  const userIconRef = useRef(null);
  const loginFormRef = useRef(null);
  const accountFormRef = useRef(null);
  const location = useLocation();

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

  toggleAccountFormExternally = toggleAccountForm;
  

 
 


  return (
      <header className="bg-gradient-to-b from-green-200 via-green-100 to-white rounded-b-md  fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between p-2 lg:p-2" ref={navbarRef}>
          {/* Logo */}
          <div className="hidden md:flex flex-shrink-0">
            <Link to="/">
             <video
              src={logo}
              autoPlay
              loop
              muted
              playsInline
              className="w-14 h-auto sm:w-16 lg:w-20" 
            />
          {/* <img src={logo} alt="ManaKirana logo" className="w-14 h-auto sm:w-16 lg:w-20" /> */}
            </Link>
          </div>

          {/* {location.pathname === '/' && <SelectLocation />} */}

          {/* Search Box & User Account Section */}
          <div className="w-full flex items-center justify-between pl-2 space-x-2 md:space-x-0">
            <div className="flex-grow">
              <SearchBox />
            </div>
            <div className="hidden md:flex items-center space-x-4 mt-2 md:mt-0">
              <ContactUsBanner />
            </div>

            {/* User Profile / Login */}
            {/* User Account Section */}
  <div>
  {userInfo ? (
    <div className="relative flex flex-col items-center">
      <button
        onClick={toggleAccountForm}
        ref={userIconRef}
        className="text-xl text-green-700"
        aria-label="User Profile"
      >
        <CgProfile size={40} />
      </button>
      {/* <div className="flex items-center space-x-1 mt-1">
        <div className="text-green-900 text-md font-semibold">Hi</div>
        <div className="text-green-900 text-md font-semibold">
          {userInfo.name}
        </div>
      </div> */}
      {showAccountForm && (
        <ClickOutsideWrapper onOutsideClick={() => setShowAccountForm(false)}  excludeRef={userIconRef}>
          
        <div
          ref={accountFormRef}
          className="absolute mt-2 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
        >
          <Account  />
        </div>
        </ClickOutsideWrapper>
      )}
    </div>
  ) : (
    <div className="relative flex flex-col items-center">
      <button
        onClick={toggleLoginForm}
        ref={userIconRef}
        className="text-xl text-gray-600 "
        aria-label="Profile"
      >
        <CgProfile size={40} />
      </button>
      {showLoginForm && (
        <ClickOutsideWrapper onOutsideClick={() => setShowLoginForm(false)} excludeRef={userIconRef} >
        <div
          ref={loginFormRef}
          className="absolute mt-2 right-0 w-80 bg-white border  hover:scale-110 border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
        >
          <LoginScreen />
        </div>
        </ClickOutsideWrapper>
      )}
    </div>
  )}</div>
</div>



          
        </nav>
    
      </header>
  
  );
};

export { toggleAccountFormExternally };
export default Header;
