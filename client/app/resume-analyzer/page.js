'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Dashboard navigation ke liye

export default function ResumeAnalyzerPage() {
    const router = useRouter();
    const [targetRole, setTargetRole] = useState('Software Developer');
    const [resumeText, setResumeText] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('targetRole', targetRole);
            if (pdfFile) {
                formData.append('resumePdf', pdfFile);
            } else {
                formData.append('resumeText', resumeText);
            }

            const response = await fetch('http://localhost:5000/api/resume/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.analysis);
            } else {
                setError(data.error || 'Failed to analyze resume.');
            }
        } catch (err) {
            setError('Network error: Unable to connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to style score colors dynamically
    const getScoreColor = (score) => {
        if (score >= 80) return '#16a34a'; // Green
        if (score >= 50) return '#d97706'; // Yellow/Orange
        return '#dc2626'; // Red
    };

    return (
        <div style={{ maxWidth: '850px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            
            {/* Top Navigation Bar with Back to Dashboard Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', pb: '16px', paddingBottom: '12px' }}>
                <button 
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    ← Back to Dashboard
                </button>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#0f172a' }}>✨ AI Resume Analyzer & Skill Checker</h2>
            </div>

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                    <label style={{ fontWeight: '600', color: '#334155' }}>Target Role:</label>
                    <input 
                        type="text" 
                        value={targetRole} 
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Software Developer, Frontend Engineer"
                        style={{ width: '100%', padding: '10px 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: '600', color: '#334155' }}>Upload Resume PDF:</label>
                    <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        style={{ display: 'block', marginTop: '6px', padding: '6px', width: '100%' }}
                    />
                </div>

                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#94a3b8', fontSize: '14px' }}>OR</div>

                <div>
                    <label style={{ fontWeight: '600', color: '#334155' }}>Paste Resume Text Content:</label>
                    <textarea 
                        rows="6"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume summary, education, projects here..."
                        style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                    />
                </div>

                {error && <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>{error}</div>}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ background: loading ? '#93c5fd' : '#2563eb', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                >
                    {loading ? 'Analyzing with Gemini AI...' : '✨ Analyze Resume & Check Skills'}
                </button>
            </form>

            {/* Analysis Result Box */}
            {result && (
                <div style={{ marginTop: '32px', background: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginTop: 0, color: '#0f172a' }}>Analysis Result</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155' }}>ATS Score:</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', background: getScoreColor(result.score), padding: '4px 16px', borderRadius: '20px' }}>
                            {result.score}/100
                        </span>
                    </div>

                    <div style={{ marginTop: '16px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        <strong>Feedback & Actionable Recommendations:</strong>
                        <div style={{ marginTop: '8px', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            {result.feedback}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}