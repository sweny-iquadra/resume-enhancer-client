import React, { useState } from 'react';
import { enhanceResumeAPI } from '../../utils/userProfile';

const ProfileCompletionModal = ({ 
  showProfileModal, 
  setShowProfileModal, 
  userProfile,
  selectedRole,
  setIsLoading,
  setEnhancedResumeData,
  showRoleSelection,
  setShowRoleSelection,
  uniqueRoles,
  handleRoleSelection,
  setShowSuccessToast
}) => {
  const [currentSelectedRole, setCurrentSelectedRole] = useState(selectedRole);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!showProfileModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowProfileModal(false);
    }
  };

  const handleGenerateAnyway = async () => {
    setIsGenerating(true);
    try {
      if (uniqueRoles.length >= 3) {
        setShowRoleSelection(true);
      } else {
        // Proceed with normal generation using the first available role or current selected role
        const roleToUse = currentSelectedRole || uniqueRoles[0] || userProfile.role;
        await proceedWithGeneration(roleToUse);
      }
    } finally {
      setIsGenerating(false);
    }
  };



  const proceedWithGeneration = async (roleToUse) => {
    try {
      setIsLoading(true);
      setShowProfileModal(false); // Close modal immediately when starting

      // Call the enhance resume API
      const response = await enhanceResumeAPI(roleToUse, userProfile);

      if (response.success) {
        // Store in localStorage
        localStorage.setItem('enhancedResumeData', JSON.stringify(response.data));

        // Update state
        setEnhancedResumeData(response.data.enhancedResume);
        
        // Show success toast
        if (setShowSuccessToast) {
          setShowSuccessToast(true);
        }
        
        // Ensure modal stays closed after successful generation
        // Do not reopen modal on success
      } else {
        // Only reopen modal on actual failure
        setShowProfileModal(true);
        alert('❌ Failed to enhance resume. Please try again or complete your profile for better results.');
      }
    } catch (error) {
      console.error('Error calling enhance resume API:', error);
      
      // Only reopen modal on error
      setShowProfileModal(true);
      alert('⚠️ An error occurred while enhancing your resume. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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
          {/* Close X Button */}
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>

          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold">Complete Your Profile</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          {!showRoleSelection ? (
            <>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Looks like you're almost there!
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Complete your profile to build a perfect resume tailored for you.
              </p>

              {/* Missing fields list */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Missing Information:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {!userProfile.professionalSummary && (
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span>Professional Summary</span>
                    </li>
                  )}
                  {!userProfile.projects && (
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span>Projects Information</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex flex-row gap-4 items-center justify-center">
                {/* Complete Profile Button - Primary Action */}
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    // Redirect to dashboard
                    window.location.href = '/';
                  }}
                  className="text-white px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 max-w-[180px]"
                  style={{
                    backgroundColor: '#3935cd',
                    boxShadow: '0 8px 25px rgba(57, 53, 205, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2d28b8';
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3935cd';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  COMPLETE PROFILE
                </button>

                {/* Stylish Vertical Divider */}
                <div className="flex items-center justify-center">
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Generate Resume Anyway Button - Secondary Action */}
                <button 
                  onClick={handleGenerateAnyway}
                  disabled={isGenerating}
                  className={`border-2 px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold flex-1 max-w-[180px] flex items-center justify-center space-x-2 ${
                    isGenerating 
                      ? 'text-gray-500 border-gray-200 bg-gray-50 cursor-not-allowed' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
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
            /* Role Selection View */
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-blue-600 mb-3 flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  Multiple Roles Detected
                </h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  We noticed you've explored multiple job roles with iQua.ai. Please select the role you'd like us to tailor this resume for:
                </p>

                {/* Dropdown Style Selection */}
                <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-sm">
                  <div className="p-3 bg-blue-50 border-b border-blue-200">
                    <span className="text-sm font-medium text-blue-700">Select Role:</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {uniqueRoles.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleSelection(role)}
                        className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                            {role}
                          </span>
                          <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <button 
                onClick={() => setShowRoleSelection(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors font-medium text-sm"
              >
                ← Back to Profile Completion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;