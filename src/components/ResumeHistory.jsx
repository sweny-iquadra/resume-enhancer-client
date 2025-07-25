
import React, { useState } from 'react';

const ResumeHistory = ({ resumes, onBack }) => {
  const [selectedResume, setSelectedResume] = useState(null);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Resume History</h2>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600">Start by creating your first resume!</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Resumes</p>
                    <p className="text-2xl font-bold text-blue-900">{resumes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Average Score</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / resumes.length)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Latest</p>
                    <p className="text-sm font-bold text-purple-900">
                      {formatDate(resumes[resumes.length - 1]?.createdAt).split(',')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">All Resumes</h3>
              
              {resumes.map((resume, index) => (
                <div key={resume.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-indigo-600">
                              #{resumes.length - index}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 capitalize">
                            {resume.type} Resume
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Created on {formatDate(resume.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(resume.score)}`}>
                            Score: {resume.score}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button 
                        onClick={() => setSelectedResume(resume)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Download
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Resume Details Modal */}
        {selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Resume Details</h3>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{selectedResume.type} Resume</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{formatDate(selectedResume.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quality Score</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{width: `${selectedResume.score}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{selectedResume.score}%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Download PDF
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Edit & Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;
