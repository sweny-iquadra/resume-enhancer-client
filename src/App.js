
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
          hasInterviews: false,
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
          score: Math.floor(Math.random() * 30) + 70
        };
        setGeneratedResumes(prev => [...prev, resume]);
        resolve(resume);
      }, 2000);
    });
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
            onCreateResume={() => setCurrentStep('profile')}
            onAttendInterview={() => setCurrentStep('profile')}
            onViewHistory={() => setCurrentStep('history')}
          />
        )}
        
        {currentStep === 'profile' && (
          <ProfileSetup
            userProfile={userProfile}
            onProfileComplete={(profile) => {
              setUserProfile(profile);
              setProfileComplete(true);
              setCurrentStep('generator');
            }}
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
