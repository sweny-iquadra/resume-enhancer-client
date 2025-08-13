import React, { useEffect } from 'react';

const ErrorToast = ({ showErrorToast, setShowErrorToast, errorMessage }) => {
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => setShowErrorToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast, setShowErrorToast]);

  if (!showErrorToast) return null;

  return (
    <div
      className={[
        "fixed top-4 right-4 z-50 transition-all duration-500 ease-out",
        showErrorToast
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-full opacity-0 scale-95 pointer-events-none"
      ].join(" ")}
      role="alert"
      aria-live="assertive"
    >
      <div className="relative flex items-start gap-3 max-w-sm rounded-2xl border border-red-500/40 bg-neutral-900 text-neutral-100 shadow-2xl p-4">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="font-dmsans text-sm font-semibold">Error</h4>
          <p className="caption text-red-300 mt-1 break-words">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => setShowErrorToast(false)}
          className="ml-2 rounded-xl p-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors"
          aria-label="Dismiss error"
        >
          <span className="text-base leading-none">×</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
