import AppConfig from '../config';

const baseUrl = AppConfig.REACT_APP_API_URL;

/**
 * Fetches parsed resume data for a given student ID
 * @param {string|number} studentId - The student ID to fetch resume data for
 * @param {number} limit - Optional limit for the number of resumes to fetch (defaults to AppConfig.DEFAULT_RESUME_LIMIT)
 * @returns {Promise<Object>} - The parsed resume response
 * @throws {Error} - If the API call fails
 */
export const fetchParsedResumeData = async (studentId, limit = AppConfig.DEFAULT_RESUME_LIMIT) => {
    try {
        const response = await fetch(`${baseUrl}/get-parsed-resume/${studentId}?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const parsedResumeResponse = await response.json();
        console.log('API Response:', parsedResumeResponse);

        return parsedResumeResponse;
    } catch (error) {
        console.error('Error fetching parsed resume data:', error);
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
        //const parsedResumeResponse = await fetchParsedResumeData(studentId, limit);
        const parsedResumeResponse = {
            "student_id": "1",
            "limit": 3,
            "file_count": 3,
            "files": [
                {
                    "key": "students/1.0.0/1/interview_sets/1/profiles/9/Nitheesh-Resume (1) (2) (1) (1) (1).pdf",
                    "student_id": "1",
                    "interview_set_id": "1",
                    "profile_id": "9",
                    "filename": "Nitheesh-Resume (1) (2) (1) (1) (1).pdf",
                    "size": 48187,
                    "last_modified": "2025-07-14T06:36:39+00:00"
                },
                {
                    "key": "students/1.0.0/1/interview_sets/1/profiles/9/Indu Indu_iQuiz_Report.pdf",
                    "student_id": "1",
                    "interview_set_id": "1",
                    "profile_id": "9",
                    "filename": "Indu Indu_iQuiz_Report.pdf",
                    "size": 5302367,
                    "last_modified": "2025-07-14T06:36:37+00:00"
                },
                {
                    "key": "students/1.0.0/1/interview_sets/1/profiles/7/QA_Resume_John_Doe.docx",
                    "student_id": "1",
                    "interview_set_id": "1",
                    "profile_id": "7",
                    "filename": "QA_Resume_John_Doe.docx",
                    "size": 29370,
                    "last_modified": "2025-07-14T06:36:35+00:00"
                }
            ],
            "parsed_resumes": {
                "current_resumes": {
                    "contact_information": [
                        "nitheeshmvs88@gmail.com",
                        "www.linkedin.com/in/venkata-sai-nitheesh-maddela-a84a21191",
                        "(LinkedIn)",
                        "John Doe",
                        "123 Main St, Anytown, USA",
                        "johndoe@example.com",
                        "(123) 456-7890",
                        "Phone: (123) 456-7890",
                        "Email: john.doe@example.com"
                    ],
                    "top_skills": [
                        "Amazon Relational Database Service (RDS)",
                        "Amazon EC2",
                        "AWS Amplify"
                    ],
                    "certifications": [
                        "Data Science Math Skills",
                        "C (Intermediate)",
                        "Problem Solving (Basic)",
                        "IBM Data Science Professional Certificate",
                        "Machine Learning on Google Cloud Specialization",
                        "Oracle Certified Professional, Java SE 8 Programmer",
                        "Microsoft Certified: Azure Developer Associate"
                    ],
                    "summary": [
                        "As a Technical Lead with a strong background in Python development, I have gained extensive knowledge in AWS, FastAPI, Natural Language Processing, and Deep Learning. I am confident in my ability to create solutions for a variety of problems using these technologies.",
                        "My proficiency in AWS services allows me to design and deploy secure, scalable, and fault-tolerant solutions for cloud-based projects. Additionally, I have worked with FastAPI, which is a modern, fast, and easy-to-use web framework for building APIs with Python.",
                        "Furthermore, I am passionate about Natural Language Processing and Deep Learning, and I am confident in my ability to apply these technologies to build predictive models, analyze large amounts of data, and improve the user experience. I have experience with popular libraries such as TensorFlow and Keras, and I am comfortable working with both supervised and unsupervised learning algorithms.",
                        "My dedication to learning and my commitment to staying up-to-date with the latest trends and best practices in the industry make me a valuable asset to any project. I thrive in fast-paced environments and I am always willing to take on new challenges."
                    ],
                    "work_experience": [
                        "iQuadra Information Services LLC., 10 months October 2022 - Present (7 months) Software Developer",
                        "July 2022 - October 2022 (4 months)",
                        "Indian Servers - Software Development Company 6 months Machine Learning Team Leader September 2020 - December 2020 (4 months)",
                        "Online Trainee - Machine Learning July 2020 - September 2020 (3 months)",
                        "Software Engineer at Google (2018 - Present)",
                        "Junior Software Engineer at Microsoft (2016 - 2018)",
                        "Developed and maintained web applications",
                        "Worked on the development of Google Maps",
                        "Intern at Microsoft (2017 - 2018)",
                        "Worked on the development of Microsoft Office Suite"
                    ],
                    "education": [
                        "Narayana Engineering College, Nellore Bachelor of Technology - BTech (June 2018 - July 2022)",
                        "Narayana Junior College, Nellore Intermediate - M.P.C (June 2016 - April 2018)",
                        "Sri B Swamidoss English Medium High School, Nellore 10th SSC (June 2015 - April 2016)",
                        "Bachelor of Science in Computer Science, Stanford University (2012 - 2016)",
                        "Bachelor of Science in Computer Science, Stanford University (2013 - 2017)"
                    ],
                    "skills": [
                        "Proficient in Java, C++, and Python",
                        "Experience with web development using HTML, CSS, and JavaScript",
                        "Strong problem-solving skills",
                        "Excellent communication skills"
                    ],
                    "projects": [
                        "Developed a web application for tracking project progress",
                        "Created a mobile app for personal finance management",
                        "Developed a personal finance management app",
                        "Created a website for a local business"
                    ],
                    "achievements": [
                        "Promoted to Software Engineer within 2 years at Microsoft",
                        "Received 'Employee of the Month' award at Google in June 2019",
                        "Google Spot Bonus for exceptional performance in Q1 2020",
                        "Microsoft Intern of the Year 2018"
                    ]
                },
                "enhanced_resume": {
                    "contact_information": [
                        "nitheeshmvs88@gmail.com",
                        "www.linkedin.com/in/venkata-sai-nitheesh-maddela-a84a21191",
                        "(LinkedIn)",
                        "John Doe",
                        "123 Main St, Anytown, USA",
                        "johndoe@example.com",
                        "(123) 456-7890",
                        "Phone: (123) 456-7890",
                        "Email: john.doe@example.com"
                    ],
                    "top_skills": [
                        "Proficient in Amazon Relational Database Service (RDS)",
                        "Expertise in Amazon EC2",
                        "Skilled in AWS Amplify"
                    ],
                    "certifications": [
                        "Data Science Math Skills",
                        "C (Intermediate)",
                        "Problem Solving (Basic)",
                        "IBM Data Science Professional Certificate",
                        "Machine Learning on Google Cloud Specialization",
                        "Oracle Certified Professional, Java SE 8 Programmer",
                        "Microsoft Certified: Azure Developer Associate"
                    ],
                    "summary": [
                        "Technical Lead with robust Python development background, specializing in AWS, FastAPI, Natural Language Processing, and Deep Learning.",
                        "Proficient in designing and deploying secure, scalable, and fault-tolerant AWS solutions for cloud-based projects.",
                        "Passionate about leveraging Natural Language Processing and Deep Learning to build predictive models, analyze data, and enhance user experience.",
                        "Committed to continuous learning and staying abreast with industry trends and best practices, thriving in fast-paced environments and embracing new challenges."
                    ],
                    "work_experience": [
                        "Software Developer at iQuadra Information Services LLC., October 2022 - Present (10 months)",
                        "Machine Learning Team Leader at Indian Servers - Software Development Company, September 2020 - December 2020 (4 months)",
                        "Online Trainee - Machine Learning, July 2020 - September 2020 (3 months)",
                        "Software Engineer at Google, 2018 - Present",
                        "Junior Software Engineer at Microsoft, 2016 - 2018",
                        "Intern at Microsoft, 2017 - 2018",
                        "Developed and maintained various web applications",
                        "Contributed to the development of Google Maps",
                        "Participated in the development of Microsoft Office Suite"
                    ],
                    "education": [
                        "Narayana Engineering College, Nellore Bachelor of Technology - BTech (June 2018 - July 2022)",
                        "Narayana Junior College, Nellore Intermediate - M.P.C (June 2016 - April 2018)",
                        "Sri B Swamidoss English Medium High School, Nellore 10th SSC (June 2015 - April 2016)",
                        "Bachelor of Science in Computer Science, Stanford University (2012 - 2016)",
                        "Bachelor of Science in Computer Science, Stanford University (2013 - 2017)"
                    ],
                    "skills": [
                        "Proficient in Java, C++, and Python",
                        "Experience with web development using HTML, CSS, and JavaScript",
                        "Strong problem-solving skills",
                        "Excellent communication skills"
                    ],
                    "projects": [
                        "Developed a web application to efficiently track project progress",
                        "Created a user-friendly mobile app for personal finance management",
                        "Built a website to boost the online presence of a local business"
                    ],
                    "achievements": [
                        "Promoted to Software Engineer at Microsoft within 2 years",
                        "Recipient of 'Employee of the Month' award at Google in June 2019",
                        "Earned Google Spot Bonus for exceptional performance in Q1 2020",
                        "Named Microsoft Intern of the Year in 2018"
                    ],
                    "Profile Summary": [
                        "Experienced Technical Lead with a strong background in Python development, proficient in AWS services, FastAPI, Natural Language Processing, and Deep Learning.",
                        "Proven track record in designing and deploying secure, scalable, and fault-tolerant solutions for cloud-based projects, with hands-on experience in popular libraries like TensorFlow and Keras.",
                        "Continuous learner with multiple industry certifications, including IBM Data Science Professional Certificate, Machine Learning on Google Cloud Specialization, and Microsoft Certified: Azure Developer Associate."
                    ]
                }
            }
        }


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
                location: userProfile.location || "Location"
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
export const checkInterviewStatus = async (studentId) => {
    try {
        const response = await fetch(`${baseUrl}/check_interview_status/${studentId}`);

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