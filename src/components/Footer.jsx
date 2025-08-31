import {  useState, useCallback  } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import {  FaWhatsapp } from 'react-icons/fa';
import { TbDeviceLandlinePhone } from "react-icons/tb";
import logo from "../assets/ManaKiranaLogoWithName4.mp4";
import mhlogo from "../assets/RaithuDairyLogo150x102.png";
import { TiSocialFacebook, TiSocialInstagram, TiSocialYoutubeCircular } from "react-icons/ti";
import { FaSquareXTwitter } from "react-icons/fa6";
import homeConfig from '../HomeConfig.json'; // Import the homeConfig file
// import { TbCategory2 } from "react-icons/tb";
import { HiOutlineCurrencyRupee } from "react-icons/hi"; // Import Rupee Icon
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineSavings } from "react-icons/md";
let toggleAccountFormExternally;

const Footer = ({ scrollToCategory }) => {
  // const { userInfo } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { whatsappNumber, phoneNumber } = homeConfig; // Extract numbers from the homeConfig file
  const currentYear = new Date().getFullYear();
  // const [lastScrollPosition, setLastScrollPosition] = useState(0);

  // State to manage the visibility of the login and account forms
  // const [showLoginForm, setShowLoginForm] = useState(false);
  // const [showAccountForm, setShowAccountForm] = useState(false);
  
  // const loginFormRef = useRef(null);
  // const accountFormRef = useRef(null); // Ref for the account form
  // const userIconRef = useRef(null);  // Ref for the FaUserCircle icon
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const navigate = useNavigate();

  const handleCategoryCardClick = useCallback((categoryName) => {
    navigate(`/category/${categoryName}`);
  }, [navigate]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       !loginFormRef.current?.contains(event.target) &&
  //       !accountFormRef.current?.contains(event.target) &&
  //       !userIconRef.current?.contains(event.target)
  //     ) {
  //       setShowLoginForm(false);
  //       setShowAccountForm(false);
  //     }
  //   };

  //   if (showLoginForm || showAccountForm) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [showLoginForm, showAccountForm]);
  // hidden to make footer fixed ---30Jan2023
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollPosition = window.scrollY;

  //     if (currentScrollPosition > lastScrollPosition) {
  //       // User is scrolling up, hide the footer
  //       setIsFooterVisible(false);
  //     } else {
  //       // User is scrolling down, show the footer
  //       setIsFooterVisible(true);
  //     }

  //     setLastScrollPosition(currentScrollPosition);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [lastScrollPosition]);

  return (
    <>
      {/* Mobile Footer */}
      <footer
  className="fixed bottom-0 left-0 w-full rounded-sm bg-gradient-to-b from-white via-white to-white shadow-md z-30 block md:hidden"
>
  <div className="container mx-auto flex justify-between items-center px-2 py-1 sm:px-1 sm:py-1">
    {/* Home Icon */}
    <Link to="/" className="flex flex-col items-center shadow-md border border-b-5 border-green-600 hover:border-white rounded-sm  transition-all duration-300 ">
  {/* <img 
    src={logo}
    alt="" 
    className="h-9 w-9 sm:h-9 sm:w-9 object-contain "
  /> */}
   <video
    src={logo}
    autoPlay
    loop
    muted
    playsInline
    className="h-9 w-9 sm:h-9 sm:w-9 object-contain "
  />
    <span className="text-xs text-green-900">Home</span>
</Link>



   {/* User Community Icon */}
   <div className="relative flex flex-col items-center cursor-pointer">
        <RiCustomerService2Fill
          className="h-9 w-9 text-green-800 hover:text-green-700 transition"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />
        <span className="text-xs text-green-900">Say Hi To Order</span>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-10 mb-3 bg-white shadow-lg rounded-md p-2 w-48 flex flex-col gap-2">
            {/* WhatsApp */}
            <div className="bg-gray-200 p-2 rounded-md">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FaWhatsapp className="text-green-700" size={20} />
                <span className="text-gray-500 font-semibold text-sm sm:text-md ml-2">
                  {whatsappNumber}
                </span>
              </a>
            </div>

            {/* Phone */}
            <div className="bg-gray-200 p-2 rounded-md">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center"
              >
                <TbDeviceLandlinePhone className="text-green-700" size={20} />
                <span className="text-gray-500 font-semibold text-sm sm:text-md ml-2">
                  {phoneNumber}
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => handleCategoryCardClick("Eggs & Dairy")} 
        className="flex flex-col items-center cursor-pointer"
      >
       <img 
    src={mhlogo}
    alt="sri maha lakshmi raithu dairy" 
    className="h-10 w-10 sm:h-10 sm:w-10 object-contain ml-2"
  />
       <span className="text-xs text-green-900">SMLR Products</span>
      </div>

      <div
        onClick={() => handleCategoryCardClick("BUDGET FRIENDLY PACKAGES")} 

        className="flex flex-col items-center cursor-pointer"
      >
        <div className="relative h-9 w-9">
    <MdOutlineSavings className="absolute inset-0 h-full w-full text-green-800" />
    <HiOutlineCurrencyRupee className="absolute inset-0 h-5 w-5 m-auto text-green-800" />
  </div>
       <span className="text-xs text-green-900">Budget Friendly</span>
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