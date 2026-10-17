'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                
                <h1 style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Interview Preparation & Placement Platform
                </h1>
                <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '40px' }}>
                    Master your technical skills with adaptive AI mock interviews, recruiter simulators, and peer challenges.
                </p>

                {/* Grid of Modules / Tasks */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
                    
                    {/* Task 1: Adaptive Interview */}
                    <div onClick={() => router.push('/interview')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: '0.2s' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>🚀 Adaptive Interview Engine</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Dynamic AI interview that scales difficulty based on your answers with real-time feedback.</p>
                    </div>

                    {/* Task 2: Readiness Engine */}
                    <div onClick={() => router.push('/readiness')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>📊 Placement Readiness</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Analyze your skill gaps, track readiness score, and get personalized improvement roadmaps.</p>
                    </div>

                    {/* Task 3: Recruiter Simulator */}
                    <div onClick={() => router.push('/recruiter')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>🏢 AI Recruiter Simulator</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Experience company-specific interview styles like Google, Amazon, TCS, and startups.</p>
                    </div>

                    {/* Task 4: Peer Arena */}
                    <div onClick={() => router.push('/arena')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>🏆 Peer Challenge Arena</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Compete in weekly technical challenges, check leaderboards, and earn performance badges.</p>
                    </div>

                    {/* Task 3 / Analytics Dashboard */}
                    <div onClick={() => router.push('/dashboard')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>📈 Performance Dashboard</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>View complete history, score analytics, and interview progress metrics.</p>
                    </div>

                    {/* Task 5 & 6: Authentication */}
                    <div onClick={() => router.push('/auth/login')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '10px' }}>🔒 Secure Login / Portal</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Access authenticated secure portal with role-based session controls.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}