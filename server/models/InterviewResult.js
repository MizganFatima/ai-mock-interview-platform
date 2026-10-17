const mongoose = require('mongoose');

const interviewResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    topic: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewResult', interviewResultSchema);