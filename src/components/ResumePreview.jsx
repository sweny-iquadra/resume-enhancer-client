import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Footer,
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
  const [isEditing, setIsEditing] = useState(false);
  const [savedFinalResume, setSavedFinalResume] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previewScrollRef = useRef(null);

  // Close on backdrop
  const handleOutsideClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        setShowPreview(false);
      }
    },
    [setShowPreview]
  );

  // Load parsed resume data
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

  // Reset when new enhanced data arrives
  useEffect(() => {
    if (enhancedResumeData) {
      setSelections({});
      setIsEditing(false);
      setSavedFinalResume(null);
      setHasUnsavedChanges(false);

      const storedData = localStorage.getItem("parsedResumeData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setParsedResumeData(parsed);
        } catch (error) {
          console.error("Error parsing stored resume data:", error);
        }
      }
    }
  }, [enhancedResumeData]);

  // Original resume normalized
  const originalResume = useMemo(() => {
    if (!parsedResumeData?.parsed_resumes?.current_resumes) return null;
    const currentResumes = parsedResumeData.parsed_resumes.current_resumes;
    const normalized = {};
    Object.keys(currentResumes).forEach((sectionKey) => {
      const sectionData = currentResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        const dedup = Array.from(
          new Set(sectionData.filter((i) => i && i.trim()))
        );
        normalized[sectionKey] = dedup.map((item, index) => ({
          content: item,
          key: `original.${sectionKey}.${index}`,
        }));
      } else if (sectionData && sectionData.trim()) {
        normalized[sectionKey] = [
          { content: sectionData, key: `original.${sectionKey}.0` },
        ];
      }
    });
    return normalized;
  }, [parsedResumeData]);

  // Enhanced resume normalized
  const dynamicEnhancedResume = useMemo(() => {
    if (!parsedResumeData?.parsed_resumes?.enhanced_resume) return null;
    const enhancedResumes = parsedResumeData.parsed_resumes.enhanced_resume;
    const normalized = {};
    Object.keys(enhancedResumes).forEach((sectionKey) => {
      const sectionData = enhancedResumes[sectionKey];
      if (Array.isArray(sectionData)) {
        const dedup = Array.from(
          new Set(sectionData.filter((i) => i && i.trim()))
        );
        normalized[sectionKey] = dedup.map((item, index) => ({
          content: item,
          key: `enhanced.${sectionKey}.${index}`,
        }));
      } else if (sectionData && sectionData.trim()) {
        normalized[sectionKey] = [
          { content: sectionData, key: `enhanced.${sectionKey}.0` },
        ];
      }
    });
    return normalized;
  }, [parsedResumeData]);

  const enhancedSectionOrder = useMemo(() => {
    if (!dynamicEnhancedResume) return [];
    return Object.keys(dynamicEnhancedResume);
  }, [dynamicEnhancedResume]);

  // Build final resume (when nothing saved)
  const finalResume = useMemo(() => {
    if (savedFinalResume && Object.keys(savedFinalResume).length > 0) {
      return savedFinalResume;
    }
    if (!dynamicEnhancedResume && !originalResume) return {};

    const final = {};
    const hasSel = Object.keys(selections).some((k) => selections[k]);
    if (!hasSel) {
      const profileSummaryData = {
        enhanced:
          dynamicEnhancedResume?.["Profile Summary"] ||
          dynamicEnhancedResume?.["Summary"] ||
          [],
      };
      localStorage.setItem(
        "profileSummaryData",
        JSON.stringify(profileSummaryData)
      );
      return {};
    }

    enhancedSectionOrder.forEach((sectionKey) => {
      const orig = originalResume?.[sectionKey] || [];
      const enh = dynamicEnhancedResume?.[sectionKey] || [];
      const selectedItems = [];

      orig.forEach((item) => {
        if (selections[item.key])
          selectedItems.push({ content: item.content, source: "original" });
      });
      enh.forEach((item) => {
        if (selections[item.key])
          selectedItems.push({ content: item.content, source: "enhanced" });
      });

      if (selectedItems.length) final[sectionKey] = selectedItems;
    });

    return final;
  }, [
    selections,
    originalResume,
    dynamicEnhancedResume,
    enhancedSectionOrder,
    savedFinalResume,
  ]);

  // Edit/save handlers
  const handleEditClick = useCallback(() => setIsEditing(true), []);
  const handleSaveEdit = useCallback((editedData) => {
    setSavedFinalResume(editedData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setAlertConfig({
      title: "Success",
      message: "Resume saved successfully!",
      type: "success",
    });
    setShowAlert(true);
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, []);

  if (!showPreview) return null;

  if (!originalResume && !dynamicEnhancedResume) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        onClick={handleOutsideClick}
      >
        <div className="card max-w-md w-full p-6 text-center bg-white text-neutral-900">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="card-title mb-2 text-neutral-900">No Resume Data Available</h3>
          <p className="caption text-neutral-600 mb-4">
            Unable to load parsed resume data. Please try generating a new resume.
          </p>
          <button
            onClick={() => setShowPreview(false)}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  if (!dynamicEnhancedResume) return null;

  // Individual line selection
  const handleSelection = (key, isSelected) => {
    const [resumeType, sectionKey, indexStr] = key.split(".");
    const itemIndex = parseInt(indexStr, 10);

    const sourceData =
      resumeType === "original" ? originalResume : dynamicEnhancedResume;
    const itemContent = sourceData?.[sectionKey]?.[itemIndex]?.content;

    if (isSelected) {
      setSelections((prev) => {
        const next = { ...prev };
        const other = resumeType === "original" ? "enhanced" : "original";
        const mirrorKey = key.replace(`${resumeType}.`, `${other}.`);
        next[key] = true;
        next[mirrorKey] = false;
        return next;
      });

      if (savedFinalResume && itemContent) {
        setSavedFinalResume((prev) => {
          const updated = { ...prev };
          if (!updated[sectionKey]) updated[sectionKey] = [];
          const exists = updated[sectionKey].some(
            (i) => i.content === itemContent
          );
          if (!exists) {
            updated[sectionKey].push({
              content: itemContent,
              source: resumeType,
            });
          }
          return updated;
        });
      }
    } else {
      setSelections((prev) => ({ ...prev, [key]: false }));
      if (savedFinalResume && itemContent) {
        setSavedFinalResume((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          if (updated[sectionKey]) {
            updated[sectionKey] = updated[sectionKey].filter(
              (i) => i.content !== itemContent
            );
            if (updated[sectionKey].length === 0) delete updated[sectionKey];
          }
          return updated;
        });
      }
    }
  };

  // Utility to get all keys
  const getAllKeysForResume = (resumeData) => {
    const keys = [];
    if (!resumeData) return keys;
    Object.keys(resumeData).forEach((sectionKey) => {
      (resumeData[sectionKey] || []).forEach((item) => {
        if (item.key) keys.push(item.key);
      });
    });
    return keys;
  };

  // Are all selected for a type?
  const areAllSelectedForResumeType = (resumeType) => {
    const resumeData =
      resumeType === "original" ? originalResume : dynamicEnhancedResume;
    const keys = getAllKeysForResume(resumeData);
    return keys.length > 0 && keys.every((k) => selections[k] === true);
  };

  // Use All toggle (mutually exclusive)
  const handleSelectAllToggle = (resumeType) => {
    const other = resumeType === "original" ? "enhanced" : "original";
    const allSelected = areAllSelectedForResumeType(resumeType);

    const selectedResumeData =
      resumeType === "original" ? originalResume : dynamicEnhancedResume;
    const otherResumeData =
      resumeType === "original" ? dynamicEnhancedResume : originalResume;

    const selectedKeys = getAllKeysForResume(selectedResumeData);
    const otherKeys = getAllKeysForResume(otherResumeData);

    setSelections((prev) => {
      const next = { ...prev };
      if (allSelected) {
        selectedKeys.forEach((k) => (next[k] = false));
        otherKeys.forEach((k) => (next[k] = false));
      } else {
        selectedKeys.forEach((k) => (next[k] = true));
        otherKeys.forEach((k) => (next[k] = false));
      }
      return next;
    });

    setSavedFinalResume((prev) => {
      if (allSelected) {
        const updated = {};
        if (prev) {
          Object.keys(prev).forEach((sectionKey) => {
            if (!enhancedSectionOrder.includes(sectionKey)) {
              updated[sectionKey] = prev[sectionKey];
            }
          });
        }
        return updated;
      } else {
        const updated = {};
        enhancedSectionOrder.forEach((sectionKey) => {
          const sectionData = selectedResumeData?.[sectionKey] || [];
          if (sectionData.length) {
            updated[sectionKey] = sectionData.map((item) => ({
              content: item.content,
              source: resumeType,
            }));
          }
        });
        if (prev) {
          Object.keys(prev).forEach((sectionKey) => {
            if (!enhancedSectionOrder.includes(sectionKey)) {
              updated[sectionKey] = prev[sectionKey];
            }
          });
        }
        return updated;
      }
    });
  };

  const downloadResume = async (format) => {
    if (hasUnsavedChanges) {
      setAlertConfig({
        title: "Unsaved Changes",
        message:
          "You have unsaved changes in the live preview. Please save your changes before downloading.",
        type: "warning",
      });
      setShowAlert(true);
      return;
    }

    const resumeToDownload = savedFinalResume || finalResume;
    if (!resumeToDownload) return;

    try {
      const studentId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      const eligibilityResponse = await checkDownloadEligibility(studentId);

      if (!eligibilityResponse.is_eligible) {
        setAlertConfig({
          message:
            eligibilityResponse.message || "Download not allowed at this time.",
          type: "warning",
        });
        setShowAlert(true);
        return;
      }

      let fileInfo;
      if (format === "PDF") {
        fileInfo = await generateAndDownloadPDF(resumeToDownload);
      } else {
        fileInfo = await generateAndDownloadDocx(resumeToDownload);
      }

      if (fileInfo && fileInfo.file && fileInfo.filename) {
        try {
          await saveResumeToS3(studentId, fileInfo.file, fileInfo.filename);
        } catch (s3Error) {
          console.error("Error saving to S3:", s3Error);
        }
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
      setAlertConfig({
        title: "Error",
        message: "Unable to download resume. Please try again.",
        type: "error",
      });
      setShowAlert(true);
    }
  };

  // PDF builder
  const generateAndDownloadPDF = async (resumeData) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });
      pdf.setFont("arial", "normal");
      pdf.setFontSize(11);

      const pageWidth = 612,
        pageHeight = 792;
      const margin = 57.6;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      const addWatermark = () => {
        pdf.setTextColor(153, 153, 153);
        pdf.setFontSize(9);
        pdf.setFont("arial", "italic");
        const watermarkText = "Powered by iQua.ai";
        const w = pdf.getTextWidth(watermarkText);
        pdf.text(watermarkText, pageWidth - margin - w, pageHeight - 20);
        pdf.setTextColor(0, 0, 0);
      };
      addWatermark();

      const addText = (text, x, yPos, maxWidth, opts = {}) => {
        const {
          fontSize = 11,
          isBold = false,
          isTitle = false,
          lineHeight = 1.15,
        } = opts;
        pdf.setFontSize(fontSize);
        pdf.setFont("arial", isBold ? "bold" : "normal");
        if (isTitle) {
          const title = text.toUpperCase();
          pdf.text(title, x, yPos);
          const w = pdf.getTextWidth(title);
          pdf.setLineWidth(1);
          pdf.line(x, yPos + 3, x + w, yPos + 3);
          return yPos + 24;
        } else {
          const lines = pdf.splitTextToSize(text, maxWidth);
          pdf.text(lines, x, yPos);
          const totalHeight = lines.length * fontSize * lineHeight;
          return yPos + totalHeight + 6;
        }
      };

      const allSections = [
        ...enhancedSectionOrder,
        ...Object.keys(resumeData || {}).filter(
          (k) => !enhancedSectionOrder.includes(k)
        ),
      ];

      allSections.forEach((sectionKey, i) => {
        const items = resumeData[sectionKey] || [];
        if (!items.length) return;

        if (i > 0) y += 24;
        if (y > pageHeight - 100) {
          pdf.addPage();
          addWatermark();
          y = margin;
        }

        y = addText(formatSectionTitle(sectionKey), margin, y, contentWidth, {
          fontSize: 12,
          isBold: true,
          isTitle: true,
        });

        if (sectionKey.toLowerCase().includes("contact")) {
          items.forEach((item) => {
            if (y > pageHeight - 50) {
              pdf.addPage();
              addWatermark();
              y = margin;
            }
            y = addText(item.content, margin, y, contentWidth, {
              fontSize: 11,
              lineHeight: 1.15,
            });
          });
        } else {
          items.forEach((item) => {
            if (y > pageHeight - 50) {
              pdf.addPage();
              addWatermark();
              y = margin;
            }
            pdf.setFont("arial", "normal");
            pdf.setFontSize(11);
            pdf.text("•", margin, y);
            y = addText(item.content, margin + 12, y, contentWidth - 12, {
              fontSize: 11,
              lineHeight: 1.15,
            });
          });
        }
      });

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `Resume_${timestamp}.pdf`;
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });
      pdf.save(filename);
      return { file: pdfFile, filename };
    } catch (e) {
      console.error("Error generating PDF:", e);
      throw e;
    }
  };

  // DOCX builder
  const generateAndDownloadDocx = async (resumeData) => {
    try {
      const children = [];
      const allSections = [
        ...enhancedSectionOrder,
        ...Object.keys(resumeData || {}).filter(
          (k) => !enhancedSectionOrder.includes(k)
        ),
      ];

      allSections.forEach((sectionKey, idx) => {
        const items = resumeData[sectionKey] || [];
        if (!items.length) return;

        const isFirst = idx === 0;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: formatSectionTitle(sectionKey).toUpperCase(),
                bold: true,
                size: 24,
                font: "Arial",
                color: "000000",
              }),
            ],
            spacing: {
              after: 240,
              before: isFirst ? 0 : 360,
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
          })
        );

        if (sectionKey.toLowerCase().includes("contact")) {
          items.forEach((item) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.content,
                    size: 22,
                    font: "Arial",
                    color: "000000",
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 120, before: 0, line: 240, lineRule: "auto" },
              })
            );
          });
        } else {
          items.forEach((item) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${item.content}`,
                    size: 22,
                    font: "Arial",
                    color: "000000",
                  }),
                ],
                spacing: { after: 120, before: 0, line: 240, lineRule: "auto" },
                indent: { left: 180, hanging: 180 },
              })
            );
          });
        }
      });

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
              run: { font: "Arial", size: 22 },
              paragraph: {
                spacing: { line: 240, lineRule: "auto", after: 120, before: 0 },
              },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                margin: { top: 1152, right: 1152, bottom: 1152, left: 1152 },
                size: { orientation: "portrait", width: 12240, height: 15840 },
              },
            },
            children,
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Powered by iQua.ai",
                        size: 18,
                        font: "Arial",
                        color: "999999",
                        italics: true,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 0, before: 240 },
                  }),
                ],
              }),
            },
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `Resume_${timestamp}.docx`;
      const properBlob = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const docxFile = new File([properBlob], filename, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(properBlob, filename);
      return { file: docxFile, filename };
    } catch (e) {
      console.error("Error generating DOCX:", e);
      throw e;
    }
  };

  const formatSectionTitle = (sectionKey) =>
    sectionKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  // Left/Center column component
  const InteractiveWordDocument = ({
    resumeData,
    title,
    isOriginal = false,
  }) => {
    const getClickableLine = (key, content, displayContent = null) => {
      const isSelected = !!selections[key];

      return (
        <div className="flex items-start gap-2 group">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => handleSelection(key, e.target.checked)}
            className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <div
            className={`flex-1 cursor-pointer transition-all duration-200 rounded p-1 ${isSelected
              ? "bg-green-100 border-green-300 border"
              : "hover:bg-primary/5 border border-transparent"
              }`}
            onClick={() => handleSelection(key, !isSelected)}
          >
            {displayContent || (
              <span className="text-sm text-neutral-800">{content}</span>
            )}
          </div>
        </div>
      );
    };

    const sectionOrder = isOriginal
      ? enhancedSectionOrder
      : Object.keys(resumeData || {});
    return (
      <div className="card bg-white text-neutral-900 shadow-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-neutral-200 flex items-center gap-2 bg-neutral-50">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-neutral-600 font-medium">{title}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-neutral-500">📄</span>
            <span className="text-xs text-neutral-500">100%</span>
          </div>
        </div>

        <div
          className="p-8 min-h-[600px] space-y-6 bg-white"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "11pt",
            lineHeight: "1.15",
          }}
        >
          {resumeData &&
            sectionOrder.map((sectionKey, idx) => {
              const sectionItems = resumeData[sectionKey] || [];
              if (!sectionItems.length) return null;

              return (
                <div key={idx} className="mb-6 space-y-3">
                  <h2
                    className="text-lg font-bold mb-4 text-neutral-900 uppercase"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: "12pt",
                      fontWeight: "bold",
                      borderBottom: "1px solid #333",
                      paddingBottom: "2px",
                    }}
                  >
                    {formatSectionTitle(sectionKey)}
                  </h2>

                  <div className="space-y-2">
                    {sectionKey.toLowerCase().includes("contact") ? (
                      <div
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "11pt",
                          lineHeight: "1.15",
                        }}
                      >
                        <div className="space-y-2">
                          {sectionItems.map((item, i) => (
                            <div key={i}>
                              {getClickableLine(
                                item.key,
                                item.content,
                                <div
                                  className="text-neutral-800"
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "11pt",
                                    lineHeight: "1.15",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      sectionItems.map((item, i) => (
                        <div key={i}>
                          {getClickableLine(
                            item.key,
                            item.content,
                            <div
                              className="text-neutral-800 flex items-start"
                              style={{
                                fontFamily: "Arial, sans-serif",
                                fontSize: "11pt",
                                lineHeight: "1.15",
                              }}
                            >
                              <span
                                className="text-neutral-600 mr-3 mt-0.5"
                                style={{ fontSize: "11pt" }}
                              >
                                •
                              </span>
                              <span
                                className="flex-1"
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-200 text-right bg-white">
          <p
            className="text-xs text-neutral-400"
            style={{ fontFamily: "Arial, sans-serif", fontSize: "9pt" }}
          >
            Powered by iQua.ai
          </p>
        </div>
      </div>
    );
  };

  // Right column (preview + edit)
  const FinalResumePreview = ({
    resumeData,
    isEditing,
    onSave,
    onCancel,
    onEdit,
    savedFinalResume,
    previewScrollRef,
  }) => {
    const [editableContent, setEditableContent] = useState({});
    const [newSectionName, setNewSectionName] = useState("");
    const [showNewSectionInput, setShowNewSectionInput] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const currentData =
      savedFinalResume ||
      (Object.keys(finalResume || {}).length > 0 ? finalResume : resumeData);

    useEffect(() => {
      if (isEditing) {
        setEditableContent(JSON.parse(JSON.stringify(currentData || {})));
      }
    }, [isEditing, currentData]);

    // Track scroll position
    useEffect(() => {
      const handleScroll = () => {
        if (previewScrollRef.current) {
          setScrollPosition(previewScrollRef.current.scrollTop);
        }
      };

      const scrollEl = previewScrollRef.current;
      if (scrollEl) {
        scrollEl.addEventListener("scroll", handleScroll);
        return () => scrollEl.removeEventListener("scroll", handleScroll);
      }
    }, []);

    const handleContentChange = (sectionKey, itemIndex, newContent) => {
      if (!isEditing) return;
      setHasUnsavedChanges(true);
      setEditableContent((prev) => {
        const updatedSection = [...(prev[sectionKey] || [])];
        updatedSection[itemIndex] = {
          ...updatedSection[itemIndex],
          content: newContent,
        };
        return { ...prev, [sectionKey]: updatedSection };
      });
    };

    const handleAddBulletPoint = (sectionKey) => {
      if (!isEditing) return;
      setHasUnsavedChanges(true);
      setEditableContent((prev) => ({
        ...prev,
        [sectionKey]: [
          ...(prev[sectionKey] || []),
          { content: "", source: "user-added" },
        ],
      }));
    };

    const preservePreviewScroll = (evt, stateUpdater) => {
      const currentScrollTop = previewScrollRef.current?.scrollTop || 0;
      stateUpdater();
      setTimeout(() => {
        if (previewScrollRef.current) {
          previewScrollRef.current.scrollTop = currentScrollTop;
        }
      }, 0);
    };

    const handleRemoveBulletPoint = (sectionKey, itemIndex, evt) => {
      if (!isEditing) return;

      preservePreviewScroll(evt, () => {
        const itemToRemove = editableContent[sectionKey]?.[itemIndex];
        if (!itemToRemove) return;

        const contentToRemove = itemToRemove.content;

        const originalItems = originalResume?.[sectionKey] || [];
        const enhancedItems = dynamicEnhancedResume?.[sectionKey] || [];

        const originalMatch = originalItems.find(
          (i) => i.content === contentToRemove
        );
        const enhancedMatch = enhancedItems.find(
          (i) => i.content === contentToRemove
        );

        setSelections((prev) => ({
          ...prev,
          ...(originalMatch && { [originalMatch.key]: false }),
          ...(enhancedMatch && { [enhancedMatch.key]: false }),
        }));

        setHasUnsavedChanges(true);
        setEditableContent((prev) => {
          const updated = { ...prev };
          const arr = [...(updated[sectionKey] || [])];
          arr.splice(itemIndex, 1);
          if (arr.length === 0) delete updated[sectionKey];
          else updated[sectionKey] = arr;
          return updated;
        });

        setSavedFinalResume((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          if (updated[sectionKey]) {
            updated[sectionKey] = updated[sectionKey].filter(
              (i) => i.content !== contentToRemove
            );
            if (updated[sectionKey].length === 0) delete updated[sectionKey];
          }
          return Object.keys(updated).length ? updated : {};
        });
      });
    };

    const handleAddNewSection = () => {
      if (!isEditing || !newSectionName.trim()) return;
      const sectionName = newSectionName.trim();
      setEditableContent((prev) => ({
        ...prev,
        [sectionName]: [{ content: "", source: "user-added" }],
      }));
      setNewSectionName("");
      setShowNewSectionInput(false);
      setHasUnsavedChanges(true);
    };

    const handleRemoveSection = (sectionKey, evt) => {
      if (!isEditing) return;

      preservePreviewScroll(evt, () => {
        const originalItems = originalResume?.[sectionKey] || [];
        const enhancedItems = dynamicEnhancedResume?.[sectionKey] || [];
        setSelections((prev) => {
          const next = { ...prev };
          originalItems.forEach((i) => (next[i.key] = false));
          enhancedItems.forEach((i) => (next[i.key] = false));
          return next;
        });

        setEditableContent((prev) => {
          const updated = { ...prev };
          delete updated[sectionKey];
          return updated;
        });

        setSavedFinalResume((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          delete updated[sectionKey];
          return Object.keys(updated).length ? updated : {};
        });

        setHasUnsavedChanges(true);
      });
    };

    const displayData = isEditing ? editableContent : currentData;

    if (!displayData || Object.keys(displayData).length === 0) {
      return (
        <div className="card bg-white text-neutral-600 p-8 text-center">
          <div className="mb-4">📄</div>
          <p className="caption">Select content from either version to build your resume</p>
        </div>
      );
    }

    return (
      <div className="card bg-white text-neutral-900 shadow-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-neutral-200 flex items-center gap-2 bg-neutral-50">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-neutral-700 font-medium">
            {savedFinalResume ? "Final_Resume_Edited.docx" : "Final_Resume.docx"}
            {savedFinalResume && (
              <span className="ml-2 text-green-600 text-xs">✓ Latest Saved Version</span>
            )}
            {isEditing && (
              <span className="ml-2 text-primary text-xs">
                ✏️ Editing...
                {hasUnsavedChanges && <span className="text-secondary"> (Unsaved)</span>}
              </span>
            )}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {!isEditing && Object.keys(currentData || {}).length > 0 && (
              <button
                onClick={onEdit}
                className="btn btn-primary"
                title="Edit resume content"
              >
                ✏️ <span className="ml-1">Edit</span>
              </button>
            )}
            {isEditing && (
              <div className="flex flex-wrap items-center gap-2 w-full overflow-visible">
                <button onClick={() => onSave(editableContent)} className="btn btn-primary">
                  Save
                </button>
                <button onClick={onCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className="p-8 min-h-[600px] space-y-6 bg-white"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "11pt",
            lineHeight: "1.15",
          }}
        >
          {[
            ...enhancedSectionOrder,
            ...Object.keys(displayData || {}).filter(
              (k) => !enhancedSectionOrder.includes(k)
            ),
          ].map((sectionKey, idx) => {
            const sectionItems = displayData[sectionKey] || [];
            if (!sectionItems.length) return null;

            return (
              <div key={idx} className="mb-6 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className="text-lg font-bold text-neutral-900 uppercase"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: "12pt",
                      fontWeight: "bold",
                      borderBottom: "1px solid #333",
                      paddingBottom: "2px",
                      flex: 1,
                    }}
                  >
                    {formatSectionTitle(sectionKey)}
                  </h2>
                  {isEditing && !enhancedSectionOrder.includes(sectionKey) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveSection(sectionKey, e);
                      }}
                      className="flex-shrink-0 text-red-500 hover:text-red-700 text-xs ml-2"
                      title="Remove section"
                    >
                      ❌ Remove Section
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {sectionKey.toLowerCase().includes("contact") ? (
                    <div
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11pt",
                        lineHeight: "1.15",
                      }}
                    >
                      <div className="space-y-2">
                        {sectionItems.map((item, itemIndex) => (
                          <div
                            key={`${sectionKey}-contact-${itemIndex}`}
                            className="group relative"
                          >
                            {isEditing ? (
                              <div className="flex items-start gap-2">
                                <textarea
                                  value={item.content || ""}
                                  onChange={(e) =>
                                    handleContentChange(
                                      sectionKey,
                                      itemIndex,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 text-neutral-800 border-none outline-none resize-none bg-transparent"
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "11pt",
                                    lineHeight: "1.15",
                                    minHeight: "24px",
                                  }}
                                  rows={Math.max(
                                    1,
                                    Math.ceil((item.content || "").length / 80)
                                  )}
                                  placeholder="Enter contact information..."
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveBulletPoint(sectionKey, itemIndex, e);
                                  }}
                                  className="flex-shrink-0 text-red-500 hover:text-red-700 text-xs ml-2"
                                  title="Remove contact entry"
                                >
                                  ❌
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex-1 text-neutral-800"
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "11pt",
                                  lineHeight: "1.15",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <div className="mt-2">
                            <button
                              onClick={() => handleAddBulletPoint(sectionKey)}
                              className="text-primary hover:brightness-110 text-sm flex items-center gap-1 transition-colors"
                            >
                              <span>+</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    sectionItems.map((item, itemIndex) => (
                      <div
                        key={`${sectionKey}-bullet-${itemIndex}`}
                        className="group relative"
                      >
                        <div
                          className="text-neutral-800 flex items-start"
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: "11pt",
                            lineHeight: "1.15",
                          }}
                        >
                          <span
                            className="text-neutral-600 mr-3 mt-0.5"
                            style={{ fontSize: "11pt" }}
                          >
                            •
                          </span>
                          {isEditing ? (
                            <div className="flex-1 flex items-start gap-2">
                              <textarea
                                value={item.content || ""}
                                onChange={(e) =>
                                  handleContentChange(
                                    sectionKey,
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1 text-neutral-800 border-none outline-none resize-none bg-transparent"
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "11pt",
                                  lineHeight: "1.15",
                                  minHeight: "24px",
                                }}
                                rows={Math.max(
                                  1,
                                  Math.ceil((item.content || "").length / 80)
                                )}
                                placeholder="Enter bullet point content..."
                                autoComplete="off"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveBulletPoint(
                                    sectionKey,
                                    itemIndex,
                                    e
                                  );
                                }}
                                className="flex-shrink-0 text-red-500 hover:text-red-700 text-xs ml-2"
                                title="Remove bullet point"
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <span
                              className="flex-1"
                              dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          <div className="mt-8 pt-4 border-t border-neutral-200 text-right">
            <p
              className="text-xs text-neutral-400"
              style={{ fontFamily: "Arial, sans-serif", fontSize: "9pt" }}
            >
              Powered by iQua.ai
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="rounded-2xl shadow-2xl max-w-7xl w-full h-[95vh] animate-fade-in flex flex-col bg-neutral-900 border border-neutral-800">
        {/* Header */}
        <div className="text-white p-6 rounded-t-2xl flex justify-between items-center bg-gradient-to-br from-accent to-primary">
          <div>
            <h3 className="font-dmsans text-lg font-semibold">Customize Your Resume</h3>
            <p className="caption text-white/90 mt-1">
              Select the best content from original and AI-enhanced versions
            </p>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="text-white hover:bg-white/15 rounded-full p-2 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 h-full">
            {/* Original */}
            <div className="overflow-y-auto p-4 border-r border-neutral-800 bg-neutral-900">
              <div className="text-center mb-4">
                <h4 className="font-dmsans font-semibold text-neutral-100 mb-2">
                  Your Original
                </h4>
                <p className="caption text-neutral-300 mb-3">Select content to keep</p>
                <button
                  onClick={() => handleSelectAllToggle("original")}
                  className="btn grad-cta text-white"
                >
                  <span className="mr-1">
                    {areAllSelectedForResumeType("original") ? "✕" : "✓"}
                  </span>
                  <span>
                    {areAllSelectedForResumeType("original")
                      ? "Clear Selection"
                      : "Use All Original"}
                  </span>
                </button>
              </div>
              <InteractiveWordDocument
                resumeData={originalResume}
                title="Original_Resume.docx"
                isOriginal={true}
              />
            </div>

            {/* Enhanced */}
            <div className="overflow-y-auto p-4 border-r border-neutral-800 bg-neutral-900">
              <div className="text-center mb-4">
                <h4 className="font-dmsans font-semibold text-neutral-100 mb-2">
                  AI Enhanced
                </h4>
                <p className="caption text-neutral-300 mb-3">Select improved content</p>
                <button
                  onClick={() => handleSelectAllToggle("enhanced")}
                  className="btn grad-cta text-white"
                >
                  <span className="mr-1">
                    {areAllSelectedForResumeType("enhanced") ? "✕" : "✓"}
                  </span>
                  <span>
                    {areAllSelectedForResumeType("enhanced")
                      ? "Clear Selection"
                      : "Use All Enhanced"}
                  </span>
                </button>
              </div>
              <InteractiveWordDocument
                resumeData={dynamicEnhancedResume}
                title="Enhanced_Resume.docx"
                isOriginal={false}
              />
            </div>

            {/* Final Preview */}
            <div
              ref={previewScrollRef}
              className="overflow-y-auto p-4 bg-neutral-900"
            >
              <div className="text-center mb-4">
                <h4 className="font-dmsans font-semibold text-neutral-100 mb-2">
                  Final Resume
                </h4>
                <p className="caption text-neutral-300">Live preview</p>
              </div>
              <FinalResumePreview
                resumeData={finalResume}
                isEditing={isEditing}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onEdit={handleEditClick}
                savedFinalResume={savedFinalResume}
                previewScrollRef={previewScrollRef}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-6 bg-neutral-900 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="caption text-neutral-300">
              Pick individual lines or use "Use All" buttons for quick selection
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => downloadResume("PDF")}
                disabled={
                  (!finalResume || Object.keys(finalResume).length === 0) &&
                  (!savedFinalResume ||
                    Object.keys(savedFinalResume).length === 0)
                }
                className={`btn grad-cta text-white ${(!finalResume || Object.keys(finalResume).length === 0) &&
                  (!savedFinalResume ||
                    Object.keys(savedFinalResume).length === 0)
                  ? "opacity-60 cursor-not-allowed"
                  : ""
                  }`}
                title={
                  savedFinalResume
                    ? "Download most recent saved version"
                    : "Download current version"
                }
              >
                📄 <span className="ml-1">Download PDF</span>
              </button>
              <button
                onClick={() => downloadResume("DOC")}
                disabled={
                  (!finalResume || Object.keys(finalResume).length === 0) &&
                  (!savedFinalResume ||
                    Object.keys(savedFinalResume).length === 0)
                }
                className={`btn grad-cta text-white ${(!finalResume || Object.keys(finalResume).length === 0) &&
                  (!savedFinalResume ||
                    Object.keys(savedFinalResume).length === 0)
                  ? "opacity-60 cursor-not-allowed"
                  : ""
                  }`}
                title={
                  savedFinalResume
                    ? "Download most recent saved version"
                    : "Download current version"
                }
              >
                📃 <span className="ml-1">Download DOC</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
