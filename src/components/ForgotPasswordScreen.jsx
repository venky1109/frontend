import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from './Loader';

const otpRootStyle = {
  width: '100%',
  justifyContent: 'space-between',
  gap: '0.25rem',
};

const otpInputStyles = {
  width: '2rem',
  height: '2.25rem',
  marginRight: 0,
};

const ForgotPasswordScreen = ({ onSwitchToLogin }) => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [sendOTPloading, setSendOTPloading] = useState(false);
  const [sendVerifyOTPloading, setSendVerifyOTPloading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isVButtonDisabled, setVButtonDisabled] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    setButtonDisabled(!(ph && ph.trim() !== '' && ph.length === 12));
  }, [ph]);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            onRequestOTP();
          },
          "expired-callback": () => {},
        }
      );
    }
  };

  const onRequestOTP = () => {
    setSendOTPloading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setSendOTPloading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setSendOTPloading(false);
      });
  };

  const verifyOTP = async () => {
    setSendVerifyOTPloading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setUser(res.user);
        setSendVerifyOTPloading(false);
        setVButtonDisabled(true);
      })
      .catch((err) => {
        console.log(err);
        setSendVerifyOTPloading(false);
        setVButtonDisabled(false);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await forgotPassword({ phoneNo: ph.slice(2), password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Password reset successfully');
        navigate('/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      <h1 className="mb-4 rounded-md bg-gray-100 p-2 text-center text-lg font-semibold text-green-700 shadow-sm">
        Forgot Password
      </h1>
      <form onSubmit={submitHandler} className="space-y-3">
        <div>
          <label htmlFor="forgot-phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <PhoneInput
            country="in"
            value={ph}
            onChange={(value) => setPh(value)}
            containerClass="w-full"
            buttonClass="!border-gray-300 !rounded-l-md"
            inputClass="!h-10 !w-full !rounded-md !border-gray-300 !pl-12 !text-sm focus:!border-green-600 focus:!shadow-none"
            inputProps={{ id: 'forgot-phone', inputMode: 'numeric' }}
            disableDropdown
            countryCodeEditable={false}
          />
        </div>
        <button
          type="button"
          onClick={onRequestOTP}
          className={`w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isButtonDisabled && 'opacity-50 cursor-not-allowed'}`}
          disabled={isButtonDisabled}
        >
          {sendOTPloading && <CgSpinner size={20} className="mr-2 inline-block animate-spin" />}
          Send OTP via SMS
        </button>
        {showOTP && (
          <>
            <div className="opt-container mt-4 flex min-w-0 justify-center overflow-hidden">
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                autoFocus
                style={otpRootStyle}
                inputStyles={otpInputStyles}
                inputClassName="rounded-md border border-gray-300 text-center text-sm focus:border-green-600 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={verifyOTP}
              className={`w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isVButtonDisabled && 'opacity-50 cursor-not-allowed'}`}
              disabled={isVButtonDisabled}
            >
              {sendVerifyOTPloading && <CgSpinner size={20} className="mr-2 inline-block animate-spin" />}
              Verify OTP
            </button>
            {user && (
              <>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  Reset Password
                </button>
              </>
            )}
          </>
        )}
      </form>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Remember your password? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-green-700 hover:underline"
        >
          Login
        </button>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ForgotPasswordScreen;
