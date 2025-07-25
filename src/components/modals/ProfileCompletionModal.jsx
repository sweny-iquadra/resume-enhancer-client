
import React from 'react';

const ProfileCompletionModal = ({ showProfileModal, setShowProfileModal, userProfile }) => {
  if (!showProfileModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="text-white p-6 rounded-t-2xl text-center" style={{backgroundColor: '#3935cd'}}>
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

          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => {
                setShowProfileModal(false);
                // Navigate to profile completion page (future implementation)
                console.log('Navigate to profile completion');
              }}
              className="text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 50%, #7c69ef 100%)',
                boxShadow: '0 8px 25px rgba(57, 53, 205, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2d28b8 0%, #4a3dd4 50%, #6859db 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3935cd 0%, #5b4de8 50%, #7c69ef 100%)';
              }}
            >
              COMPLETE PROFILE
            </button>

            <button 
              onClick={() => setShowProfileModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
