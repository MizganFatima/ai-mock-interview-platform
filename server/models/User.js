const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },
    activeSessions: [{ 
        token: String, 
        deviceInfo: String, 
        createdAt: { type: Date, default: Date.now } 
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);