
import React from 'react';

const LoadingModal = ({ isLoading, onClose }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex items-center space-x-3">
          <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
          <div>
            <h3 className="text-lg font-semibold">AI Resume Enhancement</h3>
            <p className="text-sm opacity-90">Powered by iQua AI</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Generating Your Resume
              </h4>
              <p className="text-gray-600 leading-relaxed">
                iQua AI is generating your resume. This may take a few moments while we tailor your resume to your most relevant job role and skills.
              </p>
            </div>

            {/* Progress indicators */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Analyzing your profile...</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Enhancing content with AI...</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Optimizing for your role...</span>
              </div>
            </div>

            {/* Loading bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
