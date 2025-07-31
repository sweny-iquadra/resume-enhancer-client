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

  // Convert parsed resume data to a normalized format for original resume
  const getOriginalResumeFromParsed = () => {
    if (!parsedResumeData?.parsed_resumes?.current_resumes) {
      return null;
    }

    const currentResumes = parsedResumeData.parsed_resumes.current_resumes;
    const normalizedData = {};

    // Dynamically process all sections in current_resumes with deduplication
    Object.keys(currentResumes).forEach(sectionKey => {
      const sectionData = currentResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Remove duplicates using Set and filter out empty strings
        const deduplicatedData = Array.from(new Set(sectionData.filter(item => item && item.trim())));
        normalizedData[sectionKey] = deduplicatedData.map((item, index) => ({
          content: item,
          key: `original.${sectionKey}.${index}`
        }));
      } else {
        // Handle non-array data
        if (sectionData && sectionData.trim()) {
          normalizedData[sectionKey] = [{
            content: sectionData,
            key: `original.${sectionKey}.0`
          }];
        }
      }
    });

    return normalizedData;
  };

  // Convert parsed resume data to a normalized format for enhanced resume
  const getEnhancedResumeFromParsed = () => {
    if (!parsedResumeData?.parsed_resumes?.enhanced_resume) {
      return null;
    }

    const enhancedResumes = parsedResumeData.parsed_resumes.enhanced_resume;
    const normalizedData = {};

    // Dynamically process all sections in enhanced_resume with deduplication
    Object.keys(enhancedResumes).forEach(sectionKey => {
      const sectionData = enhancedResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Remove duplicates using Set and filter out empty strings
        const deduplicatedData = Array.from(new Set(sectionData.filter(item => item && item.trim())));
        normalizedData[sectionKey] = deduplicatedData.map((item, index) => ({
          content: item,
          key: `enhanced.${sectionKey}.${index}`
        }));
      } else {
        // Handle non-array data
        if (sectionData && sectionData.trim()) {
          normalizedData[sectionKey] = [{
            content: sectionData,
            key: `enhanced.${sectionKey}.0`
          }];
        }
      }
    });

    return normalizedData;
  };

  const originalResume = getOriginalResumeFromParsed();
  const dynamicEnhancedResume = getEnhancedResumeFromParsed();

  // Build final resume based on selections
  useEffect(() => {
    const buildFinalResume = () => {
      if (!dynamicEnhancedResume && !originalResume) return;

      const final = {};

      // Combine all section keys from both resumes
      const allSectionKeys = new Set([
        ...(originalResume ? Object.keys(originalResume) : []),
        ...(dynamicEnhancedResume ? Object.keys(dynamicEnhancedResume) : [])
      ]);

      // Process each section dynamically
      allSectionKeys.forEach(sectionKey => {
        const originalSection = originalResume?.[sectionKey] || [];
        const enhancedSection = dynamicEnhancedResume?.[sectionKey] || [];
        const selectedItems = [];

        // Check original section items
        originalSection.forEach(item => {
          if (selections[item.key]) {
            selectedItems.push({
              content: item.content,
              source: 'original'
            });
          }
        });

        // Check enhanced section items
        enhancedSection.forEach(item => {
          if (selections[item.key]) {
            selectedItems.push({
              content: item.content,
              source: 'enhanced'
            });
          }
        });

        if (selectedItems.length > 0) {
          final[sectionKey] = selectedItems;
        }
      });

      setFinalResume(final);
    };

    // Only build if we have actual data and selections
    const hasSelections = Object.keys(selections).some(key => selections[key]);
    const hasData = dynamicEnhancedResume || originalResume;

    if (hasData && hasSelections) {
      buildFinalResume();
    } else if (hasData && !hasSelections) {
      // Set empty final resume structure when no selections
      setFinalResume({});
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

    // Dynamically get all keys from all sections
    Object.keys(resumeData).forEach(sectionKey => {
      const sectionItems = resumeData[sectionKey] || [];
      sectionItems.forEach(item => {
        keys.push(item.key);
      });
    });

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

    // Generate content that matches the Final Resume Preview layout
    let resumeContent = '';

    // Add header styling
    resumeContent += 'DYNAMIC RESUME\n';
    resumeContent += '='.repeat(50) + '\n\n';

    // Dynamically build resume content from all sections with proper formatting
    Object.keys(finalResume).forEach(sectionKey => {
      const sectionItems = finalResume[sectionKey] || [];

      if (sectionItems.length > 0) {
        // Add section header with proper formatting
        resumeContent += `${sectionKey.toUpperCase()}\n`;
        resumeContent += '-'.repeat(sectionKey.length) + '\n\n';

        // Add section items with proper bullet points
        sectionItems.forEach(item => {
          if (shouldHaveBulletPoints(sectionKey)) {
            resumeContent += `• ${item.content}\n`;
          } else {
            resumeContent += `${item.content}\n`;
          }
        });

        resumeContent += '\n';
      }
    });

    // Add footer
    resumeContent += '\n' + '='.repeat(50) + '\n';
    resumeContent += 'Powered by iQua.ai\n';

    if (format === 'PDF') {
      // For PDF, we'll create a more structured HTML document
      const htmlContent = generatePDFHTML(finalResume);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume_dynamic.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For DOC format, create a properly formatted text file
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume_dynamic.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    console.log(`Downloading resume as ${format}`);
  };

  // Function to generate HTML for PDF download
  const generatePDFHTML = (resumeData) => {
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dynamic Resume</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.15;
            margin: 1in;
            color: #333;
            background: white;
        }
        .header {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            margin-bottom: 10px;
            color: #333;
        }
        .section-content {
            margin-left: 20px;
        }
        .bullet-item {
            margin-bottom: 5px;
            text-indent: -20px;
            padding-left: 20px;
        }
        .bullet-point {
            color: #666;
            margin-right: 8px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
        .contact-info {
            font-weight: normal;
        }
        .contact-info a {
            color: #0066cc;
            text-decoration: underline;
        }
        .education-item {
            background-color: #f0f8ff;
            padding: 8px;
            border-left: 4px solid #0066cc;
            margin-bottom: 8px;
        }
        .achievement-item {
            display: flex;
            align-items: center;
        }
        .achievement-icon {
            color: #ffd700;
            margin-right: 8px;
        }
        .certification-item {
            display: flex;
            align-items: center;
        }
        .certification-icon {
            color: #28a745;
            margin-right: 8px;
        }
        .skills-item {
            display: flex;
            align-items: flex-start;
        }
        .skills-bullet {
            color: #666;
            margin-right: 8px;
            margin-top: 2px;
        }
        .summary-item {
            display: flex;
            align-items: flex-start;
        }
        .summary-bullet {
            color: #666;
            margin-right: 8px;
            margin-top: 2px;
        }
        .work-experience-item {
            display: flex;
            align-items: flex-start;
        }
        .work-experience-bullet {
            color: #666;
            margin-right: 8px;
            margin-top: 2px;
        }
        .projects-item {
            display: flex;
            align-items: flex-start;
        }
        .projects-bullet {
            color: #666;
            margin-right: 8px;
            margin-top: 2px;
        }
        .top-skills-item {
            display: flex;
            align-items: flex-start;
        }
        .top-skills-bullet {
            color: #666;
            margin-right: 8px;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="header">DYNAMIC RESUME</div>
`;

    // Dynamically generate content from all sections
    Object.keys(resumeData).forEach(sectionKey => {
      const sectionItems = resumeData[sectionKey] || [];

      if (sectionItems.length > 0) {
        html += `<div class="section">\n`;
        html += `    <div class="section-title">${sectionKey.toUpperCase()}</div>\n`;
        html += `    <div class="section-content">\n`;

        sectionItems.forEach(item => {
          if (sectionKey.toLowerCase() === 'contact information') {
            // Contact information without bullets
            html += `        <div class="contact-info">${item.content}</div>\n`;
          } else if (sectionKey.toLowerCase() === 'education' && item.content.includes('CGPA')) {
            // Special education formatting with blue background
            html += `        <div class="education-item">${item.content}</div>\n`;
          } else if (sectionKey.toLowerCase() === 'education') {
            // Regular education items with bullet points
            html += `        <div class="education-item">\n`;
            html += `            <span class="bullet-point">•</span>\n`;
            html += `            <span>${item.content}</span>\n`;
            html += `        </div>\n`;
          } else if (sectionKey.toLowerCase() === 'achievements') {
            // Achievements with trophy icon
            html += `        <div class="achievement-item">\n`;
            html += `            <span class="achievement-icon">🏆</span>\n`;
            html += `            <span>${item.content}</span>\n`;
            html += `        </div>\n`;
          } else if (sectionKey.toLowerCase() === 'certifications') {
            // Certifications with checkmark icon
            html += `        <div class="certification-item">\n`;
            html += `            <span class="certification-icon">✓</span>\n`;
            html += `            <span>${item.content}</span>\n`;
            html += `        </div>\n`;
          } else if (shouldHaveBulletPoints(sectionKey)) {
            // Sections with bullet points
            const bulletClass = sectionKey.toLowerCase().replace(/\s+/g, '-') + '-item';
            const bulletIconClass = sectionKey.toLowerCase().replace(/\s+/g, '-') + '-bullet';

            html += `        <div class="${bulletClass}">\n`;
            html += `            <span class="${bulletIconClass}">•</span>\n`;
            html += `            <span>${item.content}</span>\n`;
            html += `        </div>\n`;
          } else {
            // Regular content without bullets
            html += `        <div>${item.content}</div>\n`;
          }
        });

        html += `    </div>\n`;
        html += `</div>\n`;
      }
    });

    html += `
    <div class="footer">
        Powered by iQua.ai
    </div>
</body>
</html>`;

    return html;
  };

  // Function to check if a section should have bullet points
  const shouldHaveBulletPoints = (sectionKey) => {
    const bulletPointSections = [
      'top_skills', 'certifications', 'summary', 'work_experience',
      'education', 'skills', 'projects', 'achievements'
    ];
    return bulletPointSections.includes(sectionKey.toLowerCase());
  };

  // Function to format content with bullet points
  const formatContentWithBullets = (content, sectionKey) => {
    if (!shouldHaveBulletPoints(sectionKey)) {
      return content;
    }

    // If content already contains bullet points, return as is
    if (content.includes('•') || content.includes('-')) {
      return content;
    }

    // Add bullet point to the content
    return `• ${content}`;
  };

  // Interactive Word Document Component with dynamic section rendering
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
            className={`flex-1 cursor-pointer transition-all duration-200 rounded p-1 ${isSelected ? 'bg-green-100 border-green-300 border' : 'hover:bg-blue-50 border border-transparent'
              }`}
            onClick={() => handleSelection(key, !isSelected)}
          >
            {displayContent || (
              <span className="text-sm text-gray-800">{content}</span>
            )}
          </div>
        </div>
      );
    };

    // Function to format section titles
    const formatSectionTitle = (sectionKey) => {
      return sectionKey
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };

    // Function to get appropriate emoji for section
    const getSectionEmoji = (sectionKey) => {
      const emojiMap = {
        'Contact Information': '📞',
        'Education': '🎓',
        'Technical Skills': '🚀',
        'Professional Experience': '💼',
        'Projects': '🏗️',
        'Achievements': '🏆',
        'Certifications': '📜',
        'Interests': '💡'
      };
      return emojiMap[sectionKey] || '📋';
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
        <div className="p-8 min-h-[600px] space-y-6" style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '1.15',
          background: 'white'
        }}>
          {/* Dynamically render all sections */}
          {resumeData && Object.keys(resumeData).map((sectionKey, sectionIndex) => {
            const sectionItems = resumeData[sectionKey] || [];

            return (
              <div key={sectionIndex} className="mb-6 space-y-2">
                <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase flex items-center" style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '14pt',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #333',
                  paddingBottom: '2px'
                }}>
                  <span className="mr-2">{getSectionEmoji(sectionKey)}</span>
                  {formatSectionTitle(sectionKey)}
                </h2>

                <div className="space-y-2">
                  {sectionItems.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {getClickableLine(
                        item.key,
                        item.content,
                        <div className="text-gray-800" style={{
                          fontFamily: 'Times New Roman, serif',
                          fontSize: '12pt',
                          lineHeight: '1.15'
                        }}>
                          {/* Handle special formatting for certain sections */}
                          {sectionKey === 'Contact Information' && item.content.includes('@') ? (
                            <span className="text-blue-600 underline">{item.content}</span>
                          ) : sectionKey === 'Technical Skills' && item.content.includes(':') ? (
                            <div>
                              <span className="font-semibold">{item.content.split(':')[0]}:</span>
                              <span className="ml-1">{item.content.split(':')[1]}</span>
                            </div>
                          ) : sectionKey === 'Skills' ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : sectionKey === 'Summary' ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : sectionKey === 'Top Skills' ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : sectionKey === 'Projects' && item.content.includes('|') ? (
                            <div>
                              <span className="font-semibold text-purple-700">{item.content.split('|')[0]}</span>
                              <span className="text-gray-600 text-sm ml-2">| {item.content.split('|')[1]}</span>
                            </div>
                          ) : sectionKey === 'Projects' ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : sectionKey === 'Education' && item.content.includes('CGPA') ? (
                            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                              {shouldHaveBulletPoints(sectionKey) ? formatContentWithBullets(item.content, sectionKey) : item.content}
                            </div>
                          ) : sectionKey === 'Achievements' ? (
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">🏆</span>
                              {formatContentWithBullets(item.content, sectionKey)}
                            </div>
                          ) : sectionKey === 'Certifications' ? (
                            <div className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {formatContentWithBullets(item.content, sectionKey)}
                            </div>
                          ) : sectionKey === 'Work Experience' ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : shouldHaveBulletPoints(sectionKey) ? (
                            <div className="flex items-start">
                              <span className="text-gray-600 mr-2 mt-0.5">•</span>
                              <span>{item.content}</span>
                            </div>
                          ) : (
                            item.content
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
      let content = '# Dynamic Resume\n\n';

      // Dynamically generate content from all sections
      Object.keys(data).forEach(sectionKey => {
        content += `## ${sectionKey.toUpperCase()}\n\n`;

        const sectionItems = data[sectionKey] || [];
        sectionItems.forEach(item => {
          if (sectionKey.toLowerCase() === 'contact information') {
            // Contact information without bullets
            content += `${item.content} *(${item.source})*\n`;
          } else if (sectionKey.toLowerCase() === 'education' && item.content.includes('CGPA')) {
            // Special education formatting
            content += `> **${item.content}** *(${item.source})*\n`;
          } else if (sectionKey.toLowerCase() === 'achievements') {
            // Achievements with trophy icon
            content += `🏆 ${item.content} *(${item.source})*\n`;
          } else if (sectionKey.toLowerCase() === 'certifications') {
            // Certifications with checkmark icon
            content += `✓ ${item.content} *(${item.source})*\n`;
          } else if (shouldHaveBulletPoints(sectionKey)) {
            // Sections with bullet points
            content += `• ${item.content} *(${item.source})*\n`;
          } else {
            // Regular content without bullets
            content += `${item.content} *(${item.source})*\n`;
          }
        });
        content += '\n';
      });

      content += '\n---\n\n*Powered by iQua.ai*';
      return content;
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
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${isRichTextMode
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
              {finalResume && Object.keys(finalResume).length > 0 && <FinalResumePreview resumeData={finalResume} />}
              {(!finalResume || Object.keys(finalResume).length === 0) && (
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
                disabled={!finalResume || Object.keys(finalResume).length === 0}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => downloadResume('DOC')}
                disabled={!finalResume || Object.keys(finalResume).length === 0}
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