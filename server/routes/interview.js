const express = require('express');
const router = express.Router();
const interviewService = require('../services/interviewService');

// Start or Continue Interview
// Body: { history: [], context: { role: "Frontend Dev", resumeSummary: "..." } }
router.post('/chat', async (req, res) => {
    try {
        const { history, context } = req.body;

        if (!context || !context.role) {
            return res.status(400).json({ message: "Context with role is required" });
        }

        const response = await interviewService.generateNextTurn(history || [], context);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
