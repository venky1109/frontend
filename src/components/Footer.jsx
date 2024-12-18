import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaWhatsapp } from 'react-icons/fa';
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { TiSocialFacebook, TiSocialInstagram, TiSocialYoutubeCircular } from "react-icons/ti";
import { FaSquareXTwitter } from "react-icons/fa6";
import LoginScreen from './LoginScreen'; // Import the LoginScreen component
import Account from './Account'; // Import the Account component
import homeConfig from '../HomeConfig.json'; // Import the homeConfig file
let toggleAccountFormExternally;

const Footer = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { whatsappNumber, phoneNumber } = homeConfig; // Extract numbers from the homeConfig file
  const currentYear = new Date().getFullYear();

  // State to manage the visibility of the login and account forms
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  
  const loginFormRef = useRef(null);
  const accountFormRef = useRef(null); // Ref for the account form
  const userIconRef = useRef(null);  // Ref for the FaUserCircle icon
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const toggleLoginForm = () => {
    setShowLoginForm((prev) => !prev);
    setShowAccountForm(false);
  };

  const toggleAccountForm = () => {
    setShowAccountForm((prev) => !prev);
    setShowLoginForm(false); // Ensure login form is closed when profile form is opened
  };

  // toggleAccountFormExternally = () => {
  //   setShowAccountForm((prev) => !prev);
  //   setShowLoginForm(false);
  // };
  toggleAccountFormExternally = toggleAccountForm; // Assign function for external use

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

    if (showLoginForm || showAccountForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginForm, showAccountForm]);

  return (
    <>
      {/* Mobile Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 block md:hidden">
  <div className="container mx-auto flex justify-between items-center px-2 py-4 sm:px-1 sm:py-3">
    {/* Home Icon */}
    <Link to="/" className="flex flex-col items-center">
      <FontAwesomeIcon icon={faHome} className="h-6 w-6 sm:h-5 sm:w-5 text-green-900" />
    </Link>

    <div className="flex items-center space-x-4 rounded-md">
      <div className="bg-gray-200 p-2 rounded-md">
        {/* WhatsApp */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
          <FaWhatsapp className="text-green-700" size={20} />
          <span className="text-gray-500 font-semibold text-sm sm:text-md ml-1">{whatsappNumber}</span>
        </a>
      </div>

      <div className="bg-gray-200 p-2 rounded-md">
  {/* Phone */}
  <a href={`tel:${phoneNumber}`} className="flex items-center">
    <TbDeviceLandlinePhone className="text-green-700" size={20} />
    <span className="text-gray-500 font-semibold text-sm sm:text-md ml-1">297898</span>
  </a>
</div>
    </div>

  
    <div className="relative">
  {userInfo ? (
    <div className="flex flex-col items-center">
      {/* Green icon and greeting when user is logged in */}
      <button onClick={toggleAccountForm} ref={userIconRef} className="focus:outline-none">
        <FaUserCircle className="h-7 w-7 sm:h-6 sm:w-6 text-yellow-900" />
      </button>
      {/* <div className="text-green-900 text-sm mt-1">Hi {userInfo.name}</div> */}
      <div className="text-green-900 text-sm mt-1">
  Hi {userInfo.name.substring(0, 5)}{userInfo.name.length > 5 && '...'}
</div>


      {/* Account Form */}
      {showAccountForm && (
        <div
          ref={accountFormRef}
          className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <Account onClose={() => setShowAccountForm(false)} />
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center">
      {/* Grey icon when user is not logged in */}
      <button onClick={toggleLoginForm} ref={userIconRef} className="focus:outline-none">
        <FaUserCircle className="h-7 w-7 sm:h-6 sm:w-6 text-gray-500" />
      </button>

      {/* Login Form */}
      {showLoginForm && (
        <div
          ref={loginFormRef}
          className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4"
        >
          <LoginScreen onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </div>
  )}
</div>

  </div>
</footer>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-green-800 text-white py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-6/12 mb-6 md:mb-0">
              <h6 className="text-lg font-semibold mb-2">About Us</h6>
              <p className="text-sm">
                We are a team of aspirants with a mission to deliver fresh and finest products to your doorstep, ensuring timely and reliable service. With a diverse range of items over phone call, WhatsApp message, user-friendly online platform, and a commitment to customer satisfaction, we make grocery shopping a breeze.
              </p>
            </div>
            <div className="md:w-2/12 mb-6 md:mb-0">
              <h6 className="text-lg font-semibold mb-2">Contact Us</h6>
              <p className="text-sm">Email: customercare@manakirana.online</p>
              <p className="text-sm">Phone: {phoneNumber}</p>
            </div>
            <div className="md:w-1/12 mb-6 md:mb-0">
              <h6 className="text-lg font-semibold mb-2">Quick Links</h6>
              <ul className="list-none space-y-1">
                <li><Link to="/" className="text-sm hover:underline">Home</Link></li>
                <li><Link to="/" className="text-sm hover:underline">Products</Link></li>
                <li><Link to="/cart" className="text-sm hover:underline">Cart</Link></li>
              </ul>
            </div>
            <div className="md:w-1/12 mb-6 md:mb-0 mr-8">
              <h6 className="text-lg font-semibold mb-2">Follow Us</h6>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61557084347066" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
                  <TiSocialFacebook size={24} />
                </a>
                <a href="https://www.instagram.com/manakirana8/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500">
                  <TiSocialInstagram size={24} />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500">
                  <TiSocialYoutubeCircular size={24} />
                </a>
                <a href="https://twitter.com/manakirana8" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
                  <FaSquareXTwitter size={24} />
                </a>
              </div>
            </div>
          </div>
          <hr className="my-4 border-gray-400" />
          <p className="text-center text-sm">&copy; {currentYear} ManaKirana</p>
        </div>
      </footer>
    </>
  );
}
export { toggleAccountFormExternally }; // Export external reference
export default Footer;