
import React, { useState, useEffect } from 'react';

const ResumeChat = ({ showResumeChat, setShowResumeChat, hasAttendedInterview, handleCreateResumeClick }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);

  useEffect(() => {
    const handleResumeReady = () => {
      setResumeReady(true);
      setShowResumeChat(true);
    };

    window.addEventListener('resumeReady', handleResumeReady);
    return () => window.removeEventListener('resumeReady', handleResumeReady);
  }, [setShowResumeChat]);
  const [resumeLines, setResumeLines] = useState([
    { id: 1, original: "Software Engineer with 3 years of experience", enhanced: "Accomplished Software Engineer with 3+ years of progressive experience in full-stack development", selected: 'enhanced' },
    { id: 2, original: "Worked on web applications", enhanced: "Architected and developed scalable web applications serving 10,000+ users daily", selected: 'enhanced' },
    { id: 3, original: "Know JavaScript and React", enhanced: "Expert proficiency in JavaScript, React.js, Node.js, and modern web technologies", selected: 'enhanced' },
    { id: 4, original: "Completed projects successfully", enhanced: "Successfully delivered 15+ projects on time and within budget, resulting in 25% increase in user engagement", selected: 'enhanced' }
  ]);

  if (!showResumeChat) return null;

  const toggleLineSelection = (lineId) => {
    setResumeLines(lines => 
      lines.map(line => 
        line.id === lineId 
          ? { ...line, selected: line.selected === 'original' ? 'enhanced' : 'original' }
          : line
      )
    );
  };

  const handleDownload = (format) => {
    const selectedContent = resumeLines.map(line => 
      line.selected === 'enhanced' ? line.enhanced : line.original
    ).join('\n\n');
    
    // Create a blob with the content
    const blob = new Blob([selectedContent + '\n\nPowered by iQua.ai'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_enhanced.${format === 'pdf' ? 'pdf' : 'docx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            onClick={() => {
              setShowResumeChat(false);
              setShowPreview(false);
            }}
            className="text-white hover:bg-black hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Chat Content with Full Scrolling */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 p-6">
          {!showPreview ? (
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

              {/* Success Message and Preview/Download Options - Show only when resume is ready */}
              {resumeReady && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl">✅</span>
                    </div>
                    <h3 className="font-semibold text-green-600 mb-2">Your resume is ready!</h3>
                    <p className="text-gray-700 text-sm">Choose how you'd like to proceed:</p>
                  </div>

                  {/* Preview and Download Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowPreview(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg"
                    >
                      ✅ Preview and Download
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownload('pdf')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2.5 rounded-lg font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 text-sm"
                      >
                        📄 PDF
                      </button>
                      <button 
                        onClick={() => handleDownload('docx')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2.5 rounded-lg font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 text-sm"
                      >
                        📃 DOCX
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
          ) : (
            /* Preview Mode */
            <div className="space-y-4">
              {/* Preview Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Resume Preview</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back
                </button>
              </div>

              {/* Line-by-line comparison */}
              <div className="space-y-4">
                {resumeLines.map((line) => (
                  <div key={line.id} className="bg-gray-50 rounded-lg p-3 border">
                    {/* Original Version */}
                    <div className={`p-2 rounded mb-2 cursor-pointer transition-all ${
                      line.selected === 'original' 
                        ? 'bg-blue-100 border-blue-300 border-2' 
                        : 'bg-white border border-gray-200'
                    }`}
                    onClick={() => toggleLineSelection(line.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Original</span>
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          line.selected === 'original' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {line.selected === 'original' && <span className="text-white text-xs">✓</span>}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{line.original}</p>
                    </div>

                    {/* Enhanced Version */}
                    <div className={`p-2 rounded cursor-pointer transition-all ${
                      line.selected === 'enhanced' 
                        ? 'bg-green-100 border-green-300 border-2' 
                        : 'bg-white border border-gray-200'
                    }`}
                    onClick={() => toggleLineSelection(line.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-purple-600">iQua AI Enhanced</span>
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          line.selected === 'enhanced' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {line.selected === 'enhanced' && <span className="text-white text-xs">✓</span>}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{line.enhanced}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload('pdf')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-red-600 hover:to-red-700 transform hover:scale-105 shadow-lg"
                  >
                    📄 Download as PDF
                  </button>
                  <button 
                    onClick={() => handleDownload('docx')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg"
                  >
                    📃 Download as DOCX
                  </button>
                </div>
                
                {/* Watermark */}
                <div className="text-right">
                  <span className="text-xs text-gray-400 italic">💧 Powered by iQua.ai</span>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input Area - At bottom of scrollable content */}
          {!showPreview && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeChat;
