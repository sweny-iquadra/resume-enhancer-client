
import React, { useState } from 'react';
import Header from './Header';
import SuccessToast from './modals/SuccessToast';
import ErrorToast from './modals/ErrorToast';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

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
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEducationId, setDeleteEducationId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    name: '',
    organization: '',
    credentialId: '',
    credentialUrl: '',
    doesntExpire: false,
    startDate: '',
    endDate: ''
  });
  const [certificateErrors, setCertificateErrors] = useState({});
  const [editingCertificateId, setEditingCertificateId] = useState(null);

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
    setEditingEducationId(null);
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
    setEditingEducationId(null);
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

  const handleEditEducation = (edu) => {
    setEditingEducationId(edu.id);
    setEducationForm({
      qualification: edu.qualification,
      academy: edu.academy,
      field: edu.field,
      score: edu.score,
      scoreType: edu.scoreType,
      startDate: edu.startDate,
      endDate: edu.endDate
    });
    setEducationErrors({});
    setShowEducationModal(true);
  };

  const handleDeleteEducation = (id) => {
    setDeleteEducationId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteEducation = () => {
    try {
      // Remove the record from the UI
      setEducation(prev => prev.filter(edu => edu.id !== deleteEducationId));
      
      // Close the confirmation popup
      setShowDeleteModal(false);
      setDeleteEducationId(null);
      
      // Show success message
      setSuccessTitle('Education Deleted!');
      setSuccessMessage('Education record has been deleted successfully.');
      setShowSuccessToast(true);
    } catch (error) {
      setErrorMessage('Failed to delete education record. Please try again.');
      setShowErrorToast(true);
      setShowDeleteModal(false);
      setDeleteEducationId(null);
    }
  };

  const cancelDeleteEducation = () => {
    setShowDeleteModal(false);
    setDeleteEducationId(null);
  };

  const handleAddCertificate = () => {
    setShowCertificateModal(true);
    setEditingCertificateId(null);
    setCertificateForm({
      name: '',
      organization: '',
      credentialId: '',
      credentialUrl: '',
      doesntExpire: false,
      startDate: '',
      endDate: ''
    });
    setCertificateErrors({});
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setEditingCertificateId(null);
    setCertificateForm({
      name: '',
      organization: '',
      credentialId: '',
      credentialUrl: '',
      doesntExpire: false,
      startDate: '',
      endDate: ''
    });
    setCertificateErrors({});
  };

  const handleEditCertificate = (cert) => {
    setEditingCertificateId(cert.id);
    setCertificateForm({
      name: cert.name,
      organization: cert.organization,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      doesntExpire: cert.doesntExpire,
      startDate: cert.startDate,
      endDate: cert.endDate
    });
    setCertificateErrors({});
    setShowCertificateModal(true);
  };

  const handleCertificateInputChange = (field, value) => {
    setCertificateForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (certificateErrors[field]) {
      setCertificateErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateCertificateForm = () => {
    const errors = {};
    
    if (!certificateForm.name.trim()) {
      errors.name = 'Please enter your certificate name.';
    }
    
    if (!certificateForm.organization.trim()) {
      errors.organization = 'Please enter your issued organization.';
    }
    
    if (!certificateForm.credentialId.trim()) {
      errors.credentialId = 'Please enter your credential Id.';
    }
    
    if (!certificateForm.credentialUrl.trim()) {
      errors.credentialUrl = 'Please enter your credential URL.';
    } else if (!isValidUrl(certificateForm.credentialUrl)) {
      errors.credentialUrl = 'Please enter a valid URL.';
    }
    
    if (!certificateForm.startDate) {
      errors.startDate = 'Please select start date.';
    }
    
    if (!certificateForm.doesntExpire && !certificateForm.endDate) {
      errors.endDate = 'Please specify end date.';
    }
    
    return errors;
  };

  const handleCertificateSubmit = () => {
    const errors = validateCertificateForm();
    
    if (Object.keys(errors).length > 0) {
      setCertificateErrors(errors);
      return;
    }
    
    try {
      // Simulate API call - in real implementation, this would be an actual API call
      // that could potentially fail and throw an error
      if (editingCertificateId) {
        setCertificates(prev => prev.map(cert => 
          cert.id === editingCertificateId 
            ? { ...certificateForm, id: editingCertificateId }
            : cert
        ));
        setSuccessTitle('Certificate Updated!');
        setSuccessMessage('Your certificate details have been updated successfully.');
        setShowSuccessToast(true);
      } else {
        setCertificates(prev => [...prev, { ...certificateForm, id: Date.now() }]);
        setSuccessTitle('Certificate Added!');
        setSuccessMessage('Your certificate details have been saved successfully.');
        setShowSuccessToast(true);
      }
      
      handleCloseCertificateModal();
    } catch (error) {
      // Only show error toast for actual API/backend failures
      setErrorMessage('Failed to save certificate details. Please try again.');
      setShowErrorToast(true);
    }
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
      errors.qualification = 'Please enter your qualification.';
    }
    
    if (!educationForm.academy.trim()) {
      errors.academy = 'Please enter your academy/college/university.';
    }
    
    if (!educationForm.field.trim()) {
      errors.field = 'Please enter your field of study.';
    }
    
    if (!educationForm.score.trim()) {
      errors.score = 'Please enter a valid score';
    } else {
      const scoreValue = parseFloat(educationForm.score);
      if (educationForm.scoreType === 'cgpa') {
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
          errors.score = 'Please enter a valid score';
        }
      } else if (educationForm.scoreType === 'percentage') {
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
          errors.score = 'Please enter a valid score';
        }
      }
    }
    
    if (!educationForm.startDate) {
      errors.startDate = 'Please select the start date.';
    }
    
    if (!educationForm.endDate) {
      errors.endDate = 'Please select the end date.';
    }
    
    return errors;
  };

  const handleEducationSubmit = () => {
    const errors = validateEducationForm();
    
    if (Object.keys(errors).length > 0) {
      setEducationErrors(errors);
      return;
    }
    
    try {
      // Simulate API call - in real implementation, this would be an actual API call
      // that could potentially fail and throw an error
      if (editingEducationId) {
        // Update existing education entry
        setEducation(prev => prev.map(edu => 
          edu.id === editingEducationId 
            ? { ...educationForm, id: editingEducationId }
            : edu
        ));
        setSuccessTitle('Education Updated!');
        setSuccessMessage('Your education details have been updated successfully.');
        setShowSuccessToast(true);
      } else {
        // Add new education entry
        setEducation(prev => [...prev, { ...educationForm, id: Date.now() }]);
        setSuccessTitle('Education Added!');
        setSuccessMessage('Your education details have been saved successfully.');
        setShowSuccessToast(true);
      }
      
      // Close modal and reset form
      handleCloseEducationModal();
    } catch (error) {
      // Only show error toast for actual API/backend failures
      setErrorMessage('Failed to save education details. Please try again.');
      setShowErrorToast(true);
    }
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
                  {/* Floating + Button */}
                  <button
                    onClick={handleAddEducation}
                    className="absolute top-0 right-0 w-14 h-14 rounded-xl text-white font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center z-10"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    +
                  </button>
                  
                  {education.length === 0 ? (
                    <>
                      {/* Empty state - no content */}
                      <div className="h-full"></div>
                    </>
                  ) : (
                    <div className="pt-16 space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="bg-white border-b border-gray-200 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-base mb-1">
                                {edu.qualification}
                              </div>
                              <div className="text-gray-700 text-sm mb-1">
                                {edu.academy}
                              </div>
                              <div className="text-gray-700 text-sm mb-1">
                                {edu.field}
                              </div>
                              <div className="text-gray-700 text-sm mb-2">
                                {edu.scoreType === 'percentage' ? 'Percentage' : 'CGPA'}: {edu.score}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {new Date(edu.startDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} to {new Date(edu.endDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                onClick={() => handleEditEducation(edu)}
                                className="text-gray-600 hover:text-gray-800 p-1"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDeleteEducation(edu.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Certificates' && (
                <div className="relative h-full min-h-[400px]">
                  {/* Floating + Button */}
                  <button
                    onClick={handleAddCertificate}
                    className="absolute top-0 right-0 w-14 h-14 rounded-xl text-white font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center z-10"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    +
                  </button>
                  
                  {certificates.length === 0 ? (
                    <>
                      {/* Empty state - no content */}
                      <div className="h-full"></div>
                    </>
                  ) : (
                    <div className="pt-16 space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white border-b border-gray-200 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-base mb-1">
                                {cert.name}
                              </div>
                              <div className="text-gray-700 text-sm mb-1">
                                {cert.organization}
                              </div>
                              <div className="text-gray-700 text-sm mb-1">
                                Credential ID: {cert.credentialId}
                              </div>
                              <div className="text-blue-600 text-sm mb-2 hover:underline">
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                  {cert.credentialUrl}
                                </a>
                              </div>
                              <div className="text-gray-500 text-sm">
                                {new Date(cert.startDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} to {cert.doesntExpire ? 'Present' : new Date(cert.endDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                onClick={() => handleEditCertificate(cert)}
                                className="text-gray-600 hover:text-gray-800 p-1"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => {
                                  setCertificates(prev => prev.filter(c => c.id !== cert.id));
                                  setSuccessTitle('Certificate Deleted!');
                                  setSuccessMessage('Certificate has been deleted successfully.');
                                  setShowSuccessToast(true);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div 
              className="text-white p-6 rounded-t-xl text-center"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
              }}
            >
              <h3 className="text-xl font-semibold">
                Certificate Details
              </h3>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Certificate Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Name*
                </label>
                <input
                  type="text"
                  value={certificateForm.name}
                  onChange={(e) => handleCertificateInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    certificateErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {certificateErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{certificateErrors.name}</p>
                )}
              </div>

              {/* Issued Organization Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issued Organization*
                </label>
                <input
                  type="text"
                  value={certificateForm.organization}
                  onChange={(e) => handleCertificateInputChange('organization', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    certificateErrors.organization ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {certificateErrors.organization && (
                  <p className="text-red-500 text-sm mt-1">{certificateErrors.organization}</p>
                )}
              </div>

              {/* Credential Id Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential Id*
                </label>
                <input
                  type="text"
                  value={certificateForm.credentialId}
                  onChange={(e) => handleCertificateInputChange('credentialId', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    certificateErrors.credentialId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {certificateErrors.credentialId && (
                  <p className="text-red-500 text-sm mt-1">{certificateErrors.credentialId}</p>
                )}
              </div>

              {/* Credential URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential URL*
                </label>
                <input
                  type="url"
                  value={certificateForm.credentialUrl}
                  onChange={(e) => handleCertificateInputChange('credentialUrl', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                    certificateErrors.credentialUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {certificateErrors.credentialUrl && (
                  <p className="text-red-500 text-sm mt-1">{certificateErrors.credentialUrl}</p>
                )}
                {certificateForm.credentialUrl && isValidUrl(certificateForm.credentialUrl) && !certificateErrors.credentialUrl && (
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => window.open(certificateForm.credentialUrl, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                    >
                      Visit URL
                    </button>
                  </div>
                )}
              </div>

              {/* Doesn't Expire Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="doesntExpire"
                  checked={certificateForm.doesntExpire}
                  onChange={(e) => handleCertificateInputChange('doesntExpire', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="doesntExpire" className="ml-2 text-sm text-gray-700">
                  This certificate doesn't expire
                </label>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    value={certificateForm.startDate}
                    onChange={(e) => handleCertificateInputChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                      certificateErrors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {certificateErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{certificateErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date*
                  </label>
                  <input
                    type="date"
                    value={certificateForm.endDate}
                    onChange={(e) => handleCertificateInputChange('endDate', e.target.value)}
                    disabled={certificateForm.doesntExpire}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 ${
                      certificateForm.doesntExpire ? 'bg-gray-200 cursor-not-allowed' : ''
                    } ${
                      certificateErrors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {certificateErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{certificateErrors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseCertificateModal}
                  className="flex-1 bg-white text-black border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCertificateSubmit}
                  className="flex-1 text-white py-3 rounded-lg font-medium transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                  }}
                >
                  {editingCertificateId ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h3 className="text-xl font-semibold">
                {editingEducationId ? 'Edit Educational Details' : 'Educational Details'}
              </h3>
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
                  {editingEducationId ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <SuccessToast 
        showSuccessToast={showSuccessToast} 
        setShowSuccessToast={setShowSuccessToast}
        title={successTitle}
        message={successMessage}
      />

      {/* Error Toast */}
      <ErrorToast 
        showErrorToast={showErrorToast} 
        setShowErrorToast={setShowErrorToast} 
        errorMessage={errorMessage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteEducation}
        onCancel={cancelDeleteEducation}
      />
    </div>
  );
};

export default Profile;
