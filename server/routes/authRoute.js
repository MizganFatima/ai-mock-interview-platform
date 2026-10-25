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
        user: process.env.EMAIL_USER, // Aapki email address
        pass: process.env.EMAIL_PASS  // Aapka Gmail App Password
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
        res.status(500).json({ success: false, error: err.message });
    }
});

// Forgot Password Route with Nodemailer
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

        // Create reset URL
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        // Email Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request - AI Mock Interview Platform',
            html: `
                <h3>You requested a password reset</h3>
                <p>Please click on the following link to reset your password:</p>
                <a href="${resetUrl}" target="_blank">${resetUrl}</a>
                <p>This link is valid for 1 hour.</p>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: "Password reset link has been sent to your email successfully!" 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;