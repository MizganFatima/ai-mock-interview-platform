'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRbacPage() {
    const router = useRouter();
    const [users, setUsers] = useState([
        { id: 1, name: 'Mizgan Fatima', email: 'mizgan@example.com', role: 'Administrator', status: 'Active' },
        { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Mentor', status: 'Active' },
        { id: 3, name: 'Aman Verma', email: 'aman@example.com', role: 'Student', status: 'Active' },
        { id: 4, name: 'Neha Singh', email: 'neha@example.com', role: 'Student', status: 'Suspended' }
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            router.push('/auth');
        }
    }, [router]);

    const handleRoleChange = (id, newRole) => {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    };

    const handleToggleStatus = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    };

    return (
        <div style={{ padding: '30px 40px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>
                        🛡️ Role-Based Access Control (RBAC) & Enterprise Security
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                        Manage user roles (Student, Mentor, Administrator), permissions, and active session security.
                    </p>
                </div>
                <button 
                    onClick={() => router.push('/dashboard')}
                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total System Users</div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>1,248 Users</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Active Admins & Mentors</div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '4px' }}>32 Staff</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Security Policy</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#16a34a', marginTop: '6px' }}>JWT Encrypted & Locked</div>
                </div>
            </div>

            {/* User Permissions Table */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
                    User Access & Permissions Management
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                <th style={{ padding: '12px' }}>User Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Assigned Role</th>
                                <th style={{ padding: '12px' }}>Account Status</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#0f172a' }}>{u.name}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{u.email}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <select 
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600', background: '#f8fafc', color: '#334155' }}
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Mentor">Mentor</option>
                                            <option value="Administrator">Administrator</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: u.status === 'Active' ? '#dcfce7' : '#fee2e2', color: u.status === 'Active' ? '#166534' : '#991b1b' }}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <button 
                                            onClick={() => handleToggleStatus(u.id)}
                                            style={{ background: u.status === 'Active' ? '#fee2e2' : '#dcfce7', color: u.status === 'Active' ? '#991b1b' : '#166534', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}
                                        >
                                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}