const JsonConfigs = require('../utils/jsonDb');
const jobsDb = new JsonConfigs('jobs.json');

class AssessmentService {
    calculateReadiness(roleId, userSkills) {
        const job = jobsDb.getById(roleId);
        if (!job) throw new Error('Job not found');

        let totalWeight = 0;
        let earnedScore = 0;
        const gaps = [];
        const roadmap = [];

        job.skills.forEach(skill => {
            totalWeight += skill.weight;

            // userSkills is expected to be { "HTML/CSS": true, "JavaScript": false } or similar
            // For hackathon simplicity, we might assume boolean "has skill" or 0-100 rating.
            // Let's assume the input sends a list of skills the user HAS.

            const hasSkill = userSkills.includes(skill.name);

            if (hasSkill) {
                earnedScore += skill.weight;
            } else {
                gaps.push({
                    skill: skill.name,
                    category: skill.category,
                    priority: skill.weight >= 20 ? 'High' : 'Medium'
                });
            }
        });

        // Calculate Score
        const readinessScore = totalWeight === 0 ? 0 : Math.round((earnedScore / totalWeight) * 100);

        // Generate Roadmap
        if (gaps.length > 0) {
            roadmap.push({
                module: 1,
                title: "Core Technical Gaps",
                description: "Focus on these high-priority technical skills first.",
                items: gaps.filter(g => g.category === 'Technical' && g.priority === 'High').map(g => g.skill)
            });
            roadmap.push({
                module: 2,
                title: "Tools & Frameworks",
                description: "Learn the necessary tools for the trade.",
                items: gaps.filter(g => g.category === 'Tools').map(g => g.skill)
            });
            roadmap.push({
                module: 3,
                title: "Polishing & Soft Skills",
                description: "Round out your profile.",
                items: gaps.filter(g => ['Soft', 'Portfolio'].includes(g.category)).map(g => g.skill)
            });
        }

        // Clean up empty modules
        const finalRoadmap = roadmap.filter(m => m.items.length > 0);

        return {
            role: job.title,
            score: readinessScore,
            gaps,
            roadmap: finalRoadmap
        };
    }
}

module.exports = new AssessmentService();
