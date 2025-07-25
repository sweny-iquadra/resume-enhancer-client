
import { useState } from 'react';
import { createUserProfile, checkProfileCompletion } from '../utils/userProfile';

export const useResumeLogic = () => {
  const [showResumeChat, setShowResumeChat] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [hasAttendedInterview, setHasAttendedInterview] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile] = useState(createUserProfile());

  const handleCreateResumeClick = () => {
    if (!hasAttendedInterview) {
      setShowInterviewModal(true);
    } else {
      // Check if profile is complete
      if (!checkProfileCompletion(userProfile)) {
        setShowProfileModal(true);
      } else {
        // Handle resume creation logic here
        console.log('Creating resume...');
        alert('Resume creation started!');
      }
    }
  };

  const navigateToInterview = () => {
    setCurrentPage('interview');
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
    setHasAttendedInterview,
    showProfileModal,
    setShowProfileModal,
    userProfile,
    handleCreateResumeClick,
    navigateToInterview
  };
};
