import React, { useState, useEffect } from 'react';

const ResumeGenerator = ({ 
  userProfile, 
  onGenerateResume, 
  onBack, 
  dailyLimit,
  hasAttendedMultipleInterviews = false 
}) => {
  const [selectedResumeType, setSelectedResumeType] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Check if user has attended 3+ interviews with different roles
  useEffect(() => {
    if (hasAttendedMultipleInterviews) {
      setShowRoleSelection(true);
    }
  }, [hasAttendedMultipleInterviews]);

  const resumeTypes = [
    {
      id: 'basic',
      title: 'Generate Anyway',
      description: 'Create a basic resume with your current profile - Name, Email, Phone, AI Summary, Skills from Interview',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'full',
      title: 'Full Resume',
      description: 'Complete resume - Name, Education, Work Experience, Projects, Skills, Summary (Profile Complete)',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  const commonRoles = [
    'Software Engineer',
    'Data Scientist', 
    'Product Manager',
    'UI/UX Designer',
    'Marketing Manager',
    'Business Analyst',
    'Project Manager',
    'DevOps Engineer',
    'Sales Representative',
    'Customer Success Manager'
  ];

  const handleResumeTypeSelect = (type) => {
    setSelectedResumeType(type);

    // If user has attended 3+ interviews, show role selection
    if (hasAttendedMultipleInterviews) {
      setShowRoleSelection(true);
    } else {
      // Proceed with selected role
      proceedWithGeneration(type, 'General');
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const proceedWithGeneration = async (resumeType, targetRole) => {
    if (dailyLimit.used >= dailyLimit.max) {
      return;
    }

    setIsGenerating(true);

    try {
      await onGenerateResume(resumeType, targetRole || selectedRole || customRole || 'General');
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    const targetRole = selectedRole === 'custom' ? customRole : selectedRole;
    proceedWithGeneration(selectedResumeType, targetRole);
  };

  // Check daily limit
  const isLimitReached = dailyLimit.used >= dailyLimit.max;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Generator</h1>
          <p className="text-gray-600 mt-2">Choose your resume type and generate your professional resume</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Daily Limit Warning */}
      {isLimitReached && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-700 font-semibold">
              Daily generation limit reached ({dailyLimit.used}/{dailyLimit.max}). Try again tomorrow!
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={onBack}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              ← View Saved Resumes
            </button>
          </div>
        </div>
      )}

      {/* Current Daily Usage */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Daily Generation Progress</h3>
            <p className="text-blue-700">You have generated {dailyLimit.used} out of {dailyLimit.max} resumes today</p>
          </div>
          <div className="text-right">
            <div className="w-32 bg-blue-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{width: `${(dailyLimit.used / dailyLimit.max) * 100}%`}}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">{dailyLimit.max - dailyLimit.used} remaining</p>
          </div>
        </div>
      </div>

      {!showRoleSelection ? (
        <>
          {/* Resume Type Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Resume Type</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resumeTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => !isLimitReached && handleResumeTypeSelect(type.id)}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedResumeType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : isLimitReached 
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg mr-4 ${
                      selectedResumeType === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Role Selection for Multiple Interview Attendees */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Target Role</h2>
            <p className="text-gray-600 mb-6">
              Since you've attended multiple interviews, please select the role you want to target for this resume:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {commonRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {role}
                </button>
              ))}

              <button
                onClick={() => handleRoleSelect('custom')}
                className={`p-4 text-left border-2 rounded-lg transition-colors ${
                  selectedRole === 'custom'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Custom Role
                </div>
              </button>
            </div>

            {selectedRole === 'custom' && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter your target role..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowRoleSelection(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back to Resume Types
              </button>

              <button
                onClick={handleGenerate}
                disabled={!selectedRole || (selectedRole === 'custom' && !customRole.trim()) || isGenerating || isLimitReached}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  `Generate ${selectedResumeType === 'basic' ? 'Basic' : 'Full'} Resume`
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Profile Summary */}
      {userProfile && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Name:</span> {userProfile.name || 'Not provided'}</p>
              <p><span className="font-medium">Email:</span> {userProfile.email || 'Not provided'}</p>
              <p><span className="font-medium">Phone:</span> {userProfile.phone || 'Not provided'}</p>
            </div>
            <div>
              <p><span className="font-medium">Work Experience:</span> {userProfile.workExperience?.length || 0} entries</p>
              <p><span className="font-medium">Education:</span> {userProfile.education?.length || 0} entries</p>
              <p><span className="font-medium">Projects:</span> {userProfile.projects?.length || 0} entries</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;