import React from 'react';

const LoadingModal = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header — brand gradient */}
        <div className="text-white p-6 text-center relative bg-gradient-to-br from-primary to-accent">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="font-dmsans text-xl font-semibold">Generating Your Resume</h3>
          <p className="caption text-white/90 mt-2">Powered by iQua AI</p>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="mb-6">
            {/* Progress bar (indeterminate) */}
            <div className="w-full bg-neutral-800 rounded-full h-3 mb-6 shadow-inner">
              <div className="relative h-3 rounded-full overflow-hidden w-3/4 grad-cta">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* AI Processing dots */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div
                className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-primary"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-accent"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-3 h-3 rounded-full animate-bounce shadow-lg bg-secondary"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-neutral-100 text-base leading-relaxed font-medium">
              {message || '🤖 iQua AI is crafting your perfect resume'}
            </p>
            <p className="caption">
              Analyzing your profile and tailoring content to your selected role
            </p>
          </div>

          {/* Brand info alert */}
          <div className="mt-6 alert alert-info">
            <div className="flex items-center justify-center gap-2">
              <span className="relative inline-flex">
                <span className="absolute inline-block w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
                <span className="relative inline-block w-2 h-2 bg-primary rounded-full" />
              </span>
              <span className="caption">AI is analyzing your unique profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
