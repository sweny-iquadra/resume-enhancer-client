
import React, { useState } from 'react';

const ResumeGenerator = ({ userProfile, onGenerateResume, onBack, generatedResumes }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [generationType, setGenerationType] = useState(null);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [usedToday, setUsedToday] = useState(0);

  const availableRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Mobile Developer'
  ];

  const handleGenerateBasic = async () => {
    setGenerating(true);
    setGenerationType('basic');
    
    try {
      await onGenerateResume('basic', userProfile);
      setUsedToday(prev => prev + 1);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAdvanced = async () => {
    if (selectedRoles.length === 0) {
      setShowRoleSelection(true);
      return;
    }
    
    setGenerating(true);
    setGenerationType('advanced');
    
    try {
      await onGenerateResume('advanced', { ...userProfile, targetRoles: selectedRoles });
      setUsedToday(prev => prev + 1);
      setShowRoleSelection(false);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const canGenerate = usedToday < dailyLimit;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Resume Generator</h2>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Daily Limit Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Daily Generation Limit</h4>
              <p className="text-blue-700">
                {usedToday} of {dailyLimit} resumes generated today
              </p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {dailyLimit - usedToday}
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">remaining</p>
            </div>
          </div>
        </div>

        {!canGenerate && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900">Daily Limit Reached</h4>
                <p className="text-red-700">You've reached your daily generation limit. Try again tomorrow!</p>
              </div>
            </div>
          </div>
        )}

        {/* Generation Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate Basic Resume</h3>
            <p className="text-gray-600 mb-6">
              Quick resume generation with your basic information, education, and skills.
            </p>
            <button
              onClick={handleGenerateBasic}
              disabled={generating || !canGenerate}
              className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {generating && generationType === 'basic' ? 'Generating...' : 'Generate Basic Resume'}
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Resume with Role Selection</h3>
            <p className="text-gray-600 mb-6">
              Complete resume with education, work experience, projects, and skills tailored for specific roles.
            </p>
            <button
              onClick={() => setShowRoleSelection(true)}
              disabled={generating || !canGenerate}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Select Roles & Generate
            </button>
          </div>
        </div>

        {/* Role Selection Modal */}
        {showRoleSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Target Roles</h3>
              <p className="text-gray-600 mb-6">Choose the roles you want to target with your resume:</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {availableRoles.map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRoleSelection(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAdvanced}
                  disabled={selectedRoles.length === 0 || generating}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {generating && generationType === 'advanced' ? 'Generating...' : `Generate Resume (${selectedRoles.length} roles)`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Resumes */}
        {generatedResumes.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Generated Resumes</h3>
            <div className="grid gap-4">
              {generatedResumes.map(resume => (
                <div key={resume.id} className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{resume.type} Resume</h4>
                    <p className="text-gray-600 text-sm">
                      Generated on {resume.createdAt.toLocaleDateString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-gray-700 mr-2">Score:</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${resume.score}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{resume.score}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Preview
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                      Edit/Regenerate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeGenerator;
