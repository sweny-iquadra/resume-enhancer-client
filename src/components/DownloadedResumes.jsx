import React, { useState, useEffect } from "react";
import { fetchDownloadedResumes, fetchPreviewUrlAPI } from "../utils/api";
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
                const studentId =
                    user?.id ||
                    JSON.parse(localStorage.getItem("user") || "{}")?.id ||
                    10;
                const response = await fetchDownloadedResumes(studentId);

                // Map API response to component expected format
                const resumes = (response.files || []).map((file, index) => ({
                    id: index + 1,
                    filename: file.filename,
                    file_type: file.extension,
                    file_size: formatFileSize(file.size_bytes),
                    download_date: file.uploaded_at,
                    s3_key: file.s3_key
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
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            // Get the presigned URL for download
            const data = await fetchPreviewUrlAPI(resume.s3_key);
            if (data.url) {
                const link = document.createElement("a");
                link.href = data.url;
                link.download = resume.filename;
                link.target = '_blank';
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
                    (resume) => resume.file_type.toLowerCase() === "pdf",
                ),
            );
        } else if (filterType === "doc") {
            setFilteredResumes(
                downloadedResumes.filter(
                    (resume) =>
                        resume.file_type.toLowerCase() === "docx" ||
                        resume.file_type.toLowerCase() === "doc",
                ),
            );
        }
    };

    //const ResumePreviewModal = ({ resume, onClose }) => {
    //    const [previewUrl, setPreviewUrl] = useState(null);
    //    const [loading, setLoading] = useState(true);
    //    const [previewError, setPreviewError] = useState("");

    //    useEffect(() => {
    //        const fetchPreviewUrl = async () => {
    //            if (!resume?.s3_key) return;

    //            try {
    //                setLoading(true);
    //                setPreviewError("");

    // const response = await fetchPreviewUrlAPI(resume.s3_key);

    //  if (!response.ok) {
    //      throw new Error("Failed to fetch preview URL");
    //  }

    //const data = await response.json();
    //                const data = {
    //                   "url": "https://iqua-resume-building-mvp.s3.amazonaws.com/students/1.0.0/10/enhanced_resume/Resume_2025-08-06T15-58-43.docx?AWSAccessKeyId=ASIAVRUVSV4V34ODVHR5&Signature=DSxvDnuucfIbwDUp5sNzqBgn87A%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEEYaCXVzLXdlc3QtMiJHMEUCIQD3lr6s9sf8fixA0Y4u5TY9kiOUXU4GDMs%2BBTvc10RVYQIgVw9WgM%2FbhgMWSboOTC6bdV99SFSdY0v4OQacjv7qstYq7AIIfxAAGgwzODE0OTIwNDc2NTkiDEnzHZP4kBX4afFArirJAl5HMN99zMSLsqcBAciCqFB%2Bt%2F6Pf1Fs0gupgGcZCU52RqknBsfyWuJestN%2BIGuQ%2BSmWkcA4rDCVbIlxyMBY4kyLAjsAml5iG9h2ARnioFa2k87%2FxgZgYU8AMD5Lz%2BqBTHI3pTV5Tizzrt92WbeCrDBgzVTGreHgT0aN8UZsSMGxWessD29%2BCYSs32KyXzSwzV0Xt06%2BlfBsFc%2FRXNLJP%2Bqbedh7uqBfPMa0uHWeAx8tZEGDzoL3luBjW6dI9gIV4B8RBugoG3btjjmdYzkHqn5wEZA71YsD9GAu0ELkfYai%2FS89ybsUNqEd%2BB1p16%2B4tMcEDlhGdmRFtxoYt4uipqBEkgLb%2F8PGnluZgV5zHoqdtcrpfrVhiFrVWM7IJWpS80jlQ07BASiMfaq0lyBwL5SY%2Fzpi7%2Fj%2BQMbe4PS6nHxe7Wa1fjYYcX9vMIOmz8QGOqcBSVIgXpCnjxOYHdbvUDaeqf4oPmOjFDqlYmV%2BC1qTdFnQtu%2BKz8VuxlX%2Fstu0L73qYSufxpIIpikrBODWJPfOWIgqO1a10uQNpAMwRlRxRQ7X288XuuW6xNTtZs15OeudlOLSrs4iPDYhRiCxplJbbrWEv3xJb1wBtByjQACkqyj5%2FK5NaTp8wWWILkpet8nPulHOHA0l0vTPx9fGb%2F58cm6KXrMcEUs%3D&Expires=1754521636"
    //               }
    // setPreviewUrl(data.url);

    //            } catch (err) {
    //               console.error("Error loading preview:", err);
    //               setPreviewError("Failed to load preview. Please try again.");
    //           } finally {
    //               setLoading(false);
    //           }
    //        };

    //fetchPreviewUrl();
    //    }, [resume]);

    //    if (!resume) return null;

    //    return (
    //        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
    //                {/* Header */}
    //                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
    //                <div>
    //                    <h3 className="text-xl font-semibold">{resume.filename}</h3>
    //                    <p className="text-sm opacity-90 mt-1">
    //                        Downloaded on {formatDate(resume.download_date)} • {resume.file_size}
    //                    </p>
    //                </div>
    //                <button
    //                    onClick={onClose}
    //                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
    //                    >
    //                        <span className="text-lg">✕</span>
    //                    </button>
    //                </div>

    //                {/* Inline Preview Area */}
    //                <div className="flex-1 bg-gray-100">
    //                {loading ? (
    //                    <div className="h-full flex flex-col items-center justify-center">
    //                        <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    //                        <p className="mt-4 text-gray-600">Loading preview...</p>
    //                    </div>
    //                ) : previewError ? (
    //                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
    //                        <p className="text-red-600 text-lg font-semibold mb-2">⚠️ {previewError}</p>
    //                            <p className="text-sm text-gray-500">Ensure the file exists and try again.</p>
    //                        </div>
    //                    ) : (
    //                        <iframe
    //                            src={previewUrl}
    //                            title="Resume Preview"
    //                            className="w-full h-full border-none"
    //                            sandbox=""
    //                            ></iframe>
    //                        )}
    //                    </div>
    //                </div>
    //        </div>
    //    );
    //};

    const ResumePreviewModal = ({ resume, onClose }) => {
        const [previewUrl, setPreviewUrl] = useState(null);
        const [loading, setLoading] = useState(true);
        const [previewError, setPreviewError] = useState("");
        const [iframeError, setIframeError] = useState(false);

        useEffect(() => {
            const loadPreview = async () => {
                if (!resume?.s3_key) {
                    setPreviewError("No file key available for preview.");
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);
                    setPreviewError("");
                    setIframeError(false);

                    const data = await fetchPreviewUrlAPI(resume.s3_key);

                    if (!data.url) {
                        throw new Error("No preview URL received from server");
                    }

                    setPreviewUrl(data.url);
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
                const link = document.createElement('a');
                link.href = previewUrl;
                link.download = resume.filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        if (!resume) return null;

        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold">{resume.filename}</h3>
                            <p className="text-sm opacity-90 mt-1">
                                Downloaded on {formatDate(resume.download_date)} • {resume.file_size}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {previewUrl && !loading && !previewError && (
                                <button
                                    onClick={handleDownload}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    ⬇️ Download
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 bg-gray-100">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                                <p className="ml-4 text-gray-600">Loading preview...</p>
                            </div>
                        ) : previewError ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="text-6xl mb-4">⚠️</div>
                                <p className="text-red-600 text-lg font-semibold mb-2">{previewError}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    The file might not be accessible or may have been moved.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Download Instead
                                    </button>
                                </div>
                            </div>
                        ) : iframeError ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="text-6xl mb-4">📄</div>
                                <p className="text-gray-600 text-lg font-semibold mb-2">
                                    Preview not available
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    The file preview couldn't be loaded in the browser.
                                </p>
                                <button
                                    onClick={handleDownload}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
                            //<div className="h-full flex flex-col items-center justify-center text-center px-6">
                            //   <div className="text-6xl mb-4">📄</div>
                            //   <p className="text-gray-600 text-lg font-semibold mb-2">
                            //       Preview not supported for this file type
                            //   </p>
                            //   <p className="text-sm text-gray-500 mb-4">
                            //       You can download and view this file on your system.
                            //   </p>
                            //   <button
                            //       onClick={handleDownload}
                            //       className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                            //   >
                            //       Download File
                            //   </button>
                            //   </div>
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                                title="Word Resume Preview"
                                className="w-full h-full border-none"
                            />
                        )
                        }
                    </div>
                </div>
            </div>
        );
    };



    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your enhanced resumes...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Error Loading Resumes
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="min-h-[calc(100vh-80px)] px-6 py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Enhanced Resumes
                                </h1>
                                <p className="text-gray-600">
                                    Manage and view your iQua AI enhanced resume files
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentPage("dashboard")}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                                <span>←</span>
                                <span>Back To Dashboard</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 ${activeFilter === "all" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {downloadedResumes.length}
                                    </p>
                                    <p className="text-sm text-gray-600">Total Downloads</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleFilterChange("pdf")}
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 ${activeFilter === "pdf"
                                ? "ring-2 ring-green-500 bg-green-50"
                                : ""
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📃</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            downloadedResumes.filter(
                                                (r) => r.file_type.toLowerCase() === "pdf",
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600">PDF Files</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleFilterChange("doc")}
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 ${activeFilter === "doc"
                                ? "ring-2 ring-orange-500 bg-orange-50"
                                : ""
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            downloadedResumes.filter(
                                                (r) =>
                                                    r.file_type.toLowerCase() === "docx" ||
                                                    r.file_type.toLowerCase() === "doc",
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600">DOC Files</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Resume List */}
                    {downloadedResumes.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Your Enhanced Resumes
                            </h3>
                            <p className="text-gray-600">
                                Your iQua AI enhanced resume files will appear here once you
                                download them.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Resume Files
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {activeFilter === "all" && "Showing all resume files"}
                                            {activeFilter === "pdf" && "Showing PDF files only"}
                                            {activeFilter === "doc" && "Showing DOC files only"}
                                            {" • Click on any resume to preview or download"}
                                        </p>
                                    </div>
                                    {activeFilter !== "all" && (
                                        <button
                                            onClick={() => handleFilterChange("all")}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Show All Files
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {filteredResumes.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="text-4xl mb-4">📂</div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            No{" "}
                                            {activeFilter === "pdf"
                                                ? "PDF"
                                                : activeFilter === "doc"
                                                    ? "DOC"
                                                    : ""}{" "}
                                            Files Found
                                        </h3>
                                        <p className="text-gray-600">
                                            Try selecting a different file type or create more
                                            resumes.
                                        </p>
                                    </div>
                                ) : (
                                    filteredResumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                                            onClick={() => handleResumeClick(resume)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                        <span className="text-xl">
                                                            {getFileIcon(resume.file_type)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {resume.filename}
                                                        </h3>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                            <span>{resume.file_type}</span>
                                                            <span>•</span>
                                                            <span>{resume.file_size}</span>
                                                            <span>•</span>
                                                            <span>
                                                                Downloaded {formatDate(resume.download_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedResume(resume);
                                                            setShowPreview(true);
                                                        }}
                                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        👁️ Preview
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(resume);
                                                        }}
                                                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
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