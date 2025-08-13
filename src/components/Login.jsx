import React, { useState } from 'react';
import AppConfig from '../config';
import ErrorToast from './modals/ErrorToast';
import { loginUser } from '../utils/api';

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
      const data = await loginUser(email, password);
      onLoginSuccess(data.user, data.access_token, data.token_type);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong");
      setShowErrorToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex">
      {/* Left Panel — brand gradient primary → accent */}
      <div className="hidden lg:flex flex-1 p-8 items-center justify-center">
        <div className="rounded-3xl p-12 w-full max-w-2xl h-96 relative overflow-hidden bg-gradient-to-br from-primary to-accent shadow-2xl">
          {/* Back Button (visual only) */}
          <button className="absolute top-6 left-6 text-white/90 flex items-center gap-2 text-sm hover:text-white transition-colors">
            <span>←</span>
            <span className="font-medium">Back</span>
          </button>

          {/* Headline (DM Sans per base rules) */}
          <h1 className="font-dmsans text-white text-3xl font-semibold mb-8 mt-4 leading-tight">
            Empower Your Employment Journey
          </h1>

          {/* Abstract illustration */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-12 h-12 rounded-lg bg-white/15 border border-white/10" />
                  <div className="w-12 h-12 rounded-lg bg-secondary/80" />
                  <div className="w-12 h-12 rounded-lg bg-secondary/70" />
                  <div className="w-12 h-12 rounded-lg bg-white/15 border border-white/10" />
                </div>
              </div>
              <div className="absolute -top-2 left-10 w-2 h-2 rounded-full bg-white/80" />
              <div className="absolute bottom-6 right-12 w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
          </div>

          {/* Demo chip */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <span className="text-white/90 text-sm">Demo</span>
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-neutral-900 text-xs font-bold">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo + Tagline */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-button flex items-center justify-center mr-2">
                <span className="text-white text-sm font-medium">iQ</span>
              </div>
              <span className="font-dmsans text-2xl font-semibold text-neutral-100">iQua.ai</span>
            </div>
            <p className="caption">Let the Job Find You</p>
          </div>

          {/* Card */}
          <div className="card p-6">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="grid gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <label htmlFor="email" className="form-label text-neutral-200">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <label htmlFor="password" className="form-label text-neutral-200">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input pr-12 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-300 hover:text-neutral-100"
                    aria-label="Toggle password visibility"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-300">
                New to our Platform?{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  Create an Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast (unchanged) */}
      <ErrorToast
        showErrorToast={showErrorToast}
        setShowErrorToast={setShowErrorToast}
        errorMessage={errorMessage}
      />

    </div>
  );
};

export default Login;
