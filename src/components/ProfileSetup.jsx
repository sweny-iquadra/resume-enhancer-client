
import React, { useState, useEffect } from 'react';

const ProfileSetup = ({ userProfile, onProfileComplete, onBack }) => {
  const [currentSection, setCurrentSection] = useState('basic');
  const [profile, setProfile] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    location: '',
    
    // Education
    education: [],
    
    // Work Experience
    workExperience: [],
    
    // Projects
    projects: [],
    
    // Skills
    skills: [],
    
    // AI Summary
    aiSummary: ''
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionAction, setCompletionAction] = useState('');

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '', gpa: '' }]
    }));
  };

  const addWorkExperience = () => {
    setProfile(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
    }));
  };

  const checkProfileCompletion = () => {
    const isBasicComplete = profile.name && profile.email && profile.phone;
    const hasEducation = profile.education.length > 0;
    const hasWorkExp = profile.workExperience.length > 0;
    const hasProjects = profile.projects.length > 0;
    const hasSkills = profile.skills.length > 0;

    if (isBasicComplete && hasEducation && hasWorkExp && hasProjects && hasSkills) {
      return 'complete';
    }
    return 'incomplete';
  };

  const handleSaveProfile = () => {
    const completionStatus = checkProfileCompletion();
    
    if (completionStatus === 'incomplete') {
      setShowCompletionModal(true);
    } else {
      onProfileComplete(profile);
    }
  };

  const handleCompletionAction = (action) => {
    setCompletionAction(action);
    setShowCompletionModal(false);
    
    if (action === 'generate') {
      // Generate with basic info
      onProfileComplete({ ...profile, isBasic: true });
    } else if (action === 'update') {
      // Continue editing profile
      return;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Setup</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Profile Completion</span>
            <span className="text-sm text-gray-600">
              {checkProfileCompletion() === 'complete' ? '100%' : '50%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: checkProfileCompletion() === 'complete' ? '100%' : '50%' }}
            ></div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Location"
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            <button
              onClick={addEducation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Education
            </button>
          </div>
          {profile.education.map((edu, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => {
                  const updatedEducation = [...profile.education];
                  updatedEducation[index].degree = e.target.value;
                  handleInputChange('education', updatedEducation);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="School/University"
                value={edu.school}
                onChange={(e) => {
                  const updatedEducation = [...profile.education];
                  updatedEducation[index].school = e.target.value;
                  handleInputChange('education', updatedEducation);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Graduation Year"
                value={edu.year}
                onChange={(e) => {
                  const updatedEducation = [...profile.education];
                  updatedEducation[index].year = e.target.value;
                  handleInputChange('education', updatedEducation);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="GPA (Optional)"
                value={edu.gpa}
                onChange={(e) => {
                  const updatedEducation = [...profile.education];
                  updatedEducation[index].gpa = e.target.value;
                  handleInputChange('education', updatedEducation);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
            <button
              onClick={addWorkExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Experience
            </button>
          </div>
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => {
                    const updatedExp = [...profile.workExperience];
                    updatedExp[index].title = e.target.value;
                    handleInputChange('workExperience', updatedExp);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const updatedExp = [...profile.workExperience];
                    updatedExp[index].company = e.target.value;
                    handleInputChange('workExperience', updatedExp);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2020 - Dec 2021)"
                value={exp.duration}
                onChange={(e) => {
                  const updatedExp = [...profile.workExperience];
                  updatedExp[index].duration = e.target.value;
                  handleInputChange('workExperience', updatedExp);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <textarea
                placeholder="Job Description"
                rows="3"
                value={exp.description}
                onChange={(e) => {
                  const updatedExp = [...profile.workExperience];
                  updatedExp[index].description = e.target.value;
                  handleInputChange('workExperience', updatedExp);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <button
              onClick={addProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
          {profile.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => {
                    const updatedProjects = [...profile.projects];
                    updatedProjects[index].name = e.target.value;
                    handleInputChange('projects', updatedProjects);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Technologies Used"
                  value={project.technologies}
                  onChange={(e) => {
                    const updatedProjects = [...profile.projects];
                    updatedProjects[index].technologies = e.target.value;
                    handleInputChange('projects', updatedProjects);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <textarea
                placeholder="Project Description"
                rows="3"
                value={project.description}
                onChange={(e) => {
                  const updatedProjects = [...profile.projects];
                  updatedProjects[index].description = e.target.value;
                  handleInputChange('projects', updatedProjects);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <input
                type="text"
                placeholder="Project Link (Optional)"
                value={project.link}
                onChange={(e) => {
                  const updatedProjects = [...profile.projects];
                  updatedProjects[index].link = e.target.value;
                  handleInputChange('projects', updatedProjects);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          <textarea
            placeholder="Enter your skills (comma-separated)"
            rows="3"
            value={profile.skills.join(', ')}
            onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Almost There!</h3>
              <p className="text-gray-600">Your profile is incomplete. What would you like to do?</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleCompletionAction('update')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Update Profile Now
              </button>
              <button
                onClick={() => handleCompletionAction('generate')}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                Generate Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup;
