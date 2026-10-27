'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert("Password successfully reset! Please login.");
                router.push('/');
            } else {
                alert(data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            alert("Server Connection Error");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.badge}>AI</div>
                <h2 style={styles.heading}>Reset Password</h2>
                <p style={styles.subheading}>Enter your new password below</p>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input} 
                            required 
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            style={styles.input} 
                            required 
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
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
    }
};