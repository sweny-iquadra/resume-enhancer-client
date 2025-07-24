
import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import ResumeGenerator from './components/ResumeGenerator';
import ResumeHistory from './components/ResumeHistory';

function App() {
  const [currentStep, setCurrentStep] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [hasAttendedInterviews, setHasAttendedInterviews] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [generatedResumes, setGeneratedResumes] = useState([]);

  // API placeholder functions
  const checkUserProfile = async () => {
    // API call placeholder
    console.log('API: Checking user profile...');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ 
          complete: false, 
          hasInterviews: null, // null means not asked yet
          profile: null 
        });
      }, 1000);
    });
  };

  const generateResume = async (type, profileData) => {
    // API call placeholder
    console.log('API: Generating resume...', { type, profileData });
    return new Promise(resolve => {
      setTimeout(() => {
        const resume = {
          id: Date.now(),
          type,
          createdAt: new Date(),
          downloadUrl: '#',
          score: Math.floor(Math.random() * 30) + 70,
          targetRole: profileData.targetRole || 'General',
          profileData
        };
        setGeneratedResumes(prev => [...prev, resume]);
        resolve(resume);
      }, 3000); // Longer delay to simulate actual generation
    });
  };

  const handleInterviewStatus = (attended) => {
    setHasAttendedInterviews(attended);
    
    if (!attended) {
      // Show "Attend Interview First" message
      // But still allow profile setup if they click Create Resume
      return;
    }
    
    // If they have attended interviews, check profile completion
    if (!profileComplete && !userProfile) {
      setCurrentStep('profile');
    }
  };

  const handleCreateResume = () => {
    if (hasAttendedInterviews === false) {
      // They haven't attended interviews, but we'll help them prepare
      setCurrentStep('profile');
      return;
    }
    
    if (!profileComplete || !userProfile) {
      setCurrentStep('profile');
    } else {
      setCurrentStep('generator');
    }
  };

  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    setProfileComplete(true);
    setCurrentStep('generator');
  };

  useEffect(() => {
    // Initialize user data
    checkUserProfile().then(data => {
      setProfileComplete(data.complete);
      setHasAttendedInterviews(data.hasInterviews);
      setUserProfile(data.profile);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'dashboard' && (
          <Dashboard
            hasAttendedInterviews={hasAttendedInterviews}
            profileComplete={profileComplete}
            onCreateResume={handleCreateResume}
            onAttendInterview={handleInterviewStatus}
            onViewHistory={() => setCurrentStep('history')}
          />
        )}
        
        {currentStep === 'profile' && (
          <ProfileSetup
            userProfile={userProfile}
            onProfileComplete={handleProfileComplete}
            onBack={() => setCurrentStep('dashboard')}
          />
        )}
        
        {currentStep === 'generator' && (
          <ResumeGenerator
            userProfile={userProfile}
            onGenerateResume={generateResume}
            onBack={() => setCurrentStep('dashboard')}
            generatedResumes={generatedResumes}
          />
        )}
        
        {currentStep === 'history' && (
          <ResumeHistory
            resumes={generatedResumes}
            onBack={() => setCurrentStep('dashboard')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
