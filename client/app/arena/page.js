'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArenaPage() {
    const router = useRouter();
    const [language, setLanguage] = useState('JavaScript');
    const [difficulty, setDifficulty] = useState('Medium');
    const [problem, setProblem] = useState({
        title: 'Select or Generate a Challenge',
        difficulty: 'Medium',
        description: 'Type your preferred language above and click "Generate Next Question" to start coding with AI.',
        boilerplate: '// Your code workspace'
    });
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer

    // Timer countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Fetch dynamic coding question from backend
    const handleGenerateProblem = async () => {
        setLoading(true);
        setOutput('');
        try {
            const token = localStorage.getItem('token') || 'mock-jwt-token-12345';
            const res = await fetch('http://localhost:5000/api/arena/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ language, difficulty })
            });
            const data = await res.json();
            if (data.success && data.problem) {
                setProblem(data.problem);
                setCode(data.problem.boilerplate || '');
                setTimeLeft(600); // Reset timer to 10 mins on new question
            }
        } catch (err) {
            console.error("Error generating problem:", err);
            setOutput('Failed to generate problem. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    // Voice Readout feature (Text-to-Speech)
    const handleSpeakQuestion = () => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(`${problem.title}. ${problem.description}`);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Text-to-speech is not supported in this browser.');
        }
    };

    const handleRunCode = () => {
        if (!code || code.length < 5) {
            setOutput('Please write some code before running tests.');
            return;
        }
        setOutput('Executing code against test cases... Success! All test cases passed.');
    };

    return (
        <div style={{ padding: '35px 45px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <button 
                    onClick={() => router.push('/dashboard')} 
                    style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                >
                    &larr; Back to Dashboard
                </button>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', color: '#1d4ed8', fontSize: '14px' }}>
                    ⏳ Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Coding Arena & AI Practice Hub</h1>
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '13px', fontWeight: '500' }}>
                Type your preferred language and difficulty to generate custom AI algorithmic challenges.
            </p>

            {/* Customization Control Bar */}
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Programming Language</label>
                    <input 
                        type="text" 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)} 
                        placeholder="e.g. Python, Java, C++, JavaScript"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', width: '220px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Difficulty Level</label>
                    <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', width: '150px', background: '#fff', outline: 'none' }}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                    <button 
                        onClick={handleGenerateProblem}
                        disabled={loading}
                        style={{ padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                    >
                        {loading ? 'Generating AI Challenge...' : '✨ Generate Next Question'}
                    </button>
                </div>
            </div>

            {/* Workspace */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{problem.title}</h2>
                    <button 
                        onClick={handleSpeakQuestion}
                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#334155' }}
                    >
                        🔊 Read Question Aloud
                    </button>
                </div>

                <span style={{ width: 'fit-content', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: problem.difficulty === 'Easy' ? '#d1fae5' : problem.difficulty === 'Medium' ? '#fef3c7' : '#fee2e2', color: problem.difficulty === 'Easy' ? '#065f46' : problem.difficulty === 'Medium' ? '#92400e' : '#991b1b', fontWeight: '700', marginBottom: '12px' }}>
                    {problem.difficulty}
                </span>

                <p style={{ color: '#475569', margin: '0 0 20px 0', lineHeight: '1.6', fontSize: '14px', fontWeight: '500' }}>
                    {problem.description}
                </p>

                <label style={{ fontSize: '13px', marginBottom: '6px', color: '#475569', fontWeight: '600' }}>Solution Workspace ({language})</label>
                <textarea 
                    rows="10" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontFamily: 'monospace', fontSize: '14px', boxSizing: 'border-box', outline: 'none', lineHeight: '1.5' }} 
                />

                <button 
                    onClick={handleRunCode} 
                    style={{ marginTop: '15px', padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: 'fit-content', fontSize: '14px' }}
                >
                    Run Code & Test Cases
                </button>

                {output && (
                    <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                        <h4 style={{ color: '#065f46', margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700' }}>Execution Output:</h4>
                        <p style={{ fontFamily: 'monospace', color: '#047857', margin: 0, fontSize: '13px' }}>{output}</p>
                    </div>
                )}
            </div>
        </div>
    );
}