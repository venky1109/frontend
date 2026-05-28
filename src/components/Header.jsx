import {  useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link  } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import LoginScreen from "./LoginScreen";
import Account from "./Account";
import ContactUsBanner from "./ContactUsBanner";
import logo from "../assets/ManaKiranaLogoWithName4.mp4";
// import SelectLocation from "./SelectLocation";  // Import the component
import ClickOutsideWrapper from './ClickOutsideWrapper';


let toggleAccountFormExternally;

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navbarRef = useRef(null);
  const userIconRef = useRef(null);
  const loginFormRef = useRef(null);
  const accountFormRef = useRef(null);
  // const location = useLocation();

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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-200 bg-gradient-to-r from-emerald-100 via-white to-lime-100 shadow-sm backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between gap-2 px-3 py-2 md:px-4 lg:p-2" ref={navbarRef}>
          {/* Logo */}
          <div className="hidden flex-shrink-0 md:flex">
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
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
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
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm"
        aria-label="User Profile"
      >
        <CgProfile size={30} />
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
          className="fixed left-3 right-3 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 transition-opacity duration-300 transform md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-[calc(100vw-1rem)] md:max-w-sm"
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
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm"
        aria-label="Profile"
      >
        <CgProfile size={30} />
      </button>
      {showLoginForm && (
        <ClickOutsideWrapper onOutsideClick={() => setShowLoginForm(false)} excludeRef={userIconRef} >
        <div
          ref={loginFormRef}
          className="fixed left-3 right-3 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 transition-opacity duration-300 transform md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-[calc(100vw-1rem)] md:max-w-sm"
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
