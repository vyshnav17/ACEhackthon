const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function findJobs(role, location, userSkills = []) {
    console.log(`Finding jobs for ${role} in ${location}`);

    const prompt = `
    You are a Recruitment AI Agent.
    Generate 5 HIGHLY REALISTIC, ACTIVE-LOOKING job postings for the role: "${role}" in "${location}".
    
    Candidate Skills: ${userSkills.join(', ')}

    For each job:
    1. Create a believable company name (or use a real one if known in that hub).
    2. Analyze how well the candidate's skills match the job requirements.
    3. Calculate a "Match Score" (0-100%).
    4. List "Matching Skills" and "Missing Skills" from the candidate's profile.
    5. Provide a 1-sentence "Why Apply?" reason.

    Return a clean JSON object with this structure:
    {
        "jobs": [
            {
                "id": "job_1",
                "title": "<Job Title>",
                "company": "<Company Name>",
                "location": "${location}",
                "salary_range": "<e.g. ₹12L - ₹18L or $80k - $120k based on location context>",
                "posted_time": "<e.g. 2 days ago>",
                "match_score": <number>,
                "matching_skills": ["<Skill 1>", "<Skill 2>"],
                "missing_skills": ["<Skill A>", "<Skill B>"],
                "reason": "<Short reason why this fit is good>"
            }
        ]
    }
    
    IMPORTANT: 
    - Adjust currency symbols based on the location (₹ for India, $ for US, etc.).
    - Ensure the syntax is valid JSON.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-70b-versatile',
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content || "";

        // JSON Extraction Logic
        const firstOpen = content.indexOf('{');
        const lastClose = content.lastIndexOf('}');
        let jsonStr = content;
        if (firstOpen !== -1 && lastClose !== -1) {
            jsonStr = content.substring(firstOpen, lastClose + 1);
        }
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Job Search Error:", error);

        // Mock Fallback
        return {
            jobs: [
                {
                    id: "mock_1",
                    title: role,
                    company: "Tech Giant Corp",
                    location: location,
                    salary_range: "₹12L - ₹20L",
                    posted_time: "1 day ago",
                    match_score: 85,
                    matching_skills: userSkills.slice(0, 3),
                    missing_skills: ["Industry Certification", "Leadership Experience"],
                    reason: "Strong match for your profile and experience level."
                }
            ]
        };
    }
}

module.exports = { findJobs };
