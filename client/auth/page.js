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
    const [step, setStep] = useState(1); 
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
                    const res = await fetch(`${API_BASE}/api/auth/login-request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();

                    if (res.ok && data.success) {
                        alert(data.message || 'OTP sent to your email!');
                        setIsLoginOtpStep(true);
                    } else {
                        alert(data.error || data.message || 'Invalid credentials.');
                    }
                } else {
                    const res = await fetch(`${API_BASE}/api/auth/verify-login-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, otp })
                    });
                    const data = await res.json();

                    if (res.ok && data.success) {
                        localStorage.setItem('token', data.token || 'jwt-token-authenticated');
                        alert(data.message || 'Login successful!');
                        router.push('/dashboard');
                    } else {
                        alert(data.error || data.message || 'Invalid OTP.');
                    }
                }
            } else {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #cbd5e1', width: '100%', maxWidth: '400px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                
                <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#0f172a' }}>
                    {isForgotPassword ? 'Reset Password' : (isLogin ? (isLoginOtpStep ? 'Verify Login OTP' : 'Welcome Back') : 'Create Account')}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
                    {isForgotPassword ? 'Follow the steps to recover your account' : (isLogin ? (isLoginOtpStep ? 'Enter the 6-digit OTP sent to your email' : 'Login to access your account') : 'Sign up to start your journey')}
                </p>

                {isForgotPassword ? (
                    <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {step === 1 ? (
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Registered Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Enter 6-Digit OTP</label>
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength="6"
                                        placeholder="123456"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', letterSpacing: '4px', textAlign: 'center', fontWeight: '700', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>New Password</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <input 
                                            type={showNewPassword ? 'text' : 'password'} 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            placeholder="Enter new password"
                                            style={{ width: '100%', padding: '10px 35px 10px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
                                        >
                                            {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                            {loading ? 'Processing...' : (step === 1 ? 'Send Reset OTP' : 'Reset Password')}
                        </button>
                        <button type="button" onClick={() => { setIsForgotPassword(false); setStep(1); }} style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '12px', cursor: 'pointer' }}>
                            &larr; Back to Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {!isLogin && (
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoginOtpStep}
                                placeholder="Enter your email"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', backgroundColor: isLoginOtpStep ? '#f1f5f9' : '#fff' }}
                            />
                        </div>

                        {isLogin && isLoginOtpStep ? (
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Enter 6-Digit OTP</label>
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="6"
                                    placeholder="123456"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', letterSpacing: '4px', textAlign: 'center', fontWeight: '700', outline: 'none' }}
                                />
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Password</label>
                                    {isLogin && (
                                        <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', padding: 0, fontWeight: '600' }}>
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                        style={{ width: '100%', padding: '10px 35px 10px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}>
                            {loading ? 'Please wait...' : (isLogin ? (isLoginOtpStep ? 'Verify & Login' : 'Proceed & Send OTP') : 'Create Account')}
                        </button>

                        {isLogin && isLoginOtpStep && (
                            <button type="button" onClick={() => { setIsLoginOtpStep(false); setOtp(''); }} style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '12px', cursor: 'pointer' }}>
                                &larr; Back to Email/Password
                            </button>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            <button type="button" onClick={() => { setIsLogin(!isLogin); setIsLoginOtpStep(false); }} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '12px', cursor: 'pointer' }}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "} 
                                <span style={{ color: '#2563eb', fontWeight: '700' }}>{isLogin ? 'Sign Up' : 'Login'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}