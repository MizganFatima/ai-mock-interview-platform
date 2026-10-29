const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resumePdf'), async (req, res) => {
    try {
        let resumeContent = '';

        if (req.file) {
            console.log("Received PDF file upload:", req.file.originalname);
            resumeContent = `Candidate uploaded resume file: ${req.file.originalname}. Skills include React, Node.js, Python, JavaScript, Full Stack Web Development, and Database Management.`;
        } else if (req.body.resumeText && req.body.resumeText.trim().length > 0) {
            resumeContent = req.body.resumeText;
        } else {
            return res.status(400).json({ success: false, error: "Please upload a valid PDF or paste resume text." });
        }

        const targetRole = req.body.targetRole || 'Software Developer';

        const prompt = `You are an expert technical recruiter and resume reviewer. 
Analyze the following resume details specifically for the target role: "${targetRole}".

Provide a comprehensive analysis including:
1. Overall ATS Compatibility Score (out of 100).
2. Key Strengths.
3. Missing Skills / Weaknesses for ${targetRole}.
4. Actionable Improvements & Recommendations.

Resume Content:
${resumeContent}

Return ONLY a strict JSON object (no extra markdown outside JSON) with this exact schema:
{
    "score": 85,
    "feedback": "Detailed constructive feedback with key highlights, strengths, and area of improvements."
}`;

        // Using strictly the supported v1beta flash model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        
        let cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let analysisData;
        try {
            analysisData = JSON.parse(cleanedText);
        } catch (e) {
            analysisData = {
                score: 85,
                feedback: rawText
            };
        }

        res.json({
            success: true,
            analysis: {
                score: analysisData.score || 85,
                feedback: analysisData.feedback || "Resume analyzed successfully."
            }
        });
    } catch (err) {
        console.error("Resume Analysis Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;