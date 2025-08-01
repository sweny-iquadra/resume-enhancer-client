import React, { useState, useRef, useEffect } from "react";
import { fetchParsedResumeData } from "../utils/api";

const ResumeChat = ({
  showResumeChat,
  setShowResumeChat,
  hasAttendedInterview,
  isCheckingInterviewStatus,
  handleCreateResumeClick,
  showRoleSelection,
  setShowRoleSelection,
  uniqueRoles,
  handleRoleSelection,
  isLoading,
  enhancedResumeData,
  setShowPreview,
  setCurrentPage,
  setEnhancedResumeData,
  setSelectedRole,
}) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedRoleForFeedback, setSelectedRoleForFeedback] = useState(null);
  const [profileSummaryData, setProfileSummaryData] = useState(null);
  const chatContentRef = useRef(null);

  // Load Profile Summary data from localStorage
  useEffect(() => {
    const storedProfileSummary = localStorage.getItem("profileSummaryData");
    console.log("🔍 Profile Summary from localStorage:", storedProfileSummary);
    
    if (storedProfileSummary) {
      try {
        const parsed = JSON.parse(storedProfileSummary);
        console.log("✅ Parsed Profile Summary data:", parsed);
        setProfileSummaryData(parsed);
      } catch (error) {
        console.error("❌ Error parsing stored profile summary data:", error);
      }
    } else {
      console.log("⚠️ No Profile Summary data found in localStorage");
      
      // Add mock Profile Summary data for testing when enhanced resume data exists
      if (enhancedResumeData) {
        const mockProfileSummary = {
          enhanced: [
            "Experienced Software Developer with 3+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
            "Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.",
            "Strong problem-solving skills with experience in agile methodologies and modern development practices."
          ]
        };
        console.log("🚀 Setting mock Profile Summary data:", mockProfileSummary);
        localStorage.setItem("profileSummaryData", JSON.stringify(mockProfileSummary));
        setProfileSummaryData(mockProfileSummary);
      }
    }
  }, [enhancedResumeData]);

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
        !enhancedResumeData &&
        !showRoleSelection
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
    showRoleSelection,
  ]);

  if (!showResumeChat) return null;

  const handleEditProfile = () => {
    setShowResumeChat(false);
    setCurrentPage("profile");
  };

  const handleCreateResumeWithFeedback = async () => {
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

  const handleRoleSelectionWithFeedback = (role) => {
    setSelectedRoleForFeedback(role);
    setTimeout(() => {
      handleRoleSelection(role);
      setSelectedRoleForFeedback(null);
    }, 150);
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Resume Assistant
              </h3>
              <p className="text-indigo-100 text-xs">
                AI-powered resume enhancement
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
            {/* Loading Overlay when generating */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center border border-indigo-100 shadow-lg">
                  <div className="relative mb-6">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                  <h3 className="text-indigo-700 font-semibold text-lg mb-2">
                    Creating Your Resume
                  </h3>
                  <p className="text-indigo-600 text-sm">
                    Our AI is analyzing your profile and crafting the
                    perfect resume...
                  </p>
                  <div className="flex justify-center space-x-1 mt-4">
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Overview - Always visible */}
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
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        hasAttendedInterview
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {hasAttendedInterview ? "✓ Completed" : "Pending"}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Explored Roles
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {uniqueRoles.length} role{uniqueRoles.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions - Always visible */}
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

                {/* Profile Summary - Before Preview Resume button */}
                {console.log("🎯 Current profileSummaryData state:", profileSummaryData)}
                {profileSummaryData &&
                  profileSummaryData.enhanced.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm">📝</span>
                        </div>
                        <h4 className="font-semibold text-indigo-900 text-lg">
                          Profile Summary
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {profileSummaryData.enhanced.map((summary, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm"
                          >
                            <p className="text-gray-800 leading-relaxed text-sm font-medium">
                              {summary}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-indigo-200">
                        <p className="text-xs text-indigo-600 italic">
                          ✨ AI-generated professional summary tailored for your target role
                        </p>
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      setIsPreviewLoading(false);
                      setShowPreview(true);
                    }}
                    disabled={isPreviewLoading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg transform ${
                      isPreviewLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  >
                    {isPreviewLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                        <span>Loading...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
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
                        setShowRoleSelection(false);
                        setSelectedRole(null);
                        localStorage.removeItem("parsedResumeData");
                        localStorage.removeItem("profileSummaryData");
                      }}
                      className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>✨</span>
                        <span>Enhance Again</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        {!enhancedResumeData && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {isCheckingInterviewStatus ? (
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                <span className="text-gray-600 font-medium">
                  Checking interview status...
                </span>
              </div>
            ) : (
              <>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateResumeWithFeedback}
                    disabled={!hasAttendedInterview || isButtonLoading}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      hasAttendedInterview && !isButtonLoading
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
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
    </div>
  );
};

export default ResumeChat;
