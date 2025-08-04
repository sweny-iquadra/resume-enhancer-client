
import { useState, useEffect } from 'react';
import { createUserProfile, checkProfileCompletion, getCompletedInterviewsCount, getUniqueJobRoles } from '../utils/userProfile';
import { fetchAndStructureResumeData, checkInterviewStatus } from '../utils/api';

export const useResumeLogic = () => {
  const [showResumeChat, setShowResumeChat] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userProfile] = useState(createUserProfile());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResumeData, setEnhancedResumeData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [hasAttendedInterview, setHasAttendedInterview] = useState(false);
  const [isCheckingInterviewStatus, setIsCheckingInterviewStatus] = useState(true);
  const [profileSummaryData, setProfileSummaryData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // Check interview status from API on component mount
  useEffect(() => {
    const checkInterviewStatusFromAPI = async () => {
      try {
        setIsCheckingInterviewStatus(true);
        // const student_id = 1; // Using student_id = 1 as requested
        // const response = await checkInterviewStatus(student_id);

        // Update hasAttendedInterview based on API response
        // setHasAttendedInterview(response.interview_attended || false);
        setHasAttendedInterview(true);
      } catch (error) {
        console.error('Error checking interview status:', error);
        // Fallback to false if API fails
        setHasAttendedInterview(false);
      } finally {
        setIsCheckingInterviewStatus(false);
      }
    };

    checkInterviewStatusFromAPI();
  }, []);

  // Calculate unique roles based on interview history (fallback to dummy data for now)
  const uniqueRoles = getUniqueJobRoles(userProfile);

  const handleCreateResumeClick = () => {
    if (!hasAttendedInterview) {
      setShowInterviewModal(true);
    } else {
      // Proceed with single role or default role
      const defaultRole = uniqueRoles[0] || userProfile.role;
      setSelectedRole(defaultRole);

      // Check if profile is complete first
      if (!checkProfileCompletion(userProfile)) {
        setShowProfileModal(true);
      } else {
        // Profile is complete - check for multiple roles
        if (uniqueRoles.length >= 3) {
          // Show role selection for users with 3+ different roles
          setShowRoleSelection(true);
        } else {
          // Proceed with resume enhancement for single role or less than 3 roles
          handleResumeEnhancement(defaultRole);
        }
      }
    }
  };

  const handleRoleSelection = (role) => {
    // Format role to industry-standard format (lowercase, hyphenated)
    const formattedRole = role.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSelectedRole(formattedRole);
    setShowRoleSelection(false);

    // Profile is already confirmed complete at this point - proceed with resume enhancement
    handleResumeEnhancement(role); // Use original role for display purposes
  };

  const handleResumeEnhancement = async (role) => {
    try {
      // Show loading modal
      setIsLoading(true);

      // Use the reusable API function to fetch and structure resume data
      const studentId = 103; // You can make this dynamic based on user ID
      const { structuredData } = await fetchAndStructureResumeData(studentId, userProfile);

      // Store in localStorage
      localStorage.setItem('enhancedResumeData', JSON.stringify(structuredData));

      // Update state with enhanced resume data
      setEnhancedResumeData(structuredData);
      setProfileSummaryData(structuredData.professionalSummary);
      // Show success toast
      setShowSuccessToast(true);
      setSuccessMessage("Resume Enhanced Successfully! ✨");


    } catch (error) {
      console.error('Error calling enhance resume API:', error);

      // Show user-friendly error message
      alert('⚠️ Network error occurred while enhancing your resume. Please check your internet connection and try again.');

      // If profile is incomplete, show profile modal for completion
      if (!checkProfileCompletion(userProfile)) {
        setShowProfileModal(true);
      }
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
    showProfileModal,
    setShowProfileModal,
    userProfile,
    handleCreateResumeClick,
    navigateToInterview,
    selectedRole,
    setSelectedRole,
    showRoleSelection,
    setShowRoleSelection,
    handleRoleSelection,
    uniqueRoles,
    isLoading,
    setIsLoading,
    enhancedResumeData,
    setEnhancedResumeData,
    showPreview,
    setShowPreview,
    showSuccessToast,
    setShowSuccessToast,
    handleResumeEnhancement,
    profileSummaryData
  };
};
