const express = require('express');
const router = express.Router();
const JsonConfigs = require('../utils/jsonDb');

const jobsDb = new JsonConfigs('jobs.json');

// Get all jobs
router.get('/', (req, res) => {
    const jobs = jobsDb.getAll();
    res.json(jobs);
});

// Get specific job
router.get('/:id', (req, res) => {
    const job = jobsDb.getById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
});

module.exports = router;
