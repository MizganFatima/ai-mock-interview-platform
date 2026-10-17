const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testApiKey() {
    try {
        console.log("Testing Groq API key with active model...");
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: "Say hello in one word." }],
        });
        console.log("Success! API Key & Model are working.");
        console.log("AI Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.log("API Key Error:", error.message);
    }
}

testApiKey();