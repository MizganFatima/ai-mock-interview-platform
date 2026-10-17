'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Store user session for demo/testing
        localStorage.setItem('token', 'demo-token-xyz-12345');
        localStorage.setItem('user', JSON.stringify({ email, name: name || 'Mizgan Fatima' }));

        if (isForgot) {
            setMessage ('Password reset successful! Please login.');
            setIsForgot(false);
            setIsLogin(true);
        } else if (isLogin) {
            router.push('/dashboard');
        } else {
            alert('Registration successful! Redirecting to dashboard...');
            router.push('/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #dbeafe, #eff6ff, #ffffff)', fontFamily: 'sans-serif' }}>
            {/* Navbar Header */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div 
                    onClick={() => { setIsLogin(false); setIsForgot(false); setError(''); setMessage(''); }} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '18px', color: '#1e293b', cursor: 'pointer' }}
                >
                    <span style={{ background: '#2563eb', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '14px' }}>AI</span>
                    MockInterview <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>AI POWERED</span>
                </div>
                
                <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontSize: '14px', color: '#475569' }}>
                    <span onClick={() => alert("Features: AI-powered technical mock interviews, real-time feedback, and dynamic question generation!")} style={{ cursor: 'pointer', fontWeight: '500' }}>Features</span>
                    <span onClick={() => alert("How It Works: Register your account, select your target tech stack, complete the interview, and check your score report!")} style={{ cursor: 'pointer', fontWeight: '500' }}>How It Works</span>
                    <span onClick={() => alert("Contact Support: Reach out at support@aimockinterview.com for any queries.")} style={{ cursor: 'pointer', fontWeight: '500' }}>Contact</span>
                    
                    <button 
                        onClick={() => { setIsLogin(true); setIsForgot(false); setError(''); setMessage(''); }} 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500', color: '#1e293b', fontSize: '14px' }}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => { setIsLogin(false); setIsForgot(false); setError(''); setMessage(''); }} 
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Get Started →
                    </button>
                </div>
            </nav>

            {/* Main Form Container */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
                <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>AI</span>
                        <h2 style={{ marginTop: '10px', fontSize: '24px', color: '#0f172a' }}>
                            {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Get Started')}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>
                            {isForgot ? 'Enter your email to reset password' : (isLogin ? 'Login to your account to continue practicing' : 'Create your account to begin practicing')}
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && !isForgot && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    placeholder="Mizgan Fatima" 
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="you@example.com" 
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                            />
                        </div>

                        {!isForgot ? (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Password</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="••••••••" 
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                />
                            </div>
                        ) : (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                    placeholder="Enter new password" 
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                        >
                            {isForgot ? 'Update Password' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                        {!isForgot ? (
                            <>
                                {isLogin ? (
                                    <p>Don't have an account? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}>Sign up</span></p>
                                ) : (
                                    <p>Already have an account? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}>Sign in</span></p>
                                )}
                                {isLogin && (
                                    <p style={{ marginTop: '8px' }}><span style={{ color: '#ef4444', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsForgot(true); setError(''); setMessage(''); }}>Forgot Password?</span></p>
                                )}
                            </>
                        ) : (
                            <p><span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsForgot(false); setIsLogin(true); setError(''); setMessage(''); }}>Back to Login</span></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}