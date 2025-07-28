
import React from 'react';

const InterviewPage = ({ setCurrentPage }) => {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="max-w-4xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl text-white">🎤</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to iQua.AI Interview
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get ready for your personalized interview experience. Our AI will assess your skills, 
            experience, and career goals to help you build the perfect resume.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💼</span>
              </div>
              <h3 className="font-semibold text-blue-600 mb-2">Career Assessment</h3>
              <p className="text-sm text-gray-600">Evaluate your professional background and goals</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h3 className="font-semibold text-purple-600 mb-2">Skills Analysis</h3>
              <p className="text-sm text-gray-600">Identify your strengths and areas for growth</p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📄</span>
              </div>
              <h3 className="font-semibold text-green-600 mb-2">Resume Building</h3>
              <p className="text-sm text-gray-600">Create tailored resumes for your target roles</p>
            </div>
          </div>

          <button 
            onClick={() => {
              // Go back to dashboard (interview history is managed in userProfile)
              setCurrentPage('dashboard');
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Interview
          </button>
        </div>
      </div>
    </main>
  );
};

export default InterviewPage;
import React from 'react';

const InterviewPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Interview Center</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Start New Interview</h2>
              <p className="text-gray-600 mb-4">Begin a new AI-powered interview session to improve your skills.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Interview
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-lg font-semibold text-green-700 mb-3">Interview History</h2>
              <p className="text-gray-600 mb-4">Review your past interview sessions and track your progress.</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                View History
              </button>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
