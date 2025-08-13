import React from 'react';
import { useAuth } from '../utils/AuthContext';

const Header = ({ showResumeChat, setShowResumeChat, currentPage, setCurrentPage, onLogout }) => {
  const { user } = useAuth();

  // Brand header shell (dark UI)
  const shell =
    "backdrop-blur bg-neutral-900/80 border-b border-neutral-800 px-6 py-4 text-neutral-100";

  // Logo chip uses brand gradient: primary → accent
  const logoChip =
    "w-8 h-8 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-button";

  // Small caption per brand type scale (Inter 14/140%)
  const caption = "caption";

  if (currentPage === 'interview') {
    return (
      <header className={shell}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setCurrentPage('dashboard')}
          >
            <div className={logoChip}>
              <span className="text-white text-sm font-medium">iQ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-dmsans font-semibold text-lg leading-tight">iQua.ai Interview</span>
              <span className={`${caption} -mt-0.5 text-neutral-300`}>AI that gets you</span>
            </div>
          </div>

          {/* Back to Dashboard */}
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="btn btn-ghost rounded-2xl"
          >
            ← <span className="ml-1">Back to Dashboard</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={shell}>
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setCurrentPage('dashboard')}
        >
          <div className={logoChip}>
            <span className="text-white text-sm font-medium">iQ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-dmsans font-semibold text-lg leading-tight">iQua.ai</span>
            <span className={`${caption} -mt-0.5 text-neutral-300`}>AI that gets you</span>
          </div>
        </div>

        {/* Resume Enhancer & User */}
        <div className="flex items-center gap-4">
          {/* Resume Enhancer launcher */}
          <div
            onClick={() => setShowResumeChat(!showResumeChat)}
            className={[
              "relative w-10 h-10 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-primary to-accent shadow-button cursor-pointer transition-transform duration-300",
              showResumeChat ? "scale-100" : "hover:scale-110 active:scale-95"
            ].join(" ")}
            title="Resume Enhancer - Click to open"
            role="button"
            aria-pressed={showResumeChat}
            aria-label="Open Resume Enhancer"
          >
            <span className="text-white text-base font-medium">📄</span>
            {!showResumeChat && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-neutral-900" />
            )}
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-100 font-medium text-sm">{user ? user.username : ""}</span>
            <div className="w-8 h-8 bg-neutral-800 rounded-2xl flex items-center justify-center">
              <span className="text-neutral-300 text-xs">👤</span>
            </div>
            <button
              onClick={onLogout}
              className="rounded-2xl p-2 text-neutral-300 hover:text-secondary hover:bg-secondary/10 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5A2 2 0 0 1 3 19V5a2 2 0 0 1 2-2h4"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17L21 12L16 7"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
