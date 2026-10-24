const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const otpStore = {}; 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        console.log("REGISTER BODY RECEIVED:", req.body);
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
        console.log("USER SAVED TO MONGODB SUCCESSFULLY!");
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
        console.log("REGISTER ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 1. Login Request Route (Checks password & sends Login OTP)
router.post('/login-request', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("LOGIN REQUEST FOR:", email);

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Login Verification OTP',
            text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.log('Login OTP Fallback (Terminal):', otp);
        }

        res.json({ success: true, message: 'OTP sent successfully to your email!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Verify Login OTP Route (Completes login & returns token)
router.post('/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = otpStore[email];
        if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        delete otpStore[email];

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            message: 'Login successful!',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Email not registered with any account.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}`
            });
        } catch (mailErr) {
            console.log('Reset OTP Fallback (Terminal Code):', otp);
        }

        res.json({ success: true, message: 'OTP sent successfully to your email!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password - Verify OTP & Update
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const record = otpStore[email];
        if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        delete otpStore[email];

        res.json({ success: true, message: 'Password reset successful!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;