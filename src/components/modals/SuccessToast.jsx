import React, { useEffect } from 'react';

const SuccessToast = ({ showSuccessToast, setShowSuccessToast }) => {
  useEffect(() => {
    if (showSuccessToast) {
      // Auto hide after 4 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, setShowSuccessToast]);

  if (!showSuccessToast) return null;

  return (
    <div className="fixed top-4 right-4 z-[60]" style={{
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md border border-green-400" style={{
        boxShadow: '0 20px 50px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.1)'
      }}>
        <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xl">🎉</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base">Resume Enhanced Successfully!</h3>
          <p className="text-green-100 text-sm mt-1 leading-relaxed">Your AI-powered resume is ready for preview and download</p>

          {/* Progress bar */}
          <div className="w-full bg-green-400 bg-opacity-30 rounded-full h-1 mt-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-[4000ms] ease-linear"
              style={{
                width: showSuccessToast ? '0%' : '100%',
                animation: showSuccessToast ? 'shrink 4s linear forwards' : 'none'
              }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => setShowSuccessToast(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95"
          title="Close"
        >
          <span className="text-lg">✕</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;