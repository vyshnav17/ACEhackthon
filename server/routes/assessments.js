const express = require('express');
const router = express.Router();
const assessmentService = require('../services/assessmentService');
const resumeService = require('../services/resumeService');
const JsonConfigs = require('../utils/jsonDb');
const multer = require('multer');
const fs = require('fs');

// Configure upload
const upload = multer({ dest: 'uploads/' });

// We might want to store results too
const resultsDb = new JsonConfigs('results.json');

router.post('/calculate', (req, res) => {
    try {
        const { roleId, skills, userId } = req.body;
        // skills: Array of strings ["HTML/CSS", "React"]

        if (!roleId || !skills) {
            return res.status(400).json({ message: 'Role ID and Skills are required' });
        }

        const result = assessmentService.calculateReadiness(roleId, skills);

        // Save result if userId provided
        if (userId) {
            resultsDb.create({
                id: Date.now().toString(),
                userId,
                roleId,
                date: new Date().toISOString(),
                score: result.score,
                gaps: result.gaps
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Resume Upload Endpoint
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        console.log("Creating upload request...", req.file);
        if (!req.file) {
            console.error("No file uploaded.");
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // 1. Parse content
        console.log("Parsing resume...");
        const text = await resumeService.parseResume(req.file);
        console.log("Resume parsed, length:", text.length);

        // 2. Analyze with AI
        // jobRole can be passed in body if user selected one, else generic
        const jobRole = req.body.jobRole || 'Software Engineer';
        console.log("Analyzing with AI for role:", jobRole);
        const aiResult = await resumeService.analyzeWithAI(text, jobRole);
        console.log("AI Analysis complete.");

        // 3. Cleanup file
        fs.unlinkSync(req.file.path);

        // 4. Return result
        res.json(aiResult);

    } catch (err) {
        console.error("Upload Error:", err);
        // Try cleanup
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        // Detailed error message for client
        res.status(500).json({ message: 'Analysis failed: ' + err.message, error: err.toString() });
    }
});

// Get user history
router.get('/history/:userId', (req, res) => {
    const history = resultsDb.filterBy(r => r.userId === req.params.userId);
    res.json(history);
});

module.exports = router;
