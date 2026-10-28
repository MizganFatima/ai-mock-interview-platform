const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const upload = multer({ storage: multer.memoryStorage() });

// Multi-Model Fallback Helper
async function generateWithFallback(prompt) {
    const modelsToTry = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Resume Analyzer] Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            console.log(`⚠️ Model ${modelName} failed:`, err.message);
            lastError = err;
        }
    }
    throw lastError;
}

router.post('/analyze', upload.single('resumePdf'), async (req, res) => {
    try {
        let resumeContent = '';

        // 1. If PDF File is uploaded
        if (req.file) {
            console.log("Received PDF file:", req.file.originalname);
            try {
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(req.file.buffer);
                resumeContent = pdfData.text;
            } catch (pdfErr) {
                console.log("PDF Parse warning, using fallback text extraction:", pdfErr.message);
                resumeContent = "Candidate resume uploaded as PDF file: " + req.file.originalname;
            }
        } 
        // 2. If Direct Text is pasted
        else if (req.body.resumeText && req.body.resumeText.trim().length > 0) {
            resumeContent = req.body.resumeText;
        } 
        else {
            return res.status(400).json({ success: false, error: "Please upload a valid PDF or paste resume text." });
        }

        const targetRole = req.body.targetRole || 'Software Developer';

        const prompt = `You are an expert technical recruiter and resume reviewer. 
Analyze the following resume content specifically for the target role: "${targetRole}".

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

        let rawText = await generateWithFallback(prompt);
        let cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let analysisData;
        try {
            analysisData = JSON.parse(cleanedText);
        } catch (e) {
            analysisData = {
                score: 82,
                feedback: rawText
            };
        }

        res.json({
            success: true,
            analysis: {
                score: analysisData.score || 82,
                feedback: analysisData.feedback || "Resume analyzed successfully."
            }
        });
    } catch (err) {
        console.error("Resume Analysis Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;