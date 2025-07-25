
import React, { useState, useEffect } from 'react';

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [selections, setSelections] = useState({});
  const [finalResume, setFinalResume] = useState(null);

  // Original resume data (mock data for comparison) - styled like a real resume
  const originalResume = {
    basicDetails: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY"
    },
    professionalSummary: "Experienced software developer with 2+ years in web development. Skilled in JavaScript and React with a passion for creating user-friendly applications.",
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
    workExperience: [
      {
        company: "Tech Solutions Inc",
        position: "Junior Developer",
        duration: "2020-2022",
        responsibilities: [
          "Developed web applications using React and JavaScript",
          "Collaborated with cross-functional teams on various projects",
          "Maintained and updated existing codebase for improved performance"
        ]
      }
    ],
    projects: [
      {
        name: "E-commerce Website",
        description: "Created a responsive e-commerce website with shopping cart functionality",
        technologies: ["HTML", "CSS", "JavaScript", "React"]
      }
    ]
  };

  // Build final resume based on selections
  useEffect(() => {
    if (!enhancedResumeData) return;

    const buildFinalResume = () => {
      const final = {
        basicDetails: {},
        professionalSummary: "",
        skills: [],
        workExperience: [],
        projects: []
      };

      // Basic Details
      Object.keys(originalResume.basicDetails).forEach(key => {
        const selectionKey = `basicDetails.${key}`;
        final.basicDetails[key] = selections[selectionKey] === 'enhanced' 
          ? enhancedResumeData.basicDetails[key] 
          : originalResume.basicDetails[key];
      });

      // Professional Summary
      final.professionalSummary = selections['professionalSummary'] === 'enhanced'
        ? enhancedResumeData.professionalSummary
        : originalResume.professionalSummary;

      // Skills
      final.skills = selections['skills'] === 'enhanced'
        ? enhancedResumeData.skills
        : originalResume.skills;

      // Work Experience
      const maxWorkExp = Math.max(originalResume.workExperience.length, enhancedResumeData.workExperience.length);
      for (let i = 0; i < maxWorkExp; i++) {
        const selectionKey = `workExperience.${i}`;
        const originalExp = originalResume.workExperience[i];
        const enhancedExp = enhancedResumeData.workExperience[i];

        if (selections[selectionKey] === 'enhanced' && enhancedExp) {
          final.workExperience.push(enhancedExp);
        } else if (originalExp) {
          final.workExperience.push(originalExp);
        }
      }

      // Projects
      const maxProjects = Math.max(originalResume.projects.length, enhancedResumeData.projects?.length || 0);
      for (let i = 0; i < maxProjects; i++) {
        const selectionKey = `projects.${i}`;
        const originalProject = originalResume.projects[i];
        const enhancedProject = enhancedResumeData.projects?.[i];

        if (selections[selectionKey] === 'enhanced' && enhancedProject) {
          final.projects.push(enhancedProject);
        } else if (originalProject) {
          final.projects.push(originalProject);
        }
      }

      setFinalResume(final);
    };

    buildFinalResume();
  }, [selections, enhancedResumeData]);

  if (!showPreview || !enhancedResumeData) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPreview(false);
    }
  };

  const handleSelection = (key, version) => {
    setSelections(prev => ({
      ...prev,
      [key]: version
    }));
  };

  const downloadResume = (format) => {
    if (!finalResume) return;

    // Create resume content
    const resumeContent = `
${finalResume.basicDetails.name}
${finalResume.basicDetails.email} | ${finalResume.basicDetails.phone}
${finalResume.basicDetails.location}

PROFESSIONAL SUMMARY
${finalResume.professionalSummary}

TECHNICAL SKILLS
${finalResume.skills.join(' • ')}

WORK EXPERIENCE
${finalResume.workExperience.map(exp => `
${exp.position} | ${exp.company} | ${exp.duration}
${exp.responsibilities.map(resp => `• ${resp}`).join('\n')}
`).join('\n')}

PROJECTS
${finalResume.projects.map(project => `
${project.name}
${project.description}
Technologies: ${project.technologies.join(', ')}
`).join('\n')}

Powered by iQua.ai
    `;

    // Create and download file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${finalResume.basicDetails.name.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Downloading resume as ${format}`);
  };

  // Microsoft Word-style document component
  const WordDocument = ({ resumeData, title, isOriginal = false }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Document Header - Word-style */}
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">{title}</span>
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-xs text-gray-500">📄</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>

        {/* Document Content - Styled like Microsoft Word */}
        <div className="p-8 min-h-[600px]" style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '1.15',
          background: 'white'
        }}>
          {/* Header Section */}
          <div className="text-center mb-6 pb-3 border-b-2 border-gray-300">
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '18pt',
              fontWeight: 'bold'
            }}>
              {resumeData.basicDetails.name}
            </h1>
            <div className="text-sm text-gray-700" style={{ fontSize: '11pt' }}>
              <span>{resumeData.basicDetails.email}</span>
              <span className="mx-2">|</span>
              <span>{resumeData.basicDetails.phone}</span>
              <span className="mx-2">|</span>
              <span>{resumeData.basicDetails.location}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-800 text-justify" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '12pt',
              lineHeight: '1.15',
              textAlign: 'justify'
            }}>
              {resumeData.professionalSummary}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              TECHNICAL SKILLS
            </h2>
            <p className="text-gray-800" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '12pt'
            }}>
              {resumeData.skills.join(' • ')}
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              WORK EXPERIENCE
            </h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {exp.position}
                  </h3>
                  <span className="text-gray-700 text-right" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt'
                  }}>
                    {exp.duration}
                  </span>
                </div>
                <div className="text-gray-800 mb-2 italic" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  fontStyle: 'italic'
                }}>
                  {exp.company}
                </div>
                <ul className="ml-4" style={{ listStyleType: 'disc' }}>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex} className="text-gray-800 mb-1" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '12pt',
                      lineHeight: '1.15'
                    }}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              PROJECTS
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-900" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  fontWeight: 'bold'
                }}>
                  {project.name}
                </h3>
                <p className="text-gray-800 mb-1" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  lineHeight: '1.15'
                }}>
                  {project.description}
                </p>
                <p className="text-gray-700 text-sm" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '11pt',
                  fontStyle: 'italic'
                }}>
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-right">
            <p className="text-xs text-gray-400" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '9pt'
            }}>
              Powered by iQua.ai
            </p>
          </div>
        </div>
      </div>
    );
  };

  const LineComparison = ({ label, originalContent, enhancedContent, selectionKey }) => {
    const isSelected = selections[selectionKey];

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h5 className="font-medium text-gray-800">{label}</h5>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {/* Original Side */}
          <div className="p-4 bg-red-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="text-sm font-medium text-gray-600">Original</span>
              </div>
              <button
                onClick={() => handleSelection(selectionKey, 'original')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isSelected === 'original'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-red-200'
                }`}
              >
                {isSelected === 'original' ? 'Selected' : 'Select Original'}
              </button>
            </div>
            <div className="bg-white border border-red-200 rounded-lg p-3">
              {typeof originalContent === 'string' ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{originalContent}</p>
              ) : Array.isArray(originalContent) ? (
                <div className="flex flex-wrap gap-1">
                  {originalContent.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  {Object.entries(originalContent).map(([key, value]) => (
                    <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Side */}
          <div className="p-4 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-sm font-medium text-gray-600">AI Enhanced</span>
              </div>
              <button
                onClick={() => handleSelection(selectionKey, 'enhanced')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isSelected === 'enhanced'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                }`}
              >
                {isSelected === 'enhanced' ? 'Selected' : 'Select Enhanced'}
              </button>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-3">
              {typeof enhancedContent === 'string' ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{enhancedContent}</p>
              ) : Array.isArray(enhancedContent) ? (
                <div className="flex flex-wrap gap-1">
                  {enhancedContent.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  {Object.entries(enhancedContent).map(([key, value]) => (
                    <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[95vh] animate-fade-in flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Smart Resume Builder</h3>
            <p className="text-sm opacity-90 mt-1">AI-powered resume comparison and customization tool</p>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 h-full">
            {/* Left Panel - Document Comparison */}
            <div className="col-span-2 overflow-y-auto p-4 border-r border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Original Resume Document */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Original Resume</h4>
                  <WordDocument 
                    resumeData={originalResume} 
                    title="Original_Resume.docx"
                    isOriginal={true}
                  />
                </div>

                {/* Enhanced Resume Document */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">AI Enhanced Resume</h4>
                  <WordDocument 
                    resumeData={enhancedResumeData} 
                    title="Enhanced_Resume.docx"
                  />
                </div>
              </div>

              {/* Line-by-Line Comparison Controls */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Preferred Content</h4>
                <div className="space-y-4">
                  {/* Basic Details Comparison */}
                  <LineComparison
                    label="Contact Information"
                    originalContent={originalResume.basicDetails}
                    enhancedContent={enhancedResumeData.basicDetails}
                    selectionKey="basicDetails"
                  />

                  {/* Professional Summary Comparison */}
                  <LineComparison
                    label="Professional Summary"
                    originalContent={originalResume.professionalSummary}
                    enhancedContent={enhancedResumeData.professionalSummary}
                    selectionKey="professionalSummary"
                  />

                  {/* Skills Comparison */}
                  <LineComparison
                    label="Skills"
                    originalContent={originalResume.skills}
                    enhancedContent={enhancedResumeData.skills}
                    selectionKey="skills"
                  />

                  {/* Work Experience Comparisons */}
                  {Math.max(originalResume.workExperience.length, enhancedResumeData.workExperience.length) > 0 && 
                    Array.from({ length: Math.max(originalResume.workExperience.length, enhancedResumeData.workExperience.length) }, (_, index) => {
                      const originalExp = originalResume.workExperience[index];
                      const enhancedExp = enhancedResumeData.workExperience[index];

                      if (!originalExp && !enhancedExp) return null;

                      return (
                        <LineComparison
                          key={`workExp-${index}`}
                          label={`Work Experience ${index + 1}`}
                          originalContent={originalExp ? `${originalExp.position} at ${originalExp.company}\n${originalExp.responsibilities.join('\n')}` : 'No experience entry'}
                          enhancedContent={enhancedExp ? `${enhancedExp.position} at ${enhancedExp.company}\n${enhancedExp.responsibilities.join('\n')}` : 'No experience entry'}
                          selectionKey={`workExperience.${index}`}
                        />
                      );
                    })
                  }

                  {/* Projects Comparisons */}
                  {Math.max(originalResume.projects.length, enhancedResumeData.projects?.length || 0) > 0 && 
                    Array.from({ length: Math.max(originalResume.projects.length, enhancedResumeData.projects?.length || 0) }, (_, index) => {
                      const originalProject = originalResume.projects[index];
                      const enhancedProject = enhancedResumeData.projects?.[index];

                      if (!originalProject && !enhancedProject) return null;

                      return (
                        <LineComparison
                          key={`project-${index}`}
                          label={`Project ${index + 1}`}
                          originalContent={originalProject ? `${originalProject.name}\n${originalProject.description}\nTech: ${originalProject.technologies.join(', ')}` : 'No project entry'}
                          enhancedContent={enhancedProject ? `${enhancedProject.name}\n${enhancedProject.description}\nTech: ${enhancedProject.technologies.join(', ')}` : 'No project entry'}
                          selectionKey={`projects.${index}`}
                        />
                      );
                    })
                  }
                </div>
              </div>
            </div>

            {/* Right Panel - Final Resume Preview (Same styling as original) */}
            <div className="overflow-y-auto p-4 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Final Resume Preview</h4>
              {finalResume && (
                <WordDocument 
                  resumeData={finalResume} 
                  title="Final_Resume.docx"
                  isOriginal={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer with Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Select your preferred content from each comparison above to build your final resume
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => downloadResume('PDF')}
                disabled={!finalResume}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📄</span>
                <span>Download as PDF</span>
              </button>
              <button
                onClick={() => downloadResume('DOC')}
                disabled={!finalResume}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📃</span>
                <span>Download as DOC</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
