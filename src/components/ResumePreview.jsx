import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [selections, setSelections] = useState({});
  const [finalResume, setFinalResume] = useState(null);
  const [parsedResumeData, setParsedResumeData] = useState(null);

  // Define handleOutsideClick before any potential early returns
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPreview(false);
    }
  };

  // Load parsed resume data from localStorage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem('parsedResumeData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setParsedResumeData(parsed);
      } catch (error) {
        console.error('Error parsing stored resume data:', error);
      }
    }
  }, [showPreview]);

  // Convert parsed resume data to the expected format for original resume
  const getOriginalResumeFromParsed = () => {
    if (!parsedResumeData?.parsed_resumes?.current_resumes) {
      return null; // Return null if no data available
    }

    const currentResumes = parsedResumeData.parsed_resumes.current_resumes;

    // Extract contact information dynamically
    const contactInfo = currentResumes["Contact Information"] || [];
    const name = contactInfo.find(item => item.includes("SRI DURGA CHANDA")) || 
                 contactInfo.find(item => !item.includes("Phone:") && !item.includes("Email:") && !item.includes("LinkedIn:") && !item.includes("GitHub:") && !item.includes("@") && !item.includes("+91")) || 
                 "Name Not Available";
    const email = contactInfo.find(item => item.includes("@")) || "Email Not Available";
    const phone = contactInfo.find(item => item.includes("+91") || item.includes("Phone:")) || "Phone Not Available";
    const linkedIn = contactInfo.find(item => item.includes("LinkedIn:") || item.includes("linkedin.com")) || "";
    const github = contactInfo.find(item => item.includes("GitHub:") || item.includes("github.com")) || "";

    // Extract education info dynamically
    const education = currentResumes["Education"] || [];
    const location = education.length > 0 ? 
      (education[0].includes("Andhra Pradesh") ? "Andhra Pradesh, India" : "Location from Education") :
      "Location Not Available";

    // Extract professional summary from experience or create from education
    const experience = currentResumes["Professional Experience"] || [];
    const educationInfo = currentResumes["Education"] || [];
    const professionalSummary = experience.length > 0 ? 
      experience[0] : 
      (educationInfo.length > 0 ? 
        `${educationInfo[0].includes("CSE") ? "Computer Science Engineering" : "Engineering"} student with academic excellence and technical skills.` :
        "Professional summary not available");

    // Dynamic skills extraction
    const skills = currentResumes["Technical Skills"] || [];

    // Dynamic work experience
    const workExperience = [];
    if (experience.length > 0) {
      // Group experience items into work experience entries
      const companyInfo = experience.find(item => item.includes("Technical Hub")) || experience[0] || "";
      const duration = experience.find(item => item.includes("2023")) || "Duration not specified";
      const responsibilities = experience.filter(item => 
        !item.includes("Technical Hub") && 
        !item.includes("2023") && 
        item.trim().length > 0
      );

      workExperience.push({
        company: companyInfo.includes("Technical Hub") ? "Technical Hub" : "Company from experience",
        position: companyInfo.includes("Java") ? "Java Intern" : "Position from experience",
        duration: duration,
        responsibilities: responsibilities
      });
    }

    // Dynamic projects extraction
    const projectsData = currentResumes["Projects"] || [];
    const projects = [];

    // Group project data by project names
    const projectNames = projectsData.filter(item => item.includes("|"));
    const projectDescriptions = projectsData.filter(item => !item.includes("|") && item.length > 10);

    projectNames.forEach((projectLine, index) => {
      const parts = projectLine.split("|");
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const techString = parts[1].trim();
        const technologies = techString.split(",").map(tech => tech.trim());

        // Find corresponding description
        const description = projectDescriptions[index] || "Project description not available";

        projects.push({
          name: name,
          description: description,
          technologies: technologies
        });
      }
    });

    return {
      basicDetails: {
        name: name.replace("Phone:", "").replace("Email:", "").trim(),
        email: email.replace("Email:", "").trim(),
        phone: phone.replace("Phone:", "").trim(),
        location: location,
        linkedIn: linkedIn.replace("LinkedIn:", "").trim(),
        github: github.replace("GitHub:", "").trim()
      },
      professionalSummary: professionalSummary,
      skills: skills,
      workExperience: workExperience,
      projects: projects,
      education: education,
      achievements: currentResumes["Achievements"] || [],
      certifications: currentResumes["Certifications"] || [],
      interests: currentResumes["Interests"] || []
    };
  };

  // Convert parsed resume data to the expected format for enhanced resume
  const getEnhancedResumeFromParsed = () => {
    if (!parsedResumeData?.parsed_resumes?.enhanced_resume) {
      return null; // Return null if no enhanced data available
    }

    const enhancedResumes = parsedResumeData.parsed_resumes.enhanced_resume;

    // Extract contact information dynamically
    const contactInfo = enhancedResumes["Contact Information"] || [];
    const email = contactInfo.find(item => item.includes("@")) || "Email Not Available";
    const phone = contactInfo.find(item => item.includes("+91") || item.includes("Direct Contact:")) || "Phone Not Available";
    const linkedIn = contactInfo.find(item => item.includes("LinkedIn") || item.includes("linkedin.com")) || "";
    const github = contactInfo.find(item => item.includes("GitHub") || item.includes("github.com")) || "";

    // Extract name dynamically
    const name = contactInfo.find(item => 
      !item.includes("@") && 
      !item.includes("+91") && 
      !item.includes("LinkedIn") && 
      !item.includes("GitHub") &&
      !item.includes("Direct Contact:") &&
      !item.includes("Professional Email:")
    ) || "SRI DURGA CHANDA";

    // Extract education info dynamically
    const education = enhancedResumes["Education"] || [];
    const location = education.length > 0 ? 
      (education[0].includes("Andhra Pradesh") ? "Andhra Pradesh, India" : "Location from Education") :
      "Location Not Available";

    // Extract professional summary from experience or education
    const experience = enhancedResumes["Professional Experience"] || [];
    const educationInfo = enhancedResumes["Education"] || [];
    const professionalSummary = experience.length > 0 ? 
      experience[0] : 
      (educationInfo.length > 0 ? 
        educationInfo[0] :
        "Professional summary not available");

    // Dynamic skills extraction
    const skills = enhancedResumes["Technical Skills"] || [];

    // Dynamic work experience
    const workExperience = [];
    if (experience.length > 0) {
      // Group experience items into work experience entries
      const companyInfo = experience.find(item => item.includes("Technical Hub")) || experience[0] || "";
      const duration = experience.find(item => item.includes("2023")) || "Duration not specified";
      const responsibilities = experience.filter(item => 
        !item.includes("Technical Hub") && 
        !item.includes("2023") && 
        item.trim().length > 0
      );

      workExperience.push({
        company: companyInfo.includes("Technical Hub") ? "Technical Hub" : "Company from experience",
        position: companyInfo.includes("Java") ? "Java Intern" : "Position from experience", 
        duration: duration,
        responsibilities: responsibilities
      });
    }

    // Dynamic projects extraction
    const projectsData = enhancedResumes["Projects"] || [];
    const projects = [];

    // Enhanced projects have more detailed descriptions
    projectsData.forEach((projectLine, index) => {
      if (projectLine.includes("|") || projectLine.includes("Utilized") || projectLine.includes("Leveraged") || projectLine.includes("Employed")) {
        let name = "";
        let description = projectLine;
        let technologies = [];

        if (projectLine.includes("|")) {
          const parts = projectLine.split("|");
          name = parts[0].trim();
          description = parts[1].trim();
        } else if (projectLine.includes("Shops and Stalls")) {
          name = "Shops and Stalls";
        } else if (projectLine.includes("Hostel Hoppers")) {
          name = "Hostel Hoppers";
        } else if (projectLine.includes("Travel the World")) {
          name = "Travel the World";
        }

        // Extract technologies from description
        const techMatch = description.match(/(React\.js|HTML|CSS|JavaScript|Node\.js|MongoDB|Bootstrap|SCSS)/g);
        if (techMatch) {
          technologies = [...new Set(techMatch)]; // Remove duplicates
        }

        if (name && description) {
          projects.push({
            name: name,
            description: description,
            technologies: technologies
          });
        }
      }
    });

    return {
      basicDetails: {
        name: name.trim(),
        email: email.replace("Professional Email:", "").trim(),
        phone: phone.replace("Direct Contact:", "").trim(),
        location: location,
        linkedIn: linkedIn.replace("LinkedIn Profile:", "").trim(),
        github: github.replace("GitHub Portfolio:", "").trim()
      },
      professionalSummary: professionalSummary,
      skills: skills,
      workExperience: workExperience,
      projects: projects,
      education: education,
      achievements: enhancedResumes["Achievements"] || [],
      certifications: enhancedResumes["Certifications"] || [],
      interests: enhancedResumes["Interests"] || []
    };
  };

  const originalResume = getOriginalResumeFromParsed();
  const dynamicEnhancedResume = getEnhancedResumeFromParsed();

  // Build final resume based on selections - Always run this effect
  useEffect(() => {
    const buildFinalResume = () => {
      if (!dynamicEnhancedResume && !originalResume) return;

      const final = {
        basicDetails: {},
        professionalSummary: "",
        skills: [],
        workExperience: [],
        projects: []
      };

      // Basic Details - line by line with mutual exclusion
      if (originalResume && originalResume.basicDetails) {
        Object.keys(originalResume.basicDetails).forEach(key => {
          const originalKey = `original.basicDetails.${key}`;
          const enhancedKey = `enhanced.basicDetails.${key}`;

          // Due to mutual exclusion, only one can be true at a time
          if (selections[enhancedKey] && dynamicEnhancedResume && dynamicEnhancedResume.basicDetails) {
            final.basicDetails[key] = dynamicEnhancedResume.basicDetails[key];
          } else if (selections[originalKey]) {
            final.basicDetails[key] = originalResume.basicDetails[key];
          }
        });
      }

      // Professional Summary with mutual exclusion
      if (selections['enhanced.professionalSummary'] && dynamicEnhancedResume) {
        final.professionalSummary = dynamicEnhancedResume.professionalSummary;
      } else if (selections['original.professionalSummary'] && originalResume) {
        final.professionalSummary = originalResume.professionalSummary;
      }

      // Skills - individual skill selection
      if (originalResume && originalResume.skills) {
        originalResume.skills.forEach((skill, index) => {
          if (selections[`original.skills.${index}`]) {
            final.skills.push(skill);
          }
        });
      }

      if (dynamicEnhancedResume && dynamicEnhancedResume.skills) {
        dynamicEnhancedResume.skills.forEach((skill, index) => {
          if (selections[`enhanced.skills.${index}`] && !final.skills.includes(skill)) {
            final.skills.push(skill);
          }
        });
      }

      // Work Experience - line by line
      const maxWorkExp = Math.max(
        originalResume?.workExperience?.length || 0, 
        dynamicEnhancedResume?.workExperience?.length || 0
      );

      for (let i = 0; i < maxWorkExp; i++) {
        const originalExp = originalResume?.workExperience?.[i];
        const enhancedExp = dynamicEnhancedResume?.workExperience?.[i];

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
      const maxProjects = Math.max(
        originalResume?.projects?.length || 0, 
        dynamicEnhancedResume?.projects?.length || 0
      );

      for (let i = 0; i < maxProjects; i++) {
        const originalProject = originalResume?.projects?.[i];
        const enhancedProject = dynamicEnhancedResume?.projects?.[i];

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

    // Only build if we have actual data and selections
    const hasSelections = Object.keys(selections).some(key => selections[key]);
    const hasData = dynamicEnhancedResume || originalResume;

    if (hasData && hasSelections) {
      buildFinalResume();
    } else if (hasData && !hasSelections) {
      // Set empty final resume structure when no selections
      setFinalResume({
        basicDetails: {},
        professionalSummary: "",
        skills: [],
        workExperience: [],
        projects: []
      });
    }
  }, [selections]);

  // Early return after all hooks have been called
  if (!showPreview) return null;

  // If no parsed data is available, show error state
  if (!originalResume && !dynamicEnhancedResume) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resume Data Available</h3>
          <p className="text-gray-600 mb-4">
            Unable to load parsed resume data. Please try generating a new resume.
          </p>
          <button
            onClick={() => setShowPreview(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!dynamicEnhancedResume) return null;

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

    if (!resumeData) return keys;

    // Basic details
    if (resumeData.basicDetails) {
      Object.keys(resumeData.basicDetails).forEach(key => {
        keys.push(`${prefix}.basicDetails.${key}`);
      });
    }

    // Professional summary
    keys.push(`${prefix}.professionalSummary`);

    // Skills
    if (resumeData.skills) {
      resumeData.skills.forEach((_, index) => {
        keys.push(`${prefix}.skills.${index}`);
      });
    }

    // Work experience
    if (resumeData.workExperience) {
      resumeData.workExperience.forEach((exp, index) => {
        keys.push(`${prefix}.workExperience.${index}.position`);
        keys.push(`${prefix}.workExperience.${index}.company`);
        keys.push(`${prefix}.workExperience.${index}.duration`);
        if (exp.responsibilities) {
          exp.responsibilities.forEach((_, respIndex) => {
            keys.push(`${prefix}.workExperience.${index}.responsibilities.${respIndex}`);
          });
        }
      });
    }

    // Projects
    if (resumeData.projects) {
      resumeData.projects.forEach((project, index) => {
        keys.push(`${prefix}.projects.${index}.name`);
        keys.push(`${prefix}.projects.${index}.description`);
        if (project.technologies) {
          project.technologies.forEach((_, techIndex) => {
            keys.push(`${prefix}.projects.${index}.technologies.${techIndex}`);
          });
        }
      });
    }

    return keys;
  };

  // Function to check if all items from a resume type are selected
  const areAllSelectedForResumeType = (resumeType) => {
    const resumeData = resumeType === 'original' ? originalResume : dynamicEnhancedResume;
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
      const selectedResumeData = resumeType === 'original' ? originalResume : dynamicEnhancedResume;
      const otherResumeData = resumeType === 'original' ? dynamicEnhancedResume : originalResume;

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
              resumeData?.basicDetails?.name || '',
              <h1 className="text-2xl font-bold text-gray-900" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '18pt',
                fontWeight: 'bold'
              }}>
                {resumeData?.basicDetails?.name || ''}
              </h1>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.email`,
              resumeData?.basicDetails?.email || '',
              <span className="text-sm text-gray-700">{resumeData?.basicDetails?.email || ''}</span>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.phone`,
              resumeData?.basicDetails?.phone || '',
              <span className="text-sm text-gray-700">{resumeData?.basicDetails?.phone || ''}</span>
            )}
            {getClickableLine(
              `${prefix}.basicDetails.location`,
              resumeData?.basicDetails?.location || '',
              <span className="text-sm text-gray-700">{resumeData?.basicDetails?.location || ''}</span>
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
              resumeData?.professionalSummary || '',
              <p className="text-gray-800 text-justify" style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '12pt',
                lineHeight: '1.15',
                textAlign: 'justify'
              }}>
                {resumeData?.professionalSummary || ''}
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
              {(resumeData?.skills || []).map((skill, index) => (
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
            {(resumeData?.workExperience || []).map((exp, index) => (
              <div key={index} className="space-y-2">
                {getClickableLine(
                  `${prefix}.workExperience.${index}.position`,
                  exp?.position || '',
                  <h3 className="font-bold text-gray-900" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {exp?.position || ''}
                  </h3>
                )}
                {getClickableLine(
                  `${prefix}.workExperience.${index}.company`,
                  exp?.company || '',
                  <div className="text-gray-800 italic" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontStyle: 'italic'
                  }}>
                    {exp?.company || ''}
                  </div>
                )}
                {getClickableLine(
                  `${prefix}.workExperience.${index}.duration`,
                  exp?.duration || '',
                  <span className="text-gray-700" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt'
                  }}>
                    {exp?.duration || ''}
                  </span>
                )}
                <div className="ml-4 space-y-1">
                  {(exp?.responsibilities || []).map((resp, respIndex) => (
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
            {(resumeData?.projects || []).map((project, index) => (
              <div key={index} className="space-y-2">
                {getClickableLine(
                  `${prefix}.projects.${index}.name`,
                  project?.name || '',
                  <h3 className="font-bold text-gray-900" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    fontWeight: 'bold'
                  }}>
                    {project?.name || ''}
                  </h3>
                )}
                {getClickableLine(
                  `${prefix}.projects.${index}.description`,
                  project?.description || '',
                  <p className="text-gray-800" style={{
                    fontFamily: 'Times New Roman, serif',
                    fontSize: '12pt',
                    lineHeight: '1.15'
                  }}>
                    {project?.description || ''}
                  </p>
                )}
                <div className="space-y-1">
                  <span className="font-medium text-gray-700">Technologies: </span>
                  {(project?.technologies || []).map((tech, techIndex) => (
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

  // Final Resume Preview Component with Rich Text Editor
  const FinalResumePreview = ({ resumeData }) => {
    const [isRichTextMode, setIsRichTextMode] = useState(false);
    const [richTextContent, setRichTextContent] = useState('');
    const [editedResumeData, setEditedResumeData] = useState(null);

    // Initialize edited resume data and rich text content
    useEffect(() => {
      if (resumeData) {
        setEditedResumeData({ ...resumeData });
        // Convert resume data to HTML for rich text editor
        const htmlContent = generateResumeHTML(resumeData);
        setRichTextContent(htmlContent);
      }
    }, [resumeData]);

    if (!resumeData) return null;

    const displayData = editedResumeData || resumeData;

    // Generate markdown content from resume data
    const generateResumeHTML = (data) => {
      // Safely access basic details with fallbacks
      const name = data?.basicDetails?.name || 'Your Name';
      const email = data?.basicDetails?.email || 'your.email@example.com';
      const phone = data?.basicDetails?.phone || '+1 (555) 123-4567';
      const location = data?.basicDetails?.location || 'Your Location';
      const summary = data?.professionalSummary || 'Professional summary will appear here';
      const skills = data?.skills || [];
      const workExperience = data?.workExperience || [];
      const projects = data?.projects || [];

      return `# ${name}

**${email}** | **${phone}** | **${location}**

---

## PROFESSIONAL SUMMARY

${summary}

---

## TECHNICAL SKILLS

${skills.map(skill => `- ${skill}`).join('\n')}

---

## WORK EXPERIENCE

${workExperience.map(exp => `
### ${exp?.position || 'Position Title'}
**${exp?.company || 'Company Name'}** | *${exp?.duration || 'Duration'}*

${exp?.responsibilities?.map(resp => `- ${resp}`).join('\n') || ''}
`).join('\n')}

---

## PROJECTS

${projects.map(project => `
### ${project?.name || 'Project Name'}
${project?.description || 'Project description'}

**Technologies:** ${project?.technologies?.join(', ') || 'Technologies used'}
`).join('\n')}

---

*Powered by iQua.ai*
      `;
    };

    // Parse HTML back to resume data (simplified)
    const parseHTMLToResumeData = (html) => {
      // This would be a more complex function in production
      // For now, we'll keep the structured data and just store the HTML
      return {
        ...displayData,
        htmlContent: html
      };
    };

    const handleRichTextChange = (content) => {
      setRichTextContent(content);
      // Update the structured data as well
      const updatedData = parseHTMLToResumeData(content);
      setEditedResumeData(updatedData);
    };

    const toggleEditMode = () => {
      if (isRichTextMode) {
        // Save the rich text content
        const updatedData = parseHTMLToResumeData(richTextContent);
        setEditedResumeData(updatedData);
      }
      setIsRichTextMode(!isRichTextMode);
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
              onClick={toggleEditMode}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isRichTextMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRichTextMode ? '💾 Save & Exit' : '✏️ Rich Edit'}
            </button>
            <span className="text-xs text-gray-500">📄</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>

        {/* Document Content */}
        <div className="min-h-[600px]">
          {isRichTextMode ? (
            // Rich Text Editor Mode
            <div className="h-full">
              <div style={{ minHeight: '600px' }}>
                <MDEditor
                  value={richTextContent}
                  onChange={handleRichTextChange}
                  preview="edit"
                  hideToolbar={false}
                  visibledragbar={false}
                  data-color-mode="light"
                  style={{
                    minHeight: '600px',
                    fontFamily: "'Times New Roman', serif"
                  }}
                />
              </div>
            </div>
          ) : (
            // Preview Mode with structured layout
            <div className="p-8 space-y-4" style={{ minHeight: '600px' }}>
              <MDEditor.Markdown 
                source={richTextContent} 
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '12pt',
                  lineHeight: '1.15',
                  background: 'white'
                }}
              />
            </div>
          )}
        </div>

        {/* Formatting Tips */}
        {isRichTextMode && (
          <div className="border-t border-gray-200 p-4 bg-blue-50">
            <div className="text-sm text-blue-700">
              <strong>💡 Formatting Tips:</strong>
              <ul className="mt-2 ml-4 space-y-1">
                <li>• Use # for your name, ## for sections (EXPERIENCE, SKILLS, etc.)</li>
                <li>• Use **text** for bold, *text* for italic</li>
                <li>• Use - or * for bullet points</li>
                <li>• Use --- for horizontal lines/dividers</li>
                <li>• Keep formatting simple and professional</li>
              </ul>
            </div>
          </div>
        )}
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
                resumeData={dynamicEnhancedResume} 
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