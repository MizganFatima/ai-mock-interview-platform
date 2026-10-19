'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
    const router = useRouter();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token') || 'mock-jwt-token-12345';
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                const res = await fetch(`${API_BASE}/api/report/generate-report`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setReport(data.report);
                }
            } catch (err) {
                console.log('Error fetching report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const handleDownloadPDF = () => {
        window.print();
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>
                Loading Performance Report...
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background-color: #fff !important;
                    }
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }} className="no-print">
                <button 
                    onClick={() => router.push('/dashboard')} 
                    style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                >
                    &larr; Back to Dashboard
                </button>
                <button 
                    onClick={handleDownloadPDF} 
                    style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                >
                    📥 Download Performance PDF
                </button>
            </div>

            {/* Printable Scorecard Container */}
            <div style={{ maxWidth: '800px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 4px 0' }}>AI Interview & Placement Report</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '500' }}>Era University, Lucknow — BCA 5th Semester Evaluation</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#475569', margin: '0 0 2px 0' }}>Date: {report?.dateGenerated}</p>
                        <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>Verified Academic Project</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 2px 0', fontWeight: '600' }}>Candidate Name:</p>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '700' }}>{report?.studentName}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 2px 0', fontWeight: '600' }}>Target Role & Domain:</p>
                        <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '700' }}>{report?.targetRole} ({report?.primaryTopic})</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '20px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '25px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1d4ed8', margin: '0 0 4px 0' }}>Overall Assessment Score</h3>
                        <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: '600' }}>Status: {report?.evaluationStatus}</p>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#1d4ed8', background: '#fff', padding: '10px 20px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                        {report?.latestScore}/100
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>💬 Detailed AI Interview Critique & Feedback:</h4>
                    <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', margin: 0 }}>
                        {report?.aiFeedback}
                    </p>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    <span>Total Evaluated Sessions: {report?.totalSessions}</span>
                    <span>System Generated via Google Gemini AI</span>
                </div>
            </div>
        </div>
    );
}