
// Dummy user object
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
  professionalSummary: null, // This will be auto-generated
  workExperience: [
    {
      company: "Tech Solutions Inc",
      position: "Junior Developer",
      duration: "2020-2022",
      responsibilities: ["Developed web applications", "Collaborated with team"]
    }
  ],
  projects: null // Missing project information
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
