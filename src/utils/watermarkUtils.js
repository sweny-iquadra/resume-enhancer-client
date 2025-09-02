import React from "react";
import {
    Paragraph,
    TextRun,
    AlignmentType,
    Footer,
    Header,
    ExternalHyperlink,
    HorizontalPositionAlign,
    VerticalPositionAlign,
    ImageRun
} from "docx";
import AppConfig from "../config";

/* export const WATERMARK_CONFIG = {
    text: "Powered by iQua.ai",
    url: "https://www.iqua.ai/",
    logoPath: AppConfig.WATERMARK_IMAGE_PATH, // Path to logo in public folder
    useImageWatermark: false,
}; */

// PDF watermark utilities
export const addFooterWatermarkPDF = (pdf, pageWidth, pageHeight, margin = 57.6) => {
    pdf.setTextColor(187, 187, 187); // Light gray (BBBBBB) to match DOC footer
    pdf.setFontSize(9);
    pdf.setFont("arial", "italic");
    const watermarkText = AppConfig.TEXT;
    const textWidth = pdf.getTextWidth(watermarkText);
    const textX = pageWidth - margin - textWidth;
    const textY = pageHeight - 20;

    // Add clickable link
    pdf.textWithLink(watermarkText, textX, textY, { url: AppConfig.URL, target: "_blank" });
    pdf.setTextColor(0, 0, 0);
};

export const addDiagonalTextWatermarkPDF = (pdf, pageWidth, pageHeight) => {
    pdf.saveGraphicsState();

    // Calculate center position
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    // Set watermark properties with very light gray and transparency
    pdf.setTextColor(224, 224, 224); // Very light gray (E0E0E0)
    pdf.setGState(pdf.GState({ opacity: 0.6 })); // Set transparency
    pdf.setFontSize(48);
    pdf.setFont("arial", "bold");

    // Rotate and add text
    const angle = 30; // Diagonal angle
    pdf.text(AppConfig.TEXT.toUpperCase(), centerX, centerY, {
        angle: angle,
        align: 'center',
        baseline: 'middle'
    });

    pdf.restoreGraphicsState();
}

// Add diagonal image watermark for PDF
export const addDiagonalImageWatermarkPDF = async (pdf, pageWidth, pageHeight) => {
    try {
        // Load image from public folder
        const response = await fetch(AppConfig.LOGO_PATH);
        const imageBlob = await response.blob();
        const imageDataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(imageBlob);
        });

        pdf.saveGraphicsState();

        // Calculate center position
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        // Set image properties
        const imageWidth = 200; // Adjust size as needed
        const imageHeight = 60; // Adjust size as needed

        // Rotate and add image
        const angle = 30; // Diagonal angle
        pdf.setGState(pdf.GState({ opacity: 0.6 })); // Set opacity

        // Add rotated image at center
        pdf.addImage(
            imageDataUrl,
            'PNG',
            centerX - imageWidth / 2,
            centerY - imageHeight / 2,
            imageWidth,
            imageHeight,
            undefined,
            'SLOW',
            angle
        );

        pdf.restoreGraphicsState();
    } catch (error) {
        console.error('Error adding image watermark:', error);
        // Fallback to text watermark
        addDiagonalTextWatermarkPDF(pdf, pageWidth, pageHeight);
    }
};

export const buildDocxFooter = (text = AppConfig.TEXT, url = AppConfig.URL) => {
    return new Footer({
        children: [
            new Paragraph({
                children: [
                    new ExternalHyperlink({
                        link: url,
                        children: [
                            new TextRun({
                                text,
                                italics: true,
                                color: "999999",
                                size: 18,
                                font: "Arial",
                            }),
                        ],
                    }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
            }),
        ],
    })
};

// DOC watermark utilities - Create proper diagonal watermark for every page
export const createDiagonalTextWatermarkDOC = async (text = AppConfig.TEXT || "Powered by iQua.ai") => {
    const watermarkHeader = new Header({
        children: [new Paragraph({
            children: [new ImageRun({
                data: new Uint8Array(await (await fetch((() => {
                    const s = 1400, c = document.createElement("canvas"); c.width = c.height = s;
                    const x = c.getContext("2d"); x.translate(s / 2, s / 2); x.rotate(-30 * Math.PI / 180);
                    x.font = "700 120px Arial, Helvetica, sans-serif";
                    x.fillStyle = "rgba(0,0,0,0.06)"; x.textAlign = "center";
                    x.textBaseline = "middle"; x.fillText(String(text).toUpperCase(), 0, 0);
                    return c.toDataURL("image/png");
                })())).arrayBuffer()),
                transformation: { width: 520, height: 520 },
                floating: {
                    behindDocument: true, allowOverlap: true, horizontalPosition: { align: HorizontalPositionAlign.CENTER }, verticalPosition: { align: VerticalPositionAlign.CENTER }
                }
            })]
        })]
    });
    return watermarkHeader;
};
// Add image watermark utility for DOC files
export const createDiagonalImageWatermarkDOC = async () => {
    const SRC = (AppConfig.LOGO_PATH) || "/iqua_logo.png";
    const BOX = 520, ANG = -30 * Math.PI / 180, OP = 0.6;
    const img = await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = SRC; });
    const c = document.createElement("canvas"); c.width = c.height = BOX; const ctx = c.getContext("2d");
    ctx.translate(BOX / 2, BOX / 2); ctx.rotate(ANG); const s = Math.min((BOX * 0.75) / img.width, (BOX * 0.75) / img.height); ctx.globalAlpha = OP;
    ctx.drawImage(img, -img.width * s / 2, -img.height * s / 2, img.width * s, img.height * s);
    const b64 = c.toDataURL("image/png").split(",")[1]; const bytes = Uint8Array.from(atob(b64), ch => ch.charCodeAt(0));
    return new Header({
        children: [new Paragraph({
            children: [new ImageRun({
                data: bytes, transformation: { width: BOX, height: BOX },
                floating: {
                    behindDocument: true, allowOverlap: true,
                    horizontalPosition: { align: HorizontalPositionAlign.CENTER },
                    verticalPosition: { align: VerticalPositionAlign.CENTER },
                },
            })]
        })]
    });
};

export const ClickableFooterPDF = ({ className = "" }) =>
    React.createElement(
        "div",
        { className: `mt-8 pt-4 border-t border-neutral-200 text-right ${className}` },
        React.createElement(
            "a",
            {
                href: AppConfig.URL,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xs text-neutral-400 hover:text-primary transition-colors cursor-pointer",
                style: { fontFamily: "Arial, sans-serif", fontSize: "9pt" },
            },
            AppConfig.TEXT
        )
    );
// convenience default
export default {
    AppConfig,
    buildDocxFooter,
    createDiagonalTextWatermarkDOC,
    createDiagonalImageWatermarkDOC,
    addDiagonalTextWatermarkPDF,
    addDiagonalImageWatermarkPDF,
    addFooterWatermarkPDF,
    ClickableFooterPDF,
};

// Helper: decide DOCX watermark header based on config
export const buildDocxWatermarkHeader = async () => {
    const useImage = !!(AppConfig.USE_IMAGE_WATERMARK === true);
    return useImage ? await createDiagonalImageWatermarkDOC() : await createDiagonalTextWatermarkDOC();
};






