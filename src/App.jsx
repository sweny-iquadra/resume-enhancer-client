import React from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InterviewPage from './components/InterviewPage';
import ResumeChat from './components/ResumeChat';
import ProfileCompletionModal from './components/modals/ProfileCompletionModal';
import InterviewRequirementModal from './components/modals/InterviewRequirementModal';
import { useResumeLogic } from './hooks/useResumeLogic';

function App() {
  const {
    showResumeChat,
    setShowResumeChat,
    showInterviewModal,
    setShowInterviewModal,
    currentPage,
    setCurrentPage,
    hasAttendedInterview,
    setHasAttendedInterview,
    showProfileModal,
    setShowProfileModal,
    userProfile,
    handleCreateResumeClick,
    navigateToInterview
  } = useResumeLogic();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Dashboard */}
        <div className="flex-1">
          {currentPage === 'dashboard' && (
            <>
              <Header 
                showResumeChat={showResumeChat}
                setShowResumeChat={setShowResumeChat}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              <Dashboard />
            </>
          )}

          {currentPage === 'interview' && (
            <>
              <Header 
                showResumeChat={showResumeChat}
                setShowResumeChat={setShowResumeChat}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              <InterviewPage 
                setHasAttendedInterview={setHasAttendedInterview}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* Resume Enhancer Chat Overlay */}
        <ResumeChat 
          showResumeChat={showResumeChat}
          setShowResumeChat={setShowResumeChat}
          hasAttendedInterview={hasAttendedInterview}
          handleCreateResumeClick={handleCreateResumeClick}
        />

        {/* Profile Completion Modal */}
        <ProfileCompletionModal 
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          userProfile={userProfile}
        />

        {/* Interview Requirement Modal */}
        <InterviewRequirementModal 
          showInterviewModal={showInterviewModal}
          setShowInterviewModal={setShowInterviewModal}
          navigateToInterview={navigateToInterview}
        />
      </div>
    </div>
  );
}

export default App;