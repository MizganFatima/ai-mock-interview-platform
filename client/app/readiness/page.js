'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReadinessPage() {
    const router = useRouter();
    const [newTopic, setNewTopic] = useState('');
    
    const [checklist, setChecklist] = useState([
        { topic: 'Data Structures & Algorithms', completed: true },
        { topic: 'Object-Oriented Programming (OOPs)', completed: true },
        { topic: 'DBMS & SQL Queries', completed: false },
        { topic: 'Operating Systems Fundamentals', completed: false },
        { topic: 'Python / JavaScript Programming', completed: true },
        { topic: 'Web Development (React & Node.js)', completed: false }
    ]);

    const toggleCheck = (index) => {
        const updated = [...checklist];
        updated[index].completed = !updated[index].completed;
        setChecklist(updated);
    };

    const handleAddTopic = (e) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        setChecklist([...checklist, { topic: newTopic.trim(), completed: false }]);
        setNewTopic('');
    };

    const completedCount = checklist.filter(item => item.completed).length;
    const readinessScore = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

    return (
        <div style={{ padding: '35px 45px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <button 
                onClick={() => router.push('/dashboard')} 
                style={{ marginBottom: '25px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
            >
                &larr; Back to Dashboard
            </button>
            
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Interview Readiness & Syllabus Tracker</h1>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '13px', fontWeight: '500' }}>
                Track your core academic syllabus topics, custom tech stacks, and core computer science competencies for placement readiness.
            </p>

            {/* Score Card */}
            <div style={{ background: '#ffffff', padding: '25px 30px', borderRadius: '16px', marginBottom: '25px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px 0' }}>Overall Readiness Score: {readinessScore}%</h3>
                <div style={{ width: '100%', background: '#e2e8f0', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${readinessScore}%`, background: '#059669', height: '100%', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>

            {/* Add Custom Topic Input Section */}
            <div style={{ background: '#ffffff', padding: '20px 30px', borderRadius: '16px', marginBottom: '25px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>➕ Add Custom Topic / Tech Stack</h3>
                <form onSubmit={handleAddTopic} style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="e.g., Docker, System Design, Next.js..." 
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                    <button 
                        type="submit"
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                    >
                        Add Topic
                    </button>
                </form>
            </div>

            {/* Checklist Section */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Core Topics & Skills Checklist</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {checklist.map((item, index) => (
                        <li 
                            key={index} 
                            onClick={() => toggleCheck(index)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '16px 20px', 
                                background: '#f8fafc', 
                                marginBottom: '12px', 
                                borderRadius: '12px', 
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <input 
                                type="checkbox" 
                                checked={item.completed} 
                                readOnly 
                                style={{ marginRight: '15px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }} 
                            />
                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                                {item.topic}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}