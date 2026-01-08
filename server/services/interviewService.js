const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System prompt to set the persona
const INTERVIEWER_PERSONA = `
You are an expert AI Interviewer capable of conducting professional interviews for ANY job role.
Your goal is to conduct a realistic, tough-but-fair interview tailored SPECIFICALLY to the candidate's target role.
- If the role is "Pilot", ask about aviation safety, navigation, and checklists.
- If the role is "Chef", ask about kitchen management, hygiene, and cuisine techniques.
- If the role is "Developer", ask about code, systems, and architecture.

Maintain a professional, conversational tone. Do not be repetitive.
`;

async function generateNextTurn(history, context) {
    // History contains { role: 'user'|'assistant', content: string }
    // Context contains { role: string, resumeSummary: string }

    const messages = [
        { role: 'system', content: INTERVIEWER_PERSONA },
        {
            role: 'system',
            content: `Candidate Role: ${context.role}.
                      Resume Summary: ${context.resumeSummary || "Standard applicant"}.
                      
                      Rules:
                      1. If this is the first message, ask an opening question relevant to ${context.role}.
                      2. If the user just answered, first EVALUATE their answer (give a rating /10 and brief constructive feedback). 
                      3. Then, ask the NEXT question.
                      4. Keep questions relevant to the domain of "${context.role}".
                      
                      Output Format (JSON):
                      {
                        "feedback": "Your feedback here (or null if first turn)",
                        "rating": 8 (or null if first turn),
                        "message": "The text of your next response/question"
                      }`
        },
        ...history
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Interview AI Error:", error);
        return {
            feedback: null,
            rating: null,
            message: "I'm having trouble connecting to the interview server. Let's continue. Could you describe a challenging project you've worked on recently?"
        };
    }
}

module.exports = { generateNextTurn };
