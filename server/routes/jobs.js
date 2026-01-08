const express = require('express');
const router = express.Router();
const { findJobs } = require('../services/jobService');

// Standard Roles for Assessment
const STANDARD_ROLES = [
    {
        id: "fullstack",
        title: "Full Stack Developer",
        skills: [
            { name: "React/Next.js", category: "Technical" },
            { name: "Node.js/Express", category: "Technical" },
            { name: "TypeScript", category: "Technical" },
            { name: "SQL/NoSQL", category: "Technical" },
            { name: "Git/GitHub", category: "Tools" },
            { name: "Docker", category: "Tools" },
            { name: "Communication", category: "Soft" },
            { name: "Problem Solving", category: "Soft" },
            { name: "Deployed App", category: "Portfolio" }
        ]
    },
    {
        id: "datascientist",
        title: "Data Scientist",
        skills: [
            { name: "Python", category: "Technical" },
            { name: "Pandas/NumPy", category: "Technical" },
            { name: "Machine Learning", category: "Technical" },
            { name: "SQL", category: "Technical" },
            { name: "Jupyter", category: "Tools" },
            { name: "Tableau/PowerBI", category: "Tools" },
            { name: "Storytelling", category: "Soft" },
            { name: "Critical Thinking", category: "Soft" },
            { name: "Kaggle Project", category: "Portfolio" }
        ]
    },
    {
        id: "devops",
        title: "DevOps Engineer",
        skills: [
            { name: "Linux/Bash", category: "Technical" },
            { name: "AWS/Azure", category: "Technical" },
            { name: "CI/CD (Jenkins/Actions)", category: "Technical" },
            { name: "Kubernetes/Docker", category: "Technical" },
            { name: "Terraform", category: "Tools" },
            { name: "Prometheus/Grafana", category: "Tools" },
            { name: "Collaboration", category: "Soft" },
            { name: "Incident Response", category: "Soft" },
            { name: "Infrastructure Code", category: "Portfolio" }
        ]
    },
    {
        id: "marketing",
        title: "Digital Marketer",
        skills: [
            { name: "SEO/SEM", category: "Technical" },
            { name: "Content Strategy", category: "Technical" },
            { name: "Google Analytics", category: "Tools" },
            { name: "Canva/Figma", category: "Tools" },
            { name: "Social Media Mgmt", category: "Tools" },
            { name: "Creativity", category: "Soft" },
            { name: "Data Analysis", category: "Soft" },
            { name: "Campaign Portfolio", category: "Portfolio" }
        ]
    },
    {
        id: "business",
        title: "Business Analyst",
        skills: [
            { name: "Data Modeling", category: "Technical" },
            { name: "Excel/SQL", category: "Technical" },
            { name: "Process Mapping", category: "Technical" },
            { name: "JIRA/Confluence", category: "Tools" },
            { name: "Tableau", category: "Tools" },
            { name: "Stakeholder Mgmt", category: "Soft" },
            { name: "Requirements Gathering", category: "Soft" },
            { name: "Case Studies", category: "Portfolio" }
        ]
    }
];

// Get Standard Roles
router.get('/', (req, res) => {
    res.json(STANDARD_ROLES);
});

// Generate AI Jobs
router.post('/', async (req, res) => {
    try {
        const { role, location, skills } = req.body;
        if (!role || !location) {
            return res.status(400).json({ error: "Role and Location are required" });
        }

        console.log("Searching jobs for:", role, location);
        const jobsData = await findJobs(role, location, skills || []);
        res.json(jobsData);
    } catch (err) {
        console.error("Job Search Error:", err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

module.exports = router;
