import React, { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Loader from "./Loader"; // Import Loader component

const serviceableLocations = {
  "533201": "Amalapuram",
  "533001": "Kakinada",
  "533212": "Mummidivaram",
  "533464": "Yanam",
  "533222": "Uppalaguptam",
  "533213": "Uppalaguptam"
};

// Google Maps API Key & Libraries
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_MAPS_LIBRARIES = ["places"];

const SelectLocation = ({ onLocationChange }) => {
  const [fullAddress, setFullAddress] = useState("");
  const [message, setMessage] = useState(null);
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Google Maps API only once at the top level
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // Show location input only when at the top of the page
  useEffect(() => {
    const handleScroll = () => setShowLocation(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if the pincode is serviceable
  const checkServiceAvailability = (pincode) => {
    const isServiceable = serviceableLocations[pincode];
    setMessage({
      type: isServiceable ? "success" : "error",
      text: isServiceable
        ? `Happy to deliver to ${isServiceable}!`
        : `Sorry, we do not deliver to this location yet.`
    });
    if (onLocationChange) onLocationChange(isServiceable || pincode);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!GOOGLE_MAPS_API_KEY) {
      alert("Google Maps API Key is missing.");
      return;
    }

    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              const address = data.results[0].formatted_address;
              let pincode = extractPincode(data.results[0].address_components);

              if (!pincode) {
                for (let result of data.results) {
                  pincode = extractPincode(result.address_components);
                  if (pincode) break;
                }
              }
              setFullAddress(address);
              checkServiceAvailability(pincode);
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
          setLoading(false);
        },
        () => {
          alert("Please enable location access to use this feature.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Extract Pincode from Address Components
  const extractPincode = (addressComponents) => {
    if (!addressComponents || !Array.isArray(addressComponents)) return null;
    for (let component of addressComponents) {
      if (component.types.includes("postal_code")) {
        return component.long_name;
      }
    }
    return null;
  };

  // Extract State from Address Components
  const extractState = (addressComponents) => {
    if (!addressComponents || !Array.isArray(addressComponents)) return null;
    for (let component of addressComponents) {
      if (component.types.includes("administrative_area_level_1")) {
        return component.long_name;
      }
    }
    return null;
  };

  // Handle Address Selection from Autocomplete
  const handlePlaceChanged = async () => {
    if (autocompleteRef) {
      const place = autocompleteRef.getPlace();
      if (place.formatted_address) {
        setFullAddress(place.formatted_address);
        let pincode = extractPincode(place.address_components);
        let state = extractState(place.address_components);

        if (state !== "Andhra Pradesh" && state !== "Puducherry") {
          setMessage({ type: "error", text: "We only deliver in Andhra Pradesh & Puducherry." });
          return;
        }
        if (!pincode && place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          pincode = await fetchPincodeFromLatLng(lat, lng);
        }

        checkServiceAvailability(pincode);
      }
    }
  };
  // Fetch Pincode Using Reverse Geocoding API
const fetchPincodeFromLatLng = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results.length > 0) {
      for (let result of data.results) {
        const pincode = extractPincode(result.address_components);
        if (pincode) return pincode; // Return first found pincode
      }
    }
  } catch (error) {
    console.error("Error fetching pincode from lat/lng:", error);
  }
  return null; // Return null if no pincode is found
};


  return (
    <>
      {showLocation && (
        <div className="w-full max-w-sm mx-auto p-4">
          <h2 className="text-center text-black text-lg font-semibold mb-4">
            Where Would You Like Your Order Delivered?
          </h2>

          {isLoaded ? (
            <Autocomplete
              onLoad={(ref) => setAutocompleteRef(ref)}
              onPlaceChanged={handlePlaceChanged}
              options={{
                componentRestrictions: { country: "IN" },
                types: ["geocode"],
              }}
            >
              <div className="flex items-center justify-center">
              <input 
                type="text"
                className="w-60 border rounded-md px-4 bg-white border-green-500 text-gray-700"
                placeholder="Search a new address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
              </div>
            </Autocomplete>
          ) : (
            <Loader />
          )}

          {/* OR Separator */}
          <div className="flex items-center justify-center ">
            {/* <div className="w-1/4 border-t border-gray-300"></div> */}
            <span className="mx-2 text-gray-700 font-semibold">OR</span>
            {/* <div className="w-1/4 border-t border-gray-300"></div> */}
          </div>

       

          {/* Use My Current Location Button */}
          <div className="flex items-center justify-center">
          <button
            className="flex items-center text-gray-700 bg-white font-semibold cursor-pointer px-4 rounded-md border border-gray-500 hover:bg-blue-100 transition-all"
            onClick={getCurrentLocation}
            aria-label="Detect current location"
          >
            <FaCrosshairs className="mr-2" />
            Use My Current Location
          </button>
          </div>

          {loading && <Loader />}

          {message && (
            <div className={`mt-4 p-2 border rounded-lg ${message.type === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}`}>
              <strong>{message.type === "success" ? "Great!" : "Oops!"}</strong>
              <p>{message.text}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SelectLocation;
