
import React from 'react';

const ResumeChat = ({ 
  showResumeChat, 
  setShowResumeChat, 
  hasAttendedInterview, 
  handleCreateResumeClick,
  showRoleSelection,
  uniqueRoles,
  handleRoleSelection,
  isLoading,
  enhancedResumeData,
  setShowPreview,
  setCurrentPage
}) => {
  if (!showResumeChat) return null;

  const handleEditProfile = () => {
    setCurrentPage('dashboard');
    setShowResumeChat(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col animate-fade-in">
        {/* Chat Header */}
        <div className="text-white p-4 rounded-t-2xl flex justify-between items-center" style={{background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 50%, #7c69ef 100%)'}}>
          <div className="flex items-center space-x-2">
            <span className="text-xl">📄</span>
            <span className="font-semibold">Resume Enhancer</span>
          </div>
          <button
            onClick={() => setShowResumeChat(false)}
            className="text-white hover:bg-black hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Chat Content with Full Scrolling */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 p-6">
          <div className="space-y-6">
            {/* Welcome Message */}
            {!showRoleSelection && !isLoading && !enhancedResumeData && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-semibold text-purple-600 mb-3">
                  Welcome to iQua.AI Resume enhancer
                </h3>
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  <p>1. iQua.ai helps you create resumes tailored to your skills, job roles, and sectors you've explored through our interviews.</p>
                  <p>2. Click the Create Resume button to let iQua build a resume uniquely designed for you!</p>
                </div>
              </div>
            )}

            {/* Role Selection Message */}
            {showRoleSelection && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-600 mb-3">
                    🎯 Multiple Roles Detected
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We noticed you've explored multiple job roles with iQua.ai. Please select the role you'd like us to tailor this resume for:
                  </p>
                  <div className="space-y-2">
                    {uniqueRoles.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleSelection(role)}
                        className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span className="font-medium text-blue-700">{role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Enhancing your resume...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {/* Enhanced Resume Results */}
            {enhancedResumeData && (
              <div className="space-y-4">
                {/* Success Message */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Resume Enhanced Successfully!
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Resume is enhanced with AI-powered improvements tailored for your selected role.
                  </p>
                </div>

                {/* Basic Details */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">📋 Basic Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {enhancedResumeData.basicDetails.name}</p>
                    <p><span className="font-medium">Email:</span> {enhancedResumeData.basicDetails.email}</p>
                    <p><span className="font-medium">Phone:</span> {enhancedResumeData.basicDetails.phone}</p>
                    <p><span className="font-medium">Location:</span> {enhancedResumeData.basicDetails.location}</p>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">💼 Professional Summary</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {enhancedResumeData.professionalSummary}
                  </p>
                </div>

                {/* Skills and Roles */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">🚀 Skills & Roles</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {enhancedResumeData.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {enhancedResumeData.roles.map((role, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tip Message */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700 mb-2">💡 Pro Tip</h4>
                  <p className="text-yellow-700 text-sm mb-3">
                    Add your missing details to improve your profile and stand out
                  </p>
                  <button
                    onClick={handleEditProfile}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Final Message */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-600 mb-3">
                    🎉 Your resume is ready!
                  </h3>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Preview & Compare
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons Container - Only show if not in special states */}
            {!showRoleSelection && !isLoading && !enhancedResumeData && (
              <div className="flex gap-4 items-center justify-center">
                {/* Create Resume Button */}
                <button 
                  onClick={handleCreateResumeClick}
                  className={`group relative overflow-hidden px-6 py-3.5 rounded-xl transition-all duration-500 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 min-w-[140px] ${
                    hasAttendedInterview 
                      ? 'text-white cursor-pointer border-indigo-300 hover:border-indigo-200 hover:-translate-y-1' 
                      : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-600 cursor-not-allowed border-gray-300 opacity-60'
                  }`}
                  style={hasAttendedInterview ? {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #5b4de8 30%, #7c3aed 70%, #8b5cf6 100%)',
                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3), 0 0 20px rgba(79, 70, 229, 0.1)',
                    filter: 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.2))'
                  } : {}}
                  disabled={!hasAttendedInterview}
                >
                  <span className="relative z-20 flex flex-col items-center justify-center space-y-1">
                    <span className="text-xl">{hasAttendedInterview ? '📄' : '🔒'}</span>
                    <span className="font-bold tracking-wider text-xs uppercase leading-tight">
                      CREATE<br/>RESUME
                    </span>
                  </span>
                  {hasAttendedInterview && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform rotate-45 transition-all duration-500"></div>
                    </>
                  )}
                </button>

                {/* Stylish Divider */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-gradient-to-t from-purple-300 via-purple-500 to-purple-700 rounded-full"></div>
                </div>

                {/* Attend Interview Button */}
                <button 
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setShowResumeChat(false);
                  }}
                  className={`group relative overflow-hidden px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 border-2 min-w-[140px] ${
                    !hasAttendedInterview
                      ? 'text-white cursor-pointer border-blue-300 hover:border-blue-200 hover:-translate-y-1'
                      : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-600 cursor-not-allowed border-gray-300 opacity-50'
                  }`}
                  style={!hasAttendedInterview ? {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                  } : {}}
                  disabled={hasAttendedInterview}
                >
                  <span className="relative z-20 flex flex-col items-center justify-center space-y-1 text-white">
                    <span className="text-xl">{!hasAttendedInterview ? '🎤' : '🔒'}</span>
                    <span className="font-bold tracking-wider text-xs uppercase leading-tight">
                      ATTEND<br/>INTERVIEW
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Chat Input Area - At bottom of scrollable content */}
          {!showRoleSelection && !isLoading && (
            <div className="mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything about resume building..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md">
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeChat;
