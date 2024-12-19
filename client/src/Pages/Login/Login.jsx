import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/home'); // Redirect to home if token exists
    }
  }, [navigate, token]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token); // Save token to local storage
        navigate('/home'); // Redirect to home
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:block md:w-1/2">
        <img
          className="w-full h-full object-cover"
          src="https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_579.jpg"
          alt="Login Illustration"
        />
      </div>
      <div className="flex flex-col mt-28 justify-center items-center md:w-1/2 px-6 md:px-12">
        <h1 className="font-poppins text-2xl font-semibold mb-6 text-gray-700">Super Admin Sign In</h1>
        <form
          onSubmit={handleLogin}
          className="w-[300px] rounded-md px-4 text-base font-poppins"
        >
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
