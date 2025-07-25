
import React from 'react';

const ProfileCompletionModal = ({ showProfileModal, setShowProfileModal, userProfile }) => {
  if (!showProfileModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowProfileModal(false);
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

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            {/* Complete Profile Button - Primary Action */}
            <button 
              onClick={() => {
                setShowProfileModal(false);
                // Redirect to dashboard
                window.location.href = '/';
              }}
              className="text-white px-8 py-3.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto min-w-[160px]"
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

            {/* Stylish Divider */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <div className="text-gray-400 text-xs font-medium py-1">OR</div>
              <div className="w-px h-8 bg-gradient-to-t from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Generate Anyway Button - Secondary Action */}
            <button 
              onClick={() => {
                setShowProfileModal(false);
                // Generate resume with existing data
                console.log('Generating resume with existing data...');
              }}
              className="text-gray-700 border-2 border-gray-300 px-8 py-3.5 rounded-xl transition-all duration-300 font-semibold hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 w-full sm:w-auto min-w-[160px] relative overflow-hidden"
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'scale(1)';
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
