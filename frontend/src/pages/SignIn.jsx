import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { auth } from "../utils/firebase";
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  // Brand Colors
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 1px ${primaryColor}20`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = borderColor;
    e.target.style.boxShadow = "none";
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {email, password}, { withCredentials: true })
      if(result.data) {
        console.log("Sign in successfully:", result.data);
        navigate("/")
      }
    } catch (error) {
      console.log("Signin error: ", error); 
    }
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);

    try {
      const result = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: data?.user.email
      }, {withCredentials: true})
      navigate("/")
      console.log("Result: ", result);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white px-6 py-7 shadow-md"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
            Feast
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Please sign in.</p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          
          {/* Email Field */}
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="mb-1.5 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400"
              style={{ border: `1px solid ${borderColor}` }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Password Field - Now identical size to Email */}
          <div className="flex flex-col items-start">
            <div className="flex w-full items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                onClick={() => navigate("/forgot-password")}
                type="button" 
                className="text-xs cursor-pointer font-semibold hover:underline" 
                style={{ color: primaryColor }}
              >
                Forgot?
              </button>
            </div>
            <div className="relative w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-lg px-3 py-2 pr-10 text-sm outline-none transition-all placeholder:text-gray-400"
                style={{ border: `1px solid ${borderColor}` }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full cursor-pointer rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
          >
            Sign In
          </button>
          <button
                      onClick={handleGoogleAuth}
                      type="button"
                      className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <FaGoogle size={18} className="text-red-500" />
                      <span>Sign In with Google</span>
                    </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-5 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/signup")}
              type="button" 
              className="font-bold cursor-pointer hover:underline" 
              style={{ color: primaryColor }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;