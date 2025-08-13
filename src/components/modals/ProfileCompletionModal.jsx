import React, { useState } from 'react';
import ErrorToast from './ErrorToast';

const ProfileCompletionModal = ({
  showProfileModal,
  setShowProfileModal,
  userProfile,
  setIsLoading,
  setEnhancedResumeData,
  setShowSuccessToast,
  setShowPreview,
  setCurrentPage,
  setShowResumeChat,
  handleResumeEnhancement
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessContent, setShowSuccessContent] = useState(false);
  const [generatedResumeData, setGeneratedResumeData] = useState(null);
  // Error toast state
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!showProfileModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowProfileModal(false);
    }
  };

  const handleGenerateAnyway = async () => {
    setIsGenerating(true);
    await proceedWithGeneration();
  };

  const proceedWithGeneration = async () => {
    try {
      // Set loading state first, then close modal to show ResumeChat loading state
      setIsLoading(true);
      setShowProfileModal(false);
      setShowResumeChat(true);

      await handleResumeEnhancement();

      // Clean up all internal modal states
      setShowSuccessContent(false);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating resume:', error);
      setIsGenerating(false);
      setIsLoading(false);
      setShowErrorToast(true);
      setErrorToastMessage(error.message || 'Failed to generate resume. Please try again.');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleOutsideClick}
      >
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
          {/* Modal Header — brand gradient */}
          <div className="text-white p-6 text-center relative bg-gradient-to-br from-primary to-accent">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/15 transition-colors"
              aria-label="Close"
            >
              <span className="text-lg">✕</span>
            </button>

            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="font-dmsans text-xl font-semibold">Complete Your Profile</h3>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {!showSuccessContent ? (
              <>
                <p className="text-neutral-100 text-base leading-relaxed mb-3">
                  Looks like you're almost there!
                </p>
                <p className="caption text-neutral-300 mb-6">
                  Complete your profile to build a perfect resume tailored for your career goals.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {/* Complete Profile — primary CTA */}
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setCurrentPage('profile');
                    }}
                    className="btn grad-cta w-full rounded-2xl py-3.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>📝</span>
                      <span>COMPLETE PROFILE</span>
                    </span>
                  </button>

                  {/* Generate Resume Anyway — secondary CTA */}
                  <button
                    onClick={handleGenerateAnyway}
                    disabled={isGenerating}
                    className={`btn btn-secondary w-full rounded-2xl py-3.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full"></div>
                        <span>GENERATING...</span>
                      </span>
                    ) : (
                      <span>GENERATE ANYWAY</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-green-500">✓</span>
                </div>
                <h4 className="font-dmsans text-lg font-semibold text-neutral-100 mb-2">
                  Resume Generated!
                </h4>
                <p className="caption text-neutral-300 mb-4">
                  Your enhanced resume is ready for review.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPreview(true);
                      setShowProfileModal(false);
                    }}
                    className="btn grad-cta flex-1"
                  >
                    View Resume
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <ErrorToast
        showErrorToast={showErrorToast}
        setShowErrorToast={setShowErrorToast}
        errorMessage={errorToastMessage}
      />
    </>
  );
};

export default ProfileCompletionModal;
