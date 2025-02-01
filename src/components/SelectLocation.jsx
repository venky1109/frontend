import React, { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";
import { Autocomplete } from "@react-google-maps/api";

const serviceableLocations = {
  "533201": "Amalapuram",
  "533001": "Kakinada",
  "533212": "Mummidivaram",
  "533464": "Yanam",
  "533222": "Uppalaguptam",
  "533213": "Uppalaguptam"
};

const SelectLocation = ({ onLocationChange }) => {
  const [fullAddress, setFullAddress] = useState("");
  const [message, setMessage] = useState(null);
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [loadMaps, setLoadMaps] = useState(false);

  // Detect scroll position to show/hide component
  useEffect(() => {
    const handleScroll = () => setShowLocation(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if location is serviceable
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

  // Extract Pincode from Google Maps Address Components
  const extractPincode = (addressComponents) => {
    return addressComponents?.find((comp) => comp.types.includes("postal_code"))?.long_name || null;
  };

  // Extract State from Address Components
  const extractState = (addressComponents) => {
    return addressComponents?.find((comp) => comp.types.includes("administrative_area_level_1"))?.long_name || null;
  };

  // Handle Place Selection from Autocomplete
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

        checkServiceAvailability(pincode);
      }
    }
  };

  // Fetch Pincode Using Reverse Geocoding API
  const fetchPincodeFromLatLng = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      
      return data.results.flatMap(result => extractPincode(result.address_components)).find(Boolean) || null;
    } catch (error) {
      console.error("Error fetching pincode from lat/lng:", error);
      return null;
    }
  };

  // Enable Device Location Access
  const enableDeviceLocation = () => {
    if (!process.env.REACT_APP_GOOGLE_API_KEY) {
      alert("Google Maps API Key is missing.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              const address = data.results[0].formatted_address;
              let pincode = await fetchPincodeFromLatLng(latitude, longitude);

              setFullAddress(address);
              checkServiceAvailability(pincode);
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        },
        () => alert("Please enable location access to use this feature.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      {showLocation && (
        <div className="w-full max-w-sm mx-auto p-4">
          <h2 className="text-center text-white text-lg font-semibold mb-4">
            Where Would You Like Your Order Delivered?
          </h2>

          {/* Show "Enter Location" Button First */}
          {!loadMaps && (
            <button
              className="flex items-center font-semibold text-green-800 bg-white w-full m-1 cursor-pointer px-4 py-1 rounded-md border border-red-500 hover:bg-green-100 transition-all"
              onClick={() => setLoadMaps(true)}
            >
              Enter Location
            </button>
          )}

          {/* Show Google Maps Autocomplete After Clicking "Enter Location" */}
          {loadMaps && (
            <Autocomplete
              onLoad={(ref) => setAutocompleteRef(ref)}
              onPlaceChanged={handlePlaceChanged}
              options={{
                componentRestrictions: { country: "IN" },
                types: ["geocode"],
              }}
            >
              <input
                type="text"
                className="w-full border rounded-lg p-1 bg-gray-100 text-gray-700"
                placeholder="Search a new address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                onBlur={() => {
                  if (fullAddress) {
                    setMessage({
                      type: "error",
                      text: "Please select an address from suggestions to check service availability."
                    });
                  }
                }}
              />
            </Autocomplete>
          )}

          {/* Detect Current Location Button */}
          <div className="flex items-center mt-1">
            <button
              className="flex items-center text-green-800 bg-white font-semibold cursor-pointer px-4 py-1 rounded-md border border-red-500 hover:bg-green-100 transition-all"
              onClick={enableDeviceLocation}
              aria-label="Detect current location"
            >
              <FaCrosshairs className="mr-2" />
              Use My Current Location
            </button>
          </div>

          {/* Service Availability Message */}
          {message && (
            <div
              className={`mt-4 p-2 border rounded-lg ${
                message.type === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
              }`}
            >
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
