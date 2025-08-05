import React from 'react';
import { useAuth } from "../utils/AuthContext";

const Header = ({ showResumeChat, setShowResumeChat, currentPage, setCurrentPage, onLogout }) => {
  const { user } = useAuth();
  if (currentPage === 'interview') {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCurrentPage('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7f90fa' }}>
              <span className="text-white text-sm font-bold">iQ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">iQua.ai Interview</span>
              <span className="text-xs text-gray-500 -mt-1">AI that gets you</span>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setCurrentPage('dashboard')}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7f90fa' }}>
            <span className="text-white text-sm font-bold">iQ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">iQua.ai</span>
            <span className="text-xs text-gray-500 -mt-1">AI that gets you</span>
          </div>
        </div>

        {/* Resume Enhancer Icon & User Profile */}
        <div className="flex items-center space-x-4">
          <div
            onClick={() => setShowResumeChat(!showResumeChat)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-110 hover:-translate-y-1 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 100%)',
              animation: showResumeChat ? 'none' : 'gentlePulse 2s ease-in-out infinite',
              boxShadow: '0 4px 20px rgba(57, 53, 205, 0.3)'
            }}
            title="Resume Enhancer - Click to open"
          >
            <span className="text-white text-base font-medium transform transition-transform duration-200">📄</span>
            {!showResumeChat && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium text-sm">{user ? user.username : ""}</span>
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">👤</span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
              title="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;