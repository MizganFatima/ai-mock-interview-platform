const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_mock_interview_super_secret_key';

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

// Login Route
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

// Forgot Password Route (Returning reset link directly to bypass Render SMTP timeout)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Use environment CLIENT_URL or fallback to live Vercel frontend URL
        const clientUrl = process.env.CLIENT_URL || 'https://ai-mock-interview-platform-tau.vercel.app';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        console.log("🔑 Generated Password Reset Link:", resetUrl);

        res.status(200).json({ 
            success: true, 
            message: "Password reset link generated successfully!",
            resetUrl: resetUrl 
        });
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR DETAILS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;