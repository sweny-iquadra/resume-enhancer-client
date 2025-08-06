import AppConfig from "../config";

const baseUrl = AppConfig.REACT_APP_API_URL;

/**
 * Fetches parsed resume data for a given student ID
 * @param {string|number} studentId - The student ID to fetch resume data for
 * @param {number} limit - Optional limit for the number of resumes to fetch (defaults to AppConfig.DEFAULT_RESUME_LIMIT)
 * @returns {Promise<Object>} - The parsed resume response
 * @throws {Error} - If the API call fails
 */
// ✅ 1. FETCH PARSED RESUME DATA
export const fetchParsedResumeData = async (
    studentId,
    limit = AppConfig.DEFAULT_RESUME_LIMIT,
) => {
    try {
        const token = localStorage.getItem("access_token");
        const tokenType = localStorage.getItem("token_type") || "Bearer";

        if (!token) {
            throw new Error("User not authenticated. Missing token.");
        }

        const response = await fetch(
            `${baseUrl}/get-parsed-resume/${studentId}?limit=${limit}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${tokenType} ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );

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
export const fetchAndStructureResumeData = async (
    studentId,
    userProfile = {},
    limit = AppConfig.DEFAULT_RESUME_LIMIT,
) => {
    try {
        //    const parsedResumeResponse = await fetchParsedResumeData(studentId, limit);

        const parsedResumeResponse = {
            student_id: "10",
            limit: 1,
            file_count: 1,
            files: [
                {
                    key: "students/1.0.0/10/interview_sets/1/profiles/6/Teja_Resume.pdf",
                    student_id: "10",
                    interview_set_id: "1",
                    profile_id: "6",
                    filename: "Teja_Resume.pdf",
                    size: 201690,
                    last_modified: "2025-07-14T06:36:50+00:00",
                },
            ],
            parsed_resumes: {
                current_resumes: {
                    contact_information: [
                        "Gadepalli Sankara Surya Tejaswi",
                        "Phone: +91-9110377671",
                        "City: Rajahmundry, Andhra Pradesh",
                        "Email: gsstejaswi@gmail.com",
                        "Github: tejagadepalli",
                        "LinkedIn: Sankara Surya Tejaswi Gadepalli",
                    ],
                    education: [
                        "Bachelor of Technology in Computer Science and Engineering 2021-2025, Aditya Engineering College, Surampalem, CGPA: 7.29",
                    ],
                    project_experience: [
                        "Face Recognition Bot: Developed a Chatbot using Amazon Lex. The bot stores sensitive company information and responds to 95% of inquiries. Protected access exclusively to authorized users, the bot verifies identities by comparing faces against a secure database using Amazon Rekognition, ensuring a 100% secure authentication process. Leveraged over 5+ Services: AWS, Amazon Lex, Python, Amazon Rekognition for Face Identification.",
                        "AWS Cloud Deployment: A Web application based on React, deployed using AWS Cloud. Spearheaded AWS design, deployment, and management to achieve 3 goals: fault tolerance, availability, scalability, Engaged with AWS cloud services including EC2, S3, RDS, Lambda, IAM, and VPC. Technologies and Services Used: AWS, Ubuntu, EC2, S3 Buckets, Load Balancers.",
                        "Oracle Cloud Deployment: Deployed the React web application on Oracle Cloud. Directed the deployment of a React web application, achieving a 20% reduction in deployment time using Oracle Cloud, Utilized Oracle Cloud tools and services, enhancing application security by 30%. Leveraged over 5+ Oracle Cloud Technologies and Services: Oracle Cloud, Object Storage, Oracle Database, Oracle VM’s, and VCN.",
                    ],
                    internship: [
                        "Cloud Computing DevOps Internship June 2024 - August 2024, ExcelR Pvt. Ltd Online: Conceptualized and managed cloud infrastructure across 2 major platforms, AWS and Azure, implementing 5 CI/CD pipelines and automating deployment processes, leading to a 30% increase in efficiency. Applied Docker and Kubernetes for containerization and orchestration, Enhancing resource efficiency by 40%.",
                        "Web Development Internship June 2023 - July 2023, BrainOvision Solutions Pvt. Ltd Online: Led the development of a coffee shop webpage using WordPress, reducing development time by 30% and increasing efficiency. Designed the project to enhance user experience, improving customer satisfaction by 25%. Delivered an User-friendly and aesthetically pleasing interface, allowing 100% of customers to easily explore and interact with the coffee shop’s offerings online.",
                    ],
                    technical_skills_and_interests: [
                        "Coding Profiles: GeeksforGeeks Profile, CodeChef Profile, HackerRank Profile",
                        "Programming Languages : Python, C/C++, HTML, CSS.",
                        "Operating System : Linux, Windows, Mac.",
                        "Tools: VSCode, Sublime, Git, GitHub, WordPress.",
                        "Exploring : Cloud Computing, Software Development, DevOps, ServiceNow.",
                        "Soft Skills : Multilingual(English, Hindi), Leadership, Team coordination.",
                    ],
                    achievements: [
                        "Achieved 5-Star HackerRank badges in Python, C, C++.",
                        "Solved over 650+ problems on platforms like GeeksforGeeks andCodeChef.",
                        "Received over 4 badges from AWS.",
                        "Accomplished DockerandKubernetes badges.",
                        "EarnedJiraFundamentals Badge",
                    ],
                    certifications: [
                        "IT Specialist in Python (Certiport)",
                        "AWS Cloud Practitioner Essentials (edX)",
                        "Certified System Administrator (ServiceNow)",
                        "Certified Application Developer (ServiceNow)",
                        "Azure Data Science Associate (Microsoft)",
                        "HackerRank Python Basic",
                    ],
                },
                enhanced_resume: {
                    contact_information: [
                        "Gadepalli Sankara Surya Tejaswi",
                        "Phone: +91-9110377671",
                        "City: Rajahmundry, Andhra Pradesh",
                        "Email: gsstejaswi@gmail.com",
                        "Github: tejagadepalli",
                        "LinkedIn: Sankara Surya Tejaswi Gadepalli",
                    ],
                    profile_summary: [],
                    education: [
                        "Bachelor of Technology in Computer Science and Engineering 2021-2025, Aditya Engineering College, Surampalem, CGPA: 7.29",
                    ],
                    project_experience: [
                        "Face Recognition Bot: Developed a Chatbot using Amazon Lex. The bot stores sensitive company information and responds to 95% of inquiries. Protected access exclusively to authorized users, the bot verifies identities by comparing faces against a secure database using Amazon Rekognition, ensuring a 100% secure authentication process. Leveraged over 5+ Services: AWS, Amazon Lex, Python, Amazon Rekognition for Face Identification.",
                        "AWS Cloud Deployment: A Web application based on React, deployed using AWS Cloud. Spearheaded AWS design, deployment, and management to achieve 3 goals: fault tolerance, availability, scalability, Engaged with AWS cloud services including EC2, S3, RDS, Lambda, IAM, and VPC. Technologies and Services Used: AWS, Ubuntu, EC2, S3 Buckets, Load Balancers.",
                        "Oracle Cloud Deployment: Deployed the React web application on Oracle Cloud. Directed the deployment of a React web application, achieving a 20% reduction in deployment time using Oracle Cloud, Utilized Oracle Cloud tools and services, enhancing application security by 30%. Leveraged over 5+ Oracle Cloud Technologies and Services: Oracle Cloud, Object Storage, Oracle Database, Oracle VM’s, and VCN.",
                    ],
                    internship: [
                        "Cloud Computing DevOps Internship June 2024 - August 2024, ExcelR Pvt. Ltd Online: Conceptualized and managed cloud infrastructure across 2 major platforms, AWS and Azure, implementing 5 CI/CD pipelines and automating deployment processes, leading to a 30% increase in efficiency. Applied Docker and Kubernetes for containerization and orchestration, Enhancing resource efficiency by 40%.",
                        "Web Development Internship June 2023 - July 2023, BrainOvision Solutions Pvt. Ltd Online: Led the development of a coffee shop webpage using WordPress, reducing development time by 30% and increasing efficiency. Designed the project to enhance user experience, improving customer satisfaction by 25%. Delivered an User-friendly and aesthetically pleasing interface, allowing 100% of customers to easily explore and interact with the coffee shop’s offerings online.",
                    ],
                    technical_skills_and_interests: [
                        "Coding Profiles: GeeksforGeeks Profile, CodeChef Profile, HackerRank Profile",
                        "Programming Languages : Python, C/C++, HTML, CSS.",
                        "Operating System : Linux, Windows, Mac.",
                        "Tools: VSCode, Sublime, Git, GitHub, WordPress.",
                        "Exploring : Cloud Computing, Software Development, DevOps, ServiceNow.",
                        "Soft Skills : Multilingual(English, Hindi), Leadership, Team coordination.",
                    ],
                    achievements: [
                        "Achieved 5-Star HackerRank badges in Python, C, C++.",
                        "Solved over 650+ problems on platforms like GeeksforGeeks andCodeChef.",
                        "Received over 4 badges from AWS.",
                        "Accomplished DockerandKubernetes badges.",
                        "EarnedJiraFundamentals Badge",
                    ],
                    certifications: [
                        "IT Specialist in Python (Certiport)",
                        "AWS Cloud Practitioner Essentials (edX)",
                        "Certified System Administrator (ServiceNow)",
                        "Certified Application Developer (ServiceNow)",
                        "Azure Data Science Associate (Microsoft)",
                        "HackerRank Python Basic",
                    ],
                },
            },
        };
        // Store the raw response in localStorage
        localStorage.setItem(
            "parsedResumeData",
            JSON.stringify(parsedResumeResponse),
        );

        // Extract data from the API response structure
        const currentResumes =
            parsedResumeResponse?.parsed_resumes?.current_resumes || {};
        const enhancedResume =
            parsedResumeResponse?.parsed_resumes?.enhanced_resume || {};

        // Extract contact information from the current resumes
        const contactInfo = currentResumes?.contact_information || [];
        const name =
            contactInfo.find((info) => info.includes("@") === false) ||
            userProfile.name ||
            "User";
        const email =
            contactInfo.find((info) => info.includes("@")) ||
            userProfile.email ||
            "user@example.com";

        // Create a structured resume data object for ResumeChat component
        const structuredResumeData = {
            basicDetails: {
                name: name,
                email: email,
                location: userProfile.location || "",
            },
            skills: enhancedResume?.skills || currentResumes?.skills || [],
            professionalSummary:
                enhancedResume?.profile_summary?.[0] ||
                currentResumes?.profile_summary?.[0] ||
                "",
            workExperience:
                enhancedResume?.work_experience ||
                currentResumes?.work_experience ||
                [],
            education:
                enhancedResume?.education || currentResumes?.education || [],
            projects:
                enhancedResume?.projects || currentResumes?.projects || [],
        };

        return {
            rawResponse: parsedResumeResponse,
            structuredData: structuredResumeData,
        };
    } catch (error) {
        console.error("Error fetching and structuring resume data:", error);
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
        //  const response = await fetch(
        //     `${baseUrl}/check_interview_status/${studentId}`,
        //     {
        //         method: "GET",
        //        headers: {
        //            ...getAuthHeader(),
        //            "Content-Type": "application/json",
        //       },
        //    },
        // );

        const response = {
            interview_attended: true,
            interview_count: 168,
        };

        // if (!response.ok) {
        //    throw new Error(`HTTP error! status: ${response.status}`);
        //  }

        const interviewStatusResponse = await response.json();
        console.log("Interview Status Response:", interviewStatusResponse);

        return interviewStatusResponse;
    } catch (error) {
        console.error("Error checking interview status:", error);
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
        formData.append("student_id", studentId);
        formData.append("file", file);
        formData.append("file_name", filename);

        // const response = await fetch(`${baseUrl}/upload-enhanced-resume`, {
        //     method: "POST",
        //     headers: {
        //         ...getAuthHeader(), // ✅ only auth header — don't set Content-Type for FormData!
        //     },
        //     body: formData,
        //  });

        //  if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        //  }
        const response = {
            status: "success",
            s3_key: "students/1.0.0/10/enhanced_resume/teja_resume.pdf",
        };

        const s3Response = await response.json();
        console.log("S3 Save Response:", s3Response);

        return s3Response;
    } catch (error) {
        console.error("Error saving resume to S3:", error);
        throw error;
    }
};
