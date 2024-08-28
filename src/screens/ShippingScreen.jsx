import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetDeliveryAddressQuery } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Account from '../components/Account'; // Import Account component

const ShippingScreen = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userInfo);
  const userId = user?._id;

  // State to manage Account form visibility
  const [showAccountForm, setShowAccountForm] = useState(false);

  // Fetch the delivery address using React Query
  const { data: deliveryAddress, isLoading, isError, refetch } = useGetDeliveryAddressQuery(userId, {
    skip: !userId,
  });
  
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Toggle Account form visibility
  const handleGoToAccount = () => {
    setShowAccountForm((prev) => !prev);
  };

  // Close the Account form and refetch the delivery address
  const handleAccountUpdate = () => {
    setShowAccountForm(false); // Close the Account form
    refetch(); // Refetch the address from the database after update
  };

  // Navigate to payment if there is a valid saved address
  const handleContinueWithSavedAddress = () => {
    navigate('/payment');
  };

  // Check if the delivery address is valid
  const hasValidAddress = deliveryAddress && deliveryAddress.deliveryAddress && deliveryAddress.deliveryAddress.street && deliveryAddress.deliveryAddress.city && deliveryAddress.deliveryAddress.postalCode;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading address</div>;

  return (
    <div className="mt-20">
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1 className="text-2xl font-semibold mb-6">Shipping</h1>
        {hasValidAddress ? (
          <div className="border p-4 mb-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Saved Address</h2>
            <p>{deliveryAddress.deliveryAddress.street}</p>
            <p>{deliveryAddress.deliveryAddress.city}</p>
            <p>{deliveryAddress.deliveryAddress.postalCode}</p>
            <button
              className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700"
              onClick={handleContinueWithSavedAddress}
            >
              Continue with Saved Address
            </button>
          </div>
        ) : (
          <div className="border p-4 mb-4 rounded-md shadow-sm">
            <p className="text-red-600">Enter address in account to complete order</p>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleGoToAccount}
            >
              Go to Account
            </button>
          </div>
        )}
        {showAccountForm && (
          <div className="mt-4">
            <Account onClose={handleAccountUpdate} /> {/* Pass handleAccountUpdate as the onClose callback */}
          </div>
        )}
      </FormContainer>
    </div>
  );
};

export default ShippingScreen;
