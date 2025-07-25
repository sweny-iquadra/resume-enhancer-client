
import { useState } from 'react';
import { createUserProfile, checkProfileCompletion, getCompletedInterviewsCount, getUniqueJobRoles } from '../utils/userProfile';

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
    } else if (uniqueRoles.length >= 3) {
      // Show role selection in chat
      setShowRoleSelection(true);
    } else {
      // Proceed with single role or check profile completion
      const defaultRole = uniqueRoles[0] || userProfile.role;
      setSelectedRole(defaultRole);
      
      if (!checkProfileCompletion(userProfile)) {
        setShowProfileModal(true);
      } else {
        // Handle resume creation logic here
        console.log('Creating resume...');
        alert('Resume creation started!');
      }
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
    
    if (!checkProfileCompletion(userProfile)) {
      setShowProfileModal(true);
    } else {
      // Handle resume creation logic here
      console.log('Creating resume with role:', role);
      alert('Resume creation started!');
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
    setShowPreview
  };
};
