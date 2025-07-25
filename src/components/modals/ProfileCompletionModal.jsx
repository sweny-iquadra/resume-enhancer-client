
import React, { useState } from 'react';

const ProfileCompletionModal = ({ showProfileModal, setShowProfileModal, userProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!showProfileModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      setShowProfileModal(false);
    }
  };

  const simulateResumeGeneration = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to OpenAI backend
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      
      // Simulate successful response
      const enhancedProfile = {
        ...userProfile,
        professionalSummary: "Generated professional summary based on experience and skills",
        projects: "Enhanced project details with AI optimization",
        resumeEnhanced: true
      };
      
      // Show first success message
      setSuccessMessage("Resume is enhanced with all user profile detail and also updated your profile.");
      setShowSuccess(true);
      
      // After 2 seconds, show final message
      setTimeout(() => {
        setSuccessMessage("Your resume is ready!");
        
        // After another 2 seconds, close modal and trigger ResumeChat
        setTimeout(() => {
          setIsLoading(false);
          setShowSuccess(false);
          setShowProfileModal(false);
          // Trigger ResumeChat to show enhanced UI
          window.dispatchEvent(new CustomEvent('resumeReady'));
        }, 2000);
      }, 2000);
      
    } catch (error) {
      console.error('Resume generation failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Generating your resume...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we enhance your profile</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <p className="text-gray-700 font-medium text-lg leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="text-white p-6 rounded-t-2xl text-center relative" style={{backgroundColor: '#3935cd'}}>
          {/* Close X Button */}
          <button
            onClick={() => !isLoading && setShowProfileModal(false)}
            className={`absolute top-4 right-4 text-white rounded-full p-2 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:bg-opacity-20'
            }`}
            disabled={isLoading}
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
                if (!isLoading) {
                  setShowProfileModal(false);
                  // Redirect to dashboard
                  window.location.href = '/';
                }
              }}
              disabled={isLoading}
              className={`text-white px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold shadow-lg flex-1 max-w-[180px] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transform hover:scale-105'
              }`}
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

            {/* Generate Anyway Button - Secondary Action */}
            <button 
              onClick={simulateResumeGeneration}
              disabled={isLoading}
              className={`text-gray-700 border-2 border-gray-300 px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold flex-1 max-w-[180px] relative overflow-hidden ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105'
              }`}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#9ca3af';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <span className="relative z-10">GENERATE ANYWAY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
