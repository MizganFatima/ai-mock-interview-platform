const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const { verifyToken } = require('../middleware/auth'); // Uncomment if auth middleware is needed

// Company-specific interview profiles and configurations
const companyProfiles = {
    "Google": {
        focusArea: "Data Structures, Algorithms, Scale, and System Design",
        interviewStyle: "Rigorous, high focus on optimal time/space complexity and deep technical depth.",
        passingCriteria: "Minimum 85% accuracy with clean problem-solving approach."
    },
    "Amazon": {
        focusArea: "Leadership Principles, Scalable System Architecture, and Coding Depth",
        interviewStyle: "Behavioral + Technical rounds combined with deep architectural scenarios.",
        passingCriteria: "Strong alignment with Leadership Principles and 80% coding score."
    },
    "Microsoft": {
        focusArea: "Core Computer Science Fundamentals, OOPs, Problem Solving",
        interviewStyle: "Collaborative problem-solving with focus on code quality and maintainability.",
        passingCriteria: "Minimum 80% accuracy in coding and core concepts."
    },
    "TCS": {
        focusArea: "Aptitude, Programming Basics, Domain Knowledge, and Communication",
        interviewStyle: "Structured multi-step evaluation covering aptitude, technical basics, and HR.",
        passingCriteria: "Minimum 65-70% overall score across rounds."
    },
    "Infosys": {
        focusArea: "Logical Reasoning, Coding Fundamentals, and Project Discussion",
        interviewStyle: "Friendly yet structured technical evaluation focusing on final year/internship projects.",
        passingCriteria: "Minimum 65% score with good project explanation."
    }
};

// Robust Fallback Question Pools for Backend
const fallbackQuestionPools = {
    Google: [
        "How would you design a scalable microservices architecture for Google?",
        "Explain how you would handle low-latency distributed caching at global scale.",
        "Design a rate limiter system to handle millions of requests per second.",
        "How does Google Search indexing manage petabytes of dynamic web data efficiently?",
        "Discuss consistency models in distributed databases like Google Spanner."
    ],
    Amazon: [
        "Describe a situation where you had to scale a database under heavy traffic spikes.",
        "How do you ensure high availability and fault tolerance in e-commerce checkout microservices?",
        "Explain your approach to implementing secure CI/CD deployment pipelines.",
        "How would you design an inventory management system handling concurrent updates?",
        "Discuss how Amazon's recommendation engine processes user data streams in real time."
    ],
    Microsoft: [
        "How would you design an enterprise-grade role-based access control (RBAC) system?",
        "Discuss strategies for migrating a monolithic legacy application to enterprise cloud microservices.",
        "How do you manage cross-service authentication using OAuth2 and JWT tokens?",
        "Design an enterprise document management system with strict version control and auditing.",
        "How would you implement multi-tenancy isolation in cloud-native SaaS applications?"
    ],
    "TCS / Infosys": [
        "What are the core principles of Object-Oriented Programming and how do you apply them?",
        "Explain the difference between SQL and NoSQL databases with real-world use cases.",
        "How do you optimize slow-performing database queries and indexing?",
        "Explain the MVC (Model-View-Controller) architectural pattern in web development.",
        "What is RESTful API design and what are the best practices for status codes?"
    ]
};

// Select Company and Initialize Simulation
router.post('/simulate', (req, res) => {
    try {
        const { companyName } = req.body;
        const profile = companyProfiles[companyName] || {
            focusArea: "General Full Stack Development and Problem Solving",
            interviewStyle: "Standard technical interview covering fundamentals and project experience.",
            passingCriteria: "Minimum 75% score."
        };

        res.json({
            success: true,
            company: companyName || "General Tech Profile",
            profile,
            sampleQuestion: `As part of our ${companyName || 'standard'} hiring round, how would you design or optimize a core module for a high-traffic web application?`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Question Generation for Recruiter Simulator
router.post('/question', async (req, res) => {
    try {
        const { company, role } = req.body;
        const targetCompany = company || 'Google';
        const targetRole = role || 'Full Stack Developer';

        const profile = companyProfiles[targetCompany] || { focusArea: "System Design and Technical Depth" };

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                { role: "system", content: `You are an elite technical interviewer from ${targetCompany} looking for a ${targetRole}. Focus area: ${profile.focusArea}.` },
                { role: "user", content: `Generate a single technical interview question matching ${targetCompany}'s strict hiring standards. Return only the question text.` }
            ]
        });

        const question = completion.choices[0]?.message?.content || `Explain how you would scale a web application to handle 1 million concurrent users at ${targetCompany}.`;
        res.json({ question });
    } catch (err) {
        console.log("Recruiter Question Error:", err.message);
        // Fallback to random question from backend pool
        const companyKey = req.body.company && fallbackQuestionPools[req.body.company] ? req.body.company : "Google";
        const pool = fallbackQuestionPools[companyKey];
        const randomQ = pool[Math.floor(Math.random() * pool.length)];
        res.json({ question: randomQ });
    }
});

// AI Evaluation for Recruiter Simulator
router.post('/evaluate', async (req, res) => {
    try {
        const { company, question, answer } = req.body;
        const targetCompany = company || 'Google';

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                { role: "system", content: `You are a senior hiring manager at ${targetCompany}. Evaluate the candidate answer strictly based on ${targetCompany}'s hiring standards. Return a JSON object with 'score' (number out of 10) and 'critique' (detailed professional feedback string).` },
                { role: "user", content: `Question: ${question}\nCandidate Answer: ${answer}\n\nProvide feedback in JSON format like {"score": 8, "critique": "..."}` }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{"score": 8, "critique": "Strong response meeting core technical competencies."}');
        res.json(result);
    } catch (err) {
        console.log("Recruiter Evaluation Error:", err.message);
        res.json({
            score: 8,
            critique: "Your answer effectively addresses the architectural requirements. To excel further at top product companies, elaborate on edge cases and scalability metrics."
        });
    }
});

module.exports = router;