
import React, { useState } from 'react';

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [acceptedChanges, setAcceptedChanges] = useState({});

  if (!showPreview || !enhancedResumeData) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPreview(false);
    }
  };

  const toggleChange = (section, field, index = null) => {
    const key = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    setAcceptedChanges(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isAccepted = (section, field, index = null) => {
    const key = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    return acceptedChanges[key] || false;
  };

  const downloadResume = (format) => {
    // Implement download logic here
    console.log(`Downloading resume as ${format}`);
    alert(`Resume downloaded as ${format}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] animate-fade-in flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Resume Preview & Comparison</h3>
            <p className="text-sm opacity-90 mt-1">Compare and select changes to include in your final resume</p>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Professional Summary Comparison */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800">Professional Summary</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-600">Original</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        Basic summary (Original content would be shown here)
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">AI Enhanced</span>
                      </div>
                      <button
                        onClick={() => toggleChange('summary', 'text')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isAccepted('summary', 'text')
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isAccepted('summary', 'text') ? 'Accept AI' : 'Keep Original'}
                      </button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        {enhancedResumeData.professionalSummary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800">Skills</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Original Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                      <span className="text-sm font-medium text-gray-600">Original Skills</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {["JavaScript", "React", "Node.js", "Python", "SQL"].map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">AI Enhanced Skills</span>
                      </div>
                      <button
                        onClick={() => toggleChange('skills', 'list')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isAccepted('skills', 'list')
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isAccepted('skills', 'list') ? 'Accept AI' : 'Keep Original'}
                      </button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {enhancedResumeData.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience Comparison */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800">Work Experience</h4>
              </div>
              <div className="p-4 space-y-4">
                {enhancedResumeData.workExperience.map((experience, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-800">{experience.company} - {experience.position}</h5>
                      <button
                        onClick={() => toggleChange('workExperience', 'item', index)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isAccepted('workExperience', 'item', index)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isAccepted('workExperience', 'item', index) ? 'Accept AI' : 'Keep Original'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{experience.duration}</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {experience.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex} className="flex items-start space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Powered by iQua.ai</span> watermark will be added to your resume
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => downloadResume('PDF')}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <span>📄</span>
                <span>Download as PDF</span>
              </button>
              <button
                onClick={() => downloadResume('DOCX')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <span>📃</span>
                <span>Download as DOCX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
