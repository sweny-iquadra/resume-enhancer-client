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

      // Basic Details - line by line with mutual exclusion
      Object.keys(originalResume.basicDetails).forEach(key => {
        const originalKey = `original.basicDetails.${key}`;
        const enhancedKey = `enhanced.basicDetails.${key}`;

        // Due to mutual exclusion, only one can be true at a time
        if (selections[enhancedKey]) {
          final.basicDetails[key] = enhancedResumeData.basicDetails[key];
        } else if (selections[originalKey]) {
          final.basicDetails[key] = originalResume.basicDetails[key];
        }
      });

      // Professional Summary with mutual exclusion
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

        // Check position, company, duration with mutual exclusion
        ['position', 'company', 'duration'].forEach(field => {
          const enhancedKey = `enhanced.workExperience.${i}.${field}`;
          const originalKey = `original.workExperience.${i}.${field}`;

          if (selections[enhancedKey] && enhancedExp?.[field]) {
            expToAdd[field] = enhancedExp[field];
            hasContent = true;
          } else if (selections[originalKey] && originalExp?.[field]) {
            expToAdd[field] = originalExp[field];
            hasContent = true;
          }
        });

        // Handle responsibilities with mutual exclusion
        expToAdd.responsibilities = [];

        // Get all responsibility indices from both resumes
        const maxResponsibilities = Math.max(
          originalExp?.responsibilities?.length || 0,
          enhancedExp?.responsibilities?.length || 0
        );

        for (let respIndex = 0; respIndex < maxResponsibilities; respIndex++) {
          const enhancedKey = `enhanced.workExperience.${i}.responsibilities.${respIndex}`;
          const originalKey = `original.workExperience.${i}.responsibilities.${respIndex}`;

          if (selections[enhancedKey] && enhancedExp?.responsibilities?.[respIndex]) {
            expToAdd.responsibilities.push(enhancedExp.responsibilities[respIndex]);
            hasContent = true;
          } else if (selections[originalKey] && originalExp?.responsibilities?.[respIndex]) {
            expToAdd.responsibilities.push(originalExp.responsibilities[respIndex]);
            hasContent = true;
          }
        }

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

        // Check name, description with mutual exclusion
        ['name', 'description'].forEach(field => {
          const enhancedKey = `enhanced.projects.${i}.${field}`;
          const originalKey = `original.projects.${i}.${field}`;

          if (selections[enhancedKey] && enhancedProject?.[field]) {
            projectToAdd[field] = enhancedProject[field];
            hasContent = true;
          } else if (selections[originalKey] && originalProject?.[field]) {
            projectToAdd[field] = originalProject[field];
            hasContent = true;
          }
        });

        // Handle technologies with mutual exclusion
        projectToAdd.technologies = [];

        // Get all technology indices from both resumes
        const maxTechnologies = Math.max(
          originalProject?.technologies?.length || 0,
          enhancedProject?.technologies?.length || 0
        );

        for (let techIndex = 0; techIndex < maxTechnologies; techIndex++) {
          const enhancedKey = `enhanced.projects.${i}.technologies.${techIndex}`;
          const originalKey = `original.projects.${i}.technologies.${techIndex}`;

          if (selections[enhancedKey] && enhancedProject?.technologies?.[techIndex]) {
            projectToAdd.technologies.push(enhancedProject.technologies[techIndex]);
            hasContent = true;
          } else if (selections[originalKey] && originalProject?.technologies?.[techIndex]) {
            projectToAdd.technologies.push(originalProject.technologies[techIndex]);
            hasContent = true;
          }
        }

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
    setSelections(prev => {
      const newSelections = { ...prev };

      if (isSelected) {
        // When selecting a line, we need to deselect the corresponding line from the other resume
        const keyParts = key.split('.');
        const resumeType = keyParts[0]; // 'original' or 'enhanced'
        const otherResumeType = resumeType === 'original' ? 'enhanced' : 'original';

        // Create the corresponding key for the other resume
        const correspondingKey = key.replace(`${resumeType}.`, `${otherResumeType}.`);

        // Set the selected line and deselect the corresponding line from the other resume
        newSelections[key] = true;
        newSelections[correspondingKey] = false;
      } else {
        // Simply deselect the line
        newSelections[key] = false;
      }

      return newSelections;
    });
  };

  // Function to get all possible keys for a resume
  const getAllKeysForResume = (resumeData, prefix) => {
    const keys = [];

    // Basic details
    Object.keys(resumeData.basicDetails).forEach(key => {
      keys.push(`${prefix}.basicDetails.${key}`);
    });

    // Professional summary
    keys.push(`${prefix}.professionalSummary`);

    // Skills
    resumeData.skills.forEach((_, index) => {
      keys.push(`${prefix}.skills.${index}`);
    });

    // Work experience
    resumeData.workExperience.forEach((exp, index) => {
      keys.push(`${prefix}.workExperience.${index}.position`);
      keys.push(`${prefix}.workExperience.${index}.company`);
      keys.push(`${prefix}.workExperience.${index}.duration`);
      exp.responsibilities.forEach((_, respIndex) => {
        keys.push(`${prefix}.workExperience.${index}.responsibilities.${respIndex}`);
      });
    });

    // Projects
    resumeData.projects.forEach((project, index) => {
      keys.push(`${prefix}.projects.${index}.name`);
      keys.push(`${prefix}.projects.${index}.description`);
      project.technologies.forEach((_, techIndex) => {
        keys.push(`${prefix}.projects.${index}.technologies.${techIndex}`);
      });
    });

    return keys;
  };

  // Function to check if all items from a resume type are selected
  const areAllSelectedForResumeType = (resumeType) => {
    const resumeData = resumeType === 'original' ? originalResume : enhancedResumeData;
    const keys = getAllKeysForResume(resumeData, resumeType);
    return keys.length > 0 && keys.every(key => selections[key] === true);
  };

  // Function to toggle select all from one resume
  const handleSelectAllToggle = (resumeType) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const otherResumeType = resumeType === 'original' ? 'enhanced' : 'original';
      const allCurrentlySelected = areAllSelectedForResumeType(resumeType);

      // Get all keys for both resumes
      const selectedResumeData = resumeType === 'original' ? originalResume : enhancedResumeData;
      const otherResumeData = resumeType === 'original' ? enhancedResumeData : originalResume;

      const selectedKeys = getAllKeysForResume(selectedResumeData, resumeType);
      const otherKeys = getAllKeysForResume(otherResumeData, otherResumeType);

      if (allCurrentlySelected) {
        // If all are selected, clear all selections from both resumes
        selectedKeys.forEach(key => {
          newSelections[key] = false;
        });
        otherKeys.forEach(key => {
          newSelections[key] = false;
        });
      } else {
        // If not all are selected, select all from chosen resume and deselect all from other
        selectedKeys.forEach(key => {
          newSelections[key] = true;
        });
        otherKeys.forEach(key => {
          newSelections[key] = false;
        });
      }

      return newSelections;
    });
  };

  const downloadResume = (format) => {
    if (!finalResume) return;

    // Generate content from finalResume object with proper formatting
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
${exp.position || ''}
${exp.company || ''} | ${exp.duration || ''}
${exp.responsibilities?.map(resp => `• ${resp}`).join('\n') || ''}
`).join('\n')}

PROJECTS
${finalResume.projects?.map(project => `
${project.name || ''}
${project.description || ''}
Technologies: ${project.technologies?.join(', ') || ''}
`).join('\n') || ''}

Powered by iQua.ai
    `.trim();

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
              isSelected ? 'bg-green-100 border-green-300 border' : 'hover:bg-blue-50 border border-transparent'
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
    const [isEditing, setIsEditing] = useState(false);
    const [editedResumeData, setEditedResumeData] = useState(null);

    // Initialize edited resume data with the final resume data
    useEffect(() => {
      if (resumeData) {
        setEditedResumeData({ ...resumeData });
      }
    }, [resumeData]);

    if (!resumeData) return null;

    const displayData = editedResumeData || resumeData;

    const handleFieldEdit = (section, field, value, index = null, subIndex = null) => {
      setEditedResumeData(prev => {
        const updated = { ...prev };

        if (section === 'basicDetails') {
          updated.basicDetails = { ...updated.basicDetails, [field]: value };
        } else if (section === 'professionalSummary') {
          updated.professionalSummary = value;
        } else if (section === 'skills') {
          const newSkills = [...updated.skills];
          if (index !== null) {
            newSkills[index] = value;
          }
          updated.skills = newSkills;
        } else if (section === 'workExperience') {
          const newWorkExp = [...updated.workExperience];
          if (field === 'responsibilities' && subIndex !== null) {
            newWorkExp[index].responsibilities[subIndex] = value;
          } else {
            newWorkExp[index][field] = value;
          }
          updated.workExperience = newWorkExp;
        } else if (section === 'projects') {
          const newProjects = [...updated.projects];
          if (field === 'technologies' && subIndex !== null) {
            newProjects[index].technologies[subIndex] = value;
          } else {
            newProjects[index][field] = value;
          }
          updated.projects = newProjects;
        }

        return updated;
      });
    };

    const addNewItem = (section, type) => {
      setEditedResumeData(prev => {
        const updated = { ...prev };

        if (section === 'skills') {
          updated.skills = [...updated.skills, 'New Skill'];
        } else if (section === 'workExperience') {
          updated.workExperience = [...updated.workExperience, {
            position: 'New Position',
            company: 'New Company',
            duration: 'Duration',
            responsibilities: ['New responsibility']
          }];
        } else if (section === 'projects') {
          updated.projects = [...updated.projects, {
            name: 'New Project',
            description: 'Project description',
            technologies: ['Technology']
          }];
        } else if (section === 'responsibilities') {
          const newWorkExp = [...updated.workExperience];
          newWorkExp[type].responsibilities.push('New responsibility');
          updated.workExperience = newWorkExp;
        } else if (section === 'technologies') {
          const newProjects = [...updated.projects];
          newProjects[type].technologies.push('New Technology');
          updated.projects = newProjects;
        }

        return updated;
      });
    };

    const removeItem = (section, index, subIndex = null) => {
      setEditedResumeData(prev => {
        const updated = { ...prev };

        if (section === 'skills') {
          updated.skills = updated.skills.filter((_, i) => i !== index);
        } else if (section === 'workExperience') {
          updated.workExperience = updated.workExperience.filter((_, i) => i !== index);
        } else if (section === 'projects') {
          updated.projects = updated.projects.filter((_, i) => i !== index);
        } else if (section === 'responsibilities') {
          const newWorkExp = [...updated.workExperience];
          newWorkExp[index].responsibilities = newWorkExp[index].responsibilities.filter((_, i) => i !== subIndex);
          updated.workExperience = newWorkExp;
        } else if (section === 'technologies') {
          const newProjects = [...updated.projects];
          newProjects[index].technologies = newProjects[index].technologies.filter((_, i) => i !== subIndex);
          updated.projects = newProjects;
        }

        return updated;
      });
    };

    const EditableField = ({ value, onSave, multiline = false, placeholder = "", className = "" }) => {
      const [isFieldEditing, setIsFieldEditing] = useState(false);
      const [fieldValue, setFieldValue] = useState(value);

      const handleSave = () => {
        onSave(fieldValue);
        setIsFieldEditing(false);
      };

      const handleCancel = () => {
        setFieldValue(value);
        setIsFieldEditing(false);
      };

      if (isFieldEditing) {
        return (
          <div className="relative group">
            {multiline ? (
              <textarea
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className={`w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  lineHeight: '1.15'
                }}
                placeholder={placeholder}
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className={`w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  lineHeight: '1.15'
                }}
                placeholder={placeholder}
                autoFocus
              />
            )}
            <div className="flex gap-1 mt-1">
              <button
                onClick={handleSave}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        );
      }

      return (
        <div
          onClick={() => isEditing && setIsFieldEditing(true)}
          className={`${isEditing ? 'cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded px-1' : ''} ${className}`}
          title={isEditing ? "Click to edit" : ""}
        >
          {value || (isEditing ? <span className="text-gray-400 italic">{placeholder}</span> : "")}
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
          <span className="text-sm text-gray-600 font-medium">Final_Resume.docx</span>
          <div className="ml-auto flex items-center space-x-2">
            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  isEditing 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isEditing ? '💾 Done' : '✏️ Edit'}
              </button>
            <span className="text-xs text-gray-500">📄</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>

        {/* Document Content - Following Original Resume Layout */}
        <div className="p-8 min-h-[600px] space-y-4 final-resume-content" style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '1.15',
          background: 'white'
        }}>
          {/* Header Section - Same as Original */}
          <div className="text-center mb-6 pb-3 border-b-2 border-gray-300 space-y-2">
            <EditableField
              value={displayData.basicDetails.name}
              onSave={(value) => handleFieldEdit('basicDetails', 'name', value)}
              placeholder="Your Name"
              className="text-2xl font-bold text-gray-900 text-center"
            />
            <div className="text-sm text-gray-700 space-y-1">
              <EditableField
                value={displayData.basicDetails.email}
                onSave={(value) => handleFieldEdit('basicDetails', 'email', value)}
                placeholder="email@example.com"
                className="block"
              />
              <EditableField
                value={displayData.basicDetails.phone}
                onSave={(value) => handleFieldEdit('basicDetails', 'phone', value)}
                placeholder="Phone Number"
                className="block"
              />
              <EditableField
                value={displayData.basicDetails.location}
                onSave={(value) => handleFieldEdit('basicDetails', 'location', value)}
                placeholder="Location"
                className="block"
              />
            </div>
          </div>

          {/* Professional Summary - Same as Original */}
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
            <EditableField
              value={displayData.professionalSummary}
              onSave={(value) => handleFieldEdit('professionalSummary', '', value)}
              multiline={true}
              placeholder="Write your professional summary here..."
              className="text-gray-800 text-justify"
            />
          </div>

          {/* Technical Skills - Same as Original */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '14pt',
                fontWeight: 'bold',
                borderBottom: '1px solid #333',
                paddingBottom: '2px'
              }}>
                TECHNICAL SKILLS
              </h2>
              {isEditing && (
                <button
                  onClick={() => addNewItem('skills')}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  + Add Skill
                </button>
              )}
            </div>
            <div className="space-y-1">
              {displayData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <EditableField
                    value={skill}
                    onSave={(value) => handleFieldEdit('skills', '', value, index)}
                    placeholder="Skill name"
                    className="inline-block bg-gray-100 px-2 py-1 rounded text-sm"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeItem('skills', index)}
                      className="px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience - Same as Original */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '14pt',
                fontWeight: 'bold',
                borderBottom: '1px solid #333',
                paddingBottom: '2px'
              }}>
                WORK EXPERIENCE
              </h2>
              {isEditing && (
                <button
                  onClick={() => addNewItem('workExperience')}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  + Add Experience
                </button>
              )}
            </div>
            {displayData.workExperience.map((exp, index) => (
              <div key={index} className="space-y-2 border-l-2 border-gray-200 pl-4 relative">
                {isEditing && (
                  <button
                    onClick={() => removeItem('workExperience', index)}
                    className="absolute -left-8 top-0 px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
                <EditableField
                  value={exp.position}
                  onSave={(value) => handleFieldEdit('workExperience', 'position', value, index)}
                  placeholder="Job Position"
                  className="font-bold text-gray-900 text-lg"
                />
                <EditableField
                  value={exp.company}
                  onSave={(value) => handleFieldEdit('workExperience', 'company', value, index)}
                  placeholder="Company Name"
                  className="text-gray-800 italic"
                />
                <EditableField
                  value={exp.duration}
                  onSave={(value) => handleFieldEdit('workExperience', 'duration', value, index)}
                  placeholder="Duration"
                  className="text-gray-700"
                />
                <div className="ml-4 space-y-1">
                  {exp.responsibilities?.map((resp, respIndex) => (
                    <div key={respIndex} className="flex items-start gap-2">
                      <span className="text-gray-800">•</span>
                      <EditableField
                        value={resp}
                        onSave={(value) => handleFieldEdit('workExperience', 'responsibilities', value, index, respIndex)}
                        placeholder="Responsibility description"
                        className="text-gray-800 flex-1"
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeItem('responsibilities', index, respIndex)}
                          className="px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addNewItem('responsibilities', index)}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 ml-4"
                    >
                      + Add Responsibility
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Projects - Same as Original */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '14pt',
                fontWeight: 'bold',
                borderBottom: '1px solid #333',
                paddingBottom: '2px'
              }}>
                PROJECTS
              </h2>
              {isEditing && (
                <button
                  onClick={() => addNewItem('projects')}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  + Add Project
                </button>
              )}
            </div>
            {displayData.projects?.map((project, index) => (
              <div key={index} className="space-y-2 border-l-2 border-gray-200 pl-4 relative">
                {isEditing && (
                  <button
                    onClick={() => removeItem('projects', index)}
                    className="absolute -left-8 top-0 px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
                <EditableField
                  value={project.name}
                  onSave={(value) => handleFieldEdit('projects', 'name', value, index)}
                  placeholder="Project Name"
                  className="font-bold text-gray-900 text-lg"
                />
                <EditableField
                  value={project.description}
                  onSave={(value) => handleFieldEdit('projects', 'description', value, index)}
                  multiline={true}
                  placeholder="Project description"
                  className="text-gray-800"
                />
                <div className="space-y-1">
                  <span className="font-medium text-gray-700">Technologies: </span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-center gap-1">
                        <EditableField
                          value={tech}
                          onSave={(value) => handleFieldEdit('projects', 'technologies', value, index, techIndex)}
                          placeholder="Technology"
                          className="inline-block bg-blue-100 px-2 py-1 rounded text-sm"
                        />
                        {isEditing && (
                          <button
                            onClick={() => removeItem('technologies', index, techIndex)}
                            className="px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        onClick={() => addNewItem('technologies', index)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        + Add Tech
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer - Same as Original */}
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
            <h3 className="text-xl font-semibold">Resume Builder</h3>
            <p className="text-sm opacity-90 mt-1">Choose content from both versions</p>
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
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Original</h4>
                <p className="text-sm text-gray-600 mb-3">Select content to keep</p>
                <button
                  onClick={() => handleSelectAllToggle('original')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>{areAllSelectedForResumeType('original') ? '✕' : '✓'}</span>
                  <span>{areAllSelectedForResumeType('original') ? 'Clear Selection' : 'Use All Original'}</span>
                </button>
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
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Enhanced</h4>
                <p className="text-sm text-gray-600 mb-3">Select improved content</p>
                <button
                  onClick={() => handleSelectAllToggle('enhanced')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>{areAllSelectedForResumeType('enhanced') ? '✕' : '✓'}</span>
                  <span>{areAllSelectedForResumeType('enhanced') ? 'Clear Selection' : 'Use All Enhanced'}</span>
                </button>
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
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Final Resume</h4>
                <p className="text-sm text-gray-600">Live preview & edit</p>
              </div>
              {finalResume && <FinalResumePreview resumeData={finalResume} />}
              {!finalResume && (
                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                  <div className="mb-4">📄</div>
                  <p>Select content from either version to build your resume</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Pick individual lines or use "Use All" buttons for quick selection
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => downloadResume('PDF')}
                disabled={!finalResume}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => downloadResume('DOC')}
                disabled={!finalResume}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📃</span>
                <span>Download DOC</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;