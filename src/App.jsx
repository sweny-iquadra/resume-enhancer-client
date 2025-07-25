import React, { useState } from 'react';
import './App.css';

function App() {
  const [showResumeChat, setShowResumeChat] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'interview'

  // Mock data - replace with actual API call to check interview attendance
  const [hasAttendedInterview, setHasAttendedInterview] = useState(true);

  const handleCreateResumeClick = () => {
    if (!hasAttendedInterview) {
      setShowInterviewModal(true);
    } else {
      // Handle resume creation logic here
      console.log('Creating resume...');
    }
  };

  const navigateToInterview = () => {
    setCurrentPage('interview');
    setShowInterviewModal(false);
    setShowResumeChat(false);
  };

  const features = [
    {
      id: 1,
      title: 'My Profile',
      icon: '👤',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'My Interviews',
      icon: '👥',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      title: 'Book SME',
      icon: '📊',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Job Tracker',
      icon: '🏆',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Dashboard */}
        <div className="flex-1">
          {currentPage === 'dashboard' && (
            <>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">iQ</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">iQua.ai</span>
                  <span className="text-xs text-gray-500 -mt-1">AI that gets you</span>
                </div>
              </div>

              {/* Resume Enhancer Icon & User Profile */}
              <div className="flex items-center space-x-4">
                <div 
                  onClick={() => setShowResumeChat(!showResumeChat)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:shadow-lg transition-all cursor-pointer shadow-md animate-pulse" 
                  style={{
                    background: '#3935cd',
                    animation: 'blink-glow-custom 1.5s ease-in-out infinite'
                  }}
                  title="Resume Enhancer"
                >
                  <span className="text-white text-base font-medium">📄</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium text-sm">John Smith</span>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-xs">👤</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

      {/* Main Content */}
          <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
            <div className="max-w-6xl w-full">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Side - Illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Main circular background */}
                    <div className="w-96 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full relative overflow-hidden flex items-center justify-center">
                      {/* People figures */}
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-16 bg-orange-400 rounded-t-full relative">
                          <div className="w-6 h-6 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-16 left-12">
                        <div className="w-10 h-14 bg-blue-600 rounded-t-full relative">
                          <div className="w-5 h-5 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-16 right-12">
                        <div className="w-10 h-14 bg-orange-500 rounded-t-full relative">
                          <div className="w-5 h-5 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                      </div>

                      {/* Puzzle pieces in center */}
                      <div className="flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-md"></div>
                          <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-md"></div>
                          <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-md"></div>
                          <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-md"></div>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute bottom-4 left-8">
                        <div className="w-6 h-8 bg-green-400 rounded-t-full"></div>
                      </div>
                      <div className="absolute bottom-4 right-8">
                        <div className="w-4 h-6 bg-green-400 rounded-t-full"></div>
                      </div>

                      {/* Background shapes */}
                      <div className="absolute top-16 left-16 w-16 h-16 bg-blue-200 rounded-lg transform rotate-12 opacity-60"></div>
                      <div className="absolute top-20 right-20 w-12 h-12 bg-orange-200 rounded-lg transform -rotate-12 opacity-60"></div>
                      <div className="absolute bottom-20 left-20 w-8 h-8 bg-purple-200 rounded-lg transform rotate-45 opacity-60"></div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Navigation Cards */}
                <div className="grid grid-cols-2 gap-6">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className={`${feature.bgColor} ${feature.borderColor} border-2 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1`}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="font-medium text-lg text-blue-600">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
            </>
          )}

          {currentPage === 'interview' && (
            <>
              {/* Interview Page Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  {/* Logo */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">iQ</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">iQua.ai Interview</span>
                      <span className="text-xs text-gray-500 -mt-1">AI that gets you</span>
                    </div>
                  </div>

                  {/* Back to Dashboard Button */}
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <span className="text-lg">←</span>
                    <span className="font-medium">Back to Dashboard</span>
                  </button>
                </div>
              </header>

              {/* Interview Page Content */}
              <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="max-w-4xl w-full text-center">
                  <div className="bg-white rounded-2xl shadow-lg p-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <span className="text-4xl text-white">🎤</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                      Welcome to iQua.AI Interview
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      Get ready for your personalized interview experience. Our AI will assess your skills, 
                      experience, and career goals to help you build the perfect resume.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-xl">💼</span>
                        </div>
                        <h3 className="font-semibold text-blue-600 mb-2">Career Assessment</h3>
                        <p className="text-sm text-gray-600">Evaluate your professional background and goals</p>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-xl">🧠</span>
                        </div>
                        <h3 className="font-semibold text-purple-600 mb-2">Skills Analysis</h3>
                        <p className="text-sm text-gray-600">Identify your strengths and areas for growth</p>
                      </div>

                      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-xl">📄</span>
                        </div>
                        <h3 className="font-semibold text-green-600 mb-2">Resume Building</h3>
                        <p className="text-sm text-gray-600">Create tailored resumes for your target roles</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        // Mark interview as attended and go back to dashboard
                        setHasAttendedInterview(true);
                        setCurrentPage('dashboard');
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Start Interview
                    </button>
                  </div>
                </div>
              </main>
            </>
          )}
        </div>

        {/* Resume Enhancer Chat Overlay */}
        {showResumeChat && (
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
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-semibold text-purple-600 mb-3">
                      Welcome to iQua.AI Resume enhancer
                    </h3>
                    <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                      <p>1. iQua.ai helps you create resumes tailored to your skills, job roles, and sectors you've explored through our interviews.</p>
                      <p>2. Click the Create Resume button to let iQua build a resume uniquely designed for you!</p>
                    </div>
                  </div>

                  {/* Action Buttons Container - Enhanced Creative Styling */}
                  <div className="flex gap-4 items-center justify-center">
                    {/* Create Resume Button */}
                    <button 
                      onClick={handleCreateResumeClick}
                      className={`group relative overflow-hidden px-6 py-3.5 rounded-xl transition-all duration-500 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 min-w-[140px] ${
                        hasAttendedInterview 
                          ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 cursor-pointer border-emerald-300 hover:border-emerald-200 hover:-translate-y-1' 
                          : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-600 cursor-not-allowed border-gray-300 opacity-60'
                      }`}
                      style={hasAttendedInterview ? {
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.1)',
                        filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2))'
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

                    {/* Attend Interview Button - Disabled */}
                    <button 
                      disabled={true}
                      className="group relative overflow-hidden px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 border-2 border-gray-300 backdrop-blur-sm cursor-not-allowed min-w-[140px] opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                        boxShadow: '0 4px 10px rgba(107, 114, 128, 0.2)'
                      }}
                    >
                      <span className="relative z-20 flex flex-col items-center justify-center space-y-1 text-white">
                        <span className="text-xl">🔒</span>
                        <span className="font-bold tracking-wider text-xs uppercase leading-tight">
                          ATTEND<br/>INTERVIEW
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* Chat Messages would go here in the future */}
                  <div className="space-y-4">
                    {/* Placeholder for future chat messages */}
                  </div>
                </div>

                {/* Chat Input Area - At bottom of scrollable content */}
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
              </div>
            </div>
          </div>
        )}

        {/* Interview Requirement Modal */}
        {showInterviewModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold">Interview Required</h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-center">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Take your first step by attending an interview, and let iQua help you build a resume for your preferred job role!
                </p>

                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={navigateToInterview}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    ATTEND INTERVIEW
                  </button>

                  <button 
                    onClick={() => setShowInterviewModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;