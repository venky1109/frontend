import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetDeliveryAddressQuery } from '../slices/usersApiSlice'; // Assuming this is the correct import
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const user = useSelector((state) => state.auth.userInfo);
// console.log('User Info:', user); // This should print your user info object
  const userId = user?._id; // Safely accessing the user ID
  // console.log(user?._id)
 

  const { data: deliveryAddress, isLoading, isError } = useGetDeliveryAddressQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(''); // Assuming country needs to be set manually

  useEffect(() => {
    if (deliveryAddress) {
      console.log('Updating address fields with:', deliveryAddress);
      setAddress(deliveryAddress.deliveryAddress.street || '');
      setCity(deliveryAddress.deliveryAddress.city || '');
      setPostalCode(deliveryAddress.deliveryAddress.postalCode || '');
      setCountry('India'); // Assuming the country is India
    }
  }, [deliveryAddress]);



  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  if (!userId) {
    return <div>Error: User ID is not available.</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading address</div>;

  return (
    <div className="mt-20">
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1 className="text-2xl font-semibold mb-6">Shipping</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-geen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue
          </button>
        </form>
      </FormContainer>
    </div>
  );
};

export default ShippingScreen;
