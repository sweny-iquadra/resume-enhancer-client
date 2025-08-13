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
    setShowResumeChat
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
      return;
    }

    // Check if user profile is complete before proceeding
    if (!checkProfileCompletion(userProfile)) {
      setShowProfileCompletion(true);
      return;
    }

    setIsButtonLoading(true);
    try {
      await handleCreateResumeClick();
    } catch (error) {
      console.error("Error in resume creation:", error);
      alert("⚠️ Something went wrong while creating your resume. Please try again.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCreateResumeAnyway = async () => {
    setShowProfileCompletion(false);
    setIsGenerating(true);
    try {
      await handleResumeEnhancement();
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={[
          "w-[420px] h-[580px] flex flex-col rounded-2xl transition-all duration-300 ease-out",
          "hover:scale-[1.01] border bg-neutral-900 border-neutral-800 shadow-2xl"
        ].join(" ")}
        style={{ animation: "slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header — brand gradient primary → accent */}
        <div className="p-5 rounded-t-2xl flex justify-between items-center bg-gradient-to-br from-primary to-accent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h3 className="font-dmsans text-white font-semibold text-lg">
                Smart Resume Builder
              </h3>
              <p className="text-neutral-200 text-sm font-medium">
                Create tailored resumes instantly
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowResumeChat(false)}
            className="text-white hover:bg-white/15 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          ref={chatContentRef}
        >
          <div className="p-6 space-y-6 relative">
            {(isLoading || isGenerating) ? (
              /* Loading / Generating */
              <div className="rounded-xl p-6 border bg-neutral-900 border-neutral-800 shadow-card animate-fade-in">
                {/* Progress header in brand gradient */}
                <div className="text-white p-4 rounded-xl text-center mb-4 bg-gradient-to-br from-primary to-accent">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                  <h3 className="font-dmsans text-lg font-semibold">Generating Resume</h3>
                  <p className="caption opacity-90 mt-1">Powered by iQua AI</p>
                </div>

                {/* Progress bar */}
                <div className="w-full rounded-full h-2 mb-4 bg-neutral-800 shadow-inner">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.6s_infinite]"></div>
                  </div>
                </div>

                {/* Status line */}
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>

                <p className="text-neutral-200 text-sm font-medium">
                  🤖 Qua AI is generating your resume. This may take a few moments
                  while we tailor your resume to your most relevant job role and skills.
                </p>

                <div className="mt-4 rounded-lg p-3 border bg-neutral-900 border-neutral-800">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">AI is analyzing your unique profile</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Status Overview */}
                <div className="rounded-xl p-5 border bg-neutral-900 border-neutral-800 relative">
                  <h4 className="font-dmsans font-semibold text-neutral-100 mb-4 flex items-center">
                    <span className="text-xl mr-2">📊</span>
                    Your Progress
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="caption text-neutral-300">Interview Status</span>
                      {isCheckingInterviewStatus ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          <span className="text-xs text-primary">Checking...</span>
                        </div>
                      ) : (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium border ${hasAttendedInterview
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-secondary/15 text-secondary border-secondary/30"
                            }`}
                        >
                          {hasAttendedInterview ? "✓ Completed" : "Pending"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Completion Prompt */}
                {showProfileCompletion && !enhancedResumeData && (
                  <div className="rounded-xl p-5 border bg-neutral-900 border-neutral-800">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">💡</div>
                      <div>
                        <h3 className="font-dmsans font-semibold text-neutral-100">Looks like you're almost there!</h3>
                        <p className="caption text-neutral-300">
                          Complete your profile to build a perfect resume tailored for you.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleEditProfile}
                        className="flex-1 btn btn-secondary rounded-2xl"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>✏️</span>
                          <span>COMPLETE PROFILE</span>
                        </span>
                      </button>
                      <button
                        onClick={handleCreateResumeAnyway}
                        className="flex-1 btn grad-cta text-white rounded-2xl shadow-button hover:brightness-110 active:brightness-95"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>🚀</span>
                          <span>GENERATE ANYWAY</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {!hasAttendedInterview && (
                  <div className="rounded-xl p-5 border bg-neutral-900 border-neutral-800">
                    <h4 className="font-dmsans text-white font-semibold text-lg">How it works</h4>
                    <div className="space-y-3 caption text-neutral-300">
                      <div className="text-neutral-200 text-sm font-medium">
                        <p>Take your first step by attending an interview, and let iQua help you build a resume for your
                          preferred job role!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {enhancedResumeData && (
                  <div className="space-y-6">
                    <div className="rounded-xl p-5 border bg-green-500/10 border-green-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <h3 className="font-dmsans font-semibold text-green-400">Resume Ready!</h3>
                          <p className="text-green-300 text-sm font-medium">
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

        {/* Action Footer */}
        {!showProfileCompletion && !(isLoading || isGenerating) && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-900 rounded-b-2xl">
            {isCheckingInterviewStatus ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-neutral-300 font-medium">Checking interview status...</span>
              </div>
            ) : enhancedResumeData ? (
              <div className="space-y-3">
                {/* Preview Resume */}
                <button
                  onClick={async () => {
                    setIsPreviewLoading(false);
                    setShowPreview(true);
                  }}
                  disabled={isPreviewLoading}
                  className={[
                    "w-full py-3 px-6 rounded-2xl font-semibold transition-all shadow-lg",
                    isPreviewLoading
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "grad-cta text-white hover:brightness-110 active:brightness-95"
                  ].join(" ")}
                >
                  {isPreviewLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>👁️</span>
                      <span>Preview Resume</span>
                    </span>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 btn btn-secondary rounded-2xl"
                  >
                    <span className="flex items-center justify-center gap-2">
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
                    className="flex-1 btn grad-cta text-white rounded-2xl shadow-button hover:brightness-110 active:brightness-95"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>✨</span>
                      <span>Enhance Again</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  {/* Enhance Resume (uses iQua tokens) */}
                  <button
                    onClick={handleCreateResumeWithFeedback}
                    disabled={!hasAttendedInterview || isButtonLoading}
                    className={[
                      "flex-1 py-3 px-6 rounded-2xl font-semibold transition-all",
                      hasAttendedInterview && !isButtonLoading
                        ? "grad-cta text-white shadow-lg hover:brightness-110 active:brightness-95"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    ].join(" ")}
                  >
                    {isButtonLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Enhancing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
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
                      className="flex-1 btn grad-cta text-white rounded-2xl shadow-button hover:brightness-110 active:brightness-95"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>🎤</span>
                        <span>Attend Interview</span>
                      </span>
                    </button>
                  )}
                </div>

                {!hasAttendedInterview && (
                  <p className="text-center text-xs text-neutral-400 mt-3">
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
