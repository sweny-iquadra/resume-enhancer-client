
import React, { useState, useEffect } from 'react';

const ResumeGenerator = ({ userProfile, onGenerateResume, onBack, generatedResumes }) => {
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [dailyLimit, setDailyLimit] = useState({ used: 0, total: 3 });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);

  const resumeTypes = [
    {
      id: 'basic',
      title: 'Generate Anyway',
      description: 'Create a basic resume with your current profile information',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'full',
      title: 'Full Resume',
      description: 'Complete resume with all your details, education, work experience, projects, and skills',
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
    'DevOps Engineer'
  ];

  useEffect(() => {
    // Simulate API call to check daily limit
    checkDailyLimit();
  }, []);

  const checkDailyLimit = async () => {
    // API placeholder
    console.log('API: Checking daily generation limit...');
    const todayGenerated = generatedResumes.filter(resume => {
      const today = new Date().toDateString();
      return new Date(resume.createdAt).toDateString() === today;
    }).length;
    
    setDailyLimit({ used: todayGenerated, total: 3 });
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    
    // Check if user has attended 3+ interviews for role selection
    const hasMultipleInterviews = true; // This would come from user profile
    
    if (hasMultipleInterviews) {
      setShowRoleSelection(true);
    } else {
      handleGenerate(type, '');
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    if (role === 'custom') {
      return; // Wait for custom input
    }
    handleGenerate(selectedType, role);
  };

  const handleCustomRoleSubmit = () => {
    if (customRole.trim()) {
      handleGenerate(selectedType, customRole);
    }
  };

  const handleGenerate = async (type, role) => {
    // Check daily limit
    if (dailyLimit.used >= dailyLimit.total) {
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);
    setShowRoleSelection(false);
    
    try {
      const resume = await onGenerateResume(type, {
        ...userProfile,
        targetRole: role
      });
      
      setGeneratedResume(resume);
      
      // Update daily limit
      setDailyLimit(prev => ({ ...prev, used: prev.used + 1 }));
      
    } catch (error) {
      console.error('Resume generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Resume...</h2>
          <p className="text-gray-600">Please wait while we create your professional resume.</p>
        </div>
      </div>
    );
  }

  if (generatedResume) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Generated!</h2>
            <p className="text-gray-600">Your professional resume is ready for download.</p>
          </div>

          {/* Resume Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Resume Preview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Quality Score:</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{width: `${generatedResume.score}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{generatedResume.score}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center">Resume preview would appear here</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">What's Missing?</span>
              <span className="text-sm text-gray-600">Completion: {generatedResume.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full" 
                style={{width: `${generatedResume.score}%`}}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {generatedResume.score < 80 && (
                <p>Consider adding more work experience or projects to improve your score.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                // API call to download PDF/DOCX
                console.log('API: Downloading resume...');
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Download PDF/DOCX
            </button>
            <button
              onClick={() => {
                // Edit and regenerate
                setGeneratedResume(null);
                setSelectedType('');
              }}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Edit & Regenerate
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate Resume</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Daily Limit Display */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Daily Generation Limit</h3>
              <p className="text-blue-700 text-sm">
                You have {dailyLimit.total - dailyLimit.used} generations remaining today
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {dailyLimit.used}/{dailyLimit.total}
            </div>
          </div>
        </div>

        {/* Resume Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Resume Type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resumeTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeSelection(type.id)}
                className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">{type.title}</h3>
                </div>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Target Role</h3>
            <p className="text-gray-600 mb-6">Choose the role you're applying for to customize your resume:</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {commonRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelection(role)}
                  className="px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500"
                >
                  {role}
                </button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter a custom role:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Enter role title"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleCustomRoleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Select
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRoleSelection(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Limit Reached</h3>
              <p className="text-gray-600 mb-6">
                You've reached your daily generation limit of {dailyLimit.total} resumes. 
                Try again tomorrow or check your saved resumes.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Saved Resumes
                </button>
                <button
                  onClick={onBack}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
