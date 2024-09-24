import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from '../components/Loader';

const RegisterScreen = ({ onClose, onSwitchToLogin }) => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [sendOTPloading, setSendOTPloading] = useState(false);
  const [sendVerifyOTPloading, setSendVerifyOTPloading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isVButtonDisabled, setVButtonDisabled] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (ph && ph.trim() !== '' && ph.length === 12) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [ph]);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  };

  const onSignup = () => {
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
  const sendOTP = async () => {
    try {
      if (ph && name) {
        setButtonDisabled(true);
        setTimeout(() => {
          setButtonDisabled(false);
        }, 300000); // 5 minutes
      }

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
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
        const res = await register({ name, phoneNo: ph.slice(2), password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <Toaster toastOptions={{ duration: 4000 }} />
    <div id="recaptcha-container"></div>
    <h1 className="mb-4 text-center text-green-700 text-lg md:text-xl bg-gray-100 p-2 rounded-lg shadow-sm">
            Register
          </h1>
    <form onSubmit={submitHandler} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
        <PhoneInput
          country={"in"}
          value={ph}
          onChange={(value) => setPh(value)}
          className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          disableDropdown
          inputStyle={{ width: '100%', padding: '1rem', borderRadius: '0.375rem' }}
        />
      </div>
      <button
        type="button"
        onClick={sendOTP}
        className={`w-full py-2 px-4 rounded-lg bg-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isButtonDisabled && 'opacity-50 cursor-not-allowed'}`}
        disabled={isButtonDisabled}
      >
        {sendOTPloading && <CgSpinner size={20} className="animate-spin inline-block mr-2" />}
        Send OTP via SMS
      </button>
      {showOTP && (
        <>
          <OtpInput
            value={otp}
            onChange={setOtp}
            OTPLength={6}
            otpType="number"
            autoFocus
            className="opt-container"
          />
          <button
            type="button"
            onClick={verifyOTP}
            className={`w-full py-2 px-4 rounded-lg bg-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isVButtonDisabled && 'opacity-50 cursor-not-allowed'}`}
            disabled={isVButtonDisabled}
          >
            {sendVerifyOTPloading && <CgSpinner size={20} className="animate-spin inline-block mr-2" />}
            Verify OTP
          </button>
          {user && (
            <>
              <div>
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 mt-4 rounded-lg bg-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                Register
              </button>
            </>
          )}
        </>
      )}
    </form>
    <div className="text-center mt-4">
      <span className="text-gray-600">Already have an account? </span>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-green-700 hover:underline"
      >
        Login
      </button>
    </div>
    {isLoading && <Loader />}
  </div>
);
};

export default RegisterScreen;
