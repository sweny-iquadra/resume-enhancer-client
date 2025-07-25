
import React, { useState, useEffect } from 'react';

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [selections, setSelections] = useState({});
  const [finalResume, setFinalResume] = useState(null);

  // Extract data from the enhanced resume data structure
  const originalResume = enhancedResumeData?.originalResume;
  const enhancedResume = enhancedResumeData?.enhancedResume;
  const userRole = enhancedResumeData?.userRole;

  // Build final resume based on selections
  useEffect(() => {
    if (!enhancedResume || !originalResume) return;

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
        ? enhancedResume.skills
        : originalResume.skills;

      // Work Experience
      const maxWorkExp = Math.max(originalResume.workExperience?.length || 0, enhancedResume.workExperience?.length || 0);
      for (let i = 0; i < maxWorkExp; i++) {
        const selectionKey = `workExperience.${i}`;
        const originalExp = originalResume.workExperience?.[i];
        const enhancedExp = enhancedResume.workExperience?.[i];

        if (selections[selectionKey] === 'enhanced' && enhancedExp) {
          final.workExperience.push(enhancedExp);
        } else if (originalExp) {
          final.workExperience.push(originalExp);
        }
      }

      // Projects
      const maxProjects = Math.max(originalResume.projects?.length || 0, enhancedResume.projects?.length || 0);
      for (let i = 0; i < maxProjects; i++) {
        const selectionKey = `projects.${i}`;
        const originalProject = originalResume.projects?.[i];
        const enhancedProject = enhancedResume.projects?.[i];

        if (selections[selectionKey] === 'enhanced' && enhancedProject) {
          final.projects.push(enhancedProject);
        } else if (originalProject) {
          final.projects.push(originalProject);
        }
      }

      setFinalResume(final);
    };

    buildFinalResume();
  }, [selections, enhancedResume, originalResume]);

  if (!showPreview || !enhancedResumeData || !originalResume || !enhancedResume) return null;

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

  // Interactive Word Document Component with clickable sections
  const InteractiveWordDocument = ({ resumeData, enhancedData, title, isOriginal = false }) => {
    const getClickableSection = (sectionKey, content, isHeader = false) => {
      const isSelected = selections[sectionKey];
      const isFromOriginal = isSelected === 'original';
      const isFromEnhanced = isSelected === 'enhanced';
      
      let bgColor = 'hover:bg-blue-50';
      let borderColor = 'hover:border-blue-300';
      
      if (isFromOriginal && isOriginal) {
        bgColor = 'bg-green-100 border-green-300';
      } else if (isFromEnhanced && !isOriginal) {
        bgColor = 'bg-green-100 border-green-300';
      } else if ((isFromOriginal && !isOriginal) || (isFromEnhanced && isOriginal)) {
        bgColor = 'bg-gray-100 opacity-50';
      }

      return (
        <div
          className={`cursor-pointer transition-all duration-200 border-2 border-transparent rounded p-1 ${bgColor} ${borderColor}`}
          onClick={() => handleSelection(sectionKey, isOriginal ? 'original' : 'enhanced')}
          title={`Click to select this ${isOriginal ? 'original' : 'enhanced'} content`}
        >
          {content}
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
            {getClickableSection('name', 
              <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '18pt',
                fontWeight: 'bold'
              }}>
                {resumeData.basicDetails.name}
              </h1>
            )}
            {getClickableSection('contact',
              <div className="text-sm text-gray-700" style={{ fontSize: '11pt' }}>
                <span>{resumeData.basicDetails.email}</span>
                <span className="mx-2">|</span>
                <span>{resumeData.basicDetails.phone}</span>
                <span className="mx-2">|</span>
                <span>{resumeData.basicDetails.location}</span>
              </div>
            )}
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
            {getClickableSection('professionalSummary',
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
            {getClickableSection('skills',
              <p className="text-gray-800" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '12pt'
              }}>
                {resumeData.skills.join(' • ')}
              </p>
            )}
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
                {getClickableSection(`workExperience.${index}`,
                  <div>
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
                )}
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
                {getClickableSection(`projects.${index}`,
                  <div>
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
                )}
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

  // Final Resume Preview Component (using original styling)
  const FinalResumePreview = ({ resumeData }) => {
    if (!resumeData) return null;
    
    return (
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
          <div className="grid grid-cols-3 h-full">
            {/* Left Panel - Original Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Original Resume</h4>
                <p className="text-sm text-gray-600">Click on any section to select it for your final resume</p>
              </div>
              <InteractiveWordDocument 
                resumeData={originalResume} 
                enhancedData={enhancedResume}
                title="Original_Resume.docx"
                isOriginal={true}
              />
            </div>

            {/* Middle Panel - Enhanced Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Enhanced Resume</h4>
                <p className="text-sm text-gray-600">Click on any section to select it for your final resume</p>
              </div>
              <InteractiveWordDocument 
                resumeData={enhancedResume} 
                enhancedData={enhancedResume}
                title="Enhanced_Resume.docx"
                isOriginal={false}
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
                  <p>Start selecting content from the original or enhanced resume to build your final version</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Click directly on sections in the original or enhanced resume to build your final version
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
