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

  // Advanced deduplication function for complex content
  const advancedDeduplicate = (items) => {
    if (!Array.isArray(items)) return items;

    const seen = new Set();
    const deduplicatedItems = [];

    items.forEach(item => {
      if (!item || !item.trim()) return;

      // Normalize the content for comparison
      const normalizedContent = item
        .toLowerCase()
        .replace(/[^\w\s@.-]/g, ' ')  // Replace special chars with spaces (except email chars)
        .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
        .trim();

      // Extract key information for more intelligent matching
      const keyWords = normalizedContent
        .split(' ')
        .filter(word => word.length > 2)  // Filter out short words
        .sort()  // Sort for consistent comparison
        .join(' ');

      // Check for similar content (fuzzy matching)
      let isDuplicate = false;
      
      for (const seenKey of seen) {
        // Calculate similarity ratio
        const similarity = calculateSimilarity(keyWords, seenKey);
        if (similarity > 0.8) {  // 80% similarity threshold
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        seen.add(keyWords);
        deduplicatedItems.push(item);
      }
    });

    return deduplicatedItems;
  };

  // Calculate similarity between two strings
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Calculate edit distance (Levenshtein distance)
  const getEditDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,       // deletion
          matrix[j - 1][i] + 1,       // insertion  
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Convert parsed resume data to a normalized format for original resume
  const getOriginalResumeFromParsed = () => {
    if (!parsedResumeData?.parsed_resumes?.current_resumes) {
      return null;
    }

    const currentResumes = parsedResumeData.parsed_resumes.current_resumes;
    const normalizedData = {};

    // Dynamically process all sections in current_resumes with advanced deduplication
    Object.keys(currentResumes).forEach(sectionKey => {
      const sectionData = currentResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Use advanced deduplication for complex content matching
        const deduplicatedData = advancedDeduplicate(sectionData);
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

    // Dynamically process all sections in enhanced_resume with advanced deduplication
    Object.keys(enhancedResumes).forEach(sectionKey => {
      const sectionData = enhancedResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Use advanced deduplication for complex content matching
        const deduplicatedData = advancedDeduplicate(sectionData);
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

    // Generate content from finalResume object with proper formatting
    let resumeContent = '';

    // Dynamically build resume content from all sections
    Object.keys(finalResume).forEach(sectionKey => {
      resumeContent += `\n${sectionKey.toUpperCase()}\n`;
      resumeContent += '='.repeat(sectionKey.length) + '\n';

      const sectionItems = finalResume[sectionKey] || [];
      sectionItems.forEach(item => {
        resumeContent += `• ${item.content}\n`;
      });
      resumeContent += '\n';
    });

    resumeContent += '\nPowered by iQua.ai';

    // Create and download file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_dynamic.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Downloading resume as ${format}`);
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
            className={`flex-1 cursor-pointer transition-all duration-200 rounded p-1 ${
              isSelected ? 'bg-green-100 border-green-300 border' : 'hover:bg-blue-50 border border-transparent'
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
                          ) : sectionKey === 'Projects' && item.content.includes('|') ? (
                            <div>
                              <span className="font-semibold text-purple-700">{item.content.split('|')[0]}</span>
                              <span className="text-gray-600 text-sm ml-2">| {item.content.split('|')[1]}</span>
                            </div>
                          ) : sectionKey === 'Education' && item.content.includes('CGPA') ? (
                            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                              {item.content}
                            </div>
                          ) : sectionKey === 'Achievements' ? (
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">🏆</span>
                              {item.content}
                            </div>
                          ) : sectionKey === 'Certifications' ? (
                            <div className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {item.content}
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
          content += `- ${item.content} *(${item.source})*\n`;
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