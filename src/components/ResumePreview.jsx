import React, { useState, useEffect } from 'react';

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [selections, setSelections] = useState({});
  const [finalResume, setFinalResume] = useState(null);

  // Original resume data (mock data for comparison)
  const originalResume = {
    basicDetails: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY"
    },
    professionalSummary: "Experienced software developer with 2+ years in web development. Skilled in JavaScript and React.",
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    workExperience: [
      {
        company: "Tech Solutions Inc",
        position: "Junior Developer",
        duration: "2020-2022",
        responsibilities: [
          "Developed web applications using React",
          "Collaborated with team members on projects",
          "Maintained existing codebase"
        ]
      }
    ],
    projects: [
      {
        name: "Basic Website",
        description: "Created a simple website with HTML/CSS",
        technologies: ["HTML", "CSS", "JavaScript"]
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

SKILLS
${finalResume.skills.join(', ')}

WORK EXPERIENCE
${finalResume.workExperience.map(exp => `
${exp.position} at ${exp.company} (${exp.duration})
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
            <h3 className="text-xl font-semibold">Resume Preview & Comparison</h3>
            <p className="text-sm opacity-90 mt-1">Compare line-by-line and build your final resume</p>
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
            {/* Left Panel - Comparisons */}
            <div className="col-span-2 overflow-y-auto p-6 border-r border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Line-by-Line Comparison</h4>
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

            {/* Right Panel - Final Resume Preview */}
            <div className="overflow-y-auto p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Final Resume Preview</h4>
              {finalResume && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="text-center mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">{finalResume.basicDetails.name}</h2>
                    <p className="text-gray-600 mt-1">
                      {finalResume.basicDetails.email} | {finalResume.basicDetails.phone}
                    </p>
                    <p className="text-gray-600">{finalResume.basicDetails.location}</p>
                  </div>

                  {/* Professional Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{finalResume.professionalSummary}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {finalResume.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Work Experience</h3>
                    {finalResume.workExperience.map((exp, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <h4 className="font-medium text-gray-800">{exp.position}</h4>
                        <p className="text-gray-600 text-sm">{exp.company} | {exp.duration}</p>
                        <ul className="text-sm text-gray-700 mt-2 ml-4">
                          {exp.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="list-disc">{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Projects</h3>
                    {finalResume.projects.map((project, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <h4 className="font-medium text-gray-800">{project.name}</h4>
                        <p className="text-gray-700 text-sm">{project.description}</p>
                        <p className="text-gray-600 text-xs mt-1">Tech: {project.technologies.join(', ')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Watermark */}
                  <div className="text-right text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
                    Powered by iQua.ai
                  </div>
                </div>
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