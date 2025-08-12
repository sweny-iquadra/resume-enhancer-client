import React, { useState, useEffect, useMemo, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Footer,
  SectionType,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveResumeToS3, checkDownloadEligibility } from "../utils/api";
import AlertModal from "./modals/AlertModal";

const ResumePreview = ({ showPreview, setShowPreview, enhancedResumeData }) => {
  const [selections, setSelections] = useState({});
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [previewContent, setPreviewContent] = useState({});
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionItems, setNewSectionItems] = useState([""]);

  // Define handleOutsideClick before any potential early returns
  const handleOutsideClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setShowPreview(false);
    }
  }, [setShowPreview]);

  // Load parsed resume data from localStorage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem("parsedResumeData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setParsedResumeData(parsed);
      } catch (error) {
        console.error("Error parsing stored resume data:", error);
      }
    }
  }, [showPreview]);

  // Reset states when modal opens
  useEffect(() => {
    if (showPreview) {
      setIsSaved(false);
      setPreviewContent({});
      setSelections({});
    }
  }, [showPreview]);

  // Memoize the normalized resume data to prevent unnecessary recalculations
  const originalResume = useMemo(() => {
    if (!parsedResumeData?.parsed_resumes?.current_resumes) {
      return null;
    }

    const currentResumes = parsedResumeData.parsed_resumes.current_resumes;
    const normalizedData = {};

    // Dynamically process all sections in current_resumes with deduplication
    Object.keys(currentResumes).forEach((sectionKey) => {
      const sectionData = currentResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Remove duplicates using Set and filter out empty strings
        const deduplicatedData = Array.from(
          new Set(sectionData.filter((item) => item && item.trim())),
        );
        normalizedData[sectionKey] = deduplicatedData.map((item, index) => ({
          content: item,
          key: `original.${sectionKey}.${index}`,
        }));
      } else {
        // Handle non-array data
        if (sectionData && sectionData.trim()) {
          normalizedData[sectionKey] = [
            {
              content: sectionData,
              key: `original.${sectionKey}.0`,
            },
          ];
        }
      }
    });

    return normalizedData;
  }, [parsedResumeData]);

  const dynamicEnhancedResume = useMemo(() => {
    if (!parsedResumeData?.parsed_resumes?.enhanced_resume) {
      return null;
    }

    const enhancedResumes = parsedResumeData.parsed_resumes.enhanced_resume;
    const normalizedData = {};

    // Dynamically process all sections in enhanced_resume with deduplication
    Object.keys(enhancedResumes).forEach((sectionKey) => {
      const sectionData = enhancedResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        // Remove duplicates using Set and filter out empty strings
        const deduplicatedData = Array.from(
          new Set(sectionData.filter((item) => item && item.trim())),
        );
        normalizedData[sectionKey] = deduplicatedData.map((item, index) => ({
          content: item,
          key: `enhanced.${sectionKey}.${index}`,
        }));
      } else {
        // Handle non-array data
        if (sectionData && sectionData.trim()) {
          normalizedData[sectionKey] = [
            {
              content: sectionData,
              key: `enhanced.${sectionKey}.0`,
            },
          ];
        }
      }
    });

    return normalizedData;
  }, [parsedResumeData]);

  // Get the section order from enhanced resume
  const enhancedSectionOrder = useMemo(() => {
    if (!dynamicEnhancedResume) return [];
    return Object.keys(dynamicEnhancedResume);
  }, [dynamicEnhancedResume]);

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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Resume Data Available
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to load parsed resume data. Please try generating a new
            resume.
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
    setSelections((prev) => {
      const newSelections = { ...prev };

      if (isSelected) {
        // When selecting a line, we need to deselect the corresponding line from the other resume
        const keyParts = key.split(".");
        const resumeType = keyParts[0]; // 'original' or 'enhanced'
        const otherResumeType =
          resumeType === "original" ? "enhanced" : "original";

        // Create the corresponding key for the other resume
        const correspondingKey = key.replace(
          `${resumeType}.`,
          `${otherResumeType}.`,
        );

        // Set the selected line and deselect the corresponding line from the other resume
        newSelections[key] = true;
        newSelections[correspondingKey] = false;
      } else {
        // Simply deselect the line
        newSelections[key] = false;
      }

      return newSelections;
    });
    setIsSaved(false); // Mark as unsaved when selections change
  };

  // Function to add content to preview
  const addToPreview = (sectionKey, content, source) => {
    setPreviewContent(prev => {
      const newContent = { ...prev };
      if (!newContent[sectionKey]) {
        newContent[sectionKey] = [];
      }
      
      // Check if content already exists to avoid duplicates
      const exists = newContent[sectionKey].some(item => item.content === content);
      if (!exists) {
        newContent[sectionKey].push({ content, source });
      }
      
      return newContent;
    });
    setIsSaved(false);
  };

  // Function to remove content from preview
  const removeFromPreview = (sectionKey, contentIndex) => {
    setPreviewContent(prev => {
      const newContent = { ...prev };
      if (newContent[sectionKey]) {
        const removedItem = newContent[sectionKey][contentIndex];
        newContent[sectionKey].splice(contentIndex, 1);
        
        // If section is empty, remove it
        if (newContent[sectionKey].length === 0) {
          delete newContent[sectionKey];
        }
        
        // Update selections to deselect the removed item
        if (removedItem) {
          const resumeData = removedItem.source === 'original' ? originalResume : dynamicEnhancedResume;
          if (resumeData && resumeData[sectionKey]) {
            const matchingItem = resumeData[sectionKey].find(item => item.content === removedItem.content);
            if (matchingItem) {
              setSelections(prevSelections => ({
                ...prevSelections,
                [matchingItem.key]: false
              }));
            }
          }
        }
      }
      return newContent;
    });
    setIsSaved(false);
  };

  // Function to remove entire section from preview
  const removeSectionFromPreview = (sectionKey) => {
    setPreviewContent(prev => {
      const newContent = { ...prev };
      
      // Deselect all items in this section
      if (newContent[sectionKey]) {
        newContent[sectionKey].forEach(item => {
          const resumeData = item.source === 'original' ? originalResume : dynamicEnhancedResume;
          if (resumeData && resumeData[sectionKey]) {
            const matchingItem = resumeData[sectionKey].find(resumeItem => resumeItem.content === item.content);
            if (matchingItem) {
              setSelections(prevSelections => ({
                ...prevSelections,
                [matchingItem.key]: false
              }));
            }
          }
        });
      }
      
      delete newContent[sectionKey];
      return newContent;
    });
    setIsSaved(false);
  };

  // Function to get all possible keys for a resume
  const getAllKeysForResume = (resumeData, prefix) => {
    const keys = [];

    if (!resumeData) return keys;

    // Dynamically get all keys from all sections
    Object.keys(resumeData).forEach((sectionKey) => {
      const sectionItems = resumeData[sectionKey] || [];
      sectionItems.forEach((item) => {
        keys.push(item.key);
      });
    });

    return keys;
  };

  // Function to check if all items from a resume type are selected
  const areAllSelectedForResumeType = (resumeType) => {
    const resumeData =
      resumeType === "original" ? originalResume : dynamicEnhancedResume;
    const keys = getAllKeysForResume(resumeData, resumeType);
    return keys.length > 0 && keys.every((key) => selections[key] === true);
  };

  // Function to toggle select all from one resume
  const handleSelectAllToggle = (resumeType) => {
    setSelections((prev) => {
      const newSelections = { ...prev };
      const otherResumeType =
        resumeType === "original" ? "enhanced" : "original";
      const allCurrentlySelected = areAllSelectedForResumeType(resumeType);

      // Get all keys for both resumes
      const selectedResumeData =
        resumeType === "original" ? originalResume : dynamicEnhancedResume;
      const otherResumeData =
        resumeType === "original" ? dynamicEnhancedResume : originalResume;

      const selectedKeys = getAllKeysForResume(selectedResumeData, resumeType);
      const otherKeys = getAllKeysForResume(otherResumeData, otherResumeType);

      if (allCurrentlySelected) {
        // If all are selected, clear all selections from both resumes
        selectedKeys.forEach((key) => {
          newSelections[key] = false;
        });
        otherKeys.forEach((key) => {
          newSelections[key] = false;
        });
        // Clear preview content
        setPreviewContent({});
      } else {
        // If not all are selected, select all from chosen resume and deselect all from other
        selectedKeys.forEach((key) => {
          newSelections[key] = true;
        });
        otherKeys.forEach((key) => {
          newSelections[key] = false;
        });
        
        // Update preview content with selected resume data
        const newPreviewContent = {};
        Object.keys(selectedResumeData).forEach(sectionKey => {
          newPreviewContent[sectionKey] = selectedResumeData[sectionKey].map(item => ({
            content: item.content,
            source: resumeType
          }));
        });
        setPreviewContent(newPreviewContent);
      }

      return newSelections;
    });
    setIsSaved(false);
  };

  // Function to handle save
  const handleSave = () => {
    // Update selections based on preview content
    const newSelections = {};
    
    Object.keys(previewContent).forEach(sectionKey => {
      previewContent[sectionKey].forEach(item => {
        const resumeData = item.source === 'original' ? originalResume : dynamicEnhancedResume;
        if (resumeData && resumeData[sectionKey]) {
          const matchingItem = resumeData[sectionKey].find(resumeItem => resumeItem.content === item.content);
          if (matchingItem) {
            newSelections[matchingItem.key] = true;
          }
        }
      });
    });
    
    setSelections(newSelections);
    setIsSaved(true);
    
    setAlertConfig({
      title: "Saved Successfully",
      message: "Your resume content has been saved. You can now download it.",
      type: "success"
    });
    setShowAlert(true);
  };

  // Function to add new section
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const validItems = newSectionItems.filter(item => item.trim());
    if (validItems.length === 0) return;
    
    setPreviewContent(prev => ({
      ...prev,
      [newSectionName]: validItems.map(item => ({
        content: item,
        source: 'custom'
      }))
    }));
    
    // Reset modal state
    setNewSectionName("");
    setNewSectionItems([""]);
    setShowAddSectionModal(false);
    setIsSaved(false);
  };

  const downloadResume = async (format) => {
    if (!isSaved) {
      setAlertConfig({
        title: "Save Required",
        message: "Please save your content first before downloading.",
        type: "warning"
      });
      setShowAlert(true);
      return;
    }

    // Use previewContent for download
    const resumeToDownload = previewContent;
    console.log("Downloading resume with data:", resumeToDownload);

    if (!resumeToDownload || Object.keys(resumeToDownload).length === 0) {
      setAlertConfig({
        title: "No Content",
        message: "Please add some content to your resume before downloading.",
        type: "warning"
      });
      setShowAlert(true);
      return;
    }

    try {
      const studentId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

      const eligibilityResponse = await checkDownloadEligibility(studentId);

      if (!eligibilityResponse.is_eligible) {
        setAlertConfig({
          message: eligibilityResponse.message || "Download not allowed at this time.",
          type: "warning"
        });
        setShowAlert(true);
        return;
      }

      let fileInfo;

      if (format === "PDF") {
        // Generate actual PDF file
        fileInfo = await generateAndDownloadPDF(resumeToDownload);
      } else {
        // Generate proper DOCX file
        fileInfo = await generateAndDownloadDocx(resumeToDownload);
      }

      // Save to S3 after successful download
      if (fileInfo && fileInfo.file && fileInfo.filename) {
        console.log("Saving file to S3:", fileInfo.filename);

        try {
          const s3Response = await saveResumeToS3(
            studentId,
            fileInfo.file,
            fileInfo.filename,
          );
          console.log("File successfully saved to S3:", s3Response);
        } catch (s3Error) {
          console.error("Error saving to S3:", s3Error);
          // Don't prevent download if S3 save fails, just log the error
        }
      }

      console.log(`Successfully downloaded resume as ${format}`);
    } catch (error) {
      setAlertConfig({
        title: "Error",
        message: "Unable to check download eligibility. Please try again.",
        type: "error"
      });
      setShowAlert(true);
    }
  };

  // Function to generate actual PDF file with EXACT same formatting as preview
  const generateAndDownloadPDF = async (resumeData) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });

      // Set exactly the same font as preview - Arial, 11pt
      pdf.setFont("arial", "normal");
      pdf.setFontSize(11);

      // PDF dimensions and margins - match preview exactly
      const pageWidth = 612; // 8.5 inches * 72 points
      const pageHeight = 792; // 11 inches * 72 points
      const margin = 57.6; // 0.8 inches * 72 points (same as preview padding)
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Function to add watermark exactly like preview
      const addWatermark = () => {
        pdf.setTextColor(153, 153, 153); // Same gray as preview
        pdf.setFontSize(9);
        pdf.setFont("arial", "italic");
        const watermarkText = "Powered by iQua.ai";
        const watermarkWidth = pdf.getTextWidth(watermarkText);
        const watermarkX = pageWidth - margin - watermarkWidth;
        const watermarkY = pageHeight - 20;
        pdf.text(watermarkText, watermarkX, watermarkY);
        pdf.setTextColor(0, 0, 0); // Reset to black
      };

      addWatermark();

      // Function to add text with EXACT same spacing as preview
      const addText = (text, x, y, maxWidth, options = {}) => {
        const {
          fontSize = 11,
          isBold = false,
          isTitle = false,
          lineHeight = 1.15
        } = options;

        pdf.setFontSize(fontSize);
        pdf.setFont("arial", isBold ? "bold" : "normal");

        if (isTitle) {
          // Section titles - exactly like preview
          pdf.setFontSize(12);
          pdf.setFont("arial", "bold");

          // Convert to uppercase like preview
          const titleText = text.toUpperCase();
          pdf.text(titleText, x, y);

          // Add underline exactly like preview
          const textWidth = pdf.getTextWidth(titleText);
          pdf.setLineWidth(1);
          pdf.line(x, y + 3, x + textWidth, y + 3);

          return y + 24; // Same spacing as preview (24pt after section titles)
        } else {
          // Regular text
          const lines = pdf.splitTextToSize(text, maxWidth);
          pdf.text(lines, x, y);

          // Calculate line spacing exactly like preview
          const lineSpacing = fontSize * lineHeight;
          const totalHeight = lines.length * lineSpacing;

          return y + totalHeight + 6; // 6pt paragraph spacing like preview
        }
      };

      // Process each section with EXACT same formatting as preview
      const sectionOrder = Object.keys(resumeData);
      sectionOrder.forEach((sectionKey, sectionIndex) => {
        const sectionItems = resumeData[sectionKey] || [];

        if (sectionItems.length > 0) {
          // Section spacing - exactly like preview
          if (sectionIndex > 0) {
            yPosition += 24; // 24pt between sections like preview
          }

          // Check if we need a new page
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            addWatermark();
            yPosition = margin;
          }

          // Add section title with exact same formatting as preview
          const formattedTitle = formatSectionTitle(sectionKey);
          yPosition = addText(formattedTitle, margin, yPosition, contentWidth, {
            fontSize: 12,
            isBold: true,
            isTitle: true
          });

          // Add section content with exact same formatting as preview
          if (sectionKey.toLowerCase().includes("contact")) {
            // Contact information - no bullets, exactly like preview
            sectionItems.forEach((item) => {
              if (yPosition > pageHeight - 50) {
                pdf.addPage();
                addWatermark();
                yPosition = margin;
              }
              yPosition = addText(item.content, margin, yPosition, contentWidth, {
                fontSize: 11,
                lineHeight: 1.15
              });
            });
          } else {
            // All other sections with bullet points - exactly like preview
            sectionItems.forEach((item) => {
              if (yPosition > pageHeight - 50) {
                pdf.addPage();
                addWatermark();
                yPosition = margin;
              }

              // Add bullet point exactly like preview
              pdf.setFont("arial", "normal");
              pdf.setFontSize(11);
              pdf.text("•", margin, yPosition);

              // Add content with exact same indentation as preview
              yPosition = addText(item.content, margin + 12, yPosition, contentWidth - 12, {
                fontSize: 11,
                lineHeight: 1.15
              });
            });
          }
        }
      });

      // Generate filename and save
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `Resume_${timestamp}.pdf`;
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], filename, { type: "application/pdf" });

      pdf.save(filename);
      return { file: pdfFile, filename };
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Function to generate DOCX with exact same formatting as preview
  const generateAndDownloadDocx = async (resumeData) => {
    try {
      const children = [];

      // Process each section with exact same formatting as preview
      const sectionOrder = Object.keys(resumeData);
      sectionOrder.forEach((sectionKey, sectionIndex) => {
        const sectionItems = resumeData[sectionKey] || [];

        if (sectionItems.length > 0) {
          const isFirstSection = sectionIndex === 0;

          // Section title - exactly like preview
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: formatSectionTitle(sectionKey).toUpperCase(),
                  bold: true,
                  size: 24, // 12pt
                  font: "Arial",
                  color: "000000",
                }),
              ],
              spacing: {
                after: 240, // 12pt spacing after section title
                before: isFirstSection ? 0 : 360, // 18pt spacing before section
                line: 240,
                lineRule: "auto",
              },
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 4,
                },
              },
            }),
          );

          // Section content with exact same formatting as preview
          if (sectionKey.toLowerCase().includes("contact")) {
            // Contact information - no bullets, exactly like preview
            sectionItems.forEach((item) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item.content,
                      size: 22, // 11pt
                      font: "Arial",
                      color: "000000",
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                  spacing: {
                    after: 120, // 6pt spacing between items
                    before: 0,
                    line: 240,
                    lineRule: "auto",
                  },
                }),
              );
            });
          } else {
            // All other sections with bullet points - exactly like preview
            sectionItems.forEach((item) => {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${item.content}`,
                      size: 22, // 11pt
                      font: "Arial",
                      color: "000000",
                    }),
                  ],
                  spacing: {
                    after: 120, // 6pt spacing between items
                    before: 0,
                    line: 240,
                    lineRule: "auto",
                  },
                  indent: {
                    left: 180, // 9pt left indent for bullet content
                    hanging: 180, // Hanging indent for bullet points
                  },
                }),
              );
            });
          }
        }
      });

      // Create document with exact same specifications as preview
      const doc = new Document({
        creator: "iQua.ai Resume Builder",
        title: "Professional Resume",
        description: "ATS-Friendly Professional Resume",
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              basedOn: "Normal",
              next: "Normal",
              run: {
                font: "Arial",
                size: 22, // 11pt
              },
              paragraph: {
                spacing: {
                  line: 240,
                  lineRule: "auto",
                  after: 120,
                  before: 0,
                },
              },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1152, // 0.8 inch margins (same as preview padding)
                  right: 1152,
                  bottom: 1152,
                  left: 1152,
                },
                size: {
                  orientation: "portrait",
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: children,
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Powered by iQua.ai",
                        size: 18, // 9pt
                        font: "Arial",
                        color: "999999",
                        italics: true,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: {
                      after: 0,
                      before: 240,
                    },
                  }),
                ],
              }),
            },
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `Resume_${timestamp}.docx`;

      const properBlob = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const docxFile = new File([properBlob], filename, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(properBlob, filename);
      return { file: docxFile, filename };
    } catch (error) {
      console.error("Error generating DOCX:", error);
      throw error;
    }
  };

  // Helper function to format section titles exactly like preview
  const formatSectionTitle = (sectionKey) => {
    return sectionKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Interactive Word Document Component with ATS-friendly formatting
  const InteractiveWordDocument = ({ resumeData, title, isOriginal = false, prefix }) => {
    const getClickableLine = (key, content, displayContent = null, sectionKey, item) => {
      const isSelected = selections[key];

      return (
        <div className="flex items-start gap-2 group">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              handleSelection(key, e.target.checked);
              if (e.target.checked) {
                addToPreview(sectionKey, content, isOriginal ? 'original' : 'enhanced');
              }
            }}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div
            className={`flex-1 cursor-pointer transition-all duration-200 rounded p-1 ${isSelected
              ? "bg-green-100 border-green-300 border"
              : "hover:bg-blue-50 border border-transparent"
              }`}
            onClick={() => {
              const newSelected = !isSelected;
              handleSelection(key, newSelected);
              if (newSelected) {
                addToPreview(sectionKey, content, isOriginal ? 'original' : 'enhanced');
              }
            }}
          >
            {displayContent || (
              <span className="text-sm text-gray-800">{content}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToPreview(sectionKey, content, isOriginal ? 'original' : 'enhanced');
              handleSelection(key, true);
            }}
            className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all"
          >
            Add
          </button>
        </div>
      );
    };

    // Use enhanced section order for consistent display
    const sectionOrder = isOriginal ? enhancedSectionOrder : Object.keys(resumeData || {});

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

        {/* Document Content - EXACT same formatting as downloads */}
        <div className="p-8 min-h-[600px] space-y-6" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15", background: "white" }}>
          {resumeData && sectionOrder.map((sectionKey, sectionIndex) => {
            const sectionItems = resumeData[sectionKey] || [];

            if (!sectionItems || sectionItems.length === 0) {
              return null;
            }

            return (
              <div key={sectionIndex} className="mb-6 space-y-3">
                <h2 className="text-lg font-bold mb-4 text-gray-900 uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #333", paddingBottom: "2px" }}>
                  {formatSectionTitle(sectionKey)}
                </h2>

                <div className="space-y-2">
                  {sectionKey.toLowerCase().includes("contact") ? (
                    // Contact information - no bullets, exactly like downloads
                    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                      <div className="space-y-2">
                        {sectionItems.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            {getClickableLine(item.key, item.content,
                              <div className="text-gray-800" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                                {item.content}
                              </div>,
                              sectionKey,
                              item
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // All other sections with bullets, exactly like downloads
                    sectionItems.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {getClickableLine(item.key, item.content,
                          <div className="text-gray-800 flex items-start" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                            <span className="text-gray-600 mr-3 mt-0.5" style={{ fontSize: "11pt" }}>•</span>
                            <span className="flex-1">{item.content}</span>
                          </div>,
                          sectionKey,
                          item
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer - exactly like downloads */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-right">
          <p className="text-xs text-gray-400" style={{ fontFamily: "Arial, sans-serif", fontSize: "9pt" }}>
            Powered by iQua.ai
          </p>
        </div>
      </div>
    );
  };

  // Final Resume Preview Component with exact same formatting as downloads
  const FinalResumePreview = ({ resumeData }) => {
    if (!resumeData || Object.keys(resumeData).length === 0) {
      return (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <div className="mb-4">📄</div>
          <p>Select content from either version to build your resume</p>
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Section
          </button>
        </div>
      );
    }

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
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              + Add Section
            </button>
          </div>
        </div>

        {/* Document Content - EXACT same formatting as downloads */}
        <div className="p-8 min-h-[600px] space-y-6" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15", background: "white" }}>
          {Object.keys(resumeData).map((sectionKey, sectionIndex) => {
            const sectionItems = resumeData[sectionKey] || [];

            if (!sectionItems || sectionItems.length === 0) {
              return null;
            }

            return (
              <div key={sectionIndex} className="mb-6 space-y-2 group">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold mb-3 text-gray-900 uppercase" style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", fontWeight: "bold", borderBottom: "1px solid #333", paddingBottom: "2px" }}>
                    {formatSectionTitle(sectionKey)}
                  </h2>
                  <button
                    onClick={() => removeSectionFromPreview(sectionKey)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all"
                  >
                    Remove Section
                  </button>
                </div>

                <div className="space-y-2">
                  {sectionKey.toLowerCase().includes("contact") ? (
                    // Contact information - no bullets, exactly like downloads
                    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                      <div className="space-y-2">
                        {sectionItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="group flex items-start gap-2">
                            <div className="flex-1 text-gray-800" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                              {item.content}
                            </div>
                            <button
                              onClick={() => removeFromPreview(sectionKey, itemIndex)}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // All other sections with bullets - exactly like downloads
                    sectionItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="group flex items-start gap-2">
                        <div className="flex-1 text-gray-800 flex items-start" style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt", lineHeight: "1.15" }}>
                          <span className="text-gray-600 mr-3 mt-0.5" style={{ fontSize: "11pt" }}>•</span>
                          <span className="flex-1">{item.content}</span>
                        </div>
                        <button
                          onClick={() => removeFromPreview(sectionKey, itemIndex)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer - exactly like downloads */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-right">
            <p className="text-xs text-gray-400" style={{ fontFamily: "Arial, sans-serif", fontSize: "9pt" }}>
              Powered by iQua.ai
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add Section Modal
  const AddSectionModal = () => {
    if (!showAddSectionModal) return null;

    return (
      <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Add New Section</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Certifications, Awards, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Items
              </label>
              {newSectionItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...newSectionItems];
                      newItems[index] = e.target.value;
                      setNewSectionItems(newItems);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter content item"
                  />
                  {newSectionItems.length > 1 && (
                    <button
                      onClick={() => {
                        const newItems = newSectionItems.filter((_, i) => i !== index);
                        setNewSectionItems(newItems);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setNewSectionItems([...newSectionItems, ""])}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                + Add Item
              </button>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowAddSectionModal(false);
                setNewSectionName("");
                setNewSectionItems([""]);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSection}
              disabled={!newSectionName.trim() || newSectionItems.every(item => !item.trim())}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Section
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleOutsideClick}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[95vh] animate-fade-in flex flex-col">
        {/* Modal Header */}
        <div className="text-white p-6 rounded-t-2xl flex justify-between items-center"
          style={{ background: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)' }}
        >
          <div>
            <h3 className="text-xl font-semibold">Customize Your Resume</h3>
            <p className="text-sm opacity-90 mt-1">Select content and build your perfect resume</p>
          </div>
          <div className="flex items-center space-x-3">
            {!isSaved && Object.keys(previewContent).length > 0 && (
              <span className="text-sm bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            {isSaved && (
              <span className="text-sm bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                ✓ Saved
              </span>
            )}
            <button onClick={() => setShowPreview(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 h-full">
            {/* Left Panel - Original Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Original</h4>
                <p className="text-sm text-gray-600 mb-3">Select content to keep</p>
                <button onClick={() => handleSelectAllToggle("original")} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto">
                  <span>{areAllSelectedForResumeType("original") ? "✕" : "✓"}</span>
                  <span>{areAllSelectedForResumeType("original") ? "Clear Selection" : "Use All Original"}</span>
                </button>
              </div>
              <InteractiveWordDocument resumeData={originalResume} title="Original_Resume.docx" isOriginal={true} prefix="original" />
            </div>

            {/* Middle Panel - Enhanced Resume */}
            <div className="overflow-y-auto p-4 border-r border-gray-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Enhanced</h4>
                <p className="text-sm text-gray-600 mb-3">Select improved content</p>
                <button onClick={() => handleSelectAllToggle("enhanced")} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto">
                  <span>{areAllSelectedForResumeType("enhanced") ? "✕" : "✓"}</span>
                  <span>{areAllSelectedForResumeType("enhanced") ? "Clear Selection" : "Use All Enhanced"}</span>
                </button>
              </div>
              <InteractiveWordDocument resumeData={dynamicEnhancedResume} title="Enhanced_Resume.docx" isOriginal={false} prefix="enhanced" />
            </div>

            {/* Right Panel - Final Resume Preview */}
            <div className="overflow-y-auto p-4 bg-gray-50">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Final Resume</h4>
                <p className="text-sm text-gray-600">Live preview</p>
              </div>
              <FinalResumePreview resumeData={previewContent} />
            </div>
          </div>
        </div>

        {/* Footer with Save and Download Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Build your resume by selecting content from original and enhanced versions</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleSave}
                disabled={Object.keys(previewContent).length === 0}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>💾</span>
                <span>Save</span>
              </button>
              <button 
                onClick={() => downloadResume("PDF")} 
                disabled={!isSaved || Object.keys(previewContent).length === 0} 
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
              <button 
                onClick={() => downloadResume("DOC")} 
                disabled={!isSaved || Object.keys(previewContent).length === 0} 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📃</span>
                <span>Download DOC</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Section Modal */}
      <AddSectionModal />
      
      {/* Alert Modal */}
      <AlertModal
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
      />
    </div>
  );
};

export default ResumePreview;