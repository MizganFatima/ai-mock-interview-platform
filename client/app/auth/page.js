'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // States for Forgot Password view toggle
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const endpoint = isLogin ? `${baseUrl}/api/auth/login` : `${baseUrl}/api/auth/signup`;
        
        const payload = isLogin ? { email, password } : { name, email, password };

        console.log("Submitting to endpoint:", endpoint);
        console.log("Payload data:", payload);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok && data.success) {
                alert("Success!");
                router.push('/dashboard');
            } else {
                alert(data.message || data.error || "Authentication failed");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Server Connection Error");
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            alert("Please enter your email address!");
            return;
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            console.log("Sending forgot password request to:", `${baseUrl}/api/auth/forgot-password`);
            
            const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await response.json();
            console.log("Forgot password response:", data);

            if (response.ok && data.success) {
                alert(data.message || "Password reset link sent to your email!");
                setShowForgot(false);
                setForgotEmail('');
            } else {
                alert(data.message || data.error || "Failed to process request");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            alert("Server Connection Error");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.badge}>AI</div>
                
                {!showForgot ? (
                    <>
                        <h2 style={styles.heading}>{isLogin ? "Welcome Back" : "Get Started"}</h2>
                        <p style={styles.subheading}>{isLogin ? "Login to access your interviews" : "Create your account to begin practicing"}</p>
                        
                        <form onSubmit={handleSubmit} style={styles.form}>
                            {!isLogin && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        style={styles.input} 
                                        required={!isLogin}
                                    />
                                </div>
                            )}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="you@example.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    style={styles.input} 
                                    required 
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        style={{ ...styles.input, width: '100%', paddingRight: '40px' }} 
                                        required 
                                    />
                                    <span 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        style={{ position: 'absolute', right: '12px', cursor: 'pointer', fontSize: '16px', userSelect: 'none' }}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </span>
                                </div>
                                {isLogin && (
                                    <div style={{ textAlign: 'right', marginTop: '4px' }}>
                                        <span 
                                            onClick={() => setShowForgot(true)} 
                                            style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Forgot Password?
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button type="submit" style={styles.button}>
                                {isLogin ? "Login" : "Sign Up"}
                            </button>
                        </form>

                        <p style={styles.toggleText} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span style={styles.toggleLink}>{isLogin ? "Sign Up" : "Sign In"}</span>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 style={styles.heading}>Reset Password</h2>
                        <p style={styles.subheading}>Enter your email to receive a reset link</p>
                        
                        <form onSubmit={handleForgotPasswordSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Registered Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="you@example.com"
                                    value={forgotEmail} 
                                    onChange={(e) => setForgotEmail(e.target.value)} 
                                    style={styles.input} 
                                    required 
                                />
                            </div>
                            <button type="submit" style={styles.button}>
                                Send Reset Link
                            </button>
                        </form>

                        <p style={styles.toggleText} onClick={() => setShowForgot(false)}>
                            Remembered your password? <span style={styles.toggleLink}>Sign In</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef2ff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px 30px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    badge: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        margin: '0 auto 15px auto'
    },
    heading: {
        margin: '0 0 5px 0',
        fontSize: '24px',
        color: '#1e293b'
    },
    subheading: {
        margin: '0 0 25px 0',
        fontSize: '13px',
        color: '#64748b'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'left'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#334155'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        outline: 'none',
        transition: 'border 0.2s'
    },
    button: {
        marginTop: '10px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
    },
    toggleText: {
        marginTop: '20px',
        fontSize: '13px',
        color: '#64748b'
    },
    toggleLink: {
        color: '#2563eb',
        fontWeight: '600',
        cursor: 'pointer'
    }
};