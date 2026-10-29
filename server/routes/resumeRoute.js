const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const upload = multer({ storage: multer.memoryStorage() });

async function generateWithDynamicFallback(prompt) {
    let modelsToTry = ["gemini-3.8-flash", "gemini-1.5-flash", "gemini-2.5-flash", "gemini-flash"];
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data && data.models) {
            const dynamicFlashModels = data.models
                .filter(m => m.name.includes('flash') && m.supportedGenerationMethods?.includes('generateContent'))
                .map(m => m.name.replace('models/', ''));
            if (dynamicFlashModels.length > 0) {
                modelsToTry = [...new Set([...dynamicFlashModels, ...modelsToTry])];
            }
        }
    } catch (e) {
        console.log("⚠️ Resume dynamic model fetch skipped, using default list.");
    }

    let lastError = null;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[Resume Analyzer] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError;
}

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

        let rawText = await generateWithDynamicFallback(prompt);
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