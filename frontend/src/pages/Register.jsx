import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";

import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../features/api/apiSlices/userApiSlice";
import { setCredentials } from "../features/authenticate/authSlice";
import { updateLoader } from "../features/loader/loaderSlice";

import { UsernameInput, EmailInput, PasswordInput } from "../components/Inputs";
import SubmitButton from "../components/SubmitButton";
import validateForm from "../utils/validateForm";

import logo from "../assets/logo.jpeg";
import bgImage from "../assets/login-img2.jpeg";

const validationSchema = object({
  username: string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters"),
  email: string().required("Email is required.").email("Invalid Email"),
  password: string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(
    parseInt(localStorage.getItem("otpCountdown")) || 0
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(e.target.name, e.target.value, validationSchema, setErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateLoader(40));
    try {
      const res = await register(formData).unwrap();
      await dispatch(setCredentials(res.user));
      await sendOtp({ email: formData.email });
      setStep(2);
      setCountdown(60);
      localStorage.setItem("otpCountdown", "60");
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err?.data?.error || "Registration failed");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateLoader(40));
    try {
      const res = await verifyOtp({ email: formData.email, otp }).unwrap();
      await dispatch(setCredentials(res.user));
      toast.success("Email verified. You're now logged in.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.error || "OTP verification failed");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const resendOtp = async () => {
    try {
      dispatch(updateLoader(40));
      await sendOtp({ email: formData.email });
      setCountdown(60);
      localStorage.setItem("otpCountdown", "60");
      toast.success("OTP sent again");
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem("otpCountdown", (countdown - 1).toString());
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const hasErrors = Object.values(errors).some((err) => err);
  const { username, email, password } = formData;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col md:flex-row justify-center items-center px-4 py-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md bg-white/90 shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-blue-700">EXPENSE TRACKER</h1>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
          {step === 1 ? "Register" : "Verify Your Email"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <UsernameInput
              value={username}
              onChange={handleChange}
              errors={errors}
            />
            <EmailInput
              value={email}
              onChange={handleChange}
              errors={errors}
            />
            <PasswordInput
              value={password}
              onChange={handleChange}
              errors={errors}
            />
            <SubmitButton
              isLoading={registerLoading}
              isDisabled={!username || !email || !password || hasErrors}
            />
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            />
            <SubmitButton
              isLoading={verifyOtpLoading}
              isDisabled={!otp}
            />
            <div className="text-sm text-center mt-2">
              Didn’t receive OTP?<br></br> Please check your SPAM folder too.<br></br>{" "}
              <button
                onClick={resendOtp}
                disabled={countdown > 0}
                className="text-blue-600 disabled:text-gray-400"
              >
                Resend {countdown > 0 ? `in ${countdown}s` : ""}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <>
            <div className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-md transition"
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
// Register component UI logic
