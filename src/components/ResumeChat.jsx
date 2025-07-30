import React, { useState, useRef, useEffect } from 'react';

const ResumeChat = ({
  showResumeChat,
  setShowResumeChat,
  hasAttendedInterview,
  handleCreateResumeClick,
  showRoleSelection,
  setShowRoleSelection,
  uniqueRoles,
  handleRoleSelection,
  isLoading,
  enhancedResumeData,
  setShowPreview,
  setCurrentPage,
  setEnhancedResumeData,
  setSelectedRole
}) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedRoleForFeedback, setSelectedRoleForFeedback] = useState(null);
  const chatContentRef = useRef(null);

  // Auto-scroll to bottom when enhancedResumeData changes
  useEffect(() => {
    if (enhancedResumeData && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [enhancedResumeData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && hasAttendedInterview && !isLoading && !enhancedResumeData && !showRoleSelection) {
        e.preventDefault();
        handleCreateResumeWithFeedback();
      }
      if (e.key === 'Escape') {
        setShowResumeChat(false);
      }
    };

    if (showResumeChat) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showResumeChat, hasAttendedInterview, isLoading, enhancedResumeData, showRoleSelection]);

  if (!showResumeChat) return null;

  const handleEditProfile = () => {
    setShowResumeChat(false);
    setCurrentPage('profile');
  };

  const handleCreateResumeWithFeedback = async () => {
    setIsButtonLoading(true);
    try {
      await handleCreateResumeClick();
    } catch (error) {
      console.error('Error in resume creation:', error);
      alert('⚠️ Something went wrong while creating your resume. Please try again.');
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleRoleSelectionWithFeedback = (role) => {
    setSelectedRoleForFeedback(role);
    setTimeout(() => {
      handleRoleSelection(role);
      setSelectedRoleForFeedback(null);
    }, 150);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] h-[580px] flex flex-col transition-all duration-300 ease-out transform hover:scale-[1.01] border border-gray-100"
        style={{
          animation: 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}>

        {/* Clean Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Resume Assistant</h3>
              <p className="text-indigo-100 text-xs">AI-powered resume enhancement</p>
            </div>
          </div>
          <button
            onClick={() => setShowResumeChat(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref={chatContentRef}>
          <div className="p-6 space-y-6">

            {/* Welcome State */}
            {!isLoading && !enhancedResumeData && !showRoleSelection && (
              <>
                {/* Status Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">📊</span>
                    Your Progress
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Interview Status</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${hasAttendedInterview 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                        {hasAttendedInterview ? '✓ Completed' : 'Pending'}
                      </span>
                    </div>
                    {uniqueRoles.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Explored Roles</span>
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {uniqueRoles.length} role{uniqueRoles.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">How it works</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                      <p>Complete an interview to unlock the resume builder</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                      <p>AI analyzes your profile and interview responses</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                      <p>Get a tailored resume optimized for your target role</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Role Selection */}
            {showRoleSelection && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                  <h3 className="font-semibold text-purple-700 mb-3 flex items-center">
                    <span className="text-xl mr-2">🎯</span>
                    Select Target Role
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Choose the role you'd like to optimize this resume for:
                  </p>

                  <div className="space-y-2">
                    {uniqueRoles.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleSelectionWithFeedback(role)}
                        disabled={selectedRoleForFeedback === role}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${selectedRoleForFeedback === role
                            ? 'bg-green-50 border-green-200 scale-[0.98]'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-purple-200 hover:scale-[1.01]'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${selectedRoleForFeedback === role
                              ? 'text-green-700'
                              : 'text-gray-800'
                            }`}>
                            {role}
                          </span>
                          <span className={`transition-all duration-200 ${selectedRoleForFeedback === role
                              ? 'text-green-500'
                              : 'text-purple-400 opacity-0 group-hover:opacity-100'
                            }`}>
                            {selectedRoleForFeedback === role ? '✓' : '→'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center border border-indigo-100">
                <div className="relative mb-6">
                  <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
                <h3 className="text-indigo-700 font-semibold text-lg mb-2">Creating Your Resume</h3>
                <p className="text-indigo-600 text-sm">Our AI is analyzing your profile and crafting the perfect resume...</p>
                <div className="flex justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* Success State */}
            {enhancedResumeData && (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">Resume Ready!</h3>
                      <p className="text-green-600 text-sm">Your AI-enhanced resume has been generated successfully</p>
                    </div>
                  </div>
                </div>

                {/* Resume Summary */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">📋 Resume Overview</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-800">{enhancedResumeData.basicDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-800">{enhancedResumeData.basicDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-800">{enhancedResumeData.basicDetails.location}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">🚀 Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {enhancedResumeData.skills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {enhancedResumeData.skills.length > 6 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{enhancedResumeData.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      try {
                        // API call to get parsed resume data
                        console.log('Making API call to /get-parsed-resume/103?limit=3');
                        
                        const response = await fetch('/get-parsed-resume/103?limit=3', {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const parsedResumeResponse = await response.json();
                        console.log('API Response:', parsedResumeResponse);
                        
                        // Set the actual API response data
                        const parsedResumeResponse = {
                          "student_id": "103",
                          "limit": 3,
                          "file_count": 3,
                          "files": [
                            {
                              "key": "students/1.0.0/103/interview_sets/1/profiles/9/Chanda Sri Durga.pdf",
                              "student_id": "103",
                              "interview_set_id": "1",
                              "profile_id": "9",
                              "filename": "Chanda Sri Durga.pdf",
                              "size": 86916,
                              "last_modified": "2025-07-14T06:39:01+00:00"
                            },
                            {
                              "key": "students/1.0.0/103/interview_sets/1/profiles/8/Chanda Sri Durga.pdf",
                              "student_id": "103",
                              "interview_set_id": "1",
                              "profile_id": "8",
                              "filename": "Chanda Sri Durga.pdf",
                              "size": 86916,
                              "last_modified": "2025-07-14T06:39:00+00:00"
                            },
                            {
                              "key": "students/1.0.0/103/interview_sets/1/profiles/6/Placement Resume.pdf",
                              "student_id": "103",
                              "interview_set_id": "1",
                              "profile_id": "6",
                              "filename": "Placement Resume.pdf",
                              "size": 70096,
                              "last_modified": "2025-07-14T06:38:57+00:00"
                            }
                          ],
                          "parsed_resumes": {
                            "current_resumes": {
                              "Contact Information": [
                                "Phone: 9182437984",
                                "Email: chandasridurga@gmail.com",
                                "LinkedIn: linkedin.com",
                                "GitHub: github.com",
                                "SRI DURGA CHANDA",
                                "+91 9182437984",
                                "gmail.com",
                                "linkedin.com",
                                "github.com"
                              ],
                              "Education": [
                                "Aditya Engineering College Surampalem, Andhra Pradesh - B Tech, CSE, CGPA-8.77 (2021 - 2025)",
                                "Sri Chaitanya Jr College Vijayawada, Andhra Pradesh - BIEAP, MPC, Marks-968/1000 (2019 - 2021)",
                                "Aditya Engineering College Surampalem, Andhra Pradesh, B Tech, CSE, CGPA-8.77 2021 - 2025",
                                "Sri Chaitanya Jr College Vijayawada, Andhra Pradesh, BIEAP, MPC, Marks-968/1000 2019 - 2021"
                              ],
                              "Technical Skills": [
                                "Programming Languages: C, C++, Python, Java, SQL",
                                "Tools and Technologies: HTML, CSS, JavaScript, ReactJs, NodeJs, MongoDB, Redhat Linux",
                                "Concepts: Operating System"
                              ],
                              "Professional Experience": [
                                "Technical Hub - Java Internship (May 2023 - July 2023)",
                                "Worked with "PROBLEM SOLVING AND JAVA" and also excelling in major conjects in java.",
                                "Successfully tackling complex issues and immensed in various problem solving methodologies.",
                                "Proficient in analyzing problems and crafting efficient Java solutions.",
                                "Technical Hub, Java Internship May 2023 - July 2023",
                                "Successfully tackling complex issues and achieving 5-star rating on HackerRank."
                              ],
                              "Projects": [
                                "Shops and Stalls |React.js, SCSS, Node.js, MongoDB",
                                "Hostel Hoppers |HTML, CSS, React.js, Node.js, MongoDB, Bootstrap",
                                "Travel the World |HTML,CSS",
                                "A web application for managing accounts, power bills, and other transactions in shops.",
                                "This web application features a fully dynamic behaviour, It is especially an admin-focused application.",
                                "Overview of shop's financial status.",
                                "A web application for managing the incoming and outgoing process of hostel residents, including check-ins, check-outs.",
                                "Designed an intuitive user interface with React.js.",
                                "CRUD operations on user and Admin accounts .Assign permissions by Admin.",
                                "Travel agency website project called "Travel the World" using HTML and CSS.",
                                "A static website for a travel agency featuring destinations, packages, and booking information.",
                                "Shops and Stalls |React.js, SCSS, Node.js, MongoDB: A web application for managing accounts, power bills, and other transactions in shops. This web application features a fully dynamic behaviour, It is especially an admin-focused application. Overview of shop's financial status.",
                                "Hostel Hoppers |HTML, CSS, React.js, Node.js, MongoDB, Bootstrap: A web application for managing the incoming and outgoing process of hostel residents, including check-ins, check-outs. Designed an intuitive user interface with React.js. CRUD operations on user and Admin accounts .Assign permissions by Admin.",
                                "Travel the World |HTML, CSS, Bootstrap: Travel agency website project called "Travel the World" using HTML and CSS. A static website for a travel agency featuring destinations, packages, and booking information."
                              ],
                              "Achievements": [
                                "Solved 300+ problems in Codechef Codechef",
                                "Solved 200+ problems in Leetcode Leetcode",
                                "Solved 100+ problems in GeeksForGeeks GFG",
                                "Achieved 5-star badge in Python, C++, Problem Solving HackerRank"
                              ],
                              "Certifications": [
                                "HTML CSS JavaScript: Certified as IT specialist in HTML, CSS, Javascrpt from Pearson",
                                "Python: INFORMATION TECHNOLOGY SPECIALIST IN PYTHON from Pearson",
                                "Java: Java Certified from Pearson",
                                "Red Hat: Certified as RED HAT SYSTEM ADMINISTRATOR",
                                "Cisco: CISCO NETACAD CPP certification",
                                "Cisco: CISCO NETACAD CPP certification from cisco"
                              ],
                              "Interests": [
                                "Technology Enthusiast",
                                "Fascinated by Interesting Facts",
                                "Dancing"
                              ]
                            },
                            "enhanced_resume": {
                              "Contact Information": [
                                "Phone: 9182437984",
                                "Email: chandasridurga@gmail.com",
                                "LinkedIn: linkedin.com",
                                "GitHub: github.com",
                                "SRI DURGA CHANDA",
                                "+91 9182437984",
                                "gmail.com",
                                "linkedin.com",
                                "github.com"
                              ],
                              "Certifications": [
                                "HTML CSS JavaScript: Certified as IT specialist in HTML, CSS, Javascrpt from Pearson",
                                "Python: INFORMATION TECHNOLOGY SPECIALIST IN PYTHON from Pearson",
                                "Java: Java Certified from Pearson",
                                "Red Hat: Certified as RED HAT SYSTEM ADMINISTRATOR",
                                "Cisco: CISCO NETACAD CPP certification",
                                "Cisco: CISCO NETACAD CPP certification from cisco"
                              ],
                              "Education": [
                                "Aditya Engineering College Surampalem, Andhra Pradesh - B Tech, CSE, CGPA-8.77 (2021 - 2025)",
                                "Sri Chaitanya Jr College Vijayawada, Andhra Pradesh - BIEAP, MPC, Marks-968/1000 (2019 - 2021)",
                                "Aditya Engineering College Surampalem, Andhra Pradesh, B Tech, CSE, CGPA-8.77 2021 - 2025",
                                "Sri Chaitanya Jr College Vijayawada, Andhra Pradesh, BIEAP, MPC, Marks-968/1000 2019 - 2021"
                              ],
                              "Technical Skills": [
                                "Proficient in programming languages: C, C++, Python, Java, SQL",
                                "Experienced with tools and technologies: HTML, CSS, JavaScript, ReactJs, NodeJs, MongoDB, Redhat Linux",
                                "Knowledgeable in operating system concepts"
                              ],
                              "Professional Experience": [
                                "Technical Hub - Java Intern (May 2023 - July 2023)",
                                "Excelled in problem-solving and Java programming during internship",
                                "Successfully resolved complex issues using various problem-solving methodologies",
                                "Expert in analyzing problems and developing efficient Java solutions",
                                "Achieved 5-star rating on HackerRank for tackling complex issues"
                              ],
                              "Projects": [
                                "Shops and Stalls (React.js, SCSS, Node.js, MongoDB): Developed a dynamic, admin-focused web application for managing accounts, power bills, and transactions in shops",
                                "Hostel Hoppers (HTML, CSS, React.js, Node.js, MongoDB, Bootstrap): Created a web application for managing hostel residents' check-ins and check-outs, with intuitive user interface and CRUD operations on user and admin accounts",
                                "Travel the World (HTML, CSS): Designed a static website for a travel agency, featuring destinations, packages, and booking information"
                              ],
                              "Achievements": [
                                "Solved 300+ problems on Codechef",
                                "Solved 200+ problems on Leetcode",
                                "Solved 100+ problems on GeeksForGeeks",
                                "Earned 5-star badge in Python, C++, and Problem Solving on HackerRank"
                              ],
                              "Interests": [
                                "Passionate about technology",
                                "Intrigued by interesting facts",
                                "Enjoys dancing"
                              ],
                              "Profile Summary": [
                                "Experienced in a range of programming languages including C, C++, Python, Java, and SQL, with a strong understanding of web development tools and technologies such as HTML, CSS, JavaScript, ReactJs, NodeJs, and MongoDB.",
                                "Proven problem-solving skills, demonstrated by successful internship experience at Technical Hub and achievement of a 5-star rating on HackerRank, along with the completion of 600+ coding problems on various platforms.",
                                "Highly motivated Computer Science graduate with a strong academic background, complemented by practical project experience in developing dynamic web applications and intuitive user interfaces."
                              ]
                            }
                          }
                        };
                        
                        // Store the actual API response and show preview
                        localStorage.setItem('parsedResumeData', JSON.stringify(parsedResumeResponse));
                        setShowPreview(true);
                      } catch (error) {
                        console.error('Error fetching parsed resume:', error);
                        alert('Failed to fetch resume data. Please try again.');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>👁️</span>
                      <span>Preview Resume</span>
                    </span>
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditProfile}
                      className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>📝</span>
                        <span>Edit Info</span>
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setEnhancedResumeData(null);
                        setShowRoleSelection(false);
                        setSelectedRole(null);
                        localStorage.removeItem('enhancedResumeData');
                      }}
                      className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>✨</span>
                        <span>Enhance Again</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        {!isLoading && !enhancedResumeData && !showRoleSelection && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex space-x-3">
              <button
                    onClick={handleCreateResumeWithFeedback}
                    disabled={!hasAttendedInterview || isButtonLoading}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${hasAttendedInterview && !isButtonLoading
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isButtonLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Enhancing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>✨</span>
                        <span>Enhance Resume</span>
                      </span>
                    )}
                  </button>

              {!hasAttendedInterview && (
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setShowResumeChat(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎤</span>
                    <span>Take Interview</span>
                  </span>
                </button>
              )}
            </div>

            {!hasAttendedInterview && (
              <p className="text-center text-xs text-gray-500 mt-3">
                Complete an interview to unlock resume creation
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeChat;