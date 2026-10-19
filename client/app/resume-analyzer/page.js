'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumeAnalyzerPage() {
    const router = useRouter();
    const [resumeText, setResumeText] = useState('');
    const [targetRole, setTargetRole] = useState('Software Developer');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resumeText.trim()) {
            setError('Please enter or paste your resume content.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token') || 'mock-jwt-token-12345';
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const res = await fetch(`${API_BASE}/api/resume/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ resumeText, targetRole })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setAnalysis(data.analysis);
            } else {
                setError(data.error || 'Failed to analyze resume.');
            }
        } catch (err) {
            setError('Network error or server unavailable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px 40px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={() => router.push('/dashboard')} 
                    style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                >
                    &larr; Back to Dashboard
                </button>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>AI Resume Analyzer & Skill Matcher 📝</h1>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px', fontWeight: '500' }}>
                Paste your resume text below to evaluate skill gaps, get an overall score, and prepare tailored interview paths.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: '24px' }}>
                {/* Input Form */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <form onSubmit={handleAnalyze}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Target Role</label>
                            <input 
                                type="text" 
                                value={targetRole} 
                                onChange={(e) => setTargetRole(e.target.value)} 
                                placeholder="e.g. Full Stack Developer, Data Scientist"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Paste Resume Text Content</label>
                            <textarea 
                                rows="12" 
                                value={resumeText} 
                                onChange={(e) => setResumeText(e.target.value)} 
                                placeholder="Paste your resume summary, education, projects, and skill sets here..."
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', lineHeight: '1.5' }}
                            />
                        </div>

                        {error && <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '15px', fontWeight: '600' }}>{error}</p>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                        >
                            {loading ? 'Analyzing with Gemini AI...' : '✨ Analyze Resume & Check Skills'}
                        </button>
                    </form>
                </div>

                {/* Results Display */}
                {analysis && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Analysis Scorecard</h2>
                            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '16px', border: '1px solid #bfdbfe' }}>
                                Score: {analysis.overallScore}/100
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                            <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>Level: {analysis.experienceLevel}</span>
                            <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>Fit: {analysis.recommendedRole}</span>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#065f46', marginBottom: '6px' }}>✅ Detected Skills:</h4>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {analysis.detectedSkills?.map((skill, idx) => (
                                    <span key={idx} style={{ background: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#991b1b', marginBottom: '6px' }}>⚠️ Missing / Suggested Skills:</h4>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {analysis.missingSkills?.map((skill, idx) => (
                                    <span key={idx} style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>AI Career Critique & Tips:</h4>
                            <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: '1.5' }}>{analysis.critique}</p>
                        </div>

                        <button 
                            onClick={() => router.push('/interview')} 
                            style={{ marginTop: 'auto', padding: '10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                        >
                            Start Mock Interview based on Skills →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}