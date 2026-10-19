const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const InterviewResult = require('../models/InterviewResult');
const { GoogleGenAI } = require('@google/genai');

// Google Gemini API Initialization using GEMINI_API_KEY from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to call Gemini API with fallback models
async function callGeminiWithFallback(promptText, responseJsonFormat = false) {
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying Gemini model: ${modelName}`);
            const config = {};
            if (responseJsonFormat) {
                config.responseMimeType = "application/json";
            }

            const response = await ai.models.generateContent({
                model: modelName,
                contents: promptText,
                config: config,
            });

            const textContent = response.text();
            if (textContent) return textContent;
        } catch (err) {
            console.log(`Model ${modelName} failed, trying next... Error:`, err.message);
        }
    }
    throw new Error("All Gemini models failed.");
}

// Start Interview Session & Generate First AI Question (With Custom Language & Anti-Repeat Support)
router.post('/start', verifyToken, async (req, res) => {
    try {
        const { topic, role, difficulty, language, excludeQuestions } = req.body;
        const sessionId = Date.now().toString();
        const selectedTopic = topic || 'JavaScript';
        const selectedRole = role || 'Software Developer';
        const currentDiff = difficulty || 'Beginner';
        const selectedLanguage = language ? language.trim() : 'English';
        const excludedList = excludeQuestions || [];

        const prompt = `You are an expert technical interviewer. Never repeat standard questions. Always generate a completely new, unique, and fresh technical question.
Generate a single ${currentDiff}-level technical interview question for a ${selectedRole} focusing on ${selectedTopic}.

CRITICAL ANTI-REPEAT INSTRUCTION: Do NOT repeat or generate anything similar to these previously asked questions:
${JSON.stringify(excludedList)}

CRITICAL LANGUAGE INSTRUCTION: The question must be written entirely in the following language: "${selectedLanguage}". Return only the question text without extra quotes or formatting.`;

        let firstQuestion;
        try {
            firstQuestion = await callGeminiWithFallback(prompt);
        } catch (err) {
            firstQuestion = `Can you explain the core concepts and fundamental rules of ${selectedTopic} for a ${selectedRole} role?`;
        }

        res.json({
            success: true,
            sessionId,
            difficulty: currentDiff,
            question: firstQuestion.trim()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Evaluate Answer, Save to DB, & Generate Next Dynamic AI Question (With Anti-Repeat)
router.post('/evaluate', verifyToken, async (req, res) => {
    try {
        const { sessionId, answer, currentDifficulty, topic, role, question, language, excludeQuestions } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!answer || answer.trim().length < 5) {
            return res.status(400).json({ success: false, error: 'Please provide a meaningful answer.' });
        }

        const selectedTopic = topic || 'JavaScript';
        const selectedRole = role || 'Software Developer';
        const currentDiff = currentDifficulty || 'Beginner';
        const selectedLanguage = language ? language.trim() : 'English';
        const excludedList = excludeQuestions || [];

        let score = 80;
        let feedbackText = "Strong technical explanation with clear understanding.";
        
        try {
            const evalPrompt = `You are an expert technical interviewer. Evaluate the candidate's answer and return a JSON object with 'score' (number out of 100) and 'critique' (string feedback written in ${selectedLanguage}).
Role: ${selectedRole}
Topic: ${selectedTopic}
Question: ${question}
Candidate Answer: ${answer}

Provide feedback in strict JSON format like {"score": 85, "critique": "..."}`;

            const rawContent = await callGeminiWithFallback(evalPrompt, true);
            let cleanedContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const evaluationData = JSON.parse(cleanedContent);
            score = evaluationData.score || 80;
            feedbackText = evaluationData.critique || feedbackText;
        } catch (err) {
            console.log("AI Evaluation Fallback used:", err.message);
            if (answer.length > 80) score = 90;
            else if (answer.length < 30) score = 50;
        }

        let nextDifficulty = currentDiff;
        if (score >= 85) {
            if (nextDifficulty === 'Beginner') nextDifficulty = 'Intermediate';
            else if (nextDifficulty === 'Intermediate') nextDifficulty = 'Advanced';
        } else if (score <= 55) {
            if (nextDifficulty === 'Advanced') nextDifficulty = 'Intermediate';
            else if (nextDifficulty === 'Intermediate') nextDifficulty = 'Beginner';
        }

        InterviewResult.create({
            userId,
            topic: selectedTopic,
            role: selectedRole,
            question: question || 'General technical question',
            answer,
            score,
            feedback: feedbackText,
            difficulty: currentDiff
        }).catch(err => console.log("Database Save Error:", err));

        const nextPrompt = `You are an expert technical interviewer. Never repeat questions. Always generate a completely new and unique question.
The candidate just answered a question about ${selectedTopic}. Based on their performance, generate the next ${nextDifficulty}-level technical interview question for a ${selectedRole}.

CRITICAL ANTI-REPEAT INSTRUCTION: Do NOT repeat or generate anything similar to these previously asked questions:
${JSON.stringify(excludedList)}

CRITICAL LANGUAGE INSTRUCTION: The question must be written entirely in the following language: "${selectedLanguage}". Return only the question text.`;

        let nextQuestion;
        try {
            nextQuestion = await callGeminiWithFallback(nextPrompt);
        } catch (err) {
            nextQuestion = `How do you handle advanced state management, asynchronous operations, or performance optimization in ${selectedTopic}?`;
        }

        res.json({
            success: true,
            evaluation: {
                score,
                feedback: feedbackText,
                nextDifficulty,
                nextQuestion: nextQuestion.trim()
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get User Interview History Route
router.get('/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const history = await InterviewResult.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, history });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;