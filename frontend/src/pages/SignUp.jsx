import { useState } from "react";
import { FaEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {auth} from "../utils/firebase"
import {ClipLoader} from "react-spinners"

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 1px ${primaryColor}20`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = borderColor;
    e.target.style.boxShadow = "none";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, role, mobile },
        { withCredentials: true }
      );
      setLoading(false);
      setError("");
      if (response.data) {
        navigate("/signin");
      }
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message)
      console.error("Signup error: ", error.response?.data || error.message);
    }
  };

  const handleGoogleAuth = async () => {
    if(!mobile || mobile.length < 10) {
      return setError("Mobile number is required")
    }
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);

    try {
      await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: data?.user.displayName,
        email: data?.user.email,
        mobile,
        role
      }, {withCredentials: true})
      navigate("/");
    } catch (error) {
      setError(error?.res?.data?.error)
      console.log(error)
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white px-6 py-5 shadow-md"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
            Feast
          </h1>
          <p className="text-sm text-gray-500">Join our community today.</p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
          <div className="flex flex-col items-start">
            <label htmlFor="fullName" className="mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
              style={{ border: `1px solid ${borderColor}` }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
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

          <div className="flex flex-col items-start">
            <label htmlFor="mobile" className="mb-1 text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit number"
              required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
              style={{ border: `1px solid ${borderColor}` }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="mb-1 text-sm font-medium text-gray-700">I am a...</label>
            <div className="flex w-full gap-2">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="flex-1 cursor-pointer rounded-lg border py-1.5 text-xs font-semibold transition-all"
                  style={{
                    borderColor: role === r ? primaryColor : borderColor,
                    backgroundColor: role === r ? primaryColor : "transparent",
                    color: role === r ? "#ffffff" : "#666666",
                  }}
                >
                  {r === "deliveryBoy" ? "Rider" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg px-3 py-2 pr-10 text-sm outline-none transition-all"
                style={{ border: `1px solid ${borderColor}` }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
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
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaRegEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 h-3.5 w-3.5 cursor-pointer"
              style={{ accentColor: primaryColor }}
            />
            <label htmlFor="terms" className="text-[11px] leading-tight text-gray-500">
              I agree to the{" "}
              <span className="font-semibold" style={{ color: primaryColor }}>Terms</span> &{" "}
              <span className="font-semibold" style={{ color: primaryColor }}>Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            className="mt-1 cursor-pointer w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white"/> : "Create Account"}
          </button>
          <p className="text-red-500 text-center my-2.5"> {error} </p>
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <FaGoogle size={18} className="text-red-500" />
            <span>Sign Up with Google</span>
          </button>
        </form>

        <div className="mt-4 border-t border-gray-100 pt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              type="button"
              className="font-bold cursor-pointer hover:underline"
              style={{ color: primaryColor }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;