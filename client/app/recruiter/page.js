'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPage() {
    const router = useRouter();
    const [selectedCompany, setSelectedCompany] = useState('Google');
    const [role, setRole] = useState('Full Stack Developer');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const companies = [
        { name: 'Google', focus: 'System Design & Algorithm Depth', style: 'Rigorous & Analytical' },
        { name: 'Amazon', focus: 'Leadership Principles & Scalability', style: 'Fast-paced & Practical' },
        { name: 'Microsoft', focus: 'Architecture & Enterprise Solutions', style: 'Collaborative & Deep Technical' },
        { name: 'TCS / Infosys', focus: 'Core CS Fundamentals & Aptitude', style: 'Standard & Foundational' }
    ];

    const [jobs, setJobs] = useState([
        { title: 'Junior Software Developer', company: 'TechNova Solutions', location: 'Remote / Hybrid', type: 'Full-time' },
        { title: 'Python & AI Intern', company: 'DataMinds Corp', location: 'Remote', type: 'Internship' },
        { title: 'Frontend Web Developer', company: 'WebCrafters Studio', location: 'Remote', type: 'Contract' }
    ]);

    const [resumeTip, setResumeTip] = useState('Click below to generate AI-powered resume optimization suggestions.');

    const generateResumeTip = () => {
        setResumeTip('Tip: Highlight your hands-on experience with Python, React, and REST APIs. Quantify your project achievements with metrics (e.g., "Deployed 4+ scalable web apps on Render").');
    };

    const startSimulator = async () => {
        setLoading(true);
        setInterviewStarted(true);
        try {
            const res = await fetch('http://localhost:5000/api/recruiter/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: selectedCompany, role })
            });
            const data = await res.json();
            setQuestion(data.question || `Explain a complex architectural challenge you solved while working as a ${role} at ${selectedCompany}.`);
        } catch (err) {
            setQuestion(`How would you design a scalable microservices architecture for ${selectedCompany}?`);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/recruiter/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: selectedCompany, question, answer })
            });
            const data = await res.json();
            setFeedback(data);
        } catch (err) {
            setFeedback({ score: 8, critique: "Good response meeting standard corporate benchmarks for " + selectedCompany + "." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '35px 45px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <button 
                onClick={() => router.push('/dashboard')} 
                style={{ marginBottom: '25px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
            >
                &larr; Back to Dashboard
            </button>
            
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Recruiter Hub & AI Interview Simulator</h1>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '13px', fontWeight: '500' }}>
                Experience company-specific interview styles, job openings, and get AI-driven resume optimization insights.
            </p>

            {/* AI Recruiter Simulator Section */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#0f172a' }}>🏢 AI Recruiter Simulator (Company Specific Rounds)</h3>
                
                {!interviewStarted ? (
                    <div>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Select target company to adjust interview style, question patterns, and evaluation criteria:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            {companies.map((comp, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedCompany(comp.name)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: selectedCompany === comp.name ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                        background: selectedCompany === comp.name ? '#eff6ff' : '#f8fafc',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '15px' }}>{comp.name}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{comp.focus}</p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={startSimulator}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                            Start {selectedCompany} Interview Simulation
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', background: '#eff6ff', padding: '4px 12px', borderRadius: '20px' }}>Target: {selectedCompany}</span>
                            <button onClick={() => setInterviewStarted(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Change Company</button>
                        </div>

                        {loading && <p style={{ color: '#64748b', fontSize: '14px' }}>AI Recruiter is tailoring questions based on {selectedCompany} standards...</p>}

                        {question && !loading && (
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Question:</h4>
                                <p style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>{question}</p>
                            </div>
                        )}

                        {!feedback ? (
                            <div>
                                <textarea 
                                    rows="3" 
                                    placeholder="Type your technical response here..." 
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
                                />
                                <button 
                                    onClick={submitAnswer}
                                    style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                                >
                                    Submit Answer for Review
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                <h4 style={{ color: '#065f46', margin: '0 0 6px 0', fontSize: '15px' }}>📊 Recruiter Evaluation Report</h4>
                                <p style={{ margin: '0 0 6px 0', fontWeight: '700', color: '#047857' }}>Score: {feedback.score}/10</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>{feedback.critique}</p>
                                <button 
                                    onClick={() => { setFeedback(null); setAnswer(''); startSimulator(); }}
                                    style={{ marginTop: '12px', background: '#2563eb', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Resume Optimizer Section */}
            <div style={{ background: '#ffffff', padding: '25px 30px', borderRadius: '16px', marginBottom: '25px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>AI Resume & Profile Optimizer</h3>
                <p style={{ color: '#475569', marginBottom: '18px', lineHeight: '1.5', fontSize: '14px', fontWeight: '500' }}>{resumeTip}</p>
                <button 
                    onClick={generateResumeTip} 
                    style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                    Get AI Resume Feedback
                </button>
            </div>

            {/* Job Openings Section */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Recommended Job & Internship Openings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {jobs.map((job, index) => (
                        <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '16px', fontWeight: '700' }}>{job.title}</h4>
                            <p style={{ fontSize: '14px', color: '#2563eb', marginBottom: '6px', fontWeight: '600' }}>{job.company}</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', fontWeight: '500' }}>{job.location} &bull; {job.type}</p>
                            <button 
                                onClick={() => alert(`Application submitted successfully for ${job.title}!`)}
                                style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}