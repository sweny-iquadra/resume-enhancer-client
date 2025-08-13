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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header — brand gradient */}
        <div className="bg-gradient-to-br from-primary to-accent text-white p-6 text-center relative">
          <button
            onClick={() => setShowInterviewModal(false)}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/15 transition-colors"
            aria-label="Close"
          >
            <span className="text-lg">✕</span>
          </button>

          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎤</span>
          </div>
          <h3 className="font-dmsans text-xl font-semibold">Interview Required</h3>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="space-y-4 mb-6">
            <p className="text-neutral-100 text-base leading-relaxed font-medium">
              🎯 To create a personalized resume, you need to attend at least one interview first.
            </p>
            <p className="text-neutral-300 text-base leading-relaxed">
              Our AI uses your interview responses to understand your skills and create a tailored resume just for you.
            </p>

            {/* Brand alert style */}
            <div className="alert alert-info">
              <p className="caption">
                💡 Quick &amp; Easy: Takes just 5–10 minutes to complete your first interview
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={navigateToInterview}
              className="btn grad-cta flex-1"
            >
              🎤 <span className="ml-1">ATTEND INTERVIEW</span>
            </button>
            <button
              onClick={() => setShowInterviewModal(false)}
              className="btn btn-secondary flex-1"
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
