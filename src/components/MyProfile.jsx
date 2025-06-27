import React, {Suspense, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import axios from 'axios';
// import MapComponent from './MapComponent'; // Ensure the import path is correct

const MapComponent = React.lazy(() => import('./MapComponent'));




const MyProfile = ({ onProfileUpdate }) => {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    // Set initial user data
    if (userInfo) {
      setName(userInfo.name);
      setPhoneNo(userInfo.phoneNo);
      setDeliveryAddress(userInfo.deliveryAddress?.street || '');
      setCity(userInfo.deliveryAddress?.city || '');
      setPostalCode(userInfo.deliveryAddress?.postalCode || '');
      setLatitude(userInfo.location?.latitude || null);
      setLongitude(userInfo.location?.longitude || null);
    }
  }, [userInfo]);

  const fetchGeolocation = async (latitude, longitude) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      // console.log('Geocoding API Response:', response.data);

      const results = response.data.results;

      if (results.length > 0) {
        let streetAddress = '';
        let locality = '';
        let postalCode = '';

        results.some((result) => {
          const addressComponents = result.address_components;

          const streetNumber = addressComponents.find(component =>
            component.types.includes('street_number')
          )?.long_name || '';

          const route = addressComponents.find(component =>
            component.types.includes('route')
          )?.long_name || '';

          if (streetNumber && route) {
            streetAddress = `${streetNumber} ${route}`;
          }

          locality = addressComponents.find(component =>
            component.types.includes('locality') || component.types.includes('sublocality')
          )?.long_name || locality;

          postalCode = addressComponents.find(component =>
            component.types.includes('postal_code')
          )?.long_name || postalCode;

          return streetAddress && locality && postalCode;
        });

        setDeliveryAddress(streetAddress || 'Unknown Street');
        setCity(locality || 'Unknown City');
        setPostalCode(postalCode || 'Unknown Postal Code');

        toast.success('Address set to current location!');
      } else {
        toast.error('No results found for your current location.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Could not fetch address for your current location.');
    }
  };

  const handleFetchLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          await fetchGeolocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting current location:', error);
          toast.error('Could not retrieve your current location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 100,
          maximumAge: 0,
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      const payload = {
        name,
        phoneNo,
        deliveryAddress: {
          street: deliveryAddress,
          city: city,
          postalCode: postalCode,
        },
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        password,
      };

      try {
        const res = await updateProfile(payload).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');

        // After successful update, trigger the onProfileUpdate callback
        onProfileUpdate(); // Notify parent component of the update
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handlePasswordResetClick = () => {
    setShowPasswordFields((prev) => !prev);
  };

  return (
    <div className="p-4 mt-1 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-400 rounded"
            // placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="tel"
            className="w-full p-2 border border-gray-300 rounded"
            value={phoneNo}
            disabled
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border border-gray-400 rounded"
            placeholder="Enter your street address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            className="w-full p-2 border border-gray-400 rounded"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            className="w-full p-2 border border-gray-400 rounded"
            placeholder="Enter your postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <button
            type="button"
            onClick={handleFetchLocationClick}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-4"
          >
            Use Current Location
          </button>
        </div>
{/* 
        {latitude && longitude && (
          <div className="mt-4">
            <MapComponent latitude={latitude} longitude={longitude} />
          </div>
        )} */}

        {latitude && longitude && (
  <div className="mt-4">
    <Suspense fallback={<div>Loading map...</div>}>
      <MapComponent latitude={latitude} longitude={longitude} />
    </Suspense>
  </div>
)}


        <button
          type="button"
          onClick={handlePasswordResetClick}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {showPasswordFields ? 'Hide Password Fields' : 'Reset Password'}
        </button>

        {showPasswordFields && (
          <>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Update
        </button>
        {loadingUpdateProfile && <Loader />}
      </form>
    </div>
  );
};

export default MyProfile;
