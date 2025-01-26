import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi"; // Location Icon
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import logo from "../assets/ManaKiranaLogoWithName.gif";
import LoginScreen from "./LoginScreen";
import Account from "./Account";
import ContactUsBanner from "./ContactUsBanner";

let toggleAccountFormExternally;

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navbarRef = useRef(null);
  const userIconRef = useRef(null);
  const loginFormRef = useRef(null);
  const accountFormRef = useRef(null);

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [locations] = useState([
    "Amalapuram",
    "Kakinada",
    "Mummidivaram",
    "Yanam",
    "Thallarevu",
    "Uppalaguptam",
  ]);

  const toggleLoginForm = () => {
    setShowLoginForm((prev) => !prev);
    setShowAccountForm(false);
  };

  const toggleAccountForm = () => {
    setShowAccountForm((prev) => !prev);
    setShowLoginForm(false);
  };

  toggleAccountFormExternally = toggleAccountForm;

  useEffect(() => {
    // Auto-detect location using Geolocation API
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

            // Call reverse geocoding API (e.g., Google Maps)
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const detectedLocation = data.results[0].address_components.find(
                (component) =>
                  component.types.includes("locality") ||
                  component.types.includes("sublocality")
              )?.long_name;

              // Set detected location
              setUserLocation(detectedLocation || "Unknown Location");

              // Check service availability
              setServiceAvailable(
                locations.includes(detectedLocation || "")
              );
            }
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            setUserLocation("Location access denied");
            setServiceAvailable(false);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setUserLocation("Geolocation not supported");
        setServiceAvailable(false);
      }
    };

    fetchLocation();
  }, [locations]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
  <nav
    className="container mx-auto flex flex-col md:flex-row items-center justify-between p-2 lg:p-2"
    ref={navbarRef}
  >
    {/* Top Section - Logo and Location Selector */}
    <div className="flex flex-col md:flex-row items-center w-full">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0 mb-2 md:mb-0">
        <img
          src={logo}
          alt="ManaKirana logo"
          className="w-14 h-auto sm:w-16 lg:w-20"
        />
      </Link>

      {/* Location Selector */}
      <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
        <FiMapPin
          size={24}
          className={`mr-2 ${
            serviceAvailable ? "text-green-600" : "text-red-600"
          }`}
        />
        <div>
          <span className="text-md text-gray-700 block md:inline">
            {userLocation || "Detecting location..."}
          </span>
          {!serviceAvailable && (
            <p className="text-red-600 text-xs mt-1">
              Services are not available in this area. <br />
              <Link to="/request-service" className="text-blue-500 underline">
                Request service
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Middle Section - Search Box */}
    <div className="w-full">
      <div className="w-full sm:w-48 lg:w-full">
        <SearchBox />
      </div>
    </div>

    {/* Bottom Section - Contact Us and User Account */}
    <div className="hidden md:flex items-center space-x-4 mt-2 md:mt-0">
      {/* Contact Us Banner */}
      <ContactUsBanner />

      {/* User Account Section */}
      {userInfo ? (
        <div className="relative flex flex-col items-center">
          {/* Logged-in User Button */}
          <button
            onClick={toggleAccountForm}
            ref={userIconRef}
            className="text-xl text-yellow-700 focus:outline-none"
          >
            <FaUserCircle size={40} />
          </button>
          <div className="flex items-center space-x-1 mt-1">
            <div className="text-green-900 text-md font-semibold">Hi</div>
            <div className="text-green-900 text-md font-semibold">
              {userInfo.name}
            </div>
          </div>

          {/* Account Form */}
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
        <div className="relative flex flex-col items-center">
          {/* Login Button */}
          <button
            onClick={toggleLoginForm}
            ref={userIconRef}
            className="text-xl text-gray-500 focus:outline-none"
          >
            <FaUserCircle size={40} />
          </button>

          {/* Login Form */}
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
  </nav>
</header>

  );
};

export { toggleAccountFormExternally };

export default Header;
