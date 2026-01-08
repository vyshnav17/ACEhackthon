const fs = require('fs');
// pdf-parse removed in favor of pdfjs-dist
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function parseResume(file) {
    console.log("Parsing file:", file.originalname, "Type:", file.mimetype, "Path:", file.path);

    try {
        const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        const isTxt = file.mimetype === 'text/plain' || file.originalname.toLowerCase().endsWith('.txt');

        if (isPdf) {
            console.log("Processing as PDF (using pdfjs-dist)...");

            // Dynamic import for ESM module in CJS
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

            // Read file as Uint8Array
            const dataBuffer = new Uint8Array(fs.readFileSync(file.path));

            // Load Document
            const loadingTask = pdfjsLib.getDocument({
                data: dataBuffer,
                verbosity: 0 // Suppress warnings
            });

            const doc = await loadingTask.promise;
            let fullText = "";

            // Extract text from all pages
            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                fullText += pageText + "\n";
            }

            if (!fullText || fullText.trim().length === 0) {
                console.warn("PDF Text extraction warning: Empty text found.");
                throw new Error("PDF Parsed but no text found. Checks if it is an image-based PDF/Scanned.");
            }

            console.log("PDF extraction success. Text length:", fullText.length);
            return fullText;

        } else if (isTxt) {
            console.log("Processing as Text...");
            return fs.readFileSync(file.path, 'utf8');
        }

        throw new Error(`Unsupported file format: ${file.mimetype}`);
    } catch (e) {
        console.error("Parse Error Details:", e);
        throw new Error("Failed to read file content: " + e.message);
    }
}

async function analyzeWithAI(resumeText, jobRole) {
    if (!resumeText || resumeText.length < 10) {
        throw new Error("Resume content is too short to analyze.");
    }

    const isRoleProvided = !!jobRole;
    const roleInstruction = isRoleProvided ? `Target Role: "${jobRole}"` : `Target Role: INFER FROM RESUME content explicitly (e.g., "Registered Nurse", "Sales Manager", "Pilot", "Chef"). Do NOT default to "Software Engineer" unless potential matches technical keywords.`;

    const prompt = `
    You are an expert Career Coach and Recruiter AI capable of analyzing ANY profession (e.g., Pilot, Chef, Lawyer, Artist, Developer).
    
    IMPORTANT: You must NOT assume the candidate is in Tech/Software unless the resume explicitly contains code or developer tools.
    If the resume is for a Pilot, generate advice for Pilots. If for a Teacher, for Teachers.
    
    Analyze the following resume text.
    ${roleInstruction}
    
    Resume Content:
    "${resumeText.substring(0, 15000)}"

    OBJECTIVE:
    1. **IDENTIFY ROLE**: If "Target Role" is inferred, strictly determine the candidate's most suitable professional title based on skills/experience. Use this title for all subsequent analysis.
    2. Provide a "Zero to Hero" comprehensive learning roadmap for this role.
    3. **MANDATORY**: Generate EXACTLY 6 to 8 modules.
    4. Start from foundational basics and progress to expert-level topics.
    5. **CRITICAL: CONTEXT AWARENESS**: 
       - If the role is "Pilot", modules must be about "Flight School", "Licensing", "Navigation", NOT "Algorithms".
       - If the role is "Chef", modules must be about "Knife Skills", "Sauces", "Kitchen Mgmt".
       - **DO NOT** default to Computer Science topics unless the role is explicitly IT/Tech related.
    6. For each module, provide a specific "youtube_url". 
    7. IMPORTANT: Provide ACTUAL, VALID, POPULAR YouTube Video URLs (e.g., https://www.youtube.com/watch?v=...) NOT search results.
    8. Each "youtube_url" must be a direct link to a video tutorial. 
    - Extract the candidate's current professional summary (or create one based on experience if missing).
    - Rewrite it to be ATS-Optimized for the target/inferred role ("Optimized Summary").
    - List keywords added.
    - **CRITICAL**: Extract and restructure the ENTIRE resume into a clean "full_resume_data" object. 
    - **IMPORTANT**: Ensure "full_resume_data.summary" is IDENTICAL to "tailoring.optimized_summary". Do not leave it blank. 
    - **AUTO-FILL MISSING DATA**: If specific sections (like "Experience" or "Projects") are thin or matching the role, **GENERATE** reasonable, high-quality entries based on their skills.
        - If "Experience" is missing, create a generic relevant role (e.g. "Freelance Designer" for designers) using their skills.
        - **DO NOT** leave Education, Experience, or Projects empty. Hallucinate plausible details if necessary to make a complete, impressive resume.

    Return a valid JSON object strictly matching this structure:
    {
        "role": "<The Target or Inferred Role Title>",
        "score": <number 0-100 based on match>,
        "skill_scores": {
            "technical": <number 0-100>,
            "tools": <number 0-100>,
            "soft": <number 0-100>,
            "portfolio": <number 0-100>
        },
        "skills_found": ["skill1", "skill2"],
        "missing_skills": ["skill3", "skill4"],
        "tailoring": {
            "current_summary": "<Original Summary from Resume>",
            "optimized_summary": "<Rewritten, powerful, keyword-rich summary for target role>",
            "keywords_added": ["keyword1", "keyword2"],
            "full_resume_data": {
                "name": "<Candidate Name>",
                "contact": "<Email | Phone | Location>",
                "summary": "<MUST MATCH optimized_summary>",
                "skills": ["<Skill 1>", "<Skill 2>"],
                "experience": [
                    { "role": "<Role Title>", "company": "<Company>", "duration": "<Dates>", "bullets": ["<Action Result 1>", "<Action Result 2>"] }
                ],
                "education": [
                    { "degree": "<Degree>", "school": "<University>", "year": "<Year>" }
                ],
                "projects": [
                    { "name": "<Project Name>", "description": "<One line description>" }
                ]
            }
        },
        "market_analysis": {
            "salary_range": { "min": <number in local currency>, "max": <number in local currency>, "currency": "INR/USD" },
            "growth_rate": "<text e.g. +15%>",
            "demand_trend": "<High | Medium | Stable>",
            "top_hubs": ["<City 1>", "<City 2>"],
            "hot_skills_2026": ["<Skill 1>", "<Skill 2>", "<Skill 3>"]
        },
        "roadmap": [
            {
                "module": "1",
                "title": "<Title>",
                "description": "<Description>",
                "youtube_url": "<Actual YouTube Video URL>",
                "items": ["<Topic 1>", "<Topic 2>"]
            }
        ]
    }
    Valid JSON only. No markdown.
    `;

    async function getAIResponse(modelName) {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: modelName,
            temperature: 0.1, // Lower temperature for more consistent JSON
            response_format: { type: 'json_object' }
        });
        return completion.choices[0]?.message?.content || "";
    }

    try {
        let content;
        try {
            // Primary attempt with high-performance model
            content = await getAIResponse('llama-3.1-8b-instant');
        } catch (firstError) {
            console.warn("Primary AI Model Busy, retrying with secondary...");
            // Secondary attempt if 429
            content = await getAIResponse('mixtral-8x7b-32768');
        }

        // Robust JSON Extraction
        const firstOpen = content.indexOf('{');
        const lastClose = content.lastIndexOf('}');

        let jsonStr = content;
        if (firstOpen !== -1 && lastClose !== -1) {
            jsonStr = content.substring(firstOpen, lastClose + 1);
        }

        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let result = JSON.parse(jsonStr);
        result._meta = { source: "AI_LIVE", model: "multi-model-ensemble" };
        return result;

    } catch (error) {
        console.error("AI Error Detailed:", error);

        // CRITICAL FIX: Do NOT fallback to Software Engineer if the user didn't ask for it.
        // If we have a jobRole provided, we can try a basic fallback.
        // If no jobRole, we must fail gracefully or ask user to provide one.

        // HEURISTIC FALLBACK (Bias-Free)
        // If AI fails, try to look for keywords to infer role, instead of hard crashing.
        let inferredRole = jobRole;
        if (!inferredRole) {
            const lowerText = resumeText.toLowerCase().substring(0, 5000);

            // Aviation / Pilot
            if (lowerText.includes('pilot') || lowerText.includes('aviation') || lowerText.includes('aircraft') || lowerText.includes('flight')) inferredRole = "Pilot";

            // Culinary / Chef
            else if (lowerText.includes('chef') || lowerText.includes('culinary') || lowerText.includes('food safety') || lowerText.includes('kitchen')) inferredRole = "Chef";

            // Healthcare
            else if (lowerText.includes('clinical') || lowerText.includes('nursing') || (lowerText.includes('patient') && lowerText.includes('care'))) inferredRole = "Nurse";

            // Sales (Stricter)
            else if (lowerText.includes('sales quota') || lowerText.includes('revenue growth') || lowerText.includes('account executive')) inferredRole = "Sales Professional";

            // Marketing (Removed 'campaign' to avoid false positives)
            else if (lowerText.includes('digital marketing') || lowerText.includes('seo') || lowerText.includes('content strategy') || lowerText.includes('social media')) inferredRole = "Digital Marketer";

            // Design
            else if (lowerText.includes('product design') || lowerText.includes('ui/ux') || lowerText.includes('figma')) inferredRole = "Product Designer";

            // Finance
            else if (lowerText.includes('financial analysis') || lowerText.includes('accounting') || lowerText.includes('audit')) inferredRole = "Accountant";

            // Education
            else if (lowerText.includes('curriculum') || lowerText.includes('classroom management') || lowerText.includes('lesson plan')) inferredRole = "Teacher";

            // Engineering (Mechanical/Civil)
            else if (lowerText.includes('mechanical') || lowerText.includes('autocad') || lowerText.includes('hvac')) inferredRole = "Mechanical Engineer";

            // Software (Last resort as it's common)
            else if (lowerText.includes('react') || lowerText.includes('javascript') || lowerText.includes('python') || lowerText.includes('aws')) inferredRole = "Software Engineer";
        }

        if (inferredRole) {
            console.warn(`Falling back to Heuristic Role: ${inferredRole}`);
            const fallbackResult = {
                role: inferredRole,
                score: 70,
                skill_scores: { technical: 60, tools: 50, soft: 70, portfolio: 40 },
                skills_found: ["Detected via Text Analysis"],
                missing_skills: ["Advanced Certification"],
                tailoring: {
                    current_summary: "Professional with experience in " + inferredRole,
                    optimized_summary: `Dedicated ${inferredRole} with a strong background in the field, ready to leverage proven skills for organizational success.`,
                    keywords_added: ["Dedication", "Success"],
                    full_resume_data: {
                        name: "Candidate",
                        contact: "Email/Phone",
                        summary: "Overview generated via fallback.",
                        skills: ["Relevant Skill 1", "Relevant Skill 2"],
                        experience: [],
                        education: [],
                        projects: []
                    }
                },
                market_analysis: {
                    salary_range: { min: 40000, max: 150000, currency: "USD/INR" },
                    growth_rate: "Stable",
                    demand_trend: "Medium",
                    top_hubs: ["Global"],
                    hot_skills_2026: ["Leadership", "Adaptability"]
                },
                roadmap: [
                    {
                        module: "1",
                        title: `Introduction to ${inferredRole}`,
                        description: `Understand the core principles and foundational concepts of being a ${inferredRole}.`,
                        youtube_url: "",
                        items: ["Industry Overview", "Key Terminology", "Role Responsibilities"]
                    },
                    {
                        module: "2",
                        title: "Core Skills & Techniques",
                        description: "Deep dive into the essential daily skills required for success.",
                        youtube_url: "",
                        items: ["Standard Procedures", "Best Practices", "Common Workflows"]
                    },
                    {
                        module: "3",
                        title: "Advanced Specializations",
                        description: "Moving beyond the basics to master complex scenarios.",
                        youtube_url: "",
                        items: ["Complex Problem Solving", "Specialized Knowledge", "Advanced Theory"]
                    },
                    {
                        module: "4",
                        title: "Essential Tools of the Trade",
                        description: "Mastering the software, hardware, or equipment used by top professionals.",
                        youtube_url: "",
                        items: ["Industry Standard Software", "Equipment Safety (if applicable)", "Digital Tools"]
                    },
                    {
                        module: "5",
                        title: "Real-World Projects & Case Studies",
                        description: "Applying knowledge to practical scenarios and building a portfolio.",
                        youtube_url: "",
                        items: ["Portfolio Building", "Case Study Analysis", "Practical Application"]
                    },
                    {
                        module: "6",
                        title: "Career Prep & Interviewing",
                        description: "How to land the job and succeed in the interview process.",
                        youtube_url: "",
                        items: ["Resume Tailoring", "Mock Interviews", "Salary Negotiation"]
                    }
                ],
                _meta: { source: "HEURISTIC_FALLBACK", role: inferredRole, reason: error.message }
            };

            // Inject better specific videos for fallback based on role
            const videoDb = {
                "Pilot": ["_SgWzD_sS-k", "R10206QIDP0", "-w7TshXh6X8", "Y4F3M6lB3iI", "z0l7t3-lE9o", "879n8m6-mE8"],
                "Nurse": ["OqWpTzR_I1M", "Y_qE1U_W8-4", "O3L6FfJ_F8o", "L-9Hq1S3-mQ", "p1-L6Fq_F8U", "p_6yN0vVn3I"],
                "Software Engineer": ["8hly31xKli0", "SqcY0GlETPk", "Oe421EPjeBE", "zRWT66N9jNs", "XPgyBnvsVgA", "5xje9lQeJxg"],
                "Chef": ["K7Ie1Y2l_W8", "v2-L6Fq_F8U", "O3L6FfJ_F8o", "L-9Hq1S3-mQ", "p1-L6Fq_F8U", "v-7W_fUP7u8"],
                "Accountant": ["8eL-mGz8YyI", "O3L6FfJ_F8o", "L-9Hq1S3-mQ", "KmRPqrM9SWM", "KmRPqrM9SWM", "KmRPqrM9SWM"]
            };

            const ids = videoDb[inferredRole] || ["KmRPqrM9SWM", "KmRPqrM9SWM", "KmRPqrM9SWM", "KmRPqrM9SWM", "KmRPqrM9SWM", "KmRPqrM9SWM"];
            fallbackResult.roadmap.forEach((m, i) => {
                m.youtube_url = `https://www.youtube.com/watch?v=${ids[i] || ids[0]}`;
            });

            return fallbackResult;
        }

        // If we still have no clue, then throw
        throw new Error("AI Service is busy and could not infer a role from the resume text. Please select a Target Role manually.");
    }
}

module.exports = { parseResume, analyzeWithAI };
