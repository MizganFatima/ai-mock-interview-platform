const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const InterviewResult = require('../models/InterviewResult');

// Get Performance Report Data for PDF Download
router.get('/generate-report', verifyToken, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const results = await InterviewResult.find({ userId }).sort({ createdAt: -1 }).limit(10);
        
        // Fallback data if no history exists in DB yet
        const latest = results && results.length > 0 ? results[0] : {
            role: "Software Developer",
            topic: "JavaScript",
            score: 88,
            difficulty: "Intermediate",
            feedback: "Strong technical clarity, great structural breakdown, and excellent professional terminology."
        };

        const avgScore = results && results.length > 0 
            ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
            : 88;

        const reportData = {
            studentName: "Mizgan Fatima",
            university: "Era University, Lucknow",
            course: "BCA 5th Semester",
            targetRole: latest.role || "Software Developer",
            primaryTopic: latest.topic || "JavaScript",
            latestScore: latest.score,
            averageScore: avgScore,
            difficultyLevel: latest.difficulty || "Intermediate",
            aiFeedback: latest.feedback,
            totalSessions: results ? results.length : 1,
            dateGenerated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            evaluationStatus: latest.score >= 75 ? "EXCELLENT - PLACEMENT READY 🚀" : "GOOD - REVISION RECOMMENDED"
        };

        res.json({
            success: true,
            report: reportData
        });

    } catch (err) {
        console.log("Report Generation Error:", err.message);
        res.status(500).json({ success: false, error: 'Failed to generate performance report data.' });
    }
});

module.exports = router;