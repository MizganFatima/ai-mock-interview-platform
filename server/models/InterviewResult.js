const mongoose = require('mongoose');

const interviewResultSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    topic: { type: String, required: true },
    role: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: { type: Number, required: true },
    feedback: { type: String, required: true },
    difficulty: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('InterviewResult', interviewResultSchema);