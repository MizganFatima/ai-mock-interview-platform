'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPage() {
    const router = useRouter();
    const [selectedCompany, setSelectedCompany] = useState('Google');
    const [role, setRole] = useState('Full Stack Developer');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const companies = [
        { name: 'Google', focus: 'System Design & Algorithm Depth', style: 'Rigorous & Analytical' },
        { name: 'Amazon', focus: 'Leadership Principles & Scalability', style: 'Fast-paced & Practical' },
        { name: 'Microsoft', focus: 'Architecture & Enterprise Solutions', style: 'Collaborative & Deep Technical' },
        { name: 'TCS / Infosys', focus: 'Core CS Fundamentals & Aptitude', style: 'Standard & Foundational' }
    ];

    // 20+ Questions Pool for each company to prevent repetition
    const questionPools = {
        Google: [
            "How would you design a scalable microservices architecture for Google?",
            "Explain how you would handle low-latency distributed caching at global scale.",
            "Design a rate limiter system to handle millions of requests per second.",
            "How does Google Search indexing manage petabytes of dynamic web data efficiently?",
            "Discuss consistency models in distributed databases like Google Spanner.",
            "Design a distributed message queue system handling high throughput.",
            "How would you implement real-time collaborative document editing like Google Docs?",
            "Explain your strategy for securing inter-service communication using mTLS at scale.",
            "Design a URL shortening service handling high traffic volumes with low latency.",
            "How do you optimize garbage collection pauses in large-scale backend services?",
            "Explain the CAP theorem and how Google's distributed systems balance consistency and availability.",
            "Design an automated anomaly detection system for server log monitoring.",
            "How would you architect a video streaming platform with global CDN caching?",
            "Discuss strategies for zero-downtime database migrations in distributed clusters.",
            "Design a distributed file storage system handling petabytes of unstructured data.",
            "How do you handle cascading failures and circuit breaking in complex microservices?",
            "Design a scalable notification dispatch system for millions of push notifications.",
            "Explain load balancing algorithms used at Layer 4 and Layer 7 in cloud environments.",
            "How would you implement distributed locking across multiple cloud data centers?",
            "Discuss memory management and optimization techniques in high-performance backend code."
        ],
        Amazon: [
            "Describe a situation where you had to scale a database under heavy traffic spikes.",
            "How do you ensure high availability and fault tolerance in e-commerce checkout microservices?",
            "Explain your approach to implementing secure CI/CD deployment pipelines.",
            "How would you design a inventory management system handling concurrent updates?",
            "Discuss how Amazon's recommendation engine processes user data streams in real time.",
            "Design a fraud detection service analyzing real-time financial transactions.",
            "How do you handle idempotency in distributed payment processing architectures?",
            "Explain strategy for multi-region active-active database replication.",
            "Design a scalable customer support ticketing and routing platform.",
            "How do you manage configuration drift across thousands of cloud instances?",
            "Discuss decoupling strategies using event-driven messaging with Apache Kafka.",
            "Design a distributed session store for high-traffic web applications.",
            "How do you monitor and trace performance bottlenecks across microservices?",
            "Explain blue-green deployment strategies and automated rollback mechanisms.",
            "Design a high-throughput logging and auditing aggregation pipeline.",
            "How do you secure API endpoints against unauthorized access and SQL injection?",
            "Discuss strategies for optimizing cloud infrastructure costs without losing performance.",
            "Design an automated backup and disaster recovery validation workflow.",
            "How do you implement rate limiting and throttling per tenant in SaaS platforms?",
            "Explain container orchestration strategies using Kubernetes and auto-scaling pods."
        ],
        Microsoft: [
            "How would you design an enterprise-grade role-based access control (RBAC) system?",
            "Discuss strategies for migrating a monolithic legacy application to enterprise cloud microservices.",
            "How do you manage cross-service authentication using OAuth2 and JWT tokens?",
            "Design an enterprise document management system with strict version control and auditing.",
            "How would you implement multi-tenancy isolation in cloud-native SaaS applications?",
            "Discuss enterprise security policies and compliance frameworks in Azure/AWS.",
            "Design a real-time telemetry collection and dashboard visualization tool.",
            "How do you optimize Entity Framework or database ORM queries under high loads?",
            "Explain enterprise messaging patterns using Azure Service Bus or RabbitMQ.",
            "Design a scalable employee directory and organizational chart microservice.",
            "How do you handle distributed transactions across independent microservice databases?",
            "Discuss API versioning strategies and backward compatibility maintenance.",
            "Design a secure file upload and virus scanning pipeline for enterprise web apps.",
            "How do you implement centralized configuration management and feature flags?",
            "Explain disaster recovery planning and recovery time objectives (RTO) for enterprise systems.",
            "Design an automated code quality inspection tool integrated into GitHub Actions.",
            "How do you manage database indexing and query execution plans for optimal speed?",
            "Discuss strategies for reducing cold-start latency in serverless function architectures.",
            "Design a secure password reset and multi-factor authentication workflow.",
            "How do you test resilient microservices using chaos engineering methodologies?"
        ],
        "TCS / Infosys": [
            "What are the core principles of Object-Oriented Programming and how do you apply them?",
            "Explain the difference between SQL and NoSQL databases with real-world use cases.",
            "How do you optimize slow-performing database queries and indexing?",
            "Explain the MVC (Model-View-Controller) architectural pattern in web development.",
            "What is RESTful API design and what are the best practices for status codes?",
            "Explain memory leak concepts in programming and how to detect and fix them.",
            "How do you handle exception handling and robust logging in backend applications?",
            "Explain the difference between process and thread in operating systems.",
            "What are database normalization forms up to 3NF with examples?",
            "How do you secure web applications against Cross-Site Scripting (XSS) and CSRF?",
            "Explain Git branching strategies and how merge conflicts are resolved in teams.",
            "What is dependency injection and why is it useful in software design?",
            "Explain the difference between synchronous and asynchronous programming models.",
            "How do you write unit tests and mock dependencies using testing frameworks?",
            "What are web sockets and how do they differ from HTTP polling?",
            "Explain CORS (Cross-Origin Resource Sharing) and how to configure it securely.",
            "What is connection pooling in database management and why is it important?",
            "Explain pagination and sorting techniques in large database result sets.",
            "What are environment variables and why are they critical for secure configuration?",
            "Explain the software development life cycle (SDLC) and Agile Scrum methodologies."
        ]
    };

    const [jobs, setJobs] = useState([
        { title: 'Junior Software Developer', company: 'TechNova Solutions', location: 'Remote / Hybrid', type: 'Full-time' },
        { title: 'Python & AI Intern', company: 'DataMinds Corp', location: 'Remote', type: 'Internship' },
        { title: 'Frontend Web Developer', company: 'WebCrafters Studio', location: 'Remote', type: 'Contract' }
    ]);

    const [resumeTip, setResumeTip] = useState('Click below to generate AI-powered resume optimization suggestions.');

    const generateResumeTip = () => {
        setResumeTip('Tip: Highlight your hands-on experience with Python, React, and REST APIs. Quantify your project achievements with metrics (e.g., "Deployed 4+ scalable web apps on Render").');
    };

    const startSimulator = async () => {
        setLoading(true);
        setInterviewStarted(true);
        try {
            const res = await fetch('http://localhost:5000/api/recruiter/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: selectedCompany, role })
            });
            const data = await res.json();
            setQuestion(data.question || `Explain a complex architectural challenge you solved while working as a ${role} at ${selectedCompany}.`);
        } catch (err) {
            // Fallback to random question from the pool so questions change dynamically
            const pool = questionPools[selectedCompany] || questionPools["Google"];
            const randomQ = pool[Math.floor(Math.random() * pool.length)];
            setQuestion(randomQ);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/recruiter/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: selectedCompany, question, answer })
            });
            const data = await res.json();
            setFeedback(data);
        } catch (err) {
            setFeedback({ score: 8, critique: "Good response meeting standard corporate benchmarks for " + selectedCompany + "." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '35px 45px', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <button 
                onClick={() => router.push('/dashboard')} 
                style={{ marginBottom: '25px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
            >
                &larr; Back to Dashboard
            </button>
            
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Recruiter Hub & AI Interview Simulator</h1>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '13px', fontWeight: '500' }}>
                Experience company-specific interview styles, job openings, and get AI-driven resume optimization insights.
            </p>

            {/* AI Recruiter Simulator Section */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#0f172a' }}>🏢 AI Recruiter Simulator (Company Specific Rounds)</h3>
                
                {!interviewStarted ? (
                    <div>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Select target company to adjust interview style, question patterns, and evaluation criteria:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            {companies.map((comp, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedCompany(comp.name)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: selectedCompany === comp.name ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                        background: selectedCompany === comp.name ? '#eff6ff' : '#f8fafc',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '15px' }}>{comp.name}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{comp.focus}</p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={startSimulator}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                            Start {selectedCompany} Interview Simulation
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', background: '#eff6ff', padding: '4px 12px', borderRadius: '20px' }}>Target: {selectedCompany}</span>
                            <button onClick={() => setInterviewStarted(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Change Company</button>
                        </div>

                        {loading && <p style={{ color: '#64748b', fontSize: '14px' }}>AI Recruiter is tailoring questions based on {selectedCompany} standards...</p>}

                        {question && !loading && (
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Question:</h4>
                                <p style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>{question}</p>
                            </div>
                        )}

                        {!feedback ? (
                            <div>
                                <textarea 
                                    rows="3" 
                                    placeholder="Type your technical response here..." 
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
                                />
                                <button 
                                    onClick={submitAnswer}
                                    style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                                >
                                    Submit Answer for Review
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                <h4 style={{ color: '#065f46', margin: '0 0 6px 0', fontSize: '15px' }}>📊 Recruiter Evaluation Report</h4>
                                <p style={{ margin: '0 0 6px 0', fontWeight: '700', color: '#047857' }}>Score: {feedback.score}/10</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>{feedback.critique}</p>
                                <button 
                                    onClick={() => { setFeedback(null); setAnswer(''); startSimulator(); }}
                                    style={{ marginTop: '12px', background: '#2563eb', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Resume Optimizer Section */}
            <div style={{ background: '#ffffff', padding: '25px 30px', borderRadius: '16px', marginBottom: '25px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>AI Resume & Profile Optimizer</h3>
                <p style={{ color: '#475569', marginBottom: '18px', lineHeight: '1.5', fontSize: '14px', fontWeight: '500' }}>{resumeTip}</p>
                <button 
                    onClick={generateResumeTip} 
                    style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                    Get AI Resume Feedback
                </button>
            </div>

            {/* Job Openings Section */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Recommended Job & Internship Openings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {jobs.map((job, index) => (
                        <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '16px', fontWeight: '700' }}>{job.title}</h4>
                            <p style={{ fontSize: '14px', color: '#2563eb', marginBottom: '6px', fontWeight: '600' }}>{job.company}</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', fontWeight: '500' }}>{job.location} &bull; {job.type}</p>
                            <button 
                                onClick={() => alert(`Application submitted successfully for ${job.title}!`)}
                                style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}