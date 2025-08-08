import React, { useState, useRef, useEffect } from "react";
import { checkDownloadEligibility } from "../utils/api";
import { checkProfileCompletion } from "../utils/userProfile";
import AlertModal from "./modals/AlertModal";

const ResumeChat = ({
  showResumeChat,
  setShowResumeChat,
  hasAttendedInterview,
  isCheckingInterviewStatus,
  handleCreateResumeClick,
  isLoading,
  enhancedResumeData,
  setShowPreview,
  setCurrentPage,
  setEnhancedResumeData,
  profileSummaryData,
  userProfile,
  handleResumeEnhancement
}) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info"
  });
  const chatContentRef = useRef(null);

  // Auto-scroll to bottom when enhancedResumeData changes
  useEffect(() => {
    if (enhancedResumeData && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [enhancedResumeData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.key === "Enter" &&
        hasAttendedInterview &&
        !isLoading &&
        !enhancedResumeData
      ) {
        e.preventDefault();
        handleCreateResumeWithFeedback();
      }
      if (e.key === "Escape") {
        setShowResumeChat(false);
      }
    };

    if (showResumeChat) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [
    showResumeChat,
    hasAttendedInterview,
    isLoading,
    enhancedResumeData,
  ]);

  if (!showResumeChat) return null;

  const handleEditProfile = () => {
    setShowResumeChat(false);
    setCurrentPage("profile");
  };

  const handleCreateResumeWithFeedback = async () => {
    // Check download eligibility before allowing resume generation
    try {
      const studentId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      const eligibilityResponse = await checkDownloadEligibility(studentId);

      if (!eligibilityResponse.is_eligible) {
        setAlertConfig({
          message: eligibilityResponse.message || "Download not allowed at this time.",
          type: "warning"
        });
        setShowAlert(true);
        return;
      }
    } catch (error) {
      console.error("Error checking download eligibility:", error);
      setAlertConfig({
        title: "Error",
        message: "Could not check download eligibility. Please try again later.",
        type: "error"
      });
      setShowAlert(true);
      return; // Stop if there's an error checking eligibility
    }

    // Check if user profile is complete before proceeding
    if (!checkProfileCompletion(userProfile)) {
      setShowProfileCompletion(true); // Show profile completion message
      return; // Stop the function here if profile is not complete
    }


    setIsButtonLoading(true);
    try {
      await handleCreateResumeClick();
    } catch (error) {
      console.error("Error in resume creation:", error);
      alert(
        "⚠️ Something went wrong while creating your resume. Please try again.",
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCreateResumeAnyway = async () => {
    setShowProfileCompletion(false); // Hide the completion message
    setIsGenerating(true);
    try {
      await handleResumeEnhancement(); // Same action as ProfileCompletionModal
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };




  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-[420px] h-[580px] flex flex-col transition-all duration-300 ease-out transform hover:scale-[1.01] border border-gray-100"
        style={{
          animation: "slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Clean Header */}
        <div className="p-5 rounded-t-2xl flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Smart Resume Builder
              </h3>
              <p className="text-indigo-100 text-xs">
                Create tailored resumes instantly
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowResumeChat(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          ref={chatContentRef}
        >
          <div className="p-6 space-y-6 relative">
            {/* Show only loading state when generating */}
            {(isLoading || isGenerating) ? (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-lg animate-fade-in">
                {/* Header with gradient matching the chat header */}
                <div
                  className="text-white p-4 rounded-xl text-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                  }}
                >
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                  <h3 className="text-lg font-semibold">Generating Resume</h3>
                  <p className="text-sm opacity-90 mt-1">Powered by iQua AI</p>
                </div>

                {/* Enhanced Progress Animation */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 shadow-inner">
                  <div
                    className="h-2 rounded-full relative overflow-hidden"
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
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce shadow-lg"
                      style={{
                        backgroundColor: '#7f90fa',
                        animationDelay: '0ms',
                        boxShadow: '0 0 8px rgba(127, 144, 250, 0.5)'
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce shadow-lg"
                      style={{
                        backgroundColor: '#6366f1',
                        animationDelay: '200ms',
                        boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)'
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce shadow-lg"
                      style={{
                        backgroundColor: '#7c69ef',
                        animationDelay: '400ms',
                        boxShadow: '0 0 8px rgba(124, 105, 239, 0.5)'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    🤖 iQua AI is crafting your perfect resume
                  </p>
                  {/* <p className="text-gray-600 text-xs">
                    Analyzing your profile and tailoring content to your career goals
                  </p> */}
                </div>

                <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-700">
                    <div className="relative">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-75"></span>
                    </div>
                    <span className="font-medium">AI is analyzing your unique profile</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Status Overview - Always visible when not loading */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 relative">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">📊</span>
                    Your Progress
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Interview Status
                      </span>
                      {isCheckingInterviewStatus ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <span className="text-xs text-blue-600">
                            Checking...
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${hasAttendedInterview
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {hasAttendedInterview ? "✓ Completed" : "Pending"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Completion Message - Shown if profile is not complete */}
                {showProfileCompletion && !enhancedResumeData && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-indigo-700">
                          Almost there!
                        </h3>
                        <p className="text-indigo-600 text-sm">
                          Looks like you're almost there! Complete your profile to build a perfect resume tailored for your career goals.
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleEditProfile}
                        className="flex-1 bg-white text-indigo-700 py-2 px-4 rounded-xl font-semibold border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 shadow-sm transform hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>✏️</span>
                          <span>COMPLETE PROFILE</span>
                        </span>
                      </button>
                      <button
                        onClick={handleCreateResumeAnyway}
                        className="flex-1 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                        style={{
                          background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #6d7df7 0%, #5856eb 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)';
                        }}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>🚀</span>
                          <span>GENERATE ANYWAY</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Instructions - Always visible when not loading */}
                {!enhancedResumeData && !showProfileCompletion && (
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      How it works
                    </h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          1
                        </span>
                        <p>Complete an interview to unlock the resume builder</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          2
                        </span>
                        <p>AI analyzes your profile and interview responses</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          3
                        </span>
                        <p>
                          Get a tailored resume optimized for your target role
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success State - Additional content when resume is generated */}
                {enhancedResumeData && (
                  <div className="space-y-6">
                    {/* Success Message */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-700">
                            Resume Ready!
                          </h3>
                          <p className="text-green-600 text-sm">
                            Your AI-enhanced resume has been generated successfully
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Footer - Always show after login */}
        {!showProfileCompletion && !(isLoading || isGenerating) && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {isCheckingInterviewStatus ? (
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                <span className="text-gray-600 font-medium">
                  Checking interview status...
                </span>
              </div>
            ) : enhancedResumeData ? (
              // Show Preview, Edit Info, and Enhance Again buttons only when resume is generated
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    setIsPreviewLoading(false);
                    setShowPreview(true);
                  }}
                  disabled={isPreviewLoading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg transform ${isPreviewLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "text-white hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  style={!isPreviewLoading ? {
                    background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                  } : {}}
                  onMouseEnter={(e) => {
                    if (!isPreviewLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #6d7df7 0%, #5856eb 100%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPreviewLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)';
                    }
                  }}
                >
                  {isPreviewLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2" style={{ color: 'white' }}>
                      <span>👁️</span>
                      <span>Preview Resume</span>
                    </span>
                  )}
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>📝</span>
                      <span>Edit Info</span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setEnhancedResumeData(null);
                      localStorage.removeItem("parsedResumeData");
                      localStorage.removeItem("profileSummaryData");
                    }}
                    className="flex-1 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #6d7df7 0%, #5856eb 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)';
                    }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>✨</span>
                      <span>Enhance Again</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              // Always show Enhance Resume button after login
              <>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateResumeWithFeedback}
                    disabled={!hasAttendedInterview || isButtonLoading}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${hasAttendedInterview && !isButtonLoading
                      ? "text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    style={hasAttendedInterview && !isButtonLoading ? {
                      background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                    } : {}}
                    onMouseEnter={(e) => {
                      if (hasAttendedInterview && !isButtonLoading) {
                        e.target.style.background = 'linear-gradient(135deg, #6d7df7 0%, #5856eb 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasAttendedInterview && !isButtonLoading) {
                        e.target.style.background = 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)';
                      }
                    }}
                  >
                    {isButtonLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Enhancing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>✨</span>
                        <span>Enhance Resume</span>
                      </span>
                    )}
                  </button>

                  {!hasAttendedInterview && (
                    <button
                      onClick={() => {
                        setCurrentPage("dashboard");
                        setShowResumeChat(false);
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      style={{
                        background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)'
                      }}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>🎤</span>
                        <span>Attend Interview</span>
                      </span>
                    </button>
                  )}
                </div>

                {!hasAttendedInterview && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Complete an interview to unlock resume creation
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
      />
    </div>
  );
};

export default ResumeChat;