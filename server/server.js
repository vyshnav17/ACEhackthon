const express = require('express'); // Server entry point - Restart 3

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/interview', require('./routes/interview'));

app.get('/', (req, res) => {
    res.send('JobReady.AI Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
