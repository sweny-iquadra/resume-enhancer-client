import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InterviewPage from './components/InterviewPage';
import ResumeChat from './components/ResumeChat';
import ResumePreview from './components/ResumePreview';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileCompletionModal from './components/modals/ProfileCompletionModal';
import InterviewRequirementModal from './components/modals/InterviewRequirementModal';
import LoadingModal from './components/modals/LoadingModal';
import SuccessToast from './components/modals/SuccessToast';
import { useResumeLogic } from './hooks/useResumeLogic';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    showResumeChat,
    setShowResumeChat,
    showInterviewModal,
    setShowInterviewModal,
    currentPage,
    setCurrentPage,
    userProfile,
    isLoadingProfile,
    showProfileModal,
    setShowProfileModal,
    selectedRole,
    setSelectedRole,
    showRoleSelection,
    setShowRoleSelection,
    isLoading,
    setIsLoading,
    enhancedResumeData,
    setEnhancedResumeData,
    showPreview,
    setShowPreview,
    showSuccessToast,
    setShowSuccessToast,
    isProfileComplete,
    completedInterviewsCount,
    uniqueJobRoles,
    hasAttendedInterview,
    isCheckingInterviewStatus
  } = useResumeLogic();

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  // If not authenticated, show login component
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

    // Show loading indicator while fetching user profile
    if (isLoadingProfile) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      );
    }

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
                onLogout={handleLogout}
              />
              <Dashboard setCurrentPage={setCurrentPage} />
            </>
          )}

          {currentPage === 'interview' && (
            <>
              <Header
                showResumeChat={showResumeChat}
                setShowResumeChat={setShowResumeChat}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
              />
              <InterviewPage
                setCurrentPage={setCurrentPage}
              />
            </>
          )}

          {currentPage === 'profile' && (
            <Profile
              setCurrentPage={setCurrentPage}
              showResumeChat={showResumeChat}
              setShowResumeChat={setShowResumeChat}
              onLogout={handleLogout}
              userProfile={userProfile}
            />
          )}
        </div>

        {/* Resume Enhancer Chat Overlay */}
        <ResumeChat
          showResumeChat={showResumeChat}
          setShowResumeChat={setShowResumeChat}
          hasAttendedInterview={hasAttendedInterview}
          isCheckingInterviewStatus={isCheckingInterviewStatus}
          handleCreateResumeClick={handleCreateResumeClick}
          showRoleSelection={showRoleSelection}
          setShowRoleSelection={setShowRoleSelection}
          uniqueJobRoles={uniqueJobRoles}
          handleRoleSelection={handleRoleSelection}
          isLoading={isLoading}
          enhancedResumeData={enhancedResumeData}
          setShowPreview={setShowPreview}
          setCurrentPage={setCurrentPage}
          setEnhancedResumeData={setEnhancedResumeData}
          setSelectedRole={setSelectedRole}
        />

        {/* Resume Preview Modal */}
        <ResumePreview
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          enhancedResumeData={enhancedResumeData}
        />

        {/* Profile Completion Modal */}
        <ProfileCompletionModal
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          userProfile={userProfile}
          selectedRole={selectedRole}
          setIsLoading={setIsLoading}
          setEnhancedResumeData={setEnhancedResumeData}
          showRoleSelection={showRoleSelection}
          setShowRoleSelection={setShowRoleSelection}
          uniqueJobRoles={uniqueJobRoles}
          handleRoleSelection={handleRoleSelection}
          setShowSuccessToast={setShowSuccessToast}
          setShowPreview={setShowPreview}
          setCurrentPage={setCurrentPage}
          setShowResumeChat={setShowResumeChat}
        />

        {/* Interview Requirement Modal */}
        <InterviewRequirementModal
          showInterviewModal={showInterviewModal}
          setShowInterviewModal={setShowInterviewModal}
          navigateToInterview={navigateToInterview}
        />

        {/* Loading Modal */}
        <LoadingModal
          isVisible={isLoading}
          message="iQua AI is generating your resume. This may take a few moments while we tailor your resume to your most relevant job role and skills."
        />

        {/* Success Toast */}
        <SuccessToast
          showSuccessToast={showSuccessToast}
          setShowSuccessToast={setShowSuccessToast}
          title={successTitle}
          message={successMessage}
        />
      </div>
    </div>
  );
}

export default App;