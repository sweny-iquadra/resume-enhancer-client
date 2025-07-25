
import React, { useState } from 'react';
import './App.css';

function App() {
  const [showResumeChat, setShowResumeChat] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
        <button
          onClick={() => setShowResumeChat(!showResumeChat)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            showResumeChat 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
          }`}
          title="Resume Enhancer"
        >
          <span className="text-lg">📄</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Dashboard */}
        <div className="flex-1">
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all cursor-pointer shadow-md animate-blink-glow" title="Resume Enhancer">
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
        </div>

        {/* Resume Enhancer Chat Interface */}
        {showResumeChat && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Chat Header */}
            <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📄</span>
                <span className="font-semibold">Resume Enhancer</span>
              </div>
              <button
                onClick={() => setShowResumeChat(false)}
                className="text-white hover:bg-purple-700 rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Welcome Message */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-purple-600 mb-2">
                  Welcome to iQua.AI Resume enhancer
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  iQua.ai helps you create resumes tailored to your skills, job roles, and sectors you've explored through our interviews.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Click the Create Resume button to let iQua build a resume uniquely designed for you!
                </p>
              </div>

              {/* Create Resume Button */}
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium">
                Create Resume
              </button>

              {/* Chat Input Area */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask me anything about resume building..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <span className="text-sm">→</span>
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
