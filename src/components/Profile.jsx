
import React, { useState } from 'react';
import Header from './Header';

const Profile = ({ setCurrentPage, showResumeChat, setShowResumeChat, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Active Interview');
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [isEditingProfessionalSummary, setIsEditingProfessionalSummary] = useState(false);
  const [tempProfessionalSummary, setTempProfessionalSummary] = useState('');
  const [skills, setSkills] = useState(['Angular']);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillError, setSkillError] = useState(false);

  const tabs = ['Active Interview', 'Education', 'Certificates'];

  const profileData = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'john-smith-developer'
  };

  const handleSaveSkill = () => {
    if (!selectedSkill) {
      setSkillError(true);
      return;
    }
    
    setSkillError(false);
    if (!skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
    }
    setSelectedSkill('');
    setIsEditingSkills(false);
  };

  const handleCancelSkillEdit = () => {
    setSelectedSkill('');
    setSkillError(false);
    setIsEditingSkills(false);
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        showResumeChat={showResumeChat}
        setShowResumeChat={setShowResumeChat}
        currentPage="profile"
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      {/* Page Title */}
      <div className="px-6 py-4" style={{ backgroundColor: '#6366f1' }}>
        <h1 className="text-white text-2xl font-medium">My Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6" style={{ backgroundColor: '#6366f1' }}>
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
                <h3 className="text-sm font-medium mb-3" style={{ color: '#9a9aff' }}>Professional Summary:</h3>
                
                {!isEditingProfessionalSummary ? (
                  /* View Mode */
                  <div className="relative bg-white rounded-lg shadow-md border border-gray-200 p-4 min-h-[120px]">
                    <button 
                      onClick={() => {
                        setIsEditingProfessionalSummary(true);
                        setTempProfessionalSummary(professionalSummary);
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    <div className="pr-8">
                      {professionalSummary ? (
                        <p className="text-gray-700 text-sm leading-relaxed">{professionalSummary}</p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">Click the edit icon to add your professional summary...</p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="relative bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <textarea
                      value={tempProfessionalSummary}
                      onChange={(e) => setTempProfessionalSummary(e.target.value)}
                      placeholder="Add your professional summary..."
                      className="w-full h-24 text-sm resize-none border-0 outline-none focus:ring-0 p-0 text-gray-700 leading-relaxed"
                      style={{ minHeight: '80px' }}
                    />
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setProfessionalSummary(tempProfessionalSummary);
                          setIsEditingProfessionalSummary(false);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setTempProfessionalSummary(professionalSummary);
                          setIsEditingProfessionalSummary(false);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                      >
                        <span className="text-lg">❌</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Skill Set */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium" style={{ color: '#7f90fa' }}>Skill Set:</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsEditingSkills(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <span className="text-lg">+</span>
                    </button>
                    <button 
                      onClick={() => setIsEditingSkills(!isEditingSkills)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <span className="text-sm">✏️</span>
                    </button>
                  </div>
                </div>

                {/* Edit mode - show skills with delete icons and Cancel/Save buttons */}
                {isEditingSkills ? (
                  <div className="space-y-3">
                    {/* Skills with delete icons */}
                    <div className="space-y-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md">
                          <span className="text-sm text-gray-800">{skill}</span>
                          <button 
                            onClick={() => handleRemoveSkill(index)}
                            className="text-red-500 hover:text-red-600 ml-2"
                          >
                            <span className="text-sm">❌</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Cancel and Save buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={handleCancelSkillEdit}
                        className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsEditingSkills(false)}
                        className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode - normal skills list */
                  <div className="space-y-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="px-3 py-2 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                    
                    {skills.length === 0 && (
                      <button 
                        onClick={() => setIsEditingSkills(true)}
                        className="w-full mt-3 py-2 text-center text-gray-400 hover:text-gray-600 text-sm"
                      >
                        + Add more skills
                      </button>
                    )}
                  </div>
                )}
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
                        Sure. My name is John Smith, and I'm a software developer 
                        specializing in building web applications using modern 
                        frameworks. I have strong experience in building 
                        reusable responsive UI components using JavaScript, 
                        React, TypeScript, and CSS frameworks. I also 
                        work with RESTful API integration and backend services.
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
