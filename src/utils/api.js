import AppConfig from '../config';

const baseUrl = AppConfig.REACT_APP_API_URL;

/**
 * Fetches parsed resume data for a given student ID
 * @param {string|number} studentId - The student ID to fetch resume data for
 * @param {number} limit - Optional limit for the number of resumes to fetch (defaults to AppConfig.DEFAULT_RESUME_LIMIT)
 * @returns {Promise<Object>} - The parsed resume response
 * @throws {Error} - If the API call fails
 */
// ✅ 1. FETCH PARSED RESUME DATA
export const fetchParsedResumeData = async (studentId, limit = AppConfig.DEFAULT_RESUME_LIMIT) => {
    try {
        const token = localStorage.getItem("access_token");
        const tokenType = localStorage.getItem("token_type") || "Bearer";

        if (!token) {
            throw new Error("User not authenticated. Missing token.");
        }

        const response = await fetch(`${baseUrl}/get-parsed-resume/${studentId}?limit=${limit}`, {
            method: 'GET',
            headers: {
                Authorization: `${tokenType} ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Error ${response.status}`);
        }

        const parsedResumeData = await response.json();
        console.log("Parsed Resume Data:", parsedResumeData);
        return parsedResumeData;
    } catch (error) {
        console.error("Failed to fetch parsed resume:", error.message);
        throw error;
    }
};


/**
 * Fetches parsed resume data and returns a structured object for ResumeChat component
 * @param {string|number} studentId - The student ID to fetch resume data for
 * @param {Object} userProfile - User profile data for fallback values
 * @param {number} limit - Optional limit for the number of resumes to fetch
 * @returns {Promise<Object>} - Structured resume data for ResumeChat component
 * @throws {Error} - If the API call fails
 */
export const fetchAndStructureResumeData = async (studentId, userProfile = {}, limit = AppConfig.DEFAULT_RESUME_LIMIT) => {
    try {
        const parsedResumeResponse = await fetchParsedResumeData(studentId, limit);

        // Store the raw response in localStorage
        localStorage.setItem('parsedResumeData', JSON.stringify(parsedResumeResponse));

        // Extract data from the API response structure
        const currentResumes = parsedResumeResponse?.parsed_resumes?.current_resumes || {};
        const enhancedResume = parsedResumeResponse?.parsed_resumes?.enhanced_resume || {};

        // Extract contact information from the current resumes
        const contactInfo = currentResumes?.contact_information || [];
        const name = contactInfo.find(info => info.includes('@') === false) || userProfile.name || "User";
        const email = contactInfo.find(info => info.includes('@')) || userProfile.email || "user@example.com";

        // Create a structured resume data object for ResumeChat component
        const structuredResumeData = {
            basicDetails: {
                name: name,
                email: email,
                location: userProfile.location || ""
            },
            skills: enhancedResume?.skills || currentResumes?.skills || [],
            professionalSummary: enhancedResume?.profile_summary?.[0] || currentResumes?.profile_summary?.[0] || "",
            workExperience: enhancedResume?.work_experience || currentResumes?.work_experience || [],
            education: enhancedResume?.education || currentResumes?.education || [],
            projects: enhancedResume?.projects || currentResumes?.projects || []
        };

        return {
            rawResponse: parsedResumeResponse,
            structuredData: structuredResumeData
        };
    } catch (error) {
        console.error('Error fetching and structuring resume data:', error);
        throw error;
    }
};

/**
 * Checks the interview status for a given student ID
 * @param {string|number} studentId - The student ID to check interview status for
 * @returns {Promise<Object>} - The interview status response with interview_attended boolean
 * @throws {Error} - If the API call fails
 */
// ✅ 3. CHECK INTERVIEW STATUS
export const checkInterviewStatus = async (studentId) => {
    try {
        const response = await fetch(`${baseUrl}/check_interview_status/${studentId}`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const interviewStatusResponse = await response.json();
        console.log('Interview Status Response:', interviewStatusResponse);

        return interviewStatusResponse;
    } catch (error) {
        console.error('Error checking interview status:', error);
        throw error;
    }
};


export const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    const type = localStorage.getItem("token_type") || "Bearer";

    if (token) {
        return { Authorization: `${type} ${token}` };
    }
    return {};
};

/**
 * Saves a resume file to S3 bucket
 * @param {string|number} userId - The user ID
 * @param {File} file - The downloaded file to save
 * @param {string} filename - The filename to save as
 * @returns {Promise<Object>} - The S3 save response
 * @throws {Error} - If the API call fails
 */
// ✅ 2. SAVE RESUME TO S3
export const saveResumeToS3 = async (studentId, file, filename) => {
    try {
        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('file', file);
        formData.append('file_name', filename);

        const response = await fetch(`${baseUrl}/upload-enhanced-resume`, {
            method: 'POST',
            headers: {
                ...getAuthHeader()  // ✅ only auth header — don't set Content-Type for FormData!
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const s3Response = await response.json();
        console.log('S3 Save Response:', s3Response);

        return s3Response;
    } catch (error) {
        console.error('Error saving resume to S3:', error);
        throw error;
    }
};
