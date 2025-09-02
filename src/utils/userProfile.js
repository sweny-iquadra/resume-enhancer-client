import { checkStudentProfileCompletion } from './api';

// Function to check if profile is complete
export const checkProfileCompletion = async (user) => {
  const studentId = user?.id;
  if (studentId) {
    const profileCompletion = await checkStudentProfileCompletion(studentId);
    return profileCompletion;
  }
};

// Function to get completed interviews count
//export const getCompletedInterviewsCount = (userProfile) => {
// return userProfile.interviewHistory?.filter(interview => interview.completed).length || 0;
//};

// Function to get unique job roles from interview history
//export const getUniqueJobRoles = (userProfile) => {
// const completedInterviews = userProfile.interviewHistory?.filter(interview => interview.completed) || [];
// const uniqueRoles = [...new Set(completedInterviews.map(interview => interview.role))];
// return uniqueRoles;
//};



