
import React from 'react';

const Dashboard = ({ 
  onResumeEnhancerClick, 
  onViewHistory, 
  hasAttendedInterviews,
  profileComplete 
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to iQua AI Resume Builder
        </h1>
        <p className="text-xl text-gray-600">
          Create professional resumes tailored to your interview experience
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Resume Enhancer - Main Entry Point */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 relative">
          <div className="absolute top-4 right-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              Primary
            </span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Resume Enhancer</h3>
            <p className="text-gray-600 mb-6">
              Start your journey to create the perfect resume based on your interview experience
            </p>
            <button
              onClick={onResumeEnhancerClick}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Resume History */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Resume History</h3>
            <p className="text-gray-600 mb-6">
              View, download, and regenerate your previous resumes (Last 5)
            </p>
            <button
              onClick={onViewHistory}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View History
            </button>
          </div>
        </div>

        {/* Daily Limit Status */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Daily Status</h3>
            <p className="text-gray-600 mb-4">
              Check your daily generation limit and progress
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Daily Limit: 3 resumes per day</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Limit resets every 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Interview Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              hasAttendedInterviews === true ? 'bg-green-100' : 
              hasAttendedInterviews === false ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 ${
                hasAttendedInterviews === true ? 'text-green-600' : 
                hasAttendedInterviews === false ? 'text-red-600' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Interview Status</h4>
              <p className={`text-sm ${
                hasAttendedInterviews === true ? 'text-green-600' : 
                hasAttendedInterviews === false ? 'text-red-600' : 'text-gray-600'
              }`}>
                {hasAttendedInterviews === true ? 'You have attended interviews' : 
                 hasAttendedInterviews === false ? 'No interviews attended yet' : 'Status pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              profileComplete ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <svg className={`w-6 h-6 ${
                profileComplete ? 'text-green-600' : 'text-orange-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Profile Status</h4>
              <p className={`text-sm ${profileComplete ? 'text-green-600' : 'text-orange-600'}`}>
                {profileComplete ? 'Profile complete' : 'Profile incomplete'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Click Resume Enhancer</h4>
                <p className="text-gray-600 text-sm">Start by clicking the Resume Enhancer button above</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Answer Questions</h4>
                <p className="text-gray-600 text-sm">Tell us about your interview experience and complete your profile</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Generate Resume</h4>
                <p className="text-gray-600 text-sm">Get your tailored resume and download in multiple formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
