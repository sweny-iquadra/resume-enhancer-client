
import React from 'react';

const Dashboard = ({ hasAttendedInterviews, profileComplete, onCreateResume, onAttendInterview, onViewHistory }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Resume Enhancer
        </h1>
        <p className="text-xl text-gray-600">
          Welcome! Let's create your perfect resume.
        </p>
      </div>

      {/* Interview Status Check */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Have you attended any interviews?
          </h2>
          
          {hasAttendedInterviews === null ? (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => onAttendInterview(true)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => onAttendInterview(false)}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                No
              </button>
            </div>
          ) : hasAttendedInterviews ? (
            <div className="text-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-semibold">Great! You have interview experience.</p>
              <p className="text-gray-600 mt-2">We'll check your profile completion and help you create a tailored resume.</p>
            </div>
          ) : (
            <div className="text-orange-600">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg font-semibold">No worries! Let's prepare you for interviews.</p>
              <p className="text-gray-600 mt-2 mb-4">We'll help you create a strong resume to land your first interview.</p>
              <button
                onClick={onCreateResume}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Attend Interview First!
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Cards */}
      {hasAttendedInterviews && (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Resume</h3>
              <p className="text-gray-600 mb-6">
                {profileComplete 
                  ? "Your profile is complete. Generate your resume now!" 
                  : "Complete your profile and generate a professional resume"
                }
              </p>
              <button
                onClick={onCreateResume}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {profileComplete ? "Generate Resume" : "Update Profile"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Resume History</h3>
              <p className="text-gray-600 mb-6">
                View, download, and regenerate your previous resumes
              </p>
              <button
                onClick={onViewHistory}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
