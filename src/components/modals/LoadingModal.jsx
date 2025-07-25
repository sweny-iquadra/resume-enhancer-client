
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
            background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 50%, #7c69ef 100%)'
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
            {/* Progress Animation */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="h-2 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, #3935cd, #5b4de8, #7c69ef)',
                  width: '70%',
                  animation: 'progress 2s ease-in-out infinite'
                }}
              ></div>
            </div>
            
            {/* AI Processing Animation */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="flex space-x-1">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: '#3935cd',
                    animationDelay: '0ms'
                  }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: '#5b4de8',
                    animationDelay: '150ms'
                  }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: '#7c69ef',
                    animationDelay: '300ms'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
            {message || "iQua AI is generating your resume. This may take a few moments while we tailor your resume to your most relevant job role and skills."}
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>AI is analyzing your profile and experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
