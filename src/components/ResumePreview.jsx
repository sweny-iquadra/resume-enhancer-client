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

      // Basic Details - line by line
      Object.keys(originalResume.basicDetails).forEach(key => {
        const originalKey = `original.basicDetails.${key}`;
        const enhancedKey = `enhanced.basicDetails.${key}`;

        if (selections[enhancedKey]) {
          final.basicDetails[key] = enhancedResumeData.basicDetails[key];
        } else if (selections[originalKey]) {
          final.basicDetails[key] = originalResume.basicDetails[key];
        }
      });

      // Professional Summary
      if (selections['enhanced.professionalSummary']) {
        final.professionalSummary = enhancedResumeData.professionalSummary;
      } else if (selections['original.professionalSummary']) {
        final.professionalSummary = originalResume.professionalSummary;
      }

      // Skills - individual skill selection
      originalResume.skills.forEach((skill, index) => {
        if (selections[`original.skills.${index}`]) {
          final.skills.push(skill);
        }
      });
      enhancedResumeData.skills.forEach((skill, index) => {
        if (selections[`enhanced.skills.${index}`] && !final.skills.includes(skill)) {
          final.skills.push(skill);
        }
      });

      // Work Experience - line by line
      const maxWorkExp = Math.max(originalResume.workExperience.length, enhancedResumeData.workExperience.length);
      for (let i = 0; i < maxWorkExp; i++) {
        const originalExp = originalResume.workExperience[i];
        const enhancedExp = enhancedResumeData.workExperience[i];

        const expToAdd = {};
        let hasContent = false;

        // Check position, company, duration
        ['position', 'company', 'duration'].forEach(field => {
          if (selections[`enhanced.workExperience.${i}.${field}`] && enhancedExp?.[field]) {
            expToAdd[field] = enhancedExp[field];
            hasContent = true;
          } else if (selections[`original.workExperience.${i}.${field}`] && originalExp?.[field]) {
            expToAdd[field] = originalExp[field];
            hasContent = true;
          }
        });

        // Handle responsibilities
        expToAdd.responsibilities = [];
        originalExp?.responsibilities?.forEach((resp, respIndex) => {
          if (selections[`original.workExperience.${i}.responsibilities.${respIndex}`]) {
            expToAdd.responsibilities.push(resp);
            hasContent = true;
          }
        });
        enhancedExp?.responsibilities?.forEach((resp, respIndex) => {
          if (selections[`enhanced.workExperience.${i}.responsibilities.${respIndex}`]) {
            expToAdd.responsibilities.push(resp);
            hasContent = true;
          }
        });

        if (hasContent) {
          final.workExperience.push(expToAdd);
        }
      }

      // Projects - line by line
      const maxProjects = Math.max(originalResume.projects.length, enhancedResumeData.projects?.length || 0);
      for (let i = 0; i < maxProjects; i++) {
        const originalProject = originalResume.projects[i];
        const enhancedProject = enhancedResumeData.projects?.[i];

        const projectToAdd = {};
        let hasContent = false;

        // Check name, description
        ['name', 'description'].forEach(field => {
          if (selections[`enhanced.projects.${i}.${field}`] && enhancedProject?.[field]) {
            projectToAdd[field] = enhancedProject[field];
            hasContent = true;
          } else if (selections[`original.projects.${i}.${field}`] && originalProject?.[field]) {
            projectToAdd[field] = originalProject[field];
            hasContent = true;
          }
        });

        // Handle technologies
        projectToAdd.technologies = [];
        originalProject?.technologies?.forEach((tech, techIndex) => {
          if (selections[`original.projects.${i}.technologies.${techIndex}`]) {
            projectToAdd.technologies.push(tech);
            hasContent = true;
          }
        });
        enhancedProject?.technologies?.forEach((tech, techIndex) => {
          if (selections[`enhanced.projects.${i}.technologies.${techIndex}`] && !projectToAdd.technologies.includes(tech)) {
            projectToAdd.technologies.push(tech);
            hasContent = true;
          }
        });

        if (hasContent) {
          final.projects.push(projectToAdd);
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

  const handleSelection = (key, isSelected) => {
    setSelections(prev => ({
      ...prev,
      [key]: isSelected
    }));
  };

  const downloadResume = (format) => {
    if (!finalResume) return;

    // Create resume content
    const resumeContent = `
${finalResume.basicDetails.name || ''}
${finalResume.basicDetails.email || ''} | ${finalResume.basicDetails.phone || ''}
${finalResume.basicDetails.location || ''}

PROFESSIONAL SUMMARY
${finalResume.professionalSummary || ''}

TECHNICAL SKILLS
${finalResume.skills.join(' • ')}

WORK EXPERIENCE
${finalResume.workExperience.map(exp => `
${exp.position || ''} | ${exp.company || ''} | ${exp.duration || ''}
${exp.responsibilities?.map(resp => `• ${resp}`).join('\n') || ''}
`).join('\n')}

PROJECTS
${finalResume.projects.map(project => `
${project.name || ''}
${project.description || ''}
Technologies: ${project.technologies?.join(', ') || ''}
`).join('\n')}

Powered by iQua.ai
    `;

    // Create and download file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${finalResume.basicDetails.name?.replace(/\s+/g, '_') || 'resume'}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Downloading resume as ${format}`);
  };

  // Interactive Word Document Component with line-by-line selection
  const InteractiveWordDocument = ({ resumeData, title, isOriginal = false, prefix }) => {
    const getClickableLine = (key, content, displayContent = null) => {
      const isSelected = selections[key];

      return (
        <div className="flex items-start gap-2 group">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => handleSelection(key, e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div
            className={`flex-1 cursor-pointer transition-all duration-200 rounded p-1 ${
              isSelected ? 'bg-green-100 border-green-300' : 'hover:bg-blue-50'
            }`}
            onClick={() => handleSelection(key, !isSelected)}
          >
            {displayContent || content}
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Document Header */}
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

        {/* Document Content */}
        <div className="p-8 min-h-[600px] space-y-4" style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '1.15',
          background: 'white'
        }}>
          {/* Header Section */}
          <div className="text-center mb-6 pb-3 border-b-2 border-gray-300 space-y-2">
            {getClickableLine(
              `${prefix}.basicDetails.name`,
              resumeData.basicDetails.name,
              <h1 className="text-2xl font-bold text-gray-900" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '18pt',
                fontWeight: 'bold'
              }}>
                {resumeData.basicDetails.name}
              </h1>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.email`,
              resumeData.basicDetails.email,
              <span className="text-sm text-gray-700">{resumeData.basicDetails.email}</span>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.phone`,
              resumeData.basicDetails.phone,
              <span className="text-sm text-gray-700">{resumeData.basicDetails.phone}</span>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.location`,
              resumeData.basicDetails.location,
              <span className="text-sm text-gray-700">{resumeData.basicDetails.location}</span>
            )}
          </div>

          {/* Professional Summary */}
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              PROFESSIONAL SUMMARY
            </h2>
            {getClickableLine(
              `${prefix}.professionalSummary`,
              resumeData.professionalSummary,
              <p className="text-gray-800 text-justify" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '12pt',
                lineHeight: '1.15',
                textAlign: 'justify'
              }}>
                {resumeData.professionalSummary}
              </p>
            )}
          </div>

          {/* Technical Skills */}
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase" style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
              paddingBottom: '2px'
            }}>
              TECHNICAL SKILLS
            </h2>
            <div className="space-y-1">
              {resumeData.skills.map((skill, index) => (
                <div key={index}>
                  {getClickableLine(
                    `${prefix}.skills.${index}`,
                    skill,
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mr-2 mb-1">{skill}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="mb-6 space-y-4">
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
              <div key={index} className="space-y-2">
                {getClickableLine(
                  `${prefix}.workExperience.${index}.position`,
                  exp.position,
                  <h3 className="font-bold text-gray-900" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {exp.position}
                  </h3>
                )}
                {getClickableLine(
                  `${prefix}.workExperience.${index}.company`,
                  exp.company,
                  <div className="text-gray-800 italic" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontStyle: 'italic'
                  }}>
                    {exp.company}
                  </div>
                )}
                {getClickableLine(
                  `${prefix}.workExperience.${index}.duration`,
                  exp.duration,
                  <span className="text-gray-700" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt'
                  }}>
                    {exp.duration}
                  </span>
                )}
                <div className="ml-4 space-y-1">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex}>
                      {getClickableLine(
                        `${prefix}.workExperience.${index}.responsibilities.${respIndex}`,
                        resp,
                        <li className="text-gray-800" style={{
                          fontFamily: 'Times New Roman, serif',
                          fontSize: '12pt',
                          lineHeight: '1.15',
                          listStyleType: 'disc'
                        }}>
                          {resp}
                        </li>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-6 space-y-4">
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
              <div key={index} className="space-y-2">
                {getClickableLine(
                  `${prefix}.projects.${index}.name`,
                  project.name,
                  <h3 className="font-bold text-gray-900" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {project.name}
                  </h3>
                )}
                {getClickableLine(
                  `${prefix}.projects.${index}.description`,
                  project.description,
                  <p className="text-gray-800" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    lineHeight: '1.15'
                  }}>
                    {project.description}
                  </p>
                )}
                <div className="space-y-1">
                  <span className="font-medium text-gray-700">Technologies: </span>
                  {project.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="inline-block">
                      {getClickableLine(
                        `${prefix}.projects.${index}.technologies.${techIndex}`,
                        tech,
                        <span className="inline-block bg-blue-100 px-2 py-1 rounded text-sm mr-2 mb-1">{tech}</span>
                      )}
                    </div>
                  ))}
                </div>
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

  // Final Resume Preview Component
  const FinalResumePreview = ({ resumeData }) => {
    if (!resumeData) return null;

    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Document Header */}
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

        {/* Document Content */}
        <div className="p-8 min-h-[600px]" style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '1.15',
          background: 'white'
        }}>
          {/* Header Section */}
          {(resumeData.basicDetails.name || resumeData.basicDetails.email || resumeData.basicDetails.phone || resumeData.basicDetails.location) && (
            <div className="text-center mb-6 pb-3 border-b-2 border-gray-300">
              {resumeData.basicDetails.name && (
                <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '18pt',
                  fontWeight: 'bold'
                }}>
                  {resumeData.basicDetails.name}
                </h1>
              )}
              <div className="text-sm text-gray-700 space-x-2" style={{ fontSize: '11pt' }}>
                {resumeData.basicDetails.email && <span>{resumeData.basicDetails.email}</span>}
                {resumeData.basicDetails.phone && <><span className="mx-2">|</span><span>{resumeData.basicDetails.phone}</span></>}
                {resumeData.basicDetails.location && <><span className="mx-2">|</span><span>{resumeData.basicDetails.location}</span></>}
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {resumeData.professionalSummary && (
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
          )}

          {/* Technical Skills */}
          {resumeData.skills.length > 0 && (
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
          )}

          {/* Work Experience */}
          {resumeData.workExperience.length > 0 && (
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
              {resumeData.workExperience.map((job, index) => (
                <div key={`work-${index}-${job.company}`} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-900" style={{
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '12pt',
                        fontWeight: 'bold'
                      }}>
                        {job.position}
                      </h4>
                      <p className="text-gray-700" style={{
                        fontFamily: 'Times New Roman, serif',
                        fontSize: '11pt',
                        fontStyle: 'italic'
                      }}>
                        {job.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '11pt'
                    }}>
                      {job.duration}
                    </span>
                  </div>
                  {job.responsibilities && (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '11pt'
                    }}>
                      {job.responsibilities.map((resp, respIndex) => (
                        <li key={`resp-${index}-${respIndex}`}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
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
                <div key={`project-${index}-${project.name}`} className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '11pt'
                  }}>
                    {project.description}
                  </p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600" style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '10pt',
                      fontStyle: 'italic'
                    }}>
                      <strong>Technologies:</strong> {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

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
            <p className="text-sm opacity-90 mt-1">Select individual lines to build your perfect resume</p>
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
            {/* Left Panel - Original Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Original Resume</h4>
                <p className="text-sm text-gray-600">Check lines to include in your final resume</p>
              </div>
              <InteractiveWordDocument 
                resumeData={originalResume} 
                title="Original_Resume.docx"
                isOriginal={true}
                prefix="original"
              />
            </div>

            {/* Middle Panel - Enhanced Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Enhanced Resume</h4>
                <p className="text-sm text-gray-600">Check lines to include in your final resume</p>
              </div>
              <InteractiveWordDocument 
                resumeData={enhancedResumeData} 
                title="Enhanced_Resume.docx"
                isOriginal={false}
                prefix="enhanced"
              />
            </div>

            {/* Right Panel - Final Resume Preview */}
            <div className="overflow-y-auto p-4 bg-gray-50">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Final Resume Preview</h4>
                <p className="text-sm text-gray-600">Real-time preview of your selections</p>
              </div>
              {finalResume && <FinalResumePreview resumeData={finalResume} />}
              {!finalResume && (
                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                  <div className="mb-4">📄</div>
                  <p>Start checking lines from the original or enhanced resume to build your final version</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Check individual lines to customize your resume with granular control
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