
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

        // Handle individual responsibilities
        if (originalExp && enhancedExp) {
          const maxResp = Math.max(originalExp.responsibilities.length, enhancedExp.responsibilities.length);
          const selectedExp = final.workExperience[final.workExperience.length - 1];
          if (selectedExp) {
            selectedExp.responsibilities = [];
            for (let j = 0; j < maxResp; j++) {
              const respKey = `workExperience.${i}.resp.${j}`;
              if (selections[respKey] === 'enhanced' && enhancedExp.responsibilities[j]) {
                selectedExp.responsibilities.push(enhancedExp.responsibilities[j]);
              } else if (originalExp.responsibilities[j]) {
                selectedExp.responsibilities.push(originalExp.responsibilities[j]);
              }
            }
          }
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

  // Interactive Word Document component with inline accept/reject
  const InteractiveWordDocument = ({ resumeData, enhancedData, title, isOriginal = false }) => {
    const InlineSelector = ({ originalContent, enhancedContent, selectionKey, type = 'text' }) => {
      const isSelected = selections[selectionKey];
      const showEnhanced = isSelected === 'enhanced';
      const showOriginal = isSelected !== 'enhanced';

      return (
        <div className="relative group">
          {type === 'text' ? (
            <span className={`${showEnhanced ? 'bg-green-100' : showOriginal ? 'bg-blue-50' : ''}`}>
              {showEnhanced ? enhancedContent : originalContent}
            </span>
          ) : type === 'skills' ? (
            <span>
              {(showEnhanced ? enhancedContent : originalContent).join(' • ')}
            </span>
          ) : null}

          {/* Hover Buttons */}
          <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
            <button
              onClick={() => handleSelection(selectionKey, 'original')}
              className={`px-2 py-1 text-xs rounded ${
                showOriginal ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              title="Use Original"
            >
              O
            </button>
            <button
              onClick={() => handleSelection(selectionKey, 'enhanced')}
              className={`px-2 py-1 text-xs rounded ${
                showEnhanced ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              title="Use Enhanced"
            >
              E
            </button>
          </div>
        </div>
      );
    };

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
              <InlineSelector
                originalContent={resumeData.basicDetails.name}
                enhancedContent={enhancedData.basicDetails.name}
                selectionKey="basicDetails.name"
              />
            </h1>
            <div className="text-sm text-gray-700" style={{ fontSize: '11pt' }}>
              <InlineSelector
                originalContent={resumeData.basicDetails.email}
                enhancedContent={enhancedData.basicDetails.email}
                selectionKey="basicDetails.email"
              />
              <span className="mx-2">|</span>
              <InlineSelector
                originalContent={resumeData.basicDetails.phone}
                enhancedContent={enhancedData.basicDetails.phone}
                selectionKey="basicDetails.phone"
              />
              <span className="mx-2">|</span>
              <InlineSelector
                originalContent={resumeData.basicDetails.location}
                enhancedContent={enhancedData.basicDetails.location}
                selectionKey="basicDetails.location"
              />
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
              <InlineSelector
                originalContent={resumeData.professionalSummary}
                enhancedContent={enhancedData.professionalSummary}
                selectionKey="professionalSummary"
              />
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
              <InlineSelector
                originalContent={resumeData.skills}
                enhancedContent={enhancedData.skills}
                selectionKey="skills"
                type="skills"
              />
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
            {Math.max(resumeData.workExperience.length, enhancedData.workExperience.length) > 0 && 
              Array.from({ length: Math.max(resumeData.workExperience.length, enhancedData.workExperience.length) }, (_, index) => {
                const originalExp = resumeData.workExperience[index];
                const enhancedExp = enhancedData.workExperience[index];

                if (!originalExp && !enhancedExp) return null;

                const displayExp = selections[`workExperience.${index}`] === 'enhanced' ? enhancedExp : originalExp;
                if (!displayExp) return null;

                return (
                  <div key={index} className="mb-4 group relative">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900" style={{
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '12pt',
                        fontWeight: 'bold'
                      }}>
                        <InlineSelector
                          originalContent={originalExp?.position || ''}
                          enhancedContent={enhancedExp?.position || ''}
                          selectionKey={`workExperience.${index}.position`}
                        />
                      </h3>
                      <span className="text-gray-700 text-right" style={{
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '12pt'
                      }}>
                        <InlineSelector
                          originalContent={originalExp?.duration || ''}
                          enhancedContent={enhancedExp?.duration || ''}
                          selectionKey={`workExperience.${index}.duration`}
                        />
                      </span>
                    </div>
                    <div className="text-gray-800 mb-2 italic" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '12pt',
                      fontStyle: 'italic'
                    }}>
                      <InlineSelector
                        originalContent={originalExp?.company || ''}
                        enhancedContent={enhancedExp?.company || ''}
                        selectionKey={`workExperience.${index}.company`}
                      />
                    </div>
                    <ul className="ml-4" style={{ listStyleType: 'disc' }}>
                      {Math.max(originalExp?.responsibilities?.length || 0, enhancedExp?.responsibilities?.length || 0) > 0 &&
                        Array.from({ length: Math.max(originalExp?.responsibilities?.length || 0, enhancedExp?.responsibilities?.length || 0) }, (_, respIndex) => {
                          const originalResp = originalExp?.responsibilities?.[respIndex];
                          const enhancedResp = enhancedExp?.responsibilities?.[respIndex];
                          
                          if (!originalResp && !enhancedResp) return null;

                          return (
                            <li key={respIndex} className="text-gray-800 mb-1" style={{
                              fontFamily: 'Times New Roman, serif',
                              fontSize: '12pt',
                              lineHeight: '1.15'
                            }}>
                              <InlineSelector
                                originalContent={originalResp || ''}
                                enhancedContent={enhancedResp || ''}
                                selectionKey={`workExperience.${index}.resp.${respIndex}`}
                              />
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                );
              })
            }
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
            {Math.max(resumeData.projects.length, enhancedData.projects?.length || 0) > 0 &&
              Array.from({ length: Math.max(resumeData.projects.length, enhancedData.projects?.length || 0) }, (_, index) => {
                const originalProject = resumeData.projects[index];
                const enhancedProject = enhancedData.projects?.[index];

                if (!originalProject && !enhancedProject) return null;

                return (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-gray-900" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '12pt',
                      fontWeight: 'bold'
                    }}>
                      <InlineSelector
                        originalContent={originalProject?.name || ''}
                        enhancedContent={enhancedProject?.name || ''}
                        selectionKey={`projects.${index}.name`}
                      />
                    </h3>
                    <p className="text-gray-800 mb-1" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '12pt',
                      lineHeight: '1.15'
                    }}>
                      <InlineSelector
                        originalContent={originalProject?.description || ''}
                        enhancedContent={enhancedProject?.description || ''}
                        selectionKey={`projects.${index}.description`}
                      />
                    </p>
                    <p className="text-gray-700 text-sm" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '11pt',
                      fontStyle: 'italic'
                    }}>
                      <span className="font-medium">Technologies:</span>{' '}
                      <InlineSelector
                        originalContent={originalProject?.technologies?.join(', ') || ''}
                        enhancedContent={enhancedProject?.technologies?.join(', ') || ''}
                        selectionKey={`projects.${index}.technologies`}
                      />
                    </p>
                  </div>
                );
              })
            }
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
            <p className="text-sm opacity-90 mt-1">Your resume, reimagined intelligently</p>
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
          <div className="grid grid-cols-2 h-full">
            {/* Left Panel - Interactive Document */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">Interactive Resume</h4>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Hover over content and click O (Original) or E (Enhanced) to choose your preferred version
                </p>
              </div>
              <InteractiveWordDocument 
                resumeData={originalResume} 
                enhancedData={enhancedResumeData}
                title="Interactive_Resume.docx"
              />
            </div>

            {/* Right Panel - Final Resume Preview */}
            <div className="overflow-y-auto p-4 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Final Resume Preview</h4>
              {finalResume ? (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  {/* Document Header - Word-style */}
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Final_Resume.docx</span>
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
                        {finalResume.basicDetails.name}
                      </h1>
                      <div className="text-sm text-gray-700" style={{ fontSize: '11pt' }}>
                        <span>{finalResume.basicDetails.email}</span>
                        <span className="mx-2">|</span>
                        <span>{finalResume.basicDetails.phone}</span>
                        <span className="mx-2">|</span>
                        <span>{finalResume.basicDetails.location}</span>
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
                        {finalResume.professionalSummary}
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
                        {finalResume.skills.join(' • ')}
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
                      {finalResume.workExperience.map((exp, index) => (
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
                      {finalResume.projects.map((project, index) => (
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
              ) : (
                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                  Make selections on the left to see your final resume
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Click O (Original) or E (Enhanced) on content elements to customize your resume
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
