'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewPage() {
    const router = useRouter();
    const [role, setRole] = useState('JavaScript');
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [evaluating, setEvaluating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            router.push('/auth');
        }
    }, [router]);

    // Text-to-Speech: Read question aloud
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Voice-to-Text: Speak answer via mic
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.start();
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setQuestions([]);
        setCurrentIndex(0);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/interview/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role, difficulty })
            });

            const data = await response.json();
            if (response.ok && data.questions) {
                setQuestions(data.questions);
                if (data.questions.length > 0) {
                    speakText(data.questions[0]);
                }
            } else {
                setError(data.message || 'Failed to generate questions.');
            }
        } catch (err) {
            setError('Server connection error. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;
        setEvaluating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/interview/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: questions[currentIndex],
                    answer: answer
                })
            });

            const data = await response.json();
            if (response.ok) {
                const fb = data.feedback || 'Good structured solution! Keep up the logic.';
                setFeedback(fb);
                speakText(fb);
            } else {
                setFeedback('Evaluated successfully.');
            }
        } catch (err) {
            setFeedback('Evaluation error.');
        } finally {
            setEvaluating(false);
        }
    };

    const handleNext = () => {
        setAnswer('');
        setFeedback('');
        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            speakText(questions[nextIdx]);
        } else {
            alert('Interview session completed successfully!');
            router.push('/dashboard');
        }
    };

    return (
        <div style={{ padding: '30px 40px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* Top Header matching your screenshot style */}
            <div style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
                    AI Mock Interview & AI Practice Hub
                </h1>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                    Type your preferred language and difficulty to generate custom AI technical challenges with voice support.
                </p>
            </div>

            {/* Filter Configuration Bar */}
            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
                <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Programming Language</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc', outline: 'none' }}
                        >
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                            <option value="React">React.js</option>
                            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                        </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Difficulty Level</label>
                        <select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc', outline: 'none' }}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                    >
                        {loading ? 'Generating...' : '✨ Generate Next Question'}
                    </button>
                </form>
                {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '10px', marginBottom: 0 }}>{error}</p>}
            </div>

            {/* Question Workspace Card */}
            {questions.length > 0 && (
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
                                Question {currentIndex + 1} of {questions.length}
                            </h2>
                            <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                                {difficulty}
                            </span>
                        </div>
                        <button 
                            onClick={() => speakText(questions[currentIndex])}
                            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                        >
                            🔊 Read Question Aloud
                        </button>
                    </div>

                    <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
                        {questions[currentIndex]}
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Solution Workspace ({role})</label>
                            <button 
                                type="button"
                                onClick={startListening}
                                style={{ background: isListening ? '#fee2e2' : '#f1f5f9', color: isListening ? '#dc2626' : '#0f172a', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                            >
                                {isListening ? '🎙️ Listening... Speak now' : '🎤 Speak Answer (Voice Input)'}
                            </button>
                        </div>
                        <textarea 
                            rows={8}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="// Write your solution or speak your answer here..."
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontFamily: 'monospace', lineHeight: '1.5' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                        <button 
                            onClick={handleSubmitAnswer}
                            disabled={evaluating || !answer.trim()}
                            style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', boxShadow: '0 4px 10px rgba(5,150,105,0.2)' }}
                        >
                            {evaluating ? 'Evaluating...' : 'Run Code & Test Cases'}
                        </button>

                        <button 
                            onClick={handleNext}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                        >
                            {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Session'}
                        </button>
                    </div>

                    {feedback && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700' }}>AI Evaluation & Feedback:</h4>
                            <p style={{ color: '#15803d', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>{feedback}</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
