import { useState, useEffect } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetDeliveryAddressQuery } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Account from '../components/Account'; // Import Account component
import { saveShippingAddress } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaPen } from 'react-icons/fa';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userInfo);
  const userId = user?._id;
  
  const dispatch = useDispatch();

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
    // console.log("navigating to payment")
    dispatch(saveShippingAddress({
  ...deliveryAddress.deliveryAddress, // includes street, city, postalCode, etc.
  location: deliveryAddress.location  // includes { type: 'Point', coordinates: [...] }
}));

    navigate('/payment');
  };

  // Check if the delivery address is valid
  const hasValidAddress = deliveryAddress && deliveryAddress.deliveryAddress && deliveryAddress.deliveryAddress.street && deliveryAddress.deliveryAddress.city && deliveryAddress.deliveryAddress.postalCode;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading address</div>;

  return (
    <div className="pb-24">
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Delivery Address</p>
          <h1 className="text-2xl font-extrabold text-slate-950">Shipping</h1>
          <p className="mt-1 text-sm text-slate-500">Confirm where your groceries should be delivered.</p>
        </div>
        {hasValidAddress ? (
          <div className="mb-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FaMapMarkerAlt />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-extrabold text-slate-950">Saved Address</h2>
                <p className="mt-2 leading-6 text-slate-700">{deliveryAddress.deliveryAddress.street}</p>
                <p className="leading-6 text-slate-700">
                  {deliveryAddress.deliveryAddress.city} - {deliveryAddress.deliveryAddress.postalCode}
                </p>
              </div>
            </div>
            <button
              className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
              onClick={handleContinueWithSavedAddress}
            >
              Continue with Saved Address
            </button>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-amber-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold text-amber-700">Enter address in account to complete order</p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800"
              onClick={handleGoToAccount}
            >
              <FaPen className="text-xs" />
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
