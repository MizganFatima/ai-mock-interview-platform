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
        <div style={{ backgroundColor: '#fafafa', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            
            {/* Top Security & RBAC Status Bar */}
            <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '6px 20px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>● Encrypted JWT Auth Active</span>
                    <span>|</span>
                    <span>Role-Based Access Control (RBAC): Student Role</span>
                </div>
                <div>Secure Session Active</div>
            </div>

            {/* Main Navigation Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>
                        AI
                    </div>
                    <div>
                        <span style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', letterSpacing: '-0.3px' }}>AI Mock Interview Platform</span>
                        <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>Pro Enterprise</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    
                    {/* TYPEABLE & SEARCHABLE LANGUAGE INPUT BOX */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '5px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px' }}>🌐</span>
                        <input 
                            type="text"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            placeholder="Type language..."
                            style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: '700', color: '#334155', width: '100px', outline: 'none' }}
                        />
                    </div>

                    <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Candidate Workspace</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Student Developer Role</div>
                    </div>

                    <button 
                        onClick={() => router.push('/interview')}
                        style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                    >
                        History
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Workspace Content */}
            <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 15px', width: '100%', boxSizing: 'border-box' }}>
                
                {/* HERO BANNER SECTION */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    
                    <div style={{ width: '100%', maxWidth: '350px', borderRadius: '16px', overflow: 'hidden', height: '190px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                            alt="Professional Candidate Interview Setting" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                            <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                            ✓ CERTIFIED AI EVALUATOR PLATFORM
                        </div>
                        
                        <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: '1.25', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
                            Real-Time AI-Powered Mock Interview & Skill Evaluator
                        </h1>
                        
                        <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', margin: '0 0 18px 0' }}>
                            Practice technical Q&A in <strong style={{ color: '#4f46e5' }}>{selectedLanguage || 'English'}</strong> with adaptive difficulty adjustments, dynamic feedback, and company recruiter simulators.
                        </p>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => router.push('/interview')}
                                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}
                            >
                                Start Interview 🚀
                            </button>
                            <button 
                                onClick={() => router.push('/arena')}
                                style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Coding Arena
                            </button>
                        </div>
                    </div>

                    <div style={{ width: '100%', maxWidth: '350px', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '42px', fontWeight: '900', color: '#4f46e5', lineHeight: '1', margin: '0 0 6px 0' }}>
                            {readinessScore}%
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Overall Readiness Score
                        </div>
                        <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                            Status: Excellent
                        </div>
                    </div>
                </section>

                {/* QUICK ANALYTICS METRICS STRIP */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '36px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Mock Sessions</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>24 Sessions</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Avg AI Feedback</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>88.5 / 100</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Challenges Solved</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#2563eb', marginTop: '4px' }}>18 Code Tasks</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Skill Gaps Resolved</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#9333ea', marginTop: '4px' }}>12 Topics</div>
                    </div>
                </section>

                {/* 6 CORE PLATFORM ENGINES / ASSIGNED TASKS */}
                <section style={{ marginBottom: '44px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                            Core Platform Modules (Assigned Tasks)
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                            Explore all six integrated technical modules designed for professional evaluation.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        <div onClick={() => router.push('/interview')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎙️</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', margin: '0 0 6px 0' }}>1. Adaptive Interview Engine</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Dynamic Q&A difficulty adjustment based on answers, 1-min timer, and voice/text evaluation in {selectedLanguage || 'English'}.</p>
                        </div>

                        <div onClick={() => router.push('/readiness')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', margin: '0 0 6px 0' }}>2. AI Placement Readiness Engine</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Combines resume analysis and assessment data to calculate scores and roadmap recommendations.</p>
                        </div>

                        <div onClick={() => router.push('/recruiter')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>💼</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', margin: '0 0 6px 0' }}>3. AI Recruiter Simulator</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Simulate corporate interviews tailored for Google, Amazon, Microsoft, TCS, and Infosys.</p>
                        </div>

                        <div onClick={() => router.push('/arena')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚡</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', margin: '0 0 6px 0' }}>4. Peer Challenge Arena</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Algorithmic challenges, code execution, leaderboards, rank badges, and streak tracking.</p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔐</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>5. Enterprise Security & Auth</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Account lockout protection, active device session tracking, and encrypted JWT tokens.</p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛡️</div>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>6. Role-Based Access Control</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>Tiered permissions for Student, Mentor, and Administrator roles securing API routes and UI.</p>
                        </div>
                    </div>
                </section>

                {/* FEATURED PRACTICE TOPICS & QUESTIONS SECTION */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', marginBottom: '44px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                                💡 Featured Technical Interview Questions Workspace
                            </h3>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                Curated technical challenges for full stack, software development, and data science tracks.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
                            {['Software Engineering', 'Data Science', 'Full Stack'].map((domain) => (
                                <button
                                    key={domain}
                                    onClick={() => setActiveDomain(domain)}
                                    style={{
                                        border: 'none',
                                        padding: '6px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        backgroundColor: activeDomain === domain ? '#ffffff' : 'transparent',
                                        color: activeDomain === domain ? '#4f46e5' : '#64748b',
                                        boxShadow: activeDomain === domain ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        {practiceQuestions.map((q) => (
                            <div key={q.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '14px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>{q.domain}</span>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: q.difficulty === 'Hard' ? '#ef4444' : '#f59e0b', background: q.difficulty === 'Hard' ? '#fee2e2' : '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>{q.difficulty}</span>
                                    </div>
                                    <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>{q.title}</h4>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.4' }}>{q.desc}</p>
                                </div>
                                <button 
                                    onClick={() => router.push('/interview')}
                                    style={{ background: '#ffffff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                                >
                                    Solve Question →
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RECENT MOCK INTERVIEW ACTIVITY HISTORY */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', marginBottom: '44px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
                        📋 Recent Mock Interview Sessions
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Software Engineer — Async JavaScript & Closures</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Language: {selectedLanguage || 'English'} | Time: 15 Mins</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#16a34a' }}>94 / 100</div>
                                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>Passed</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Full Stack Developer — React Fiber Reconciliation</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Language: English | Time: 20 Mins</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#2563eb' }}>89 / 100</div>
                                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700' }}>Completed</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', marginBottom: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>
                            Frequently Asked Questions
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Got questions? We've got answers.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
                        {faqList.map((item, index) => (
                            <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' }}>
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '13px', color: '#0f172a', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <span>{item.q}</span>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#4f46e5' }}>{openFaq === index ? '−' : '+'}</span>
                                </button>
                                {openFaq === index && (
                                    <div style={{ padding: '0 18px 14px 18px', fontSize: '12px', color: '#475569', lineHeight: '1.5', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '20px 20px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: '#0f172a' }}>AI-Powered Mock Interview Platform & Skill Evaluator © 2026</p>
                <p style={{ margin: 0 }}>Professional Web Development Internship Submission</p>
            </footer>

        </div>
    );
}