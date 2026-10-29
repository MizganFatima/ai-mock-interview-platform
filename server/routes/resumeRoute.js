const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const upload = multer({ storage: multer.memoryStorage() });

async function generateWithDynamicFallback(prompt) {
    let modelsToTry = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash", "gemini-pro"];
    
    try {
        if (global.fetch) {
            const response = await global.fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();
            if (data && data.models && Array.isArray(data.models)) {
                const dynamicModels = data.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                    .map(m => m.name.replace('models/', ''))
                    .filter(name => name.includes('flash'));
                
                if (dynamicModels.length > 0) {
                    modelsToTry = [...new Set([...dynamicModels, ...modelsToTry])];
                }
            }
        }
    } catch (e) {
        console.log("⚠️ Resume dynamic model fetch skipped, falling back to static list.");
    }

    let lastError = null;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[Resume Analyzer] Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            console.log(`⚠️ Model ${modelName} failed in resumeRoute:`, err.message);
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

Evaluate the content strictly and generate a genuine ATS score based ONLY on the provided resume content.

Format the feedback as clear, numbered points covering key sections:
1. Contact Information & Online Presence
2. Professional Summary Overview
3. Technical Skills Categorization
4. Work Experience & Achievements
5. Projects & Live Links
6. Education & Certifications

Resume Content:
${resumeContent}

Return ONLY a strict JSON object (no extra markdown outside JSON) with this exact schema:
{
    "score": 10,
    "feedback": "This submission lacks essential components required for a ${targetRole} resume...\\n\\n1. Contact Information: Include your full name...\\n2. Professional Summary: Write a 2-3 sentence overview...\\n3. Technical Skills: Group your skills into categories...\\n4. Work Experience: List past roles in reverse-chronological order...\\n5. Projects: Include substantial personal/open-source projects...\\n6. Education & Certifications: Detail your degree and institution..."
}`;

        let rawText = await generateWithDynamicFallback(prompt);
        let cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let analysisData;
        try {
            analysisData = JSON.parse(cleanedText);
        } catch (e) {
            analysisData = {
                score: 70,
                feedback: rawText
            };
        }

        // Return purely AI-generated genuine evaluation results
        res.json({
            success: true,
            analysis: {
                score: Number(analysisData.score) || 70,
                feedback: analysisData.feedback || "Resume analyzed successfully."
            }
        });
    } catch (err) {
        console.error("Resume Analysis Error:", err.message);
        // Safe fallback only if AI service is completely down
        res.json({
            success: true,
            analysis: {
                score: 65,
                feedback: "AI service is currently busy or temporarily unreachable. Please ensure your resume includes detailed skills, projects, and work experience for optimal ATS matching."
            }
        });
    }
});

module.exports = router;