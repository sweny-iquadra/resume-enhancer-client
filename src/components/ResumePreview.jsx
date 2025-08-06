import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Footer, SectionType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveResumeToS3 } from '../utils/api';

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
        // Skip Profile Summary section - it will be handled separately
        if (sectionKey === 'Profile Summary') {
          return;
        }

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

      // Still store Profile Summary data even when no selections
      const profileSummaryData = {
        enhanced: dynamicEnhancedResume?.['Profile Summary'] || dynamicEnhancedResume?.['Summary'] || []
      };
      localStorage.setItem('profileSummaryData', JSON.stringify(profileSummaryData));
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

  const downloadResume = async (format) => {
    // Use finalResume for download
    const resumeToDownload = finalResume;
    console.log('Downloading resume with data:', resumeToDownload);

    if (!resumeToDownload) return;

    try {
      let fileInfo;

      if (format === 'PDF') {
        // Generate actual PDF file
        fileInfo = await generateAndDownloadPDF(resumeToDownload);
      } else {
        // Generate proper DOCX file
        fileInfo = await generateAndDownloadDocx(resumeToDownload);
      }

      // Get userId from localStorage or user profile
      const studentId = JSON.parse(localStorage.getItem('user') || '{}')?.id || null;
      //const studentId = '1';
      // Save to S3 after successful download
      if (fileInfo && fileInfo.file && fileInfo.filename) {
        console.log('Saving file to S3:', fileInfo.filename);

        try {
          const s3Response = await saveResumeToS3(studentId, fileInfo.file, fileInfo.filename);
          console.log('File successfully saved to S3:', s3Response);
        } catch (s3Error) {
          console.error('Error saving to S3:', s3Error);
          // Don't prevent download if S3 save fails, just log the error
        }
      }

      console.log(`Successfully downloaded resume as ${format}`);
    } catch (error) {
      console.error(`Error downloading resume as ${format}:`, error);
      alert(`Error downloading resume. Please try again.`);
    }
  };

  // Function to generate actual PDF file
  const generateAndDownloadPDF = async (resumeData) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      // PDF dimensions in points (72 DPI)
      const pageWidth = 612; // 8.5 inches
      const pageHeight = 792; // 11 inches
      const margin = 54; // 0.75 inches
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;

      // Function to add watermark to each page
      const addWatermark = () => {
        pdf.setTextColor(200, 200, 200); // Light gray color
        pdf.setFontSize(10);
        pdf.setFont('times', 'italic');
        const watermarkText = 'Powered by iQua.ai';
        const watermarkWidth = pdf.getTextWidth(watermarkText);
        const watermarkX = pageWidth - margin - watermarkWidth; // Bottom right
        const watermarkY = pageHeight - margin;
        pdf.text(watermarkText, watermarkX, watermarkY);
        pdf.setTextColor(0, 0, 0); // Reset to black
      };

      // Set default font
      pdf.setFont('times', 'normal');
      pdf.setFontSize(11);

      // Add watermark to first page
      addWatermark();

      // Function to add text with word wrapping
      const addTextWithWrap = (text, x, y, maxWidth, fontSize = 11, isBold = false, isTitle = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('times', isBold ? 'bold' : 'normal');

        if (isTitle) {
          // Add underline for section titles
          const textWidth = pdf.getTextWidth(text);
          pdf.text(text, x, y);
          pdf.line(x, y + 3, x + textWidth, y + 3);
          return y + 20;
        } else {
          const lines = pdf.splitTextToSize(text, maxWidth);
          pdf.text(lines, x, y);
          return y + (lines.length * (fontSize * 1.2)) + 4;
        }
      };

      // Process each section
      Object.keys(resumeData).forEach((sectionKey, sectionIndex) => {
        const sectionItems = resumeData[sectionKey] || [];

        if (sectionItems.length > 0) {
          // Add section spacing (except for first section)
          if (sectionIndex > 0) {
            yPosition += 10;
          }

          // Check if we need a new page
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            addWatermark(); // Add watermark to new page
            yPosition = margin;
          }

          // Add section title
          const formattedTitle = formatSectionTitle(sectionKey).toUpperCase();
          yPosition = addTextWithWrap(formattedTitle, margin, yPosition, contentWidth, 12, true, true);

          // Add section content
          if (sectionKey.toLowerCase().includes('contact')) {
            // Contact information - left aligned like other sections
            sectionItems.forEach(item => {
              // Check if we need a new page
              if (yPosition > pageHeight - 50) {
                pdf.addPage();
                addWatermark(); // Add watermark to new page
                yPosition = margin;
              }

              let content = item.content;

              // Add the content with proper word wrapping
              yPosition = addTextWithWrap(content, margin, yPosition, contentWidth, 11);
            });
          } else {
            // Regular sections
            sectionItems.forEach(item => {
              // Check if we need a new page
              if (yPosition > pageHeight - 50) {
                pdf.addPage();
                addWatermark(); // Add watermark to new page
                yPosition = margin;
              }

              let content = item.content;
              let xPos = margin;

              // Handle special formatting for different sections - exactly as shown in preview
              const isTechnicalSkill = sectionKey === 'Technical Skills' && content.includes(':');
              const isProject = sectionKey === 'Projects' && content.includes('|');
              const isAchievement = sectionKey === 'Achievements';
              const isCertification = sectionKey === 'Certifications';
              const isSkills = sectionKey === 'Skills' || sectionKey === 'Summary' || sectionKey === 'Top Skills' || sectionKey === 'Work Experience';
              const isProjectsWithoutPipe = sectionKey === 'Projects' && !content.includes('|');

              if (isTechnicalSkill) {
                // Technical Skills with bold labels - exactly as shown in preview
                const [label, value] = content.split(':');
                pdf.setFont('times', 'bold');
                pdf.setFontSize(11);
                const labelWidth = pdf.getTextWidth(`${label}:`);
                pdf.text(`${label}:`, xPos, yPosition);
                pdf.setFont('times', 'normal');
                pdf.text(` ${value}`, xPos + labelWidth, yPosition);
                yPosition += 15;
              } else if (isProject) {
                // Projects with bold titles - exactly as shown in preview
                const [title, description] = content.split('|');
                pdf.setFont('times', 'bold');
                pdf.setFontSize(11);
                const titleWidth = pdf.getTextWidth(title);
                pdf.text(title, xPos, yPosition);
                pdf.setFont('times', 'normal');
                pdf.text(` | ${description}`, xPos + titleWidth, yPosition);
                yPosition += 15;
              } else if (isAchievement) {
                // Achievements with trophy icon - exactly as shown in preview
                pdf.setFontSize(11);
                pdf.setFont('times', 'normal');
                pdf.text('🏆 ', xPos, yPosition);
                yPosition = addTextWithWrap(content, xPos + 15, yPosition, contentWidth - 15, 11);
              } else if (isCertification) {
                // Certifications with checkmark icon - exactly as shown in preview
                pdf.setFontSize(11);
                pdf.setFont('times', 'normal');
                pdf.text('✓ ', xPos, yPosition);
                yPosition = addTextWithWrap(content, xPos + 15, yPosition, contentWidth - 15, 11);
              } else if (isSkills || isProjectsWithoutPipe || shouldHaveBulletPoints(sectionKey)) {
                // Skills, Summary, Top Skills, Work Experience, and other sections with bullet points - exactly as shown in preview
                pdf.setFontSize(11);
                pdf.setFont('times', 'normal');
                pdf.text('•', margin, yPosition);
                xPos = margin + 15;

                // Special handling for education highlights
                if (sectionKey.toLowerCase() === 'education' && content.includes('CGPA')) {
                  pdf.setFont('times', 'bold');
                }

                // Add the content
                yPosition = addTextWithWrap(content, xPos, yPosition, contentWidth - (xPos - margin), 11);

                // Reset font after education highlights
                if (sectionKey.toLowerCase() === 'education' && content.includes('CGPA')) {
                  pdf.setFont('times', 'normal');
                }
              } else {
                // Regular content without bullets - exactly as shown in preview
                yPosition = addTextWithWrap(content, xPos, yPosition, contentWidth, 11);
              }
            });
          }
        }
      });

      // No footer needed - watermark is sufficient

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Resume_${timestamp}.pdf`;

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');

      // Create a File object from the blob for S3 upload
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      // Download the PDF (existing functionality)
      pdf.save(filename);

      // Return the file and filename for S3 upload
      return { file: pdfFile, filename };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      throw error;
    }
  };

  // Function to generate professional HTML for PDF printing
  const generateProfessionalHTML = (resumeData) => {
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Professional Resume</title>
    <style>
        @media print {
            @page {
                margin: 0.75in;
                size: letter;
            }
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.2;
            margin: 0;
            padding: 20px;
            color: #000;
            background: white;
        }

        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
        }

        .section {
            margin-bottom: 18px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            padding-bottom: 3px;
            margin-bottom: 8px;
            color: #000;
            letter-spacing: 0.5px;
        }

        .section-content {
            margin-left: 0;
        }

        .content-item {
            margin-bottom: 4px;
            line-height: 1.3;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 4px;
        }

        .bullet-point {
            color: #000;
            margin-right: 8px;
            font-weight: bold;
            flex-shrink: 0;
            margin-top: 1px;
        }

        .bullet-content {
            flex: 1;
        }

        .contact-info {
            text-align: center;
            margin-bottom: 15px;
        }

        .contact-item {
            display: inline-block;
            margin: 0 15px 5px 0;
        }

        .education-highlight {
            background-color: #f8f9fa;
            padding: 6px 10px;
            border-left: 3px solid #007bff;
            margin-bottom: 6px;
        }

        .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 8px;
        }
    </style>
</head>
<body>
    <div class="resume-container">
`;

    // Dynamically generate content from all sections
    Object.keys(resumeData).forEach(sectionKey => {
      const sectionItems = resumeData[sectionKey] || [];

      if (sectionItems.length > 0) {
        html += `        <div class="section">\n`;
        html += `            <div class="section-title">${formatSectionTitle(sectionKey)}</div>\n`;
        html += `            <div class="section-content">\n`;

        if (sectionKey.toLowerCase() === 'contact information' || sectionKey.toLowerCase().includes('contact')) {
          // Special formatting for contact information
          html += `                <div class="contact-info">\n`;
          sectionItems.forEach(item => {
            html += `                    <div class="contact-item">${item.content}</div>\n`;
          });
          html += `                </div>\n`;
        } else {
          sectionItems.forEach(item => {
            if (sectionKey.toLowerCase() === 'education' && item.content.includes('CGPA')) {
              html += `                <div class="education-highlight">${item.content}</div>\n`;
            } else if (shouldHaveBulletPoints(sectionKey)) {
              html += `                <div class="bullet-item">\n`;
              html += `                    <span class="bullet-point">•</span>\n`;
              html += `                    <span class="bullet-content">${item.content}</span>\n`;
              html += `                </div>\n`;
            } else {
              html += `                <div class="content-item">${item.content}</div>\n`;
            }
          });
        }

        html += `            </div>\n`;
        html += `        </div>\n`;
      }
    });

    html += `
        <div class="footer">
            Powered by iQua.ai
        </div>
    </div>
</body>
</html>`;

    return html;
  };

  // Function to generate proper DOCX file
  const generateAndDownloadDocx = async (resumeData) => {
    try {
      const children = [];

      // Process each section with proper formatting and minimal top spacing
      Object.keys(resumeData).forEach((sectionKey, sectionIndex) => {
        const sectionItems = resumeData[sectionKey] || [];

        if (sectionItems.length > 0) {
          const isFirstSection = sectionIndex === 0;

          // Add section title with proper formatting
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: formatSectionTitle(sectionKey),
                  bold: true,
                  size: 28, // 14pt
                  font: "Times New Roman",
                  color: "1F2937"
                })
              ],
              spacing: {
                after: 120,
                before: isFirstSection ? 0 : 320 // Reduced top spacing, no spacing for first section
              },
              border: {
                bottom: {
                  color: "333333",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 4
                }
              }
            })
          );

          // Add section content with proper handling
          if (sectionKey.toLowerCase().includes('contact')) {
            // Contact Information - left aligned like other sections
            sectionItems.forEach((item, index) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item.content,
                      size: 22, // 11pt
                      font: "Times New Roman",
                      color: "000000"
                    })
                  ],
                  alignment: AlignmentType.LEFT,
                  spacing: { after: 60, before: 0 }
                })
              );
            });
          } else {
            // Regular sections with enhanced formatting
            sectionItems.forEach((item, index) => {
              const shouldBullet = shouldHaveBulletPoints(sectionKey);
              const isEducationHighlight = sectionKey.toLowerCase() === 'education' && item.content.includes('CGPA');
              const isTechnicalSkill = sectionKey === 'Technical Skills' && item.content.includes(':');
              const isProject = sectionKey === 'Projects' && item.content.includes('|');
              const isAchievement = sectionKey === 'Achievements';
              const isCertification = sectionKey === 'Certifications';
              const isSkills = sectionKey === 'Skills' || sectionKey === 'Summary' || sectionKey === 'Top Skills' || sectionKey === 'Work Experience';
              const isProjectsWithoutPipe = sectionKey === 'Projects' && !item.content.includes('|');

              let textContent = item.content;
              let paragraphChildren = [];

              if (isTechnicalSkill) {
                // Technical Skills with bold labels - exactly as shown in preview
                const [label, value] = item.content.split(':');
                paragraphChildren = [
                  new TextRun({
                    text: `${label}:`,
                    size: 22,
                    font: "Times New Roman",
                    color: "000000",
                    bold: true
                  }),
                  new TextRun({
                    text: ` ${value}`,
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  })
                ];
              } else if (isProject) {
                // Projects with bold titles - exactly as shown in preview
                const [title, description] = item.content.split('|');
                paragraphChildren = [
                  new TextRun({
                    text: title,
                    size: 22,
                    font: "Times New Roman",
                    color: "7C3AED", // Purple color
                    bold: true
                  }),
                  new TextRun({
                    text: ` | ${description}`,
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  })
                ];
              } else if (isAchievement) {
                // Achievements with trophy icon - exactly as shown in preview
                paragraphChildren = [
                  new TextRun({
                    text: "🏆 ",
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  }),
                  new TextRun({
                    text: item.content,
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  })
                ];
              } else if (isCertification) {
                // Certifications with checkmark icon - exactly as shown in preview
                paragraphChildren = [
                  new TextRun({
                    text: "✓ ",
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  }),
                  new TextRun({
                    text: item.content,
                    size: 22,
                    font: "Times New Roman",
                    color: "000000"
                  })
                ];
              } else if (isSkills || isProjectsWithoutPipe || shouldBullet) {
                // Skills, Summary, Top Skills, Work Experience, and other sections with bullet points - exactly as shown in preview
                textContent = `• ${item.content}`;
                paragraphChildren = [
                  new TextRun({
                    text: textContent,
                    size: 22, // 11pt
                    font: "Times New Roman",
                    color: "000000",
                    bold: isEducationHighlight
                  })
                ];
              } else {
                // Regular content without bullets - exactly as shown in preview
                paragraphChildren = [
                  new TextRun({
                    text: textContent,
                    size: 22, // 11pt
                    font: "Times New Roman",
                    color: "000000",
                    bold: isEducationHighlight
                  })
                ];
              }

              children.push(
                new Paragraph({
                  children: paragraphChildren,
                  spacing: { after: 40, before: 0 }, // Reduced spacing between items
                  indent: (isSkills || isProjectsWithoutPipe || shouldBullet) && !isTechnicalSkill && !isProject ? { left: 240 } : undefined, // Reduced indent for bullet points
                  shading: isEducationHighlight ? {
                    type: "solid",
                    color: "F8F9FA"
                  } : undefined
                })
              );
            });
          }
        }
      });

      // Create the document with proper metadata and structure
      const doc = new Document({
        creator: "iQua.ai Resume Builder",
        title: "Professional Resume",
        description: "AI-Enhanced Professional Resume",
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              basedOn: "Normal",
              next: "Normal",
              run: {
                font: "Times New Roman",
                size: 22 // 11pt
              },
              paragraph: {
                spacing: {
                  line: 230, // 1.15 line spacing to match preview
                  lineRule: "auto"
                }
              }
            }
          ]
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720, // 0.5 inch top margin in twips
                  right: 1080, // 0.75 inch side margins
                  bottom: 720, // 0.5 inch bottom margin
                  left: 1080
                },
                size: {
                  orientation: "portrait",
                  width: 12240, // 8.5 inches in twips
                  height: 15840 // 11 inches in twips
                }
              }
            },
            children: children,
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Powered by iQua.ai",
                        size: 20, // 10pt
                        font: "Times New Roman",
                        color: "CCCCCC", // Light gray
                        italics: true
                      })
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 0, before: 0 }
                  })
                ]
              })
            }
          }
        ]
      });

      // Generate blob with proper MIME type
      const blob = await Packer.toBlob(doc);

      // Create a proper filename with timestamp to avoid conflicts
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Resume_${timestamp}.docx`;

      // Use saveAs with proper blob type
      const properBlob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Create a File object from the blob for S3 upload
      const docxFile = new File([properBlob], filename, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Download the DOCX (existing functionality)
      saveAs(properBlob, filename);

      // Return the file and filename for S3 upload
      return { file: docxFile, filename };

    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating Word document. Please try again.');
      throw error;
    }
  };

  // Helper function to format section titles
  const formatSectionTitle = (sectionKey) => {
    return sectionKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .toUpperCase();
  };

  // Function to check if a section should have bullet points
  const shouldHaveBulletPoints = (sectionKey) => {
    const bulletPointSections = [
      'top_skills', 'certifications', 'summary', 'work_experience',
      'education', 'skills', 'projects', 'achievements'
    ];
    return bulletPointSections.includes(sectionKey.toLowerCase()) ||
      sectionKey === 'Skills' ||
      sectionKey === 'Summary' ||
      sectionKey === 'Top Skills' ||
      sectionKey === 'Work Experience';
  };

  // Function to parse and format contact information
  const parseContactInformation = (contactItems) => {
    const contactFields = {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      address: '',
      other: []
    };

    contactItems.forEach(item => {
      const content = item.content.toLowerCase();

      if (content.includes('@') && (content.includes('.com') || content.includes('.org') || content.includes('.net'))) {
        if (content.includes('linkedin')) {
          contactFields.linkedin = item;
        } else if (content.includes('github')) {
          contactFields.github = item;
        } else {
          contactFields.email = item;
        }
      } else if (content.includes('phone') || content.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || content.match(/\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/)) {
        contactFields.phone = item;
      } else if (content.includes('linkedin') || content.includes('www.linkedin.com')) {
        contactFields.linkedin = item;
      } else if (content.includes('github') || content.includes('www.github.com')) {
        contactFields.github = item;
      } else if (content.includes('st') || content.includes('street') || content.includes('ave') || content.includes('road') || content.includes('usa') || content.includes('address')) {
        contactFields.address = item;
      } else if (!contactFields.name && !content.includes('email') && !content.includes('phone') && !content.includes('www.')) {
        contactFields.name = item;
      } else {
        contactFields.other.push(item);
      }
    });

    return contactFields;
  };

  // Function to render formatted contact information
  const renderFormattedContactInfo = (contactItems, getClickableLine) => {
    const contactFields = parseContactInformation(contactItems);

    return (
      <div className="space-y-2">
        {contactFields.name && (
          <div>
            {getClickableLine(
              contactFields.name.key,
              contactFields.name.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Name:</span>
                <span className="text-gray-800">{contactFields.name.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.email && (
          <div>
            {getClickableLine(
              contactFields.email.key,
              contactFields.email.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Email:</span>
                <span className="text-blue-600 underline">{contactFields.email.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.phone && (
          <div>
            {getClickableLine(
              contactFields.phone.key,
              contactFields.phone.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Phone:</span>
                <span className="text-gray-800">{contactFields.phone.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.linkedin && (
          <div>
            {getClickableLine(
              contactFields.linkedin.key,
              contactFields.linkedin.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">LinkedIn:</span>
                <span className="text-blue-600 underline">{contactFields.linkedin.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.github && (
          <div>
            {getClickableLine(
              contactFields.github.key,
              contactFields.github.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">GitHub:</span>
                <span className="text-blue-600 underline">{contactFields.github.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.address && (
          <div>
            {getClickableLine(
              contactFields.address.key,
              contactFields.address.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Address:</span>
                <span className="text-gray-800">{contactFields.address.content}</span>
              </div>
            )}
          </div>
        )}

        {contactFields.other.map((item, index) => (
          <div key={index}>
            {getClickableLine(
              item.key,
              item.content,
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Other:</span>
                <span className="text-gray-800">{item.content}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
                  {sectionKey.toLowerCase().includes('contact') ? (
                    // Special formatting for contact information - left aligned
                    <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.15' }}>
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
                                {item.content}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Regular formatting for other sections
                    sectionItems.map((item, itemIndex) => (
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
                            {sectionKey === 'Technical Skills' && item.content.includes(':') ? (
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
                    ))
                  )}
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

  // Final Resume Preview Component (Read-only)
  const FinalResumePreview = ({ resumeData }) => {
    if (!resumeData) return null;

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
          <span className="text-sm text-gray-600 font-medium">Final_Resume.docx</span>
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
                  {sectionKey.toLowerCase().includes('contact') ? (
                    // Special formatting for contact information - left aligned
                    <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.15' }}>
                      <div className="space-y-2">
                        {sectionItems.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <div className="text-gray-800" style={{
                              fontFamily: 'Times New Roman, serif',
                              fontSize: '12pt',
                              lineHeight: '1.15'
                            }}>
                              {item.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Regular formatting for other sections
                    sectionItems.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div className="text-gray-800" style={{
                          fontFamily: 'Times New Roman, serif',
                          fontSize: '12pt',
                          lineHeight: '1.15'
                        }}>
                          {/* Handle special formatting for certain sections */}
                          {sectionKey === 'Technical Skills' && item.content.includes(':') ? (
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
                      </div>
                    ))
                  )}
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
                <p className="text-sm text-gray-600">Live preview</p>
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
              <span>Pick individual lines or use "Use All" buttons for quick selection</span>
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