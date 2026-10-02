import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 1px ${primaryColor}20`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = borderColor;
    e.target.style.boxShadow = "none";
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setStep(2);
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
      setStep(3);
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Invalid OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const newpassword = newPassword;
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newpassword }, { withCredentials: true });
      alert("Password updated successfully!");
      navigate("/signin");
      setError("")
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-sm rounded-xl bg-white px-6 py-6 shadow-md" style={{ border: `1px solid ${borderColor}` }}>
        
        <div className="mb-6">
          <button
            onClick={() => (step === 1 ? navigate("/signin") : setStep(step - 1))}
            className="group mb-2 flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: primaryColor }}
          >
            <IoIosArrowRoundBack size={24} className="transition-transform group-hover:-translate-x-1" />
            {step === 1 ? "Back to Login" : "Back"}
          </button>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 1 && "Enter your email to receive a verification code."}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && "Create a new strong password for your account."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                style={{ border: `1px solid ${borderColor}` }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "Send OTP"}
            </button>
            <p className="text-red-500 text-center my-2.5"> {error} </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="otp" className="mb-1 text-sm font-medium text-gray-700">Verification Code</label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                required
                className="w-full rounded-lg px-3 py-2 text-center text-lg font-bold tracking-[0.5em] outline-none transition-all"
                style={{ border: `1px solid ${borderColor}` }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "Verify OTP"}
            </button>
            <button 
              type="button" 
              onClick={handleSendOtp} 
              className="text-xs font-semibold text-center hover:underline cursor-pointer" 
              style={{ color: primaryColor }}
            >
              Resend Code
            </button>
            <p className="text-red-500 text-center my-2.5"> {error} </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="newPassword" className="mb-1 text-sm font-medium text-gray-700">New Password</label>
              <div className="relative w-full">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-lg px-3 py-2 pr-10 text-sm outline-none transition-all"
                  style={{ border: `1px solid ${borderColor}` }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaRegEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative w-full">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg px-3 py-2 pr-10 text-sm outline-none transition-all"
                  style={{ border: `1px solid ${borderColor}` }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <FaRegEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-lg py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "Update Password"}
            </button>
            <p className="text-red-500 text-center my-2.5"> {error} </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;