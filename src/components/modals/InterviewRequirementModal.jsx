import React from 'react';

const InterviewRequirementModal = ({ showInterviewModal, setShowInterviewModal, navigateToInterview }) => {
  if (!showInterviewModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowInterviewModal(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="text-white p-6 rounded-t-2xl text-center relative" style={{backgroundColor: '#3935cd'}}>
          <button
            onClick={() => setShowInterviewModal(false)}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>

          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎤</span>
          </div>
          <h3 className="text-xl font-semibold">Interview Required</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="space-y-4 mb-6">
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              🎯 To create a personalized resume, you need to attend at least one interview first.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              Our AI uses your interview responses to understand your skills and create a tailored resume just for you.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-700 text-sm font-medium">
                💡 Quick & Easy: Takes just 5-10 minutes to complete your first interview
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={navigateToInterview}
              className="flex-1 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                backgroundColor: '#3935cd',
                background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 100%)'
              }}
            >
              🎤 ATTEND INTERVIEW
            </button>
            <button 
              onClick={() => setShowInterviewModal(false)}
              className="flex-1 text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-xl transition-all duration-300 font-semibold hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              MAYBE LATER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRequirementModal;