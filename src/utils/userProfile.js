
// Dummy user object with interview history
export const createUserProfile = () => ({
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  education: {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Technology",
    graduationYear: "2020"
  },
  role: "Software Developer",
  sector: "Technology",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  professionalSummary: null, // Made null to test missing field
  workExperience: [
    {
      company: "Tech Solutions Inc",
      position: "Junior Developer",
      duration: "2020-2022",
      responsibilities: ["Developed web applications", "Collaborated with team"]
    }
  ],
  projects: null, // Made null to test missing field
  interviewHistory: [
    {
      id: 1,
      role: "Frontend Developer",
      date: "2024-01-15",
      completed: true
    },
    {
      id: 2,
      role: "Full Stack Developer",
      date: "2024-01-20",
      completed: true
    },
    {
      id: 3,
      role: "Backend Developer",
      date: "2024-01-25",
      completed: true
    },
    {
      id: 4,
      role: "DevOps Engineer",
      date: "2024-01-30",
      completed: true
    }
  ]
});

// Function to check if profile is complete
export const checkProfileCompletion = (userProfile) => {
  const requiredFields = [
    userProfile.name,
    userProfile.email,
    userProfile.phone,
    userProfile.education?.degree,
    userProfile.role,
    userProfile.sector,
    userProfile.skills?.length > 0,
    userProfile.professionalSummary,
    userProfile.workExperience?.length > 0,
    userProfile.projects
  ];

  return requiredFields.every(field => field !== null && field !== undefined && field !== '');
};

// Function to get completed interviews count
export const getCompletedInterviewsCount = (userProfile) => {
  return userProfile.interviewHistory?.filter(interview => interview.completed).length || 0;
};

// Function to get unique job roles from interview history
export const getUniqueJobRoles = (userProfile) => {
  const completedInterviews = userProfile.interviewHistory?.filter(interview => interview.completed) || [];
  const uniqueRoles = [...new Set(completedInterviews.map(interview => interview.role))];
  return uniqueRoles;
};



