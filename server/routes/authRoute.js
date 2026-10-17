const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists with this email.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route with Security & Session Tracking
router.post('/login', async (req, res) => {
    try {
        const { email, password, deviceInfo } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Check Account Lockout
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(403).json({ error: 'Account temporarily locked due to multiple failed login attempts.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
            }
            await user.save();
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = Date.now();

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1d' }
        );

        // Track Active Session
        user.activeSessions.push({ token, deviceInfo: deviceInfo || 'Web Browser' });
        await user.save();

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
