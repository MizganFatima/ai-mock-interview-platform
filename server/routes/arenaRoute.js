const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock database for leaderboards and challenges
const challenges = [
    { id: 1, title: "Optimize React Re-renders", category: "Technical", points: 100, difficulty: "Medium" },
    { id: 2, title: "Async/Await Error Handling", category: "Domain-Specific", points: 80, difficulty: "Easy" },
    { id: 3, title: "Scalable System Design for Chat App", category: "Architecture", points: 150, difficulty: "Hard" }
];

const leaderboardData = [
    { rank: 1, name: "Aarav Sharma", score: 1450, streak: 12, badge: "Master Architect" },
    { rank: 2, name: "Priya Verma", score: 1320, streak: 9, badge: "Algorithm Expert" },
    { rank: 3, name: "Rohan Gupta", score: 1250, streak: 7, badge: "Code Wizard" }
];

// Robust Helper Function for Arena AI Generation with Auto-Fallback
async function callGeminiWithFallback(genAI, prompt) {
    const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-flash",
        "gemini-pro"
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Arena Route] Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const textContent = result.response.text();
            if (textContent) return textContent;
        } catch (err) {
            console.log(`⚠️ Arena Model ${modelName} failed:`, err.message);
            lastError = err;
        }
    }
    throw lastError || new Error("All Gemini models failed in Arena Route.");
}

// Generate Dynamic Coding Challenge using Google Gemini AI with Anti-Repeat Support
router.post('/generate', async (req, res) => {
    try {
        const { language, difficulty, excludeProblems } = req.body;
        const targetLang = language || 'JavaScript';
        const targetDiff = difficulty || 'Medium';
        const excludedList = excludeProblems || [];

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const prompt = `Generate a unique ${targetDiff} level coding problem in ${targetLang}. 
CRITICAL ANTI-REPEAT INSTRUCTION: Do NOT generate any problem or title similar to these previously asked problems:
${JSON.stringify(excludedList)}

Return ONLY a valid JSON object with these exact keys:
{
  "title": "Problem Name",
  "difficulty": "${targetDiff}",
  "description": "Detailed problem statement",
  "boilerplate": "// Write your code here"
}`;

        // Call Gemini AI using multi-model fallback helper
        let textContent = await callGeminiWithFallback(genAI, prompt);
        
        // Clean markdown backticks
        textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const problem = JSON.parse(textContent);
        
        res.json({ success: true, problem });
    } catch (err) {
        console.log("Arena AI Gen Error (Using Fallback):", err.message);
        
        // Dynamic rotating questions so it changes every time even on fallback
        const dynamicList = [
            { title: "Find Maximum Subarray Sum", desc: "Given an integer array, find the contiguous subarray with the largest sum." },
            { title: "Valid Parentheses Checker", desc: "Given a string containing brackets, determine if the input string is valid and balanced." },
            { title: "Reverse a Singly Linked List", desc: "Given the head of a linked list, reverse the list and return the new head." },
            { title: "Check Palindrome String", desc: "Write a function to verify if a given string reads the same forwards and backwards." },
            { title: "Merge Two Sorted Arrays", desc: "Merge two sorted arrays into a single sorted array efficiently." }
        ];
        const randomItem = dynamicList[Math.floor(Math.random() * dynamicList.length)];

        res.json({ 
            success: true, 
            problem: {
                title: randomItem.title,
                difficulty: req.body.difficulty || "Medium",
                description: randomItem.desc,
                boilerplate: `// Write your ${req.body.language || 'JavaScript'} solution here\nfunction solve() {\n    // TODO\n}`
            }
        });
    }
});

router.get('/challenges', (req, res) => {
    res.json({ success: true, challenges });
});

router.get('/leaderboard', (req, res) => {
    res.json({ success: true, leaderboard: leaderboardData });
});

router.post('/submit-challenge', (req, res) => {
    res.json({ success: true, message: "Submitted successfully!" });
});

module.exports = router;