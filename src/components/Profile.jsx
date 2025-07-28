
import React, { useState } from 'react';

const Profile = ({ setCurrentPage, showResumeChat, setShowResumeChat, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Active Interview');
  const [professionalSummary, setProfessionalSummary] = useState('');

  const tabs = ['Active Interview', 'Education', 'Certificates'];

  const profileData = {
    name: 'Sweny Patel',
    email: 'sweny09@gmail.com',
    phone: '3082028481',
    linkedin: 'SwenyPatel_Angular13FrontendDeveloper_Res'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#6366f1' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-transparent">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-sm font-bold">iQ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">iQua.ai</span>
            <span className="text-xs text-white opacity-70 -mt-1">AI that gets you</span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium text-sm">Sweny Patel</span>
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">👤</span>
          </div>
          <button
            onClick={onLogout}
            className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            title="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="px-6 pb-4">
        <h1 className="text-white text-2xl font-medium">My Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm" style={{ minHeight: '600px' }}>
          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-80 p-6 border-r border-gray-200">
              {/* Profile Info */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">{profileData.name}</h2>
                
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-xl">👤</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">✉️</span>
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📞</span>
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <span className="w-4 h-4 mr-2">🔗</span>
                    <span className="truncate">{profileData.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-blue-600 mb-3">Professional Summary</h3>
                <div className="relative">
                  <textarea
                    value={professionalSummary}
                    onChange={(e) => setProfessionalSummary(e.target.value)}
                    placeholder="Add your professional summary..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    <span className="text-sm">✏️</span>
                  </button>
                </div>
              </div>

              {/* Skill Set */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-600">Skill Set</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <span className="text-lg">+</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Angular</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="text-xs">✏️</span>
                    </button>
                  </div>
                </div>
                
                <button className="w-full mt-3 py-2 text-center text-gray-400 hover:text-gray-600 text-sm">
                  + Add more skills
                </button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors rounded-t-lg ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700 bg-transparent'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'Active Interview' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Self Introduction Video */}
                  <div>
                    <div className="bg-gray-800 rounded-lg relative mb-4" style={{ aspectRatio: '16/9' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white text-2xl">▶️</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-xs">
                        0:00 / 0:51
                      </div>
                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">🔊</span>
                        </button>
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">⚙️</span>
                        </button>
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">⋮</span>
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-800 text-center mb-2">Self Introduction</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-xs font-medium text-gray-600 mb-2">Self Introduction Transcript</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Sure. My name is Vadim Patel, and I'm a first-time developer 
                        specializing in building the web application using Angular 
                        framework. In Angular, I have strong experience in building the 
                        reusable responsive UI components using the TypeScript, 
                        Bootstrap, Angular material, prime control, and flex layout. I also 
                        work with the RESTful API integration to talk with the back-end
                      </p>
                    </div>
                  </div>

                  {/* Technical Interview Video */}
                  <div>
                    <div className="bg-gray-800 rounded-lg relative mb-4" style={{ aspectRatio: '16/9' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white text-2xl">▶️</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-xs">
                        0:00 / 26:20
                      </div>
                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">🔊</span>
                        </button>
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">⚙️</span>
                        </button>
                        <button className="text-white hover:text-gray-300">
                          <span className="text-sm">⋮</span>
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-800 text-center mb-4">Technical Interview</h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-medium text-gray-600">Skill Set</h5>
                        <div className="flex items-center">
                          <div className="w-12 h-12 relative mr-2">
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-blue-600"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray="66.67, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">68.33%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Angular</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Education' && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Education information will be displayed here</p>
                </div>
              )}

              {activeTab === 'Certificates' && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Certificates will be displayed here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
