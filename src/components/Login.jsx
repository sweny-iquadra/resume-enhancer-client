
import React, { useState } from 'react';
import AppConfig from '../config';
import ErrorToast from "../components/modals/ErrorToast";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = AppConfig.REACT_APP_API_URL;
  // Toast states
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail || "Login failed");
        setShowErrorToast(true);
        throw new Error(data.detail || "Login failed");
      }
      onLoginSuccess(data.user, data.access_token, data.token_type);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Purple Card */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-12 w-full max-w-2xl h-96 relative overflow-hidden">
          {/* Back Button */}
          <button className="absolute top-6 left-6 text-white flex items-center space-x-2 text-sm">
            <span>←</span>
            <span>Back</span>
          </button>

          {/* Main Heading */}
          <h1 className="text-white text-3xl font-bold mb-8 mt-4">
            Empower Your Employment Journey
          </h1>

          {/* Illustration */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Bean bag and person illustration */}
              <div className="w-64 h-32 relative">
                {/* Bean bag */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-teal-400 rounded-full"></div>

                {/* Person */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  {/* Head */}
                  <div className="w-8 h-8 bg-yellow-600 rounded-full mb-1 mx-auto"></div>
                  {/* Body */}
                  <div className="w-12 h-16 bg-yellow-500 rounded-t-lg mx-auto mb-2"></div>
                  {/* Legs */}
                  <div className="w-16 h-8 bg-blue-800 rounded-b-lg mx-auto"></div>
                </div>

                {/* Laptop */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 translate-x-2 w-6 h-4 bg-gray-300 rounded-sm"></div>

                {/* Plant */}
                <div className="absolute bottom-8 right-8 w-4 h-6 bg-green-400 rounded-t-full"></div>

                {/* Background elements */}
                <div className="absolute top-4 left-8 w-6 h-4 bg-white bg-opacity-20 rounded"></div>
                <div className="absolute top-2 right-12 w-4 h-3 bg-white bg-opacity-20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Demo section */}
          <div className="absolute bottom-6 right-6 flex items-center space-x-3">
            <span className="text-white text-sm">Demo</span>
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black text-xs">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Tagline */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white text-sm">🚀</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">iQua.ai</span>
            </div>
            <p className="text-gray-600 text-sm">Let The Job Find You</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              New to our Platform?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Create an Account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <ErrorToast
        showErrorToast={showErrorToast}
        setShowErrorToast={setShowErrorToast}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default Login;
