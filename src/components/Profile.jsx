
import React, { useState } from 'react';
import Header from './Header';

const Profile = ({ setCurrentPage, showResumeChat, setShowResumeChat, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Active Interview');
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [isEditingProfessionalSummary, setIsEditingProfessionalSummary] = useState(false);
  const [tempProfessionalSummary, setTempProfessionalSummary] = useState('');
  const [skills, setSkills] = useState(['Angular', '3D-Printing']);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillError, setSkillError] = useState(false);
  const [tempSkills, setTempSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [educationForm, setEducationForm] = useState({
    qualification: '',
    academy: '',
    field: '',
    score: '',
    scoreType: 'cgpa',
    startDate: '',
    endDate: ''
  });
  const [educationErrors, setEducationErrors] = useState({});

  // Available skills for dropdown
  const availableSkills = [
    'React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js', 
    'Python', 'Java', 'C++', 'HTML/CSS', 'MongoDB', 'PostgreSQL', 
    'AWS', 'Docker', 'Kubernetes', '3D-Printing', 'Machine Learning', 
    'Git', 'REST APIs', 'GraphQL'
  ];

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
    setIsAddingSkill(false);
  };

  const handleCancelSkillAdd = () => {
    setSelectedSkill('');
    setSkillError(false);
    setIsAddingSkill(false);
  };

  const handleAddSkillClick = () => {
    setIsAddingSkill(true);
    setSkillError(false);
    setSelectedSkill('');
  };

  const handleEditSkillsClick = () => {
    setIsEditingSkills(true);
    setSkillError(false);
    setSelectedSkill('');
    setTempSkills([...skills]);
  };

  const handleRemoveSkillFromTemp = (indexToRemove) => {
    setTempSkills(tempSkills.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveSkillsEdit = () => {
    setSkills([...tempSkills]);
    setTempSkills([]);
    setIsEditingSkills(false);
  };

  const handleCancelSkillsEdit = () => {
    setTempSkills([]);
    setIsEditingSkills(false);
  };

  const handleAddEducation = () => {
    setShowEducationModal(true);
    // Reset form and errors when opening modal
    setEducationForm({
      qualification: '',
      academy: '',
      field: '',
      score: '',
      scoreType: 'cgpa',
      startDate: '',
      endDate: ''
    });
    setEducationErrors({});
  };

  const handleCloseEducationModal = () => {
    setShowEducationModal(false);
    setEducationForm({
      qualification: '',
      academy: '',
      field: '',
      score: '',
      scoreType: 'cgpa',
      startDate: '',
      endDate: ''
    });
    setEducationErrors({});
  };

  const handleEducationInputChange = (field, value) => {
    setEducationForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (educationErrors[field]) {
      setEducationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEducationForm = () => {
    const errors = {};
    
    if (!educationForm.qualification.trim()) {
      errors.qualification = 'Please fill this field';
    }
    
    if (!educationForm.academy.trim()) {
      errors.academy = 'Please fill this field';
    }
    
    if (!educationForm.field.trim()) {
      errors.field = 'Please fill this field';
    }
    
    if (!educationForm.score.trim()) {
      errors.score = 'Please fill this field';
    }
    
    if (!educationForm.startDate) {
      errors.startDate = 'Please fill this field';
    }
    
    if (!educationForm.endDate) {
      errors.endDate = 'Please fill this field';
    }
    
    return errors;
  };

  const handleEducationSubmit = () => {
    const errors = validateEducationForm();
    
    if (Object.keys(errors).length > 0) {
      setEducationErrors(errors);
      return;
    }
    
    // Add to education list
    setEducation(prev => [...prev, { ...educationForm, id: Date.now() }]);
    
    // Close modal and reset form
    handleCloseEducationModal();
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
                <div className="relative mb-3">
                  <h3 className="text-sm font-medium pb-2" style={{ color: '#7f90fa', borderBottom: '1px solid #d1d5db' }}>Skill Set:</h3>
                  <div className="absolute top-0 right-0 flex items-center space-x-2">
                    <button 
                      onClick={handleAddSkillClick}
                      className="hover:text-blue-700"
                      style={{ color: '#7f90fa' }}
                    >
                      <span className="text-lg">+</span>
                    </button>
                    <button 
                      onClick={handleEditSkillsClick}
                      className="hover:text-blue-700"
                      style={{ color: '#7f90fa' }}
                    >
                      <span className="text-sm">✏️</span>
                    </button>
                  </div>
                </div>

                {/* Add mode - dropdown with buttons and skill list */}
                {isAddingSkill ? (
                  <div className="space-y-3">
                    {/* Error message */}
                    {skillError && (
                      <div className="text-red-500 text-xs">
                        * At least select one skill
                      </div>
                    )}

                    {/* Dropdown */}
                    <div className="relative">
                      <select
                        value={selectedSkill}
                        onChange={(e) => {
                          setSelectedSkill(e.target.value);
                          setSkillError(false);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white appearance-none pr-10"
                        style={{ color: '#999' }}
                      >
                        <option value="">Select Skills</option>
                        {availableSkills.filter(skill => !skills.includes(skill)).map((skill) => (
                          <option key={skill} value={skill} className="text-black">
                            {skill}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleCancelSkillAdd}
                        className="w-full bg-gray-200 text-black py-2 rounded-md font-medium hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSkill}
                        className="w-full text-white py-2 rounded-md font-bold transition-colors text-sm"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                        }}
                      >
                        Save
                      </button>
                    </div>

                    {/* Current skills list */}
                    <div className="space-y-1 pt-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="text-sm font-bold text-black">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isEditingSkills ? (
                  /* Edit mode - skills with delete buttons and action buttons */
                  <div className="space-y-3">
                    {/* Skills list with delete buttons */}
                    <div className="space-y-2">
                      {tempSkills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-200 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-bold text-black">{skill}</span>
                          <button
                            onClick={() => handleRemoveSkillFromTemp(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center pt-4">
                      <button
                        onClick={handleCancelSkillsEdit}
                        className="bg-gray-200 text-black px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSkillsEdit}
                        className="text-white px-4 py-2 rounded-md font-bold transition-colors text-sm"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode - skills list */
                  <div className="space-y-2">
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <span className="text-sm font-bold text-black">{skill}</span>
                      </div>
                    ))}
                    
                    {skills.length === 0 && (
                      <button 
                        onClick={handleAddSkillClick}
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
                <div className="relative h-full min-h-[400px]">
                  {education.length === 0 ? (
                    <>
                      {/* Empty state - no content */}
                      <div className="h-full"></div>
                      
                      {/* Floating + Button */}
                      <button
                        onClick={handleAddEducation}
                        className="absolute bottom-8 right-8 w-12 h-12 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-10"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                        }}
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Education records will be displayed here</p>
                    </div>
                  )}
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

      {/* Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div 
              className="text-white p-6 rounded-t-xl text-center"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
              }}
            >
              <h3 className="text-xl font-semibold">Educational Details</h3>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Qualification Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification*
                </label>
                <input
                  type="text"
                  placeholder="Bachelor"
                  value={educationForm.qualification}
                  onChange={(e) => handleEducationInputChange('qualification', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    educationErrors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {educationErrors.qualification && (
                  <p className="text-red-500 text-sm mt-1">{educationErrors.qualification}</p>
                )}
              </div>

              {/* Academy Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academy*
                </label>
                <input
                  type="text"
                  value={educationForm.academy}
                  onChange={(e) => handleEducationInputChange('academy', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    educationErrors.academy ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {educationErrors.academy && (
                  <p className="text-red-500 text-sm mt-1">{educationErrors.academy}</p>
                )}
              </div>

              {/* Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field*
                </label>
                <input
                  type="text"
                  value={educationForm.field}
                  onChange={(e) => handleEducationInputChange('field', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    educationErrors.field ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {educationErrors.field && (
                  <p className="text-red-500 text-sm mt-1">{educationErrors.field}</p>
                )}
              </div>

              {/* Score Field with Radio Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score*
                </label>
                <div className="flex items-center space-x-6 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scoreType"
                      value="cgpa"
                      checked={educationForm.scoreType === 'cgpa'}
                      onChange={(e) => handleEducationInputChange('scoreType', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">CGPA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scoreType"
                      value="percentage"
                      checked={educationForm.scoreType === 'percentage'}
                      onChange={(e) => handleEducationInputChange('scoreType', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Percentage</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={educationForm.score}
                  onChange={(e) => handleEducationInputChange('score', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    educationErrors.score ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {educationErrors.score && (
                  <p className="text-red-500 text-sm mt-1">{educationErrors.score}</p>
                )}
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={educationForm.startDate}
                    onChange={(e) => handleEducationInputChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                      educationErrors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {educationErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{educationErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={educationForm.endDate}
                    onChange={(e) => handleEducationInputChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                      educationErrors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {educationErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{educationErrors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseEducationModal}
                  className="flex-1 bg-white text-black border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEducationSubmit}
                  className="flex-1 text-white py-3 rounded-lg font-medium transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
