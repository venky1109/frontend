import {  useState, useCallback  } from 'react';
import { Link ,useLocation, useNavigate } from 'react-router-dom';
import {  FaWhatsapp } from 'react-icons/fa';
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { TiSocialFacebook, TiSocialInstagram, TiSocialYoutubeCircular } from "react-icons/ti";
import { FaSquareXTwitter } from "react-icons/fa6";
import homeConfig from '../HomeConfig.json'; // Import the homeConfig file
// import { TbCategory2 } from "react-icons/tb";
import { TbCategory2 } from "react-icons/tb";
import { HiOutlineCurrencyRupee } from "react-icons/hi"; // Import Rupee Icon
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineSavings } from "react-icons/md";
let toggleAccountFormExternally;

const Footer = ({ scrollToCategory }) => {
  // const { userInfo } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { whatsappNumber, phoneNumber } = homeConfig; // Extract numbers from the homeConfig file
  const currentYear = new Date().getFullYear();
  const location = useLocation();
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

  const handleCategoriesClick = useCallback(() => {
    if (location.pathname === '/') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#categories');
    } else {
      navigate('/#categories');
    }
  }, [location.pathname, navigate]);

  const navItemClass = "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-0.5 text-[9px] font-bold leading-tight tracking-wide text-slate-600 transition";
  const activeNavItemClass = "bg-white text-emerald-800 shadow-[0_2px_8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-emerald-100";
  const iconWrapClass = "flex h-6 w-6 items-center justify-center rounded-full shadow-[0_1px_4px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.85)]";

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
      <footer className="fixed bottom-0 left-0 z-30 block w-full border-t border-emerald-100 bg-gradient-to-t from-white via-emerald-50 to-lime-50 shadow-[0_-4px_14px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] md:hidden">
        <nav className="relative mx-auto flex max-w-md items-center gap-1 px-2 py-0.5 font-sans">
          <Link to="/" className={`${navItemClass} ${location.pathname === '/' ? activeNavItemClass : ''}`} aria-label="Home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 ring-emerald-100">
              <img
                src="/images/icon-192.png"
                alt="ManaKirana"
                className="h-7 w-7 rounded-full object-contain"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`${navItemClass} ${isMenuOpen ? activeNavItemClass : ''}`}
          >
            <span className={`${iconWrapClass} bg-white ring-1 ring-emerald-100`}>
              <RiCustomerService2Fill className="h-4 w-4 text-emerald-800" />
            </span>
            <span className="truncate">Order</span>
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-12 left-3 right-3 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact to order</p>
              <div className="grid gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span>{whatsappNumber}</span>
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700"
                >
                  <TbDeviceLandlinePhone className="h-5 w-5 text-emerald-800" />
                  <span>{phoneNumber}</span>
                </a>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleCategoriesClick}
            className={`${navItemClass} ${location.hash === '#categories' ? activeNavItemClass : ''}`}
          >
            <span className={`${iconWrapClass} bg-white ring-1 ring-emerald-100`}>
              <TbCategory2 className="h-4 w-4 text-emerald-800" />
            </span>
            <span className="truncate">Categories</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryCardClick("BUDGET FRIENDLY PACKAGES")}
            className={`${navItemClass} ${location.pathname.includes('/category/BUDGET') ? activeNavItemClass : ''}`}
          >
            <span className={`${iconWrapClass} bg-white ring-1 ring-emerald-100`}>
              <span className="relative h-6 w-6">
                <MdOutlineSavings className="absolute inset-0 h-6 w-6 text-emerald-800" />
                <HiOutlineCurrencyRupee className="absolute inset-0 m-auto h-3 w-3 text-emerald-800" />
              </span>
            </span>
            <span className="truncate">Budget</span>
          </button>
        </nav>
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
