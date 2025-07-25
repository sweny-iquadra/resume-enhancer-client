
import React from 'react';

const ResumeChat = ({ showResumeChat, setShowResumeChat, hasAttendedInterview, handleCreateResumeClick }) => {
  if (!showResumeChat) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col animate-fade-in">
        {/* Chat Header */}
        <div className="text-white p-4 rounded-t-2xl flex justify-between items-center" style={{background: 'linear-gradient(135deg, #3935cd 0%, #5b4de8 50%, #7c69ef 100%)'}}>
          <div className="flex items-center space-x-2">
            <span className="text-xl">📄</span>
            <span className="font-semibold">Resume Enhancer</span>
          </div>
          <button
            onClick={() => setShowResumeChat(false)}
            className="text-white hover:bg-black hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Chat Content with Full Scrolling */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 p-6">
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-600 mb-3">
                Welcome to iQua.AI Resume enhancer
              </h3>
              <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                <p>1. iQua.ai helps you create resumes tailored to your skills, job roles, and sectors you've explored through our interviews.</p>
                <p>2. Click the Create Resume button to let iQua build a resume uniquely designed for you!</p>
              </div>
            </div>

            {/* Action Buttons Container - Enhanced Creative Styling */}
            <div className="flex gap-4 items-center justify-center">
              {/* Create Resume Button */}
              <button 
                onClick={handleCreateResumeClick}
                className={`group relative overflow-hidden px-6 py-3.5 rounded-xl transition-all duration-500 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 min-w-[140px] ${
                  hasAttendedInterview 
                    ? 'text-white cursor-pointer border-indigo-300 hover:border-indigo-200 hover:-translate-y-1' 
                    : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-600 cursor-not-allowed border-gray-300 opacity-60'
                }`}
                style={hasAttendedInterview ? {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #5b4de8 30%, #7c3aed 70%, #8b5cf6 100%)',
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3), 0 0 20px rgba(79, 70, 229, 0.1)',
                  filter: 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.2))'
                } : {}}
                disabled={!hasAttendedInterview}
              >
                <span className="relative z-20 flex flex-col items-center justify-center space-y-1">
                  <span className="text-xl">{hasAttendedInterview ? '📄' : '🔒'}</span>
                  <span className="font-bold tracking-wider text-xs uppercase leading-tight">
                    CREATE<br/>RESUME
                  </span>
                </span>
                {hasAttendedInterview && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform rotate-45 transition-all duration-500"></div>
                  </>
                )}
              </button>

              {/* Stylish Divider */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-gradient-to-t from-purple-300 via-purple-500 to-purple-700 rounded-full"></div>
              </div>

              {/* Attend Interview Button - Disabled */}
              <button 
                disabled={true}
                className="group relative overflow-hidden px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 border-2 border-gray-300 backdrop-blur-sm cursor-not-allowed min-w-[140px] opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                  boxShadow: '0 4px 10px rgba(107, 114, 128, 0.2)'
                }}
              >
                <span className="relative z-20 flex flex-col items-center justify-center space-y-1 text-white">
                  <span className="text-xl">🔒</span>
                  <span className="font-bold tracking-wider text-xs uppercase leading-tight">
                    ATTEND<br/>INTERVIEW
                  </span>
                </span>
              </button>
            </div>

            {/* Chat Messages would go here in the future */}
            <div className="space-y-4">
              {/* Placeholder for future chat messages */}
            </div>
          </div>

          {/* Chat Input Area - At bottom of scrollable content */}
          <div className="mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me anything about resume building..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md">
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeChat;
