import React, { useEffect } from 'react';

const SuccessToast = ({ showSuccessToast, setShowSuccessToast, message, title }) => {
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, setShowSuccessToast]);

  if (!showSuccessToast) return null;

  return (
    <div
      className={[
        "fixed top-4 right-4 z-50",
        "transition-all duration-300 ease-out",
        showSuccessToast
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-2 opacity-0 scale-95 pointer-events-none"
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          "relative flex items-start gap-3 max-w-sm rounded-2xl border p-4 shadow-xl",
          // iQua look: soft surface + emerald accent, light/dark friendly
          "bg-white/90 text-neutral-800 border-emerald-400/25 backdrop-blur",
          "dark:bg-neutral-900/90 dark:text-neutral-100 dark:border-emerald-400/30",
          // Subtle inner ring for crispness on high-DPI
          "ring-1 ring-black/5 dark:ring-white/5",
          // Respect reduced motion
          "motion-reduce:transition-none motion-reduce:transform-none"
        ].join(" ")}
      >

        {/* Icon chip */}
        <div className="mt-0.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <span className="text-sm font-medium leading-none">✓</span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {title || 'Success'}
          </h4>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {message || 'Operation completed successfully.'}
          </p>
        </div>

        {/* Close (no square bg or border; compact; no imports) */}
        <button
          onClick={() => setShowSuccessToast(false)}
          className={[
            "ml-1 inline-flex items-center justify-center rounded-lg p-1",
            "text-neutral-500 hover:text-neutral-700",
            "dark:text-neutral-400 dark:hover:text-neutral-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
            "transition-colors"
          ].join(" ")}
          aria-label="Dismiss success"
          title="Dismiss"
        >
          <span className="text-xs leading-none">❌</span>
        </button>

        {/* Auto-dismiss progress bar (visual cue) */}
        <span
          className={[
            "pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-b-2xl bg-emerald-500/70",
            "animate-[toastbar_4s_linear_forwards]"
          ].join(" ")}
          style={{ width: '100%' }}
        />
      </div>

      {/* Keyframes (scoped) */}
      <style>{`
        @keyframes toastbar {
          from { transform: scaleX(1); transform-origin: left; }
          to { transform: scaleX(0); transform-origin: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[toastbar_4s_linear_forwards] { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;
