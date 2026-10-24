'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isLoginOtpStep, setIsLoginOtpStep] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Send Email, 2: Enter OTP & New Password
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                if (!isLoginOtpStep) {
                    // Step 1: Request Login & Send OTP
                    const res = await fetch(`${API_BASE}/api/auth/login-request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();

                    if (res.ok && data.success) {
                        alert(data.message || 'OTP sent to your registered email!');
                        setIsLoginOtpStep(true);
                    } else {
                        alert(data.error || data.message || 'Invalid credentials.');
                    }
                } else {
                    // Step 2: Verify Login OTP
                    const res = await fetch(`${API_BASE}/api/auth/verify-login-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, otp })
                    });
                    const data = await res.json();

                    if (res.ok && data.success) {
                        localStorage.setItem('token', data.token || 'jwt-token-authenticated');
                        localStorage.setItem('user', JSON.stringify(data.user || { email }));
                        alert(data.message || 'Login successful!');
                        router.push('/dashboard');
                    } else {
                        alert(data.error || data.message || 'Invalid OTP.');
                    }
                }
            } else {
                // Sign Up Route
                const res = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    alert(data.message || 'Account created successfully! Please login.');
                    setIsLogin(true);
                    setPassword('');
                } else {
                    alert(data.error || data.message || 'Registration failed.');
                }
            }
        } catch (err) {
            alert('Unable to connect to the server. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (step === 1) {
                const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                
                if (res.ok && data.success) {
                    alert(data.message || 'OTP sent successfully to your email!');
                    setStep(2);
                } else {
                    alert(data.error || data.message || 'Failed to send OTP.');
                }
            } else {
                const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp, newPassword })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    alert(data.message || 'Password reset successful!');
                    setIsForgotPassword(false);
                    setStep(1);
                    setPassword('');
                    setNewPassword('');
                    setOtp('');
                } else {
                    alert(data.error || data.message || 'Invalid OTP.');
                }
            }
        } catch (err) {
            alert('Server error during password reset process.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #dbeafe, #eff6ff, #ffffff)', fontFamily: 'sans-serif' }}>
            {/* Top Navbar Header */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div 
                    onClick={() => { setIsLogin(false); setIsForgotPassword(false); setIsLoginOtpStep(false); }} 
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
                        onClick={() => { setIsLogin(true); setIsForgotPassword(false); setIsLoginOtpStep(false); }} 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500', color: '#1e293b', fontSize: '14px' }}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => { setIsLogin(false); setIsForgotPassword(false); setIsLoginOtpStep(false); }} 
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Get Started →
                    </button>
                </div>
            </nav>

            {/* Main Center Auth Container */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
                <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>AI</span>
                        <h2 style={{ marginTop: '10px', fontSize: '24px', color: '#0f172a' }}>
                            {isForgotPassword ? 'Reset Password' : (isLogin ? (isLoginOtpStep ? 'Verify Login OTP' : 'Welcome Back') : 'Get Started')}
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>
                            {isForgotPassword ? 'Follow the steps to recover your account' : (isLogin ? (isLoginOtpStep ? 'Enter the 6-digit OTP sent to your email' : 'Login to your account to continue practicing') : 'Create your account to begin practicing')}
                        </p>
                    </div>

                    {isForgotPassword ? (
                        <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {step === 1 ? (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Enter your registered email"
                                        required 
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                    />
                                </div>
                            ) : (<>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Enter 6-digit OTP</label>
                                        <input 
                                            type="text" 
                                            value={otp} 
                                            onChange={(e) => setOtp(e.target.value)} 
                                            placeholder="123456"
                                            maxLength="6"
                                            required 
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none', letterSpacing: '2px', fontWeight: 'bold' }} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>New Password</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <input 
                                                type={showNewPassword ? 'text' : 'password'} 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                placeholder="Enter new password"
                                                required 
                                                style={{ width: '100%', padding: '10px 35px 10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                            >
                                                {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Please wait...' : (step === 1 ? 'Send Reset OTP' : 'Reset Password')}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <span 
                                    style={{ color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }} 
                                    onClick={() => { setIsForgotPassword(false); setStep(1); }}
                                >
                                    Back to Login
                                </span>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {!isLogin && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Enter your full name"
                                        required 
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="name@example.com"
                                    required 
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                />
                            </div>

                            {(!isLogin || !isLoginOtpStep) && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>Password</label>
                                        {isLogin && (
                                            <span 
                                                style={{ color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }} 
                                                onClick={() => { setIsForgotPassword(true); setStep(1); }}
                                            >
                                                Forgot Password?
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            placeholder="••••••••"
                                            required 
                                            style={{ width: '100%', padding: '10px 35px 10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLogin && isLoginOtpStep && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '5px', color: '#334155' }}>Enter 6-digit OTP</label>
                                    <input 
                                        type="text" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value)} 
                                        placeholder="123456"
                                        maxLength="6"
                                        required 
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box', outline: 'none', letterSpacing: '2px', fontWeight: 'bold' }} 
                                    />
                                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Check your email or backend terminal for the OTP code.</p>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Please wait...' : (isLogin ? (isLoginOtpStep ? 'Verify OTP & Login' : 'Proceed & Send OTP') : 'Sign Up')}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                                <span 
                                    style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} 
                                    onClick={() => { 
                                        setIsLogin(!isLogin); 
                                        setIsLoginOtpStep(false); 
                                        setPassword(''); 
                                        setOtp(''); 
                                    }}
                                >
                                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}