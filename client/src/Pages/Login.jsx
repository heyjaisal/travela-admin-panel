import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserRole } from "../redux/actions/authaction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", global: "" });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);  // New loading state for token check
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    } else {
      setInitializing(false);  // Set initializing to false after checking for token
    }
  }, [navigate]);

  if (initializing) {
    return null; // Don't render anything while checking the token
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = { email: "", password: "", global: "" };

    if (!email) {
      newErrors.email = "Please enter your email.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token); // Store token in localStorage
      dispatch(setUserRole(role)); // Set role in Redux store

      navigate("/home");
    } catch (err) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        global: err.response?.data?.error || "Login failed. Please try again.",
      }));
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-indigo-900 to-purple-600 items-center justify-center">
        <img
          src="https://via.placeholder.com/600x600"
          alt="Illustration"
          className="w-3/4 h-auto"
        />
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-96 max-w-full mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
            Sign In
          </h2>

          {errors.global && (
            <div className="text-red-600 mb-4 text-center" aria-live="assertive">
              {errors.global}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              aria-describedby="email-error"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div id="email-error" className="text-red-500 text-sm mt-1" aria-live="assertive">
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                aria-describedby="password-error"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="text-red-500 text-sm mt-1" aria-live="assertive">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
