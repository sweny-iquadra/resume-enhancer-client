
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import ResumeGenerator from './components/ResumeGenerator';
import ResumeHistory from './components/ResumeHistory';
import './App.css';

// Mock API functions
const checkUserProfile = async () => {
  return {
    complete: false,
    hasInterviews: null,
    profile: null,
    dailyGenerated: 0,
    totalGenerated: 0
  };
};

const generateResumeAPI = async (profile, resumeType, targetRole) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: Date.now(),
    type: resumeType,
    targetRole: targetRole,
    content: `Generated ${resumeType} resume for ${targetRole} position`,
    createdAt: new Date().toISOString(),
    profile: profile
  };
};

function App() {
  const [currentStep, setCurrentStep] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [hasAttendedInterviews, setHasAttendedInterviews] = useState(null);
  const [generatedResumes, setGeneratedResumes] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dailyLimit, setDailyLimit] = useState({ used: 0, max: 3 });

  useEffect(() => {
    // Initialize user data
    checkUserProfile().then(data => {
      setProfileComplete(data.complete);
      setHasAttendedInterviews(data.hasInterviews);
      setUserProfile(data.profile);
      setDailyLimit({ used: data.dailyGenerated, max: 3 });
    });
  }, []);

  // Step 1: User logs into Dashboard and clicks "Resume Enhancer" Icon
  const handleResumeEnhancerClick = () => {
    console.log("User clicked Resume Enhancer");
    // Check if user has attended interviews
    if (hasAttendedInterviews === null) {
      setShowInterviewModal(true);
    } else {
      handleInterviewFlowDecision();
    }
  };

  // Step 2: Has User Attended Interview(s)?
  const handleInterviewResponse = (attended) => {
    setHasAttendedInterviews(attended);
    setShowInterviewModal(false);
    
    if (!attended) {
      // Show "Attend Interview First" modal
      setShowInterviewModal(false);
      setCurrentStep('no-interview');
    } else {
      // Check Profile Completion
      handleInterviewFlowDecision();
    }
  };

  const handleInterviewFlowDecision = () => {
    if (hasAttendedInterviews) {
      // Check profile completion
      if (!profileComplete) {
        setShowProfileModal(true);
      } else {
        // Check if attended 3+ interviews for role selection
        setCurrentStep('resume-generation');
      }
    }
  };

  // Profile completion flow
  const handleProfileModalChoice = (choice) => {
    setShowProfileModal(false);
    if (choice === 'update') {
      setCurrentStep('profile');
    } else if (choice === 'generate') {
      setCurrentStep('resume-generation');
    }
  };

  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    setProfileComplete(true);
    setCurrentStep('resume-generation');
  };

  // Resume generation
  const generateResume = async (resumeType, targetRole) => {
    if (dailyLimit.used >= dailyLimit.max) {
      alert("Daily generation limit reached (3/day). Try again tomorrow.");
      return;
    }

    try {
      const resume = await generateResumeAPI(userProfile, resumeType, targetRole);
      setGeneratedResumes(prev => [resume, ...prev]);
      setDailyLimit(prev => ({ ...prev, used: prev.used + 1 }));
      setCurrentStep('resume-preview');
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Dashboard */}
        {currentStep === 'dashboard' && (
          <Dashboard
            onResumeEnhancerClick={handleResumeEnhancerClick}
            onViewHistory={() => setCurrentStep('history')}
            hasAttendedInterviews={hasAttendedInterviews}
            profileComplete={profileComplete}
          />
        )}

        {/* Step 2: No Interview Flow */}
        {currentStep === 'no-interview' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Attend Interview First!</h2>
              <p className="text-gray-600 mb-6">
                We recommend attending interviews first to better understand what employers are looking for. 
                However, you can still create a resume to help you prepare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentStep('profile')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Resume
                </button>
                <button
                  onClick={() => setCurrentStep('dashboard')}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Setup */}
        {currentStep === 'profile' && (
          <ProfileSetup
            userProfile={userProfile}
            onProfileComplete={handleProfileComplete}
            onBack={() => setCurrentStep('dashboard')}
          />
        )}

        {/* Resume Generation */}
        {currentStep === 'resume-generation' && (
          <ResumeGenerator
            userProfile={userProfile}
            onGenerateResume={generateResume}
            onBack={() => setCurrentStep('dashboard')}
            generatedResumes={generatedResumes}
            dailyLimit={dailyLimit}
            hasAttendedMultipleInterviews={true} // This would be determined by actual interview data
          />
        )}

        {/* Resume Preview */}
        {currentStep === 'resume-preview' && generatedResumes.length > 0 && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Resume Generated</h1>
              <button
                onClick={() => setCurrentStep('dashboard')}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
              <p className="text-gray-600 mb-4">{generatedResumes[0].content}</p>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Download DOCX
                </button>
                <button 
                  onClick={() => setCurrentStep('resume-generation')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Daily Generation Limit: {dailyLimit.used}/{dailyLimit.max}
              </p>
            </div>
          </div>
        )}

        {/* Resume History */}
        {currentStep === 'history' && (
          <ResumeHistory
            resumes={generatedResumes}
            onBack={() => setCurrentStep('dashboard')}
          />
        )}
      </div>

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Have you attended any interviews?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleInterviewResponse(true)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => handleInterviewResponse(false)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Profile Incomplete!
            </h3>
            <p className="text-gray-600 mb-6">
              Your profile is not complete. What would you like to do?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleProfileModalChoice('update')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Update Profile Now
              </button>
              <button
                onClick={() => handleProfileModalChoice('generate')}
                className="px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                Generate Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
