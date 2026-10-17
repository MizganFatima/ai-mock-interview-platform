'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [readinessScore, setReadinessScore] = useState(92);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [activeDomain, setActiveDomain] = useState('Software Engineering');
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            router.push('/auth');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth');
    };

    const practiceQuestions = [
        { id: 1, title: 'Closures & Event Loop Architecture', domain: 'JavaScript / Async', difficulty: 'Medium', desc: 'Explain microtask queue vs macrotask execution order in V8 engine.' },
        { id: 2, title: 'Server Components & Virtual DOM', domain: 'React / Next.js', difficulty: 'Hard', desc: 'How React Fiber handles reconciliation, hydration, and hook memory retention.' },
        { id: 3, title: 'Database Indexing & B-Trees', domain: 'DBMS / SQL', difficulty: 'Hard', desc: 'Comparing B-Tree indexing vs Hash indexing performance in high concurrency.' },
        { id: 4, title: 'REST vs GraphQL API Design', domain: 'Backend System', difficulty: 'Medium', desc: 'Over-fetching vs under-fetching and schema resolution strategies.' }
    ];

    const faqList = [
        { q: 'How does the AI evaluate my answers?', a: 'The AI engine uses advanced natural language processing to analyze your speech or text responses against benchmark criteria, scoring you out of 100 with actionable feedback.' },
        { q: 'Can I upload my resume in PDF format?', a: 'Yes! The AI Placement Readiness module supports PDF and text resume uploads to automatically generate targeted interview questions based on your unique work history.' },
        { q: 'Is there a free tier available for practice?', a: 'Yes, the platform includes a starter tier with full access to core mock interviews, coding challenges, and readiness tracking.' }
    ];

    return (
        <div style={{ backgroundColor: '#fafafa', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
            
            {/* Top Security Status Bar */}
            <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '6px 15px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>● Encrypted JWT Auth Active</span>
                    <span>|</span>
                    <span>RBAC: Student Role</span>
                </div>
                <div>Secure Session Active</div>
            </div>

            {/* Navigation Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>
                        AI
                    </div>
                    <div>
                        <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>AI Mock Interview</span>
                        <span style={{ fontSize: '10px', background: '#e0e7ff', color: '#4338ca', fontWeight: '700', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>Pro</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '12px' }}>🌐</span>
                        <input 
                            type="text"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            placeholder="Language"
                            style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: '700', color: '#334155', width: '80px', outline: 'none' }}
                        />
                    </div>

                    <button 
                        onClick={() => router.push('/interview')}
                        style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                    >
                        History
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Workspace Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px', width: '100%', boxSizing: 'border-box' }}>
                
                {/* HERO BANNER SECTION WITH WORKING LAPTOP DEV IMAGE */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                    
                    <div style={{ width: '100%', maxWidth: '320px', borderRadius: '12px', overflow: 'hidden', height: '180px', border: '1px solid #cbd5e1' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                            alt="Developer Working on Laptop" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '3px 10px', borderRadius: '16px', fontSize: '10px', fontWeight: '700', marginBottom: '10px' }}>
                            <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                            ✓ CERTIFIED AI EVALUATOR PLATFORM
                        </div>
                        
                        <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3', margin: '0 0 8px 0' }}>
                            Real-Time AI-Powered Mock Interview & Skill Evaluator
                        </h1>
                        
                        <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.4', margin: '0 0 14px 0' }}>
                            Practice technical Q&A in <strong style={{ color: '#4f46e5' }}>{selectedLanguage || 'English'}</strong> with adaptive difficulty adjustments and dynamic feedback.
                        </p>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => router.push('/interview')}
                                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Start Interview 🚀
                            </button>
                            <button 
                                onClick={() => router.push('/arena')}
                                style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Coding Arena
                            </button>
                        </div>
                    </div>

                    <div style={{ width: '100%', maxWidth: '320px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: '#4f46e5', lineHeight: '1', margin: '0 0 4px 0' }}>
                            {readinessScore}%
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Overall Readiness Score
                        </div>
                        <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '700' }}>
                            Status: Excellent
                        </div>
                    </div>
                </section>

                {/* ANALYTICS STRIP */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>MOCK SESSIONS</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>24</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>AVG AI SCORE</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#16a34a', marginTop: '2px' }}>88.5</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>TASKS SOLVED</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#2563eb', marginTop: '2px' }}>18</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>SKILL GAPS</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#9333ea', marginTop: '2px' }}>12</div>
                    </div>
                </section>

                {/* 6 CORE PLATFORM ENGINES */}
                <section style={{ marginBottom: '32px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ marginBottom: '14px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                            Core Platform Modules
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Integrated technical modules for evaluation.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                        <div onClick={() => router.push('/interview')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎙️</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', margin: '0 0 4px 0' }}>1. Adaptive Interview Engine</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Dynamic Q&A difficulty adjustment and feedback in {selectedLanguage || 'English'}.</p>
                        </div>

                        <div onClick={() => router.push('/readiness')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>📊</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', margin: '0 0 4px 0' }}>2. AI Placement Readiness</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Resume analysis and score recommendations.</p>
                        </div>

                        <div onClick={() => router.push('/recruiter')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>💼</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', margin: '0 0 4px 0' }}>3. AI Recruiter Simulator</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Corporate interviews for Google, Amazon, TCS, etc.</p>
                        </div>

                        <div onClick={() => router.push('/arena')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>⚡</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', margin: '0 0 4px 0' }}>4. Peer Challenge Arena</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Coding challenges and leaderboard ranks.</p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>🔐</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>5. Enterprise Security</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Account lockout and encrypted JWT tokens.</p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>🛡️</div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>6. Role Access Control</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>Student and Mentor API permissions.</p>
                        </div>
                    </div>
                </section>

                {/* QUESTIONS SECTION */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '32px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                            💡 Featured Technical Interview Questions
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {['Software Engineering', 'Data Science', 'Full Stack'].map((domain) => (
                                <button
                                    key={domain}
                                    onClick={() => setActiveDomain(domain)}
                                    style={{
                                        border: 'none',
                                        padding: '5px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        backgroundColor: activeDomain === domain ? '#e0e7ff' : '#f1f5f9',
                                        color: activeDomain === domain ? '#4f46e5' : '#64748b'
                                    }}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                        {practiceQuestions.map((q) => (
                            <div key={q.id} style={{ border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#4f46e5', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px' }}>{q.domain}</span>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: q.difficulty === 'Hard' ? '#ef4444' : '#f59e0b', background: q.difficulty === 'Hard' ? '#fee2e2' : '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>{q.difficulty}</span>
                                    </div>
                                    <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>{q.title}</h4>
                                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.4' }}>{q.desc}</p>
                                </div>
                                <button 
                                    onClick={() => router.push('/interview')}
                                    style={{ background: '#ffffff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                                >
                                    Solve Question →
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                        {faqList.map((item, index) => (
                            <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '12px', color: '#0f172a', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <span>{item.q}</span>
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>{openFaq === index ? '−' : '+'}</span>
                                </button>
                                {openFaq === index && (
                                    <div style={{ padding: '0 14px 12px 14px', fontSize: '11px', color: '#475569', lineHeight: '1.4', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 15px', textAlign: 'center', color: '#64748b', fontSize: '11px', width: '100%', boxSizing: 'border-box' }}>
                <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#0f172a' }}>AI-Powered Mock Interview Platform © 2026</p>
                <p style={{ margin: 0 }}>ElevanceSkills Internship Submission</p>
            </footer>

        </div>
    );
}