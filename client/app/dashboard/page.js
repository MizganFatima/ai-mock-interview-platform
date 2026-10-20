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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const platformFeatures = [
        { 
            id: 'interview',
            title: 'Adaptive AI Interview Engine', 
            icon: '🎙️', 
            desc: 'Dynamic technical interview that automatically adjusts question difficulty based on your answers.',
            link: '/interview'
        },
        { 
            id: 'readiness',
            title: 'Placement Readiness & Roadmap', 
            icon: '📊', 
            desc: 'Calculates overall readiness score with resume parsing and personalized technology roadmaps.',
            link: '/readiness'
        },
        { 
            id: 'recruiter',
            title: 'Company Recruiter Simulator', 
            icon: '💼', 
            desc: 'Simulate hiring rounds for Google, Amazon, Microsoft, TCS, and Infosys with company criteria.',
            link: '/recruiter'
        },
        { 
            id: 'arena',
            title: 'Peer Challenge Arena', 
            icon: '⚡', 
            desc: 'Gamified interview challenges, live coding leaderboards, rank badges, and streak tracking.',
            link: '/arena'
        },
        { 
            id: 'resume',
            title: 'AI Resume Analyzer', 
            icon: '📄', 
            desc: 'Evaluate skill gaps, optimize CV keywords, and get instant professional resume feedback.',
            link: '/resume-analyzer'
        },
        { 
            id: 'report',
            title: 'PDF Performance Scorecard', 
            icon: '📑', 
            desc: 'Generate, view, and download comprehensive printable PDF analytics and evaluation reports.',
            link: '/report'
        },
        { 
            id: 'security',
            title: 'Enterprise Security & Sessions', 
            icon: '🔐', 
            desc: 'Account lockout protection, active device tracking, encrypted JWT auth, and security logs.',
            link: '/auth'
        },
        { 
            id: 'rbac',
            title: 'Role & Permission Controls', 
            icon: '🛡️', 
            desc: 'Multi-role ecosystem separating Student, Mentor, and Administrator portal access.',
            link: '/admin'
        }
    ];

    const pricingPlans = [
        {
            name: 'Starter Tier',
            price: '₹0',
            period: 'Forever Free',
            desc: 'Perfect for foundational practice and initial skill testing.',
            features: ['3 Adaptive Mock Sessions', 'Basic AI Performance Feedback', 'Standard Practice Questions', 'Community Support'],
            buttonText: 'Current Plan',
            popular: false
        },
        {
            name: 'Pro Candidate',
            price: '₹10',
            period: 'per month',
            desc: 'Unlimited access to all AI engines and company simulators.',
            features: ['Unlimited Mock Interviews', 'Google/Amazon Recruiter Simulators', 'AI Career Improvement Roadmap', 'Peer Arena & Leaderboards', 'Priority Evaluation'],
            buttonText: 'Upgrade to Pro 🚀',
            popular: true
        },
        {
            name: 'Enterprise / Institution',
            price: '₹99',
            period: 'per month',
            desc: 'Full mentorship support and deep multi-role analytics.',
            features: ['Everything in Pro', 'Mentor Performance Reviews', 'Role-Based Access Control Panel', 'Dedicated Placement Analytics', 'Resume Deep Scan'],
            buttonText: 'Get Enterprise',
            popular: false
        }
    ];

    const faqList = [
        { q: 'How does the AI Engine evaluate candidate answers?', a: 'The AI uses real-time context analysis to grade communication, technical depth, and problem-solving logic out of 100.' },
        { q: 'Can I practice company-specific interview rounds?', a: 'Yes! Select from company profiles like Google, Amazon, Microsoft, TCS, and Infosys to align with their actual hiring patterns.' },
        { q: 'Is the platform mobile responsive?', a: 'Absolutely! The entire dashboard, interview workspace, and coding arena are optimized for mobile and desktop screens.' }
    ];

    return (
        <div style={{ backgroundColor: '#fafafa', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            
            {/* Top Security Bar */}
            <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '6px 20px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>● Encrypted JWT Auth Active</span>
                    <span>|</span>
                    <span>Role-Based Workspace Active</span>
                </div>
                <div>Secure Candidate Session</div>
            </div>

            {/* Navigation Header */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
                    <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>
                        AI
                    </div>
                    <div>
                        <span style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', letterSpacing: '-0.3px' }}>AI Mock Interview</span>
                        <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', marginLeft: '6px' }}>Pro</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <span onClick={() => scrollToSection('home')} style={{ fontSize: '14px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>Home</span>
                    <span onClick={() => scrollToSection('engines')} style={{ fontSize: '14px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>Domains</span>
                    <span onClick={() => scrollToSection('engines')} style={{ fontSize: '14px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>Features</span>
                    <span onClick={() => scrollToSection('pricing')} style={{ fontSize: '14px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>Pricing</span>
                    <span onClick={() => scrollToSection('faq')} style={{ fontSize: '14px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>Contact</span>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '5px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px' }}>🌐</span>
                        <input 
                            type="text"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            placeholder="Language"
                            style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: '700', color: '#334155', width: '80px', outline: 'none' }}
                        />
                    </div>

                    <button 
                        onClick={handleLogout}
                        style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main id="home" style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px', width: '100%', boxSizing: 'border-box' }}>
                
                {/* HERO BANNER */}
                <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                    
                    <div style={{ borderRadius: '16px', overflow: 'hidden', height: '200px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', boxSizing: 'border-box' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                            alt="Developer Working on Laptop" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                            <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                            ✓ CERTIFIED AI EVALUATOR PLATFORM
                        </div>
                        
                        <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '900', color: '#0f172a', lineHeight: '1.25', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
                            Real-Time AI-Powered Mock Interview & Skill Evaluator
                        </h1>
                        
                        <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', margin: '0 0 18px 0' }}>
                            Practice technical Q&A in <strong style={{ color: '#4f46e5' }}>{selectedLanguage || 'English'}</strong> with dynamic difficulty adjustments, company recruiter simulators, and AI readiness roadmaps.
                        </p>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => router.push('/interview')}
                                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}
                            >
                                Start Adaptive Interview 🚀
                            </button>
                            <button 
                                onClick={() => router.push('/arena')}
                                style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Peer Arena ⚡
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '42px', fontWeight: '900', color: '#4f46e5', lineHeight: '1', margin: '0 0 6px 0' }}>
                            {readinessScore}%
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Placement Readiness Score
                        </div>
                        <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                            Status: Placement Ready
                        </div>
                    </div>
                </section>

                {/* ANALYTICS STRIP */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '36px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Mock Sessions</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>24 Sessions</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Avg AI Feedback</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>88.5 / 100</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Challenges Solved</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#2563eb', marginTop: '4px' }}>18 Tasks</div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Skill Gaps Resolved</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#9333ea', marginTop: '4px' }}>12 Topics</div>
                    </div>
                </section>

                {/* PLATFORM MODULES / ENGINES */}
                <section id="engines" style={{ marginBottom: '44px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                            Core Platform Engines
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                            Select any module below to launch its interactive workspace:
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
                        {platformFeatures.map((feat) => (
                            <div 
                                key={feat.id}
                                onClick={() => router.push(feat.link)}
                                style={{ 
                                    background: '#ffffff', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '16px', 
                                    padding: '22px', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#4f46e5';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.transform = 'translateY(0px)';
                                }}
                            >
                                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{feat.icon}</div>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', margin: '0 0 6px 0' }}>{feat.title}</h3>
                                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PRICING PLANS SECTION */}
                <section id="pricing" style={{ marginBottom: '48px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>
                            Flexible Membership Plans
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Select the right tier to supercharge your technical interview preparation.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
                        {pricingPlans.map((plan, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    background: '#ffffff', 
                                    border: plan.popular ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
                                    borderRadius: '20px', 
                                    padding: '24px', 
                                    position: 'relative',
                                    boxShadow: plan.popular ? '0 10px 30px rgba(79, 70, 229, 0.12)' : '0 4px 12px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {plan.popular && (
                                    <span style={{ position: 'absolute', top: '-12px', right: '20px', background: '#4f46e5', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                                        Most Popular
                                    </span>
                                )}

                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{plan.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>{plan.price}</span>
                                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>/ {plan.period}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px 0', lineHeight: '1.4' }}>{plan.desc}</p>

                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                        {plan.features.map((item, fIdx) => (
                                            <li key={fIdx} style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: '#16a34a', fontWeight: '800' }}>✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => router.push('/interview')}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px 16px', 
                                        borderRadius: '10px', 
                                        fontWeight: '700', 
                                        fontSize: '13px', 
                                        cursor: 'pointer',
                                        border: plan.popular ? 'none' : '1px solid #cbd5e1',
                                        backgroundColor: plan.popular ? '#4f46e5' : '#ffffff',
                                        color: plan.popular ? '#ffffff' : '#334155'
                                    }}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', marginBottom: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>
                            Frequently Asked Questions
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Got questions? We have answers.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                        {faqList.map((item, index) => (
                            <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' }}>
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{ width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '14px', color: '#0f172a', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <span>{item.q}</span>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#4f46e5' }}>{openFaq === index ? '−' : '+'}</span>
                                </button>
                                {openFaq === index && (
                                    <div style={{ padding: '0 20px 16px 20px', fontSize: '13px', color: '#475569', lineHeight: '1.5', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '25px 20px', textAlign: 'center', color: '#64748b', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: '#0f172a' }}>AI-Powered Mock Interview Platform & Skill Evaluator © 2026</p>
                <p style={{ margin: 0 }}>Professional Candidate Evaluation System</p>
            </footer>

        </div>
    );
}