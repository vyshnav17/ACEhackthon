const express = require('express');
const router = express.Router();
const JsonConfigs = require('../utils/jsonDb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersDb = new JsonConfigs('users.json');
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_hackathon_key';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const existing = usersDb.findBy(u => u.email === email);
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            history: []
        };

        usersDb.create(newUser);
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = usersDb.findBy(u => u.email === email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
