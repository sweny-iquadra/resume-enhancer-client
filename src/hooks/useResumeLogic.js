
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
    } else if (uniqueRoles.length >= 3) {
      // Show role selection in chat
      setShowRoleSelection(true);
    } else {
      // Proceed with single role or check profile completion
      const defaultRole = uniqueRoles[0] || userProfile.role;
      setSelectedRole(defaultRole);
      
      if (checkProfileCompletion(userProfile)) {
        // Profile is complete - proceed with resume enhancement
        handleResumeEnhancement(defaultRole);
      } else {
        setShowProfileModal(true);
      }
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
    
    if (checkProfileCompletion(userProfile)) {
      // Profile is complete - proceed with resume enhancement
      handleResumeEnhancement(role);
    } else {
      setShowProfileModal(true);
    }
  };

  const handleResumeEnhancement = async (role) => {
    setIsLoading(true);
    
    try {
      // Create original resume from user profile
      const originalResume = {
        basicDetails: {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          location: "New York, NY" // Default location
        },
        professionalSummary: userProfile.professionalSummary,
        skills: userProfile.skills,
        workExperience: userProfile.workExperience,
        projects: userProfile.projects || []
      };

      // Call the enhance resume API with user profile data and original resume
      const response = await enhanceResumeAPI(role, userProfile, originalResume);
      
      if (response.success) {
        // Store both original and enhanced resume data
        const resumeData = {
          originalResume: originalResume,
          enhancedResume: response.data.enhancedResume,
          userRole: role
        };
        
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        
        // Update state with complete resume data
        setEnhancedResumeData(resumeData);
        
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
