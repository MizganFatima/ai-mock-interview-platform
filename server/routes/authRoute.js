const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_mock_interview_super_secret_key';

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            success: true, 
            message: "Signup successful!", 
            token,
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        console.error("SIGNUP ERROR DETAILS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Login Route (With Password)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found with this email" });
        }

        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        console.error("LOGIN ERROR DETAILS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Direct Email Login Route (Passwordless / Replaces Forgot Password)
router.post('/email-login', async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found. Please sign up first." });
        }

        // Generate token directly for instant login
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        console.log("⚡ Direct Email Login successful for:", email);

        res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        console.error("EMAIL LOGIN ERROR DETAILS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;