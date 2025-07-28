
import { useState } from 'react';
import { createUserProfile, checkProfileCompletion, getCompletedInterviewsCount, getUniqueJobRoles, enhanceResumeAPI } from '../utils/userProfile';

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

  // Calculate interview status based on interview history
  const completedInterviewsCount = getCompletedInterviewsCount(userProfile);
  const hasAttendedInterview = completedInterviewsCount > 0;
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

      // Call the enhance resume API with user profile data
      const response = await enhanceResumeAPI(role, userProfile);

      if (response.success) {
        // Store in localStorage
        localStorage.setItem('enhancedResumeData', JSON.stringify(response.data));

        // Update state with enhanced resume data
        setEnhancedResumeData(response.data.enhancedResume);

        // Show success toast
        setShowSuccessToast(true);

        // Show success feedback
        console.log('✅ Resume enhanced successfully!');
      } else {
        console.error('API call failed:', response);
        
        // Show user-friendly error message
        alert('❌ Failed to enhance resume. Our AI encountered an issue. Please try again or check your profile completeness.');
        
        // If profile is incomplete, show profile modal for completion
        if (!checkProfileCompletion(userProfile)) {
          setShowProfileModal(true);
        }
      }
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
    setShowSuccessToast
  };
};
