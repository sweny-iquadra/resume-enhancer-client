import React from 'react';

const LoadingModal = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div
          className="text-white p-6 rounded-t-2xl text-center relative"
          style={{
            background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
          }}
        >
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-semibold">Generating Your Resume</h3>
          <p className="text-sm opacity-90 mt-2">
            Powered by iQua AI
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="mb-6">
            {/* Enhanced Progress Animation */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 shadow-inner">
              <div
                className="h-3 rounded-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #7f90fa, #6366f1, #7c69ef)',
                  width: '70%',
                  animation: 'progressPulse 2.5s ease-in-out infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* AI Processing Animation */}
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="flex space-x-2">
                <div
                  className="w-3 h-3 rounded-full animate-bounce shadow-lg"
                  style={{
                    backgroundColor: '#3935cd',
                    animationDelay: '0ms',
                    boxShadow: '0 0 10px rgba(57, 53, 205, 0.5)'
                  }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full animate-bounce shadow-lg"
                  style={{
                    backgroundColor: '#5b4de8',
                    animationDelay: '200ms',
                    boxShadow: '0 0 10px rgba(91, 77, 232, 0.5)'
                  }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full animate-bounce shadow-lg"
                  style={{
                    backgroundColor: '#7c69ef',
                    animationDelay: '400ms',
                    boxShadow: '0 0 10px rgba(124, 105, 239, 0.5)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              {message || "🤖 iQua AI is crafting your perfect resume"}
            </p>
            <p className="text-gray-600 text-sm">
              Analyzing your profile and tailoring content to your selected role
            </p>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
              <div className="relative">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></span>
              </div>
              <span className="font-medium">AI is analyzing your unique profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;