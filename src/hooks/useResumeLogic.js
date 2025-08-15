import { useState, useEffect } from 'react';
import { fetchAndStructureResumeData, checkInterviewStatus, storeEnhancedResume } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

export const useResumeLogic = () => {
  const [showResumeChat, setShowResumeChat] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResumeData, setEnhancedResumeData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [hasAttendedInterview, setHasAttendedInterview] = useState(false);
  const [isCheckingInterviewStatus, setIsCheckingInterviewStatus] = useState(true);
  const [profileSummaryData, setProfileSummaryData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();

  // Check interview status from API on component mount
  const checkInterviewStatusFromAPI = async (student_id) => {
    try {
      setIsCheckingInterviewStatus(true);
      const response = await checkInterviewStatus(student_id);
      setHasAttendedInterview(response.interview_attended || false);
    } catch (error) {
      console.error('Error checking interview status:', error);
      setHasAttendedInterview(false);
    } finally {
      setIsCheckingInterviewStatus(false);
    }
  };

  useEffect(() => {
    const studentId = JSON.parse(localStorage.getItem('user') || '{}')?.id || null;
    if (studentId) {
      checkInterviewStatusFromAPI(studentId);
    }
  }, []);

  const handleCreateResumeClick = () => {
    if (!hasAttendedInterview) {
      setShowInterviewModal(true);
    } else {
      // Always proceed with resume enhancement - profile check is now handled in ResumeChat
      handleResumeEnhancement();
    }
  };

  const handleResumeEnhancement = async () => {
    try {
      // Show loading modal
      setIsLoading(true);

      const studentId = JSON.parse(localStorage.getItem('user') || '{}')?.id || null;
      const { rawResponse, structuredData } = await fetchAndStructureResumeData(studentId);
      // Store in localStorage
      localStorage.setItem('enhancedResumeData', JSON.stringify(structuredData));
      // localStorage.setItem('profileSummaryData', JSON.stringify(structuredData.professionalSummary));
      // Update state with enhanced resume data
      setEnhancedResumeData(structuredData);

      await storeEnhancedResume(studentId, rawResponse?.profile_id, "");
      // setProfileSummaryData(structuredData.professionalSummary);
      // Show success toast
      setShowSuccessToast(true);
      setSuccessMessage("Resume Enhanced Successfully! ✨");


    } catch (error) {
      console.error('Error calling enhance resume API:', error);

      // Show user-friendly error message
      alert('⚠️ Network error occurred while enhancing your resume. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToInterview = () => {
    setCurrentPage('dashboard'); // Changed to redirect to dashboard as requested
    setShowInterviewModal(false);
    setShowResumeChat(false);
  };

  return {
    showResumeChat,
    setShowResumeChat,
    showInterviewModal,
    setShowInterviewModal,
    currentPage,
    setCurrentPage,
    hasAttendedInterview,
    isCheckingInterviewStatus,
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
    successMessage,
    setSuccessMessage,
    profileSummaryData,
    setProfileSummaryData,
    handleResumeEnhancement,
    checkInterviewStatusFromAPI
  };
};