import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
// import { FiMapPin } from "react-icons/fi"; // Location Icon
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import LoginScreen from "./LoginScreen";
import Account from "./Account";
import ContactUsBanner from "./ContactUsBanner";
import logo from "../assets/ManaKiranaLogoWithName.gif";
const GOOGLE_MAP_LIBRARIES = ["places"];
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
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(true); // Controls visibility of location dropdown

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

  // Detect location using Geolocation API
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

            try {
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

                setUserLocation(detectedLocation || "Unknown Location");
                setServiceAvailable(
                  locations.includes(detectedLocation || "")
                );
              }
            } catch (error) {
              console.error("Error during reverse geocoding:", error.message);
              setUserLocation("Location detection failed");
              setServiceAvailable(false);
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

  // Handle location selection from Google Autocomplete
  const handlePlaceChanged = () => {
    if (autocompleteRef) {
      const place = autocompleteRef.getPlace();
      const selectedLocation = place.name || place.formatted_address;

      setUserLocation(selectedLocation);
      setServiceAvailable(locations.includes(selectedLocation));
    }
  };

  // Scroll event listener to show/hide location dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/" && window.scrollY === 0) {
        setShowLocationDropdown(true); // Show dropdown when scrolled to top
      } else {
        setShowLocationDropdown(false); // Hide dropdown on scroll
      }

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LoadScript
    googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
    libraries={GOOGLE_MAP_LIBRARIES}
    >
      <header className="bg-yellow-600  rounded-b-md shadow-md fixed top-0 left-0 right-0 z-50">
        <nav
          className="container mx-auto flex flex-col md:flex-row items-center justify-between p-2 lg:p-2"
          ref={navbarRef}
        >
          {/* Top Section - Logo (Hidden on Mobile) */}
          <div className="hidden md:flex flex-shrink-0">
            <Link to="/">
              <img
                src={logo}
                alt="ManaKirana logo"
                className="w-14 h-auto sm:w-16 lg:w-20 "
              />
            </Link>
          </div>

          {/* Location Selector */}
          {showLocationDropdown && (
            <div className="flex items-center w-full md:w-auto mb-2 md:mb-0 pl-2">
              {/* Location Icon with Dynamic Color */}
              {/* <FiMapPin
                size={24}
                className={`mr-2 ${
                  serviceAvailable ? "text-green-900" : "text-red-600"
                }`}
              /> */}

              {/* Google Places Autocomplete */}
              <Autocomplete
                onLoad={(ref) => setAutocompleteRef(ref)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder={userLocation || "Enter your location"}
                  className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none w-full md:w-auto"
                />
              </Autocomplete>

              {/* Feedback for Service Availability */}
              {/* Feedback for Service Availability */}
<div className="pl-1">
  {/* <span className="text-md text-gray-700 block md:inline">
    {userLocation || "Detecting location..."}
  </span> */}
  {serviceAvailable ? (
    <p className="text-green-800 text-xs mt-1">
      Happy to deliver to {userLocation}
    </p>
  ) : (
    <p className="text-red-600 text-xs mt-1">
      Services are not available in {userLocation} <br />
      {/* <Link
        to="/request-service"
        className="text-blue-500 underline"
      >
        Request service
      </Link> */}
    </p>
  )}
</div>

            </div>
          )}

        
<div className="w-full flex items-center justify-between pl-2 space-x-2 md:space-x-0">
  {/* Search Box */}
  <div className="flex-grow">
    <SearchBox />
  </div>
{/* Bottom Section - Contact Us Banner (Visible only on larger screens) */}
<div className="hidden md:flex items-center space-x-4 mt-2 md:mt-0 ">
  <ContactUsBanner />
</div>
  {/* User Account Section */}
  {userInfo ? (
    <div className="relative flex flex-col items-center">
      <button
        onClick={toggleAccountForm}
        ref={userIconRef}
        className="text-xl text-blue-100  hover:text-white hover:scale-110 focus:outline-none"
      >
        <FaUserCircle size={40} />
      </button>
      {/* <div className="flex items-center space-x-1 mt-1">
        <div className="text-green-900 text-md font-semibold">Hi</div>
        <div className="text-green-900 text-md font-semibold">
          {userInfo.name}
        </div>
      </div> */}
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
      <button
        onClick={toggleLoginForm}
        ref={userIconRef}
        className="text-xl text-gray-500 focus:outline-none"
      >
        <FaUserCircle size={40} />
      </button>
      {showLoginForm && (
        <div
          ref={loginFormRef}
          className="absolute right-0 w-80 bg-white border  hover:text-white hover:scale-110 border-gray-300 rounded-lg shadow-lg z-10 p-4 transition-opacity duration-300 transform"
        >
          <LoginScreen onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </div>
  )}
</div>



          
        </nav>
      </header>
    </LoadScript>
  );
};

export { toggleAccountFormExternally };
export default Header;
