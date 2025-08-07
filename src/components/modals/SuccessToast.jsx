
import React, { useEffect } from 'react';

const SuccessToast = ({ showSuccessToast, setShowSuccessToast, message, title }) => {
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
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out ${showSuccessToast
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-full opacity-0 scale-95 pointer-events-none'
        }`}
    >
      <div className="text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm border border-purple-400"
        style={{
          background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)',
          boxShadow: '0 8px 25px rgba(57, 53, 205, 0.3)'
        }}>
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title || 'Success!'}</h4>
          <p className="text-purple-100 text-xs mt-1">{message || 'Operation completed successfully'}</p>
        </div>
        <button
          onClick={() => setShowSuccessToast(false)}
          className="flex-shrink-0 text-purple-200 hover:text-white transition-colors"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
