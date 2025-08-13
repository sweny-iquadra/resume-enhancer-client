import React, { useState, useEffect } from "react";
import { fetchDownloadedResumes } from "../utils/api";
import { useAuth } from "../utils/AuthContext";

const DownloadedResumes = ({ setCurrentPage }) => {
    const [downloadedResumes, setDownloadedResumes] = useState([]);
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResume, setSelectedResume] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const { user } = useAuth();

    useEffect(() => {
        const loadDownloadedResumes = async () => {
            try {
                setIsLoading(true);
                const studentId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
                const response = await fetchDownloadedResumes(studentId);

                // Map API response to component format (UNCHANGED)
                const resumes = (response.files || []).map((file, index) => ({
                    id: index + 1,
                    filename: file.filename,
                    file_type: file.extension,
                    file_size: formatFileSize(file.size_bytes),
                    download_date: file.uploaded_at,
                    s3_key: file.s3_key,
                    download_url: file.download_url
                }));

                setDownloadedResumes(resumes);
                setFilteredResumes(resumes);
            } catch (err) {
                setError("Failed to load downloaded resumes");
                console.error("Error loading downloaded resumes:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDownloadedResumes();
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (fileType) => {
        switch (fileType.toLowerCase()) {
            case "pdf":
                return "📄";
            case "docx":
            case "doc":
                return "📃";
            default:
                return "📁";
        }
    };

    const handleResumeClick = (resume) => {
        setSelectedResume(resume);
        setShowPreview(true);
    };

    const handleDownload = async (resume) => {
        try {
            if (resume.download_url) {
                const link = document.createElement("a");
                link.href = resume.download_url;
                link.download = resume.filename;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error("No download URL available");
            }
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download file. Please try again.");
        }
    };

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
        if (filterType === "all") {
            setFilteredResumes(downloadedResumes);
        } else if (filterType === "pdf") {
            setFilteredResumes(
                downloadedResumes.filter(
                    (resume) => resume.file_type.toLowerCase() === "pdf"
                )
            );
        } else if (filterType === "doc") {
            setFilteredResumes(
                downloadedResumes.filter(
                    (resume) =>
                        resume.file_type.toLowerCase() === "docx" ||
                        resume.file_type.toLowerCase() === "doc"
                )
            );
        }
    };

    const ResumePreviewModal = ({ resume, onClose }) => {
        const [previewUrl, setPreviewUrl] = useState(null);
        const [loading, setLoading] = useState(true);
        const [previewError, setPreviewError] = useState("");
        const [iframeError, setIframeError] = useState(false);

        useEffect(() => {
            const loadPreview = async () => {
                if (!resume?.download_url) {
                    setPreviewError("No file key available for preview.");
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);
                    setPreviewError("");
                    setIframeError(false);
                    setPreviewUrl(resume.download_url);
                } catch (err) {
                    console.error("Preview loading error:", err);
                    setPreviewError(err.message || "Failed to load preview. Please try again.");
                } finally {
                    setLoading(false);
                }
            };

            loadPreview();
        }, [resume]);

        const handleIframeError = () => {
            setIframeError(true);
        };

        const handleDownload = () => {
            if (previewUrl) {
                const link = document.createElement("a");
                link.href = previewUrl;
                link.download = resume.filename;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        if (!resume) return null;

        return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
                    {/* Modal Header — brand gradient */}
                    <div className="bg-gradient-to-br from-primary to-accent text-white p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{resume.filename}</h3>
                                <p className="caption text-white/90 mt-1">
                                    Downloaded on {formatDate(resume.download_date)} • {resume.file_size}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 hover:bg-white/15 transition-colors"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 bg-neutral-900">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                                <p className="ml-4 caption text-neutral-300">Loading preview...</p>
                            </div>
                        ) : previewError ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h4 className="font-dmsans font-semibold text-neutral-100 mb-1">Preview error</h4>
                                <p className="caption text-red-400 mb-4">{previewError}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="btn btn-primary"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="btn btn-secondary"
                                    >
                                        Download Instead
                                    </button>
                                </div>
                            </div>
                        ) : iframeError ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="text-6xl mb-4">📄</div>
                                <h4 className="font-dmsans font-semibold text-neutral-100 mb-1">
                                    Preview not available
                                </h4>
                                <p className="caption text-neutral-300 mb-4">
                                    The file preview couldn't be loaded in the browser.
                                </p>
                                <button
                                    onClick={handleDownload}
                                    className="btn btn-primary"
                                >
                                    Download File
                                </button>
                            </div>
                        ) : resume.file_type.toLowerCase() === "pdf" ? (
                            <iframe
                                src={previewUrl}
                                title="Resume Preview"
                                className="w-full h-full border-none"
                                onError={handleIframeError}
                                sandbox="allow-same-origin allow-scripts"
                            />
                        ) : (
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                                title="Word Resume Preview"
                                className="w-full h-full border-none"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="caption text-neutral-300">Loading your enhanced resumes...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="font-dmsans text-xl font-semibold text-neutral-100 mb-2">
                        Error Loading Resumes
                    </h3>
                    <p className="caption text-neutral-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
            {/* Page */}
            <main className="min-h-[calc(100vh-80px)] px-6 py-12 bg-neutral-900 text-neutral-100">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-dmsans font-semibold">Enhanced Resumes</h1>
                                <p className="caption text-neutral-300">
                                    Manage and view your iQua AI enhanced resume files
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentPage("dashboard")}
                                className="btn grad-cta text-white"
                            >
                                ← <span className="ml-1">Back To Dashboard</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={[
                                "card p-6 text-left transition-all duration-200",
                                "hover:border-primary/50 hover:shadow-xl",
                                activeFilter === "all" ? "ring-2 ring-primary/60" : ""
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/15 text-primary rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{downloadedResumes.length}</p>
                                    <p className="caption">Total Downloads</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleFilterChange("pdf")}
                            className={[
                                "card p-6 text-left transition-all duration-200",
                                "hover:border-primary/50 hover:shadow-xl",
                                activeFilter === "pdf" ? "ring-2 ring-primary/60" : ""
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/15 text-primary rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📃</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">
                                        {downloadedResumes.filter((r) => r.file_type.toLowerCase() === "pdf").length}
                                    </p>
                                    <p className="caption">PDF Files</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleFilterChange("doc")}
                            className={[
                                "card p-6 text-left transition-all duration-200",
                                "hover:border-primary/50 hover:shadow-xl",
                                activeFilter === "doc" ? "ring-2 ring-primary/60" : ""
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">
                                        {downloadedResumes.filter((r) => {
                                            const t = r.file_type.toLowerCase();
                                            return t === "docx" || t === "doc";
                                        }).length}
                                    </p>
                                    <p className="caption">DOC Files</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Resume List */}
                    {downloadedResumes.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="font-dmsans text-xl font-semibold mb-2">Your Enhanced Resumes</h3>
                            <p className="caption">
                                Your iQua AI enhanced resume files will appear here once you download them.
                            </p>
                        </div>
                    ) : (
                        <div className="card overflow-hidden">
                            <div className="p-6 border-b border-neutral-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-dmsans text-lg font-semibold">Resume Files</h2>
                                        <p className="caption mt-1">
                                            {activeFilter === "all" && "Showing all resume files"}
                                            {activeFilter === "pdf" && "Showing PDF files only"}
                                            {activeFilter === "doc" && "Showing DOC files only"}
                                            {" • Click on any resume to preview or download"}
                                        </p>
                                    </div>
                                    {activeFilter !== "all" && (
                                        <button
                                            onClick={() => handleFilterChange("all")}
                                            className="label text-primary hover:underline"
                                        >
                                            Show All Files
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="divide-y divide-neutral-800">
                                {filteredResumes.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="text-4xl mb-4">📂</div>
                                        <h3 className="font-dmsans text-lg font-semibold mb-2">
                                            No {activeFilter === "pdf" ? "PDF" : activeFilter === "doc" ? "DOC" : ""} Files Found
                                        </h3>
                                        <p className="caption">
                                            Try selecting a different file type or create more resumes.
                                        </p>
                                    </div>
                                ) : (
                                    filteredResumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="p-6 hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                                            onClick={() => handleResumeClick(resume)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary/15 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <span className="text-xl">{getFileIcon(resume.file_type)}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-neutral-100 group-hover:text-primary transition-colors">
                                                            {resume.filename}
                                                        </h3>
                                                        <div className="flex items-center gap-4 caption mt-1">
                                                            <span>{resume.file_type}</span>
                                                            <span>•</span>
                                                            <span>{resume.file_size}</span>
                                                            <span>•</span>
                                                            <span>Downloaded {formatDate(resume.download_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedResume(resume);
                                                            setShowPreview(true);
                                                        }}
                                                        className="btn btn-ghost"
                                                    >
                                                        👁️ Preview
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(resume);
                                                        }}
                                                        className="btn btn-secondary"
                                                    >
                                                        ⬇️ Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Preview Modal */}
            {showPreview && (
                <ResumePreviewModal
                    resume={selectedResume}
                    onClose={() => {
                        setShowPreview(false);
                        setSelectedResume(null);
                    }}
                />
            )}
        </>
    );
};

export default DownloadedResumes;
