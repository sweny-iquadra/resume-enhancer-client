
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
      
      if (!checkProfileCompletion(userProfile)) {
        setShowProfileModal(true);
      } else {
        // Profile is complete - proceed with resume enhancement
        handleResumeEnhancement(defaultRole);
      }
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
    
    if (!checkProfileCompletion(userProfile)) {
      setShowProfileModal(true);
    } else {
      // Profile is complete - proceed with resume enhancement
      handleResumeEnhancement(role);
    }
  };

  const handleResumeEnhancement = async (role) => {
    // Show loading modal instead of alert
    setIsLoading(true);
    
    try {
      // Call the enhance resume API with user profile data
      const response = await enhanceResumeAPI(role, userProfile);
      
      if (response.success) {
        // Store in localStorage
        localStorage.setItem('enhancedResumeData', JSON.stringify(response.data));
        
        // Update state with enhanced resume data
        setEnhancedResumeData(response.data.enhancedResume);
        
        // Show the preview modal
        setShowPreview(true);
      } else {
        console.error('API call failed');
        alert('Failed to enhance resume. Please try again.');
      }
    } catch (error) {
      console.error('Error calling enhance resume API:', error);
      alert('An error occurred while enhancing your resume. Please try again.');
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
    completedInterviewsCount,
    isLoading,
    setIsLoading,
    enhancedResumeData,
    setEnhancedResumeData,
    showPreview,
    setShowPreview,
    handleResumeEnhancement
  };
};
