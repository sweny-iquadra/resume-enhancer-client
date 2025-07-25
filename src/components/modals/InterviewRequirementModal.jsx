
import React from 'react';

const InterviewRequirementModal = ({ showInterviewModal, setShowInterviewModal, navigateToInterview }) => {
  if (!showInterviewModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold">Interview Required</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Take your first step by attending an interview, and let iQua help you build a resume for your preferred job role!
          </p>

          <div className="flex flex-col space-y-3">
            <button 
              onClick={navigateToInterview}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ATTEND INTERVIEW
            </button>

            <button 
              onClick={() => setShowInterviewModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRequirementModal;
