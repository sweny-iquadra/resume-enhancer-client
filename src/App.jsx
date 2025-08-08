import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InterviewPage from './components/InterviewPage';
import ResumeChat from './components/ResumeChat';
import ResumePreview from './components/ResumePreview';
import DownloadedResumes from './components/DownloadedResumes';
import Login from './components/Login';
import Profile from './components/Profile';
import InterviewRequirementModal from './components/modals/InterviewRequirementModal';

import SuccessToast from './components/modals/SuccessToast';
import { useResumeLogic } from './hooks/useResumeLogic';
import { AuthProvider } from './utils/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    showResumeChat,
    setShowResumeChat,
    showInterviewModal,
    setShowInterviewModal,
    currentPage,
    setCurrentPage,
    hasAttendedInterview,
    isCheckingInterviewStatus,
    userProfile,
    handleCreateResumeClick,
    navigateToInterview,
    isLoading,
    setIsLoading,
    enhancedResumeData,
    setEnhancedResumeData,
    showPreview,
    setShowPreview,
    showSuccessToast,
    setShowSuccessToast,
    successTitle,
    setSuccessTitle,
    successMessage,
    setSuccessMessage,
    profileSummaryData,
    setProfileSummaryData,
    handleResumeEnhancement,
    checkInterviewStatusFromAPI
  } = useResumeLogic();

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Handle successful login
  const handleLoginSuccess = async (user, token, type) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_type', type);
    setCurrentPage('dashboard');
    await checkInterviewStatusFromAPI(user?.id);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('hasAttendedInterview');
    localStorage.removeItem('enhancedResumeData');
    localStorage.removeItem('parsedResumeData');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // If not authenticated, show login component
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AuthProvider>
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
              />
            )}

            {currentPage === 'downloadedResumes' && (
              <>
                <Header
                  showResumeChat={showResumeChat}
                  setShowResumeChat={setShowResumeChat}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  onLogout={handleLogout}
                />
                <DownloadedResumes setCurrentPage={setCurrentPage} />
              </>
            )}
          </div>

          {/* Resume Enhancer Chat Overlay */}
          <ResumeChat
            showResumeChat={showResumeChat}
            setShowResumeChat={setShowResumeChat}
            hasAttendedInterview={hasAttendedInterview}
            isCheckingInterviewStatus={isCheckingInterviewStatus}
            handleCreateResumeClick={handleCreateResumeClick}
            isLoading={isLoading}
            enhancedResumeData={enhancedResumeData}
            setShowPreview={setShowPreview}
            setCurrentPage={setCurrentPage}
            setEnhancedResumeData={setEnhancedResumeData}
            profileSummaryData={profileSummaryData}
            userProfile={userProfile}
            handleResumeEnhancement={handleResumeEnhancement}
          />

          {/* Resume Preview Modal */}
          <ResumePreview
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            enhancedResumeData={enhancedResumeData}
          />

          {/* Interview Requirement Modal */}
          <InterviewRequirementModal
            showInterviewModal={showInterviewModal}
            setShowInterviewModal={setShowInterviewModal}
            navigateToInterview={navigateToInterview}
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
    </AuthProvider>
  );

}

export default App;