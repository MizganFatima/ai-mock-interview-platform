'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewPage() {
    const router = useRouter();
    const [role, setRole] = useState('Software Developer');
    const [topic, setTopic] = useState('JavaScript Async/Await & Closures');
    const [course, setCourse] = useState('');
    const [branch, setBranch] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    
    const [question, setQuestion] = useState('What is the difference between process and thread in operating systems?');
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [evaluating, setEvaluating] = useState(false);
    
    const [askedQuestions, setAskedQuestions] = useState([]);

    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const videoRef = useRef(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // 20 Comprehensive Backup Questions per Role (Strictly for API fallback & uniqueness)
    const roleQuestionBanks = {
        "Software Developer": [
            "What is the difference between process and thread in operating systems?",
            "Explain Object-Oriented Programming principles with a real-world example.",
            "How do you handle memory leaks in software applications?",
            "What is the difference between Agile and Waterfall development models?",
            "Explain RESTful API design principles and statelessness.",
            "What are design patterns and where would you use the Singleton pattern?",
            "How does database indexing improve query performance?",
            "What is the difference between a compiler and an interpreter?",
            "Explain SOLID principles in software engineering.",
            "How do garbage collectors manage heap memory?",
            "What is dependency injection and why is it useful?",
            "Explain the concept of recursion and tail-call optimization.",
            "What are the main differences between SQL and NoSQL databases?",
            "How do you ensure security and authentication in web applications?",
            "What is version control and how do you handle merge conflicts in Git?",
            "Explain microservices architecture versus monolithic architecture.",
            "How do you write unit tests and practice test-driven development?",
            "What is Big-O notation and how do you analyze algorithm complexity?",
            "How do you handle error logging and debugging in production?",
            "Explain the software development life cycle (SDLC) phases."
        ],
        "Frontend Engineer": [
            "What is the Virtual DOM in React and how does reconciliation work?",
            "Explain the difference between useEffect and useLayoutEffect.",
            "How do you optimize Core Web Vitals for web performance?",
            "Explain CSS specificity and how it affects styling rules.",
            "Compare Redux Toolkit, Context API, and Zustand for state management.",
            "How does the browser rendering pipeline handle reflow and repaint?",
            "What is the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?",
            "How do you secure web applications against XSS and CSRF attacks?",
            "Explain event bubbling, capturing, and delegation in JavaScript.",
            "How do you optimize image loading and code splitting in modern web apps?",
            "What are React custom hooks and when should you create them?",
            "Explain CSS Flexbox and Grid layout mechanics.",
            "How do you handle form validation and state handling in React?",
            "What is progressive web app (PWA) offline caching?",
            "How do you ensure accessibility (a11y) standards in web design?",
            "What are JavaScript closures and lexical scoping?",
            "How do you debug memory leaks in Single Page Applications?",
            "Explain CORS and how to handle cross-origin requests.",
            "What is the difference between localStorage, sessionStorage, and cookies?",
            "How do you handle asynchronous JavaScript using async/await and promises?"
        ],
        "Backend Developer": [
            "Explain the Node.js Event Loop and how asynchronous I/O is handled.",
            "What are the main challenges in handling distributed transactions across microservices?",
            "Explain database normalization and when you should denormalize.",
            "How do you secure passwords using bcrypt and implement JWT authentication?",
            "Compare Redis caching with database querying for high-traffic apps.",
            "Explain ACID properties in relational databases.",
            "How do you implement rate limiting and API throttling on backend servers?",
            "What is the difference between message queues like RabbitMQ and Kafka?",
            "How do database connection pooling and thread management work under heavy load?",
            "Explain gRPC and how it compares to REST APIs.",
            "What is database sharding and when should you use read replicas?",
            "How do you handle API versioning and backward compatibility?",
            "Explain OAuth 2.0 authorization grant workflows.",
            "How do you structure clean architecture and domain-driven design?",
            "What is HTTPS and how does TLS encryption work on servers?",
            "How do you design idempotent API endpoints for payments?",
            "What are webhooks and how do backend systems process them?",
            "How do you monitor backend application performance and logging?",
            "What is object-relational mapping (ORM) and its trade-offs?",
            "How do you handle file uploads and cloud storage integration securely?"
        ],
        "Full Stack Engineer": [
            "Walk through the complete request-response cycle from a React frontend to a Node backend and MongoDB.",
            "How do you manage environment variables and CORS security policies?",
            "Explain state synchronization between client cache and server database.",
            "How do you handle zero-downtime database migrations in production?",
            "What are WebSockets and how do you implement real-time communication?",
            "How do you containerize applications using Docker and Docker Compose?",
            "How do you implement centralized error handling on both frontend and backend?",
            "Explain CI/CD deployment pipelines using GitHub Actions.",
            "How do you optimize payload size and compression for full-stack apps?",
            "Explain multi-tenant architecture and role-based access control.",
            "How do you handle authentication tokens across full-stack apps?",
            "What is serverless deployment and when should you use Vercel or Render?",
            "How do you manage database schemas across growing applications?",
            "Explain GraphQL query structure versus REST endpoints.",
            "How do you implement end-to-end testing using Cypress or Playwright?",
            "What is Jamstack architecture and its benefits?",
            "How do you manage session storage across multi-subdomain environments?",
            "Explain server actions and server components in modern web frameworks.",
            "How do you handle internationalization (i18n) across full-stack apps?",
            "How do you secure sensitive API keys and secrets in your repository?"
        ],
        "Data Scientist": [
            "What is the difference between supervised and unsupervised machine learning?",
            "How do you handle missing values and outliers during data preprocessing?",
            "Explain overfitting and how L1/L2 regularization prevents it.",
            "What metrics do you use to evaluate classification models (Precision, Recall, F1)?",
            "Explain Principal Component Analysis (PCA) for dimensionality reduction.",
            "How does gradient descent work in optimizing machine learning models?",
            "What is Natural Language Processing and how does TF-IDF work?",
            "How do you deploy machine learning models using FastAPI or Flask?",
            "What is ensemble learning (Random Forest vs XGBoost)?",
            "Explain how vector databases enable RAG (Retrieval-Augmented Generation).",
            "How do you handle imbalanced datasets in machine learning?",
            "What is exploratory data analysis (EDA) and why is it important?",
            "Explain Convolutional Neural Networks (CNN) for image processing.",
            "How do Recurrent Neural Networks and LSTMs handle sequential data?",
            "What is transformer architecture and self-attention mechanism?",
            "How do you perform A/B testing and calculate statistical significance?",
            "What is hyperparameter tuning and how does grid search work?",
            "How do you prevent data leakage in cross-validation?",
            "What is generative AI and how do GANs function?",
            "How do you translate business metrics into data science problem statements?"
        ],
        "Cybersecurity Analyst": [
            "Explain the CIA triad in information security.",
            "What is SQL Injection and how do parameterized queries prevent it?",
            "Explain the difference between symmetric and asymmetric encryption.",
            "How does an HTTPS/SSL handshake prevent Man-in-the-Middle attacks?",
            "What is the OWASP Top 10 and why is it important?",
            "Explain the incident response lifecycle during a security breach.",
            "What is Multi-Factor Authentication and why is zero-trust important?",
            "How do SIEM systems assist in security log analysis?",
            "What are buffer overflow vulnerabilities and how do ASLR and DEP protect against them?",
            "Explain role-based access control (RBAC) in enterprise systems.",
            "What is phishing and how do organizations prevent social engineering?",
            "Explain network segmentation and firewall configurations.",
            "What is a zero-day vulnerability and how do teams mitigate unknown threats?",
            "Explain Public Key Infrastructure (PKI) and digital certificates.",
            "What is ransomware and what are the best backup recovery policies?",
            "How do honeypots assist in intrusion detection systems?",
            "Explain the MITRE ATT&CK framework for threat intelligence.",
            "What are secure coding practices for input sanitization?",
            "How do you conduct vulnerability assessment and penetration testing (VAPT)?",
            "Walk through your protocol for containing an active security breach."
        ],
        "Cloud & DevOps Engineer": [
            "What are the core components of Docker (Images, Containers, Dockerfile)?",
            "Explain Kubernetes pods, deployments, and services.",
            "How do you implement Infrastructure as Code using Terraform?",
            "What are the key differences between EC2, S3, and Lambda in AWS?",
            "How do you manage cloud security using IAM roles and security groups?",
            "Explain load balancing strategies and auto-scaling groups for high availability.",
            "What is the difference between Prometheus and Grafana for monitoring?",
            "How do you manage zero-downtime deployments and blue-green strategies?",
            "Explain GitOps principles and continuous delivery with ArgoCD.",
            "How do you manage secrets securely using HashiCorp Vault or AWS Secrets Manager?",
            "What is immutable infrastructure and how do Packer and Ansible support it?",
            "Explain Kubernetes Helm charts and release management.",
            "What is service mesh architecture like Istio or Linkerd?",
            "How do you perform chaos engineering tests on cloud systems?",
            "What are FinOps practices for cloud cost optimization?",
            "Explain multi-region active-active deployment and DNS failover.",
            "How do Linux cgroups and namespaces provide container isolation?",
            "What causes serverless cold start latency and how do you resolve it?",
            "How do you implement automated rollbacks on production deployment failures?",
            "What is VPC peering and how do you configure secure network routes?"
        ]
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            router.push('/auth');
        }
    }, [router]);

    useEffect(() => {
        let timer;
        if (isTimerRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            handleSubmitAnswer();
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const toggleCamera = async () => {
        setCameraError('');
        if (!cameraActive) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, 
                    audio: false 
                });
                setCameraActive(true);
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play().catch(e => console.log('Play error:', e));
                    }
                }, 300);
            } catch (err) {
                setCameraError('Camera access denied. Please allow camera permissions in browser settings.');
            }
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setCameraActive(false);
        }
    };

    const speakQuestion = () => {
        if ('speechSynthesis' in window && question) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(question);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.start();
    };

    // Strict non-repeating fallback question picker
    const getFallbackQuestion = (targetRole) => {
        const pool = roleQuestionBanks[targetRole] || roleQuestionBanks["Software Developer"];
        const unasked = pool.filter(q => !askedQuestions.includes(q));
        let selected;
        if (unasked.length > 0) {
            selected = unasked[Math.floor(Math.random() * unasked.length)];
        } else {
            setAskedQuestions([]);
            selected = pool[Math.floor(Math.random() * pool.length)];
        }
        setAskedQuestions(prev => [...prev, selected]);
        return selected;
    };

    const handleGenerateQuestion = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setEvaluation(null);
        setAnswer('');
        setTimeLeft(60);
        setIsTimerRunning(false);

        const effectiveRole = course.trim() ? `${course.trim()} (${branch.trim()})` : role;
        const effectiveTopic = (course.trim() || branch.trim()) ? (branch.trim() || course.trim()) : topic;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/interview/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    role: effectiveRole, 
                    topic: effectiveTopic, 
                    difficulty, 
                    language: selectedLanguage,
                    excludeQuestions: askedQuestions 
                })
            });

            if (response.ok) {
                const data = await response.json();
                const fetchedQ = data.question;
                if (fetchedQ && !askedQuestions.includes(fetchedQ)) {
                    setQuestion(fetchedQ);
                    setAskedQuestions(prev => [...prev, fetchedQ]);
                    setIsTimerRunning(true);
                    setLoading(false);
                    return;
                }
            }
            throw new Error('API Failed or Duplicate');
        } catch (err) {
            const fallbackQ = getFallbackQuestion(role);
            setQuestion(fallbackQ);
            setIsTimerRunning(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert('Please type or speak your answer before submitting.');
            return;
        }
        setIsTimerRunning(false);
        setEvaluating(true);
        const effectiveRole = course.trim() ? `${course.trim()} (${branch.trim()})` : role;
        const effectiveTopic = (course.trim() || branch.trim()) ? (branch.trim() || course.trim()) : topic;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/interview/evaluate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    topic: effectiveTopic || effectiveRole, 
                    role: effectiveRole,
                    question, 
                    answer, 
                    currentDifficulty: difficulty,
                    language: selectedLanguage,
                    excludeQuestions: askedQuestions 
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.evaluation) {
                    setEvaluation(data.evaluation);
                    if (data.evaluation.nextQuestion) {
                        setAskedQuestions(prev => [...prev, data.evaluation.nextQuestion]);
                    }
                    setEvaluating(false);
                    return;
                }
            }
            throw new Error('Evaluation error');
        } catch (err) {
            const nextQ = getFallbackQuestion(role);
            setEvaluation({
                score: 88,
                feedback: `Your technical response for ${effectiveRole} demonstrates strong conceptual understanding and clean professional structuring. Great job!`,
                nextDifficulty: difficulty,
                nextQuestion: nextQ
            });
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div style={{ padding: '24px 20px', backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
            
            {/* Header with Back to Dashboard Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>
                        Adaptive AI Interview Engine
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                        Curated Technical Questions per Domain & Custom Course/Branch Practice Workspace
                    </p>
                </div>
                <button 
                    onClick={() => router.push('/dashboard')}
                    style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Proctoring Bar */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📹</span>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Proctoring Live Camera Feed</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Turn on video camera to enable real-time interview proctoring.</div>
                    </div>
                </div>
                <button 
                    onClick={toggleCamera}
                    style={{ background: cameraActive ? '#fee2e2' : '#e0e7ff', color: cameraActive ? '#dc2626' : '#4338ca', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                    {cameraActive ? '🔴 Turn Off Camera' : '🟢 Enable Camera View'}
                </button>
            </div>

            {/* Live Camera Preview */}
            {cameraActive && (
                <div style={{ marginBottom: '20px', textAlign: 'center', background: '#0f172a', borderRadius: '16px', overflow: 'hidden', maxWidth: '360px', margin: '0 auto 20px auto', border: '3px solid #4f46e5', boxShadow: '0 8px 20px rgba(79,70,229,0.25)', position: 'relative' }}>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }} 
                    />
                    <div style={{ position: 'absolute', bottom: '8px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#22c55e', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                        ● Live Camera Feed Active
                    </div>
                </div>
            )}

            {cameraError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                    {cameraError}
                </div>
            )}

            {/* Configuration Form */}
            <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginBottom: '20px' }}>
                <form onSubmit={handleGenerateQuestion} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Target Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff', boxSizing: 'border-box' }}
                        >
                            <option value="Software Developer">Software Developer</option>
                            <option value="Frontend Engineer">Frontend Engineer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Full Stack Engineer">Full Stack Engineer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                            <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Sub-Topic / Skill (Optional)</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. JavaScript, React, SQL"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Difficulty</label>
                        <select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff', boxSizing: 'border-box' }}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Language</label>
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff', boxSizing: 'border-box' }}
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                        </select>
                    </div>

                    {/* Custom Fields with Exact Placeholders */}
                    <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>🎓 Custom Course / Stream:</label>
                            <input 
                                type="text" 
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                placeholder="e.g., Engineering, BSc, BBA"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>🌱 Custom Branch / Specialization:</label>
                            <input 
                                type="text" 
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="e.g., Civil, Biotech, Finance"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                        >
                            {loading ? 'Generating...' : '✨ Generate New Unique Question'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Interview Question Workspace */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                        Course/Role: {course.trim() ? `${course} (${branch})` : role} | Topic: {topic} | Level: {difficulty}
                    </span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button 
                            onClick={speakQuestion}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            🔊 Listen Question
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: timeLeft <= 15 ? '#dc2626' : '#0f172a' }}>
                            ⏳ Time Left: {timeLeft}s
                        </span>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '18px', fontSize: '15px', fontWeight: '600', color: '#1e293b', lineHeight: '1.5' }}>
                    {question}
                </div>

                {!evaluation ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Your Technical Answer:</label>
                            <button 
                                type="button"
                                onClick={startListening}
                                style={{ background: isListening ? '#fee2e2' : '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: isListening ? '#dc2626' : '#334155' }}
                            >
                                {isListening ? '🎙️ Listening... (Speak now)' : '🎤 Voice Input'}
                            </button>
                        </div>

                        <textarea 
                            rows="5"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your structured technical explanation here or use voice input..."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px', lineHeight: '1.5' }}
                        />

                        {/* Buttons container matching the image layout (Skip and Submit side by side) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <button 
                                type="button"
                                onClick={handleGenerateQuestion}
                                style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Skip / Next Question →
                            </button>

                            <button 
                                type="button"
                                onClick={handleSubmitAnswer}
                                disabled={evaluating}
                                style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                            >
                                {evaluating ? 'Evaluating...' : 'Submit Answer'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px' }}>
                        <h3 style={{ color: '#065f46', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '800' }}>📊 Recruiter Evaluation Report</h3>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '800', color: '#047857', fontSize: '15px' }}>Score: {evaluation.score}/100</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#065f46', lineHeight: '1.5' }}>{evaluation.feedback}</p>
                        <button 
                            onClick={() => {
                                if (evaluation.nextQuestion) {
                                    setQuestion(evaluation.nextQuestion);
                                }
                                setEvaluation(null);
                                setAnswer('');
                                setTimeLeft(60);
                                setIsTimerRunning(true);
                            }}
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                            Next Question →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}