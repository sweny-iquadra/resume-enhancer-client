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
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
          {/* Modal Header */}
          <div
            className="text-white p-6 rounded-t-2xl text-center relative"
            style={{
              background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
            }}
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>

            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold">Complete Your Profile</h3>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {!showSuccessContent ? (
              <>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Looks like you're almost there!
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  Complete your profile to build a perfect resume tailored for your career goals.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {/* Complete Profile Button - Primary Action */}
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setCurrentPage('profile');
                    }}
                    className="text-white py-3.5 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                    style={{
                      background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                    }}
                  >
                    <span>📝</span>
                    <span>COMPLETE PROFILE</span>
                  </button>

                  {/* Generate Resume Anyway Button - Secondary Action */}
                  <button
                    onClick={handleGenerateAnyway}
                    disabled={isGenerating}
                    className={`border-2 px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold flex-1 max-w-[180px] flex items-center justify-center space-x-2 mx-auto ${isGenerating
                      ? "text-gray-500 border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span>GENERATING...</span>
                      </>
                    ) : (
                      <span>GENERATE ANYWAY</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-green-600">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Resume Generated!</h4>
                <p className="text-gray-600 mb-4">Your enhanced resume is ready for review.</p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowPreview(true);
                      setShowProfileModal(false);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Resume
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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