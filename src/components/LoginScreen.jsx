import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ClickOutsideWrapper from "./ClickOutsideWrapper";
const LoginScreen = ({ onClose }) => {
  const [screen, setScreen] = useState('login'); // 'login', 'register', 'forgotPassword'
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value;
    setPhoneNo(inputPhoneNumber);
    setIsValidPhoneNumber(validatePhoneNumber(inputPhoneNumber));
    if (validationError) setValidationError(''); // Clear error when user starts typing
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValidPhoneNumber) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const res = await login({ phoneNo, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleScreen = (newScreen) => {
    setScreen(newScreen);
  };

  return (
    <div className="max-w-md mt-20 mx-auto p-4 bg-white shadow-md rounded-lg">
      <ClickOutsideWrapper onOutsideClick={onClose}>
      {screen === 'login' && (
        <>
          <h1 className="mb-4 text-center text-green-700 text-lg md:text-xl bg-gray-100 p-2 rounded-lg shadow-sm">
            Log In
          </h1>

          {validationError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {validationError}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {error.data?.message || error.error}
            </div>
          )}

          <form onSubmit={submitHandler} noValidate className="space-y-4">
            <div>
              <label htmlFor="phoneNo" className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNo"
                placeholder="Enter your phone number"
                value={phoneNo}
                onChange={handlePhoneNumberChange}
                required
                className={`w-full p-2 border rounded ${
                  !isValidPhoneNumber ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                disabled={isLoading}
              />
              {!isValidPhoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid 10-digit phone number without spaces or special characters.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <div className="bg-gray-100 p-2 rounded-lg shadow-sm inline-block">
              <span className="text-gray-600">New Customer? </span>
              <button
                type="button"
                onClick={() => toggleScreen('register')}
                className="text-green-700 hover:text-green-900 text-lg md:text-xl focus:outline-none"
              >
                Register
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="bg-gray-100 p-2 rounded-lg shadow-sm inline-block">
              <span className="text-gray-600">Forgot your password? </span>
              <button
                type="button"
                onClick={() => toggleScreen('forgotPassword')}
                className="text-green-700 hover:text-green-900 text-lg md:text-xl focus:outline-none"
              >
                Reset Password
              </button>
            </div>
          </div>
        </>
      )}

      {screen === 'register' && (
        <RegisterScreen onClose={onClose} onSwitchToLogin={() => toggleScreen('login')} />
      )}

      {screen === 'forgotPassword' && (
        <ForgotPasswordScreen onClose={onClose} onSwitchToLogin={() => toggleScreen('login')} />
      )}
      </ClickOutsideWrapper>
    </div>
  );
};

export default LoginScreen;
