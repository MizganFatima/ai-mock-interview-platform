const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Calculate Placement Readiness Score & Generate Roadmap
router.post('/calculate', verifyToken, async (req, res) => {
    try {
        const { resumeScore, interviewScore, codingScore, candidateType } = req.body;

        // Calculate overall score (weighted average)
        const rScore = Number(resumeScore) || 70;
        const iScore = Number(interviewScore) || 75;
        const cScore = Number(codingScore) || 65;

        const overallScore = Math.round((rScore * 0.3) + (iScore * 0.4) + (cScore * 0.3));

        // Classification status
        let classification = "Needs Improvement";
        if (overallScore >= 85) classification = "Placement Ready";
        else if (overallScore >= 70) classification = "High Potential Candidate";

        // Generate tailored roadmap based on candidate type (Fresher / Intern / Experienced)
        let recommendations = [];
        if (candidateType === 'Fresher') {
            recommendations = [
                "Focus on core Data Structures and Algorithms (DSA)",
                "Build at least 2 full-stack projects using React and Node.js",
                "Strengthen fundamental computer science concepts (DBMS, OS, OOPs)"
            ];
        } else if (candidateType === 'Internship Seeker') {
            recommendations = [
                "Optimize resume with quantifiable project achievements",
                "Practice system design basics and RESTful API development",
                "Participate in peer mock interviews to improve communication gaps"
            ];
        } else {
            recommendations = [
                "Focus on Advanced System Design and Scalability patterns",
                "Contribute to open-source software and cloud deployments",
                "Enhance leadership and technical architecture presentation skills"
            ];
        }

        res.json({
            success: true,
            readinessData: {
                overallScore,
                classification,
                breakdown: { resumeScore: rScore, interviewScore: iScore, codingScore: cScore },
                recommendations
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;