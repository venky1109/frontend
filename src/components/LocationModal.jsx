import React, { useState } from 'react';

const LocationModal = ({ setLocation, closeModal }) => {
  const [manualLocation, setManualLocation] = useState('');

  const handleManualLocationChange = (e) => {
    setManualLocation(e.target.value);
  };

  const saveManualLocation = () => {
    setLocation(manualLocation);
    closeModal();  // Close the modal after selecting a location
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
            );
          
            const data = await response.json();
            // console.log(data)
            if (data && data.address) {
              const { city, state, postcode, county } = data.address;
              const address = `${city || county}, ${state}, ${postcode}`;
              setLocation(address);
            } else {
              setLocation('Location not found');
            }
          } catch (err) {
            setLocation('Failed to fetch location');
            console.log(err)
          }
          closeModal();
        },
        (error) => {
          setLocation('Location access denied');
          closeModal();
        }
      );
    } else {
      setLocation('Geolocation not supported');
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Choose your location</h3>
        <input
          type="text"
          placeholder="Enter city, state, pincode"
          value={manualLocation}
          onChange={handleManualLocationChange}
          className="px-3 py-2 border border-gray-300 rounded w-full mb-4"
        />
        <button onClick={handleDetectLocation} className="text-blue-500 underline mb-4">
          Detect my location
        </button>
        <div className="flex justify-end">
          <button onClick={closeModal} className="px-4 py-2 mr-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={saveManualLocation} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
