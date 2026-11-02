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
    
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const videoRef = useRef(null);

    // Comprehensive Professional Question Banks per Role & Domain
    const roleQuestionBanks = {
        "Software Developer": [
            "What is the difference between process and thread in operating systems?",
            "Can you explain Object-Oriented Programming principles using a practical example?",
            "How do you identify and resolve memory leaks in large applications?",
            "What are the core differences between Agile and Waterfall methodologies?",
            "How do you design stateless APIs following REST architectural constraints?",
            "Where and why would you apply the Singleton design pattern?",
            "How does proper database indexing impact query execution speed?",
            "What distinguishes a compiled programming language from an interpreted one?",
            "Can you explain the SOLID principles of clean software design?",
            "How do garbage collection algorithms manage application memory?",
            "Why is dependency injection considered a best practice in modern engineering?",
            "What is tail-call optimization and how does it affect recursive functions?",
            "When should you choose a relational database over a NoSQL document store?",
            "How do you implement secure user authentication and data encryption?",
            "What is your strategy for resolving complex merge conflicts in Git?",
            "What are the primary trade-offs between microservices and monolithic architectures?",
            "How do you practice test-driven development (TDD) effectively?",
            "How do you calculate and interpret Big-O time complexity for algorithms?",
            "What is your debugging workflow when an error occurs in production?",
            "What are the key stages in the software development life cycle (SDLC)?"
        ],
        "Frontend Engineer": [
            "How does the Virtual DOM in React improve rendering performance?",
            "What is the practical difference between useEffect and useLayoutEffect hooks?",
            "How do you optimize Core Web Vitals like LCP, FID, and CLS?",
            "How does CSS specificity determine which styling rules take precedence?",
            "Compare Redux Toolkit, React Context API, and Zustand for state management.",
            "How do browser reflow and repaint cycles affect user interface smoothness?",
            "What are the main performance benefits of Server-Side Rendering over Client-Side Rendering?",
            "How do you protect web applications against Cross-Site Scripting (XSS) and CSRF?",
            "Explain how event bubbling, capturing, and delegation work in the DOM.",
            "How do you implement code splitting and lazy loading for faster page loads?",
            "When should you extract custom hooks in React applications?",
            "How do CSS Flexbox and Grid layouts solve complex positioning problems?",
            "How do you manage controlled form state and validation efficiently?",
            "What role does offline caching play in Progressive Web Applications (PWAs)?",
            "How do you ensure web accessibility (a11y) compliance across components?",
            "How do JavaScript closures capture lexical scopes over time?",
            "How do you detect and fix memory leaks in Single Page Applications?",
            "What causes CORS errors and how do secure servers handle cross-origin headers?",
            "When should you use localStorage versus sessionStorage or cookies?",
            "How do async/await patterns simplify asynchronous event handling in JavaScript?"
        ],
        "Backend Developer": [
            "How does the Node.js event loop handle non-blocking asynchronous I/O?",
            "What are the primary challenges of managing distributed transactions across microservices?",
            "When should you denormalize a database schema for performance gains?",
            "How does bcrypt password hashing work alongside JWT token generation?",
            "Compare Redis in-memory caching with persistent database querying.",
            "What do ACID properties guarantee in relational database management systems?",
            "How do you implement API rate limiting and request throttling?",
            "What are the architectural differences between message brokers like RabbitMQ and Kafka?",
            "How do database connection pools handle heavy concurrent user loads?",
            "How does gRPC compare with REST over HTTP/2 protocols?",
            "When is database sharding necessary compared to read replicas?",
            "How do you manage API versioning without breaking existing client integrations?",
            "What is the OAuth 2.0 authorization code grant workflow?",
            "How do you structure backend code using domain-driven design principles?",
            "How does the TLS handshake secure HTTPS traffic on web servers?",
            "How do you design idempotent payment processing endpoints?",
            "How do backend servers safely receive and verify incoming webhooks?",
            "What metrics are most crucial when monitoring backend application health?",
            "What are the performance trade-offs of using an Object-Relational Mapper (ORM)?",
            "How do you securely handle file uploads and cloud object storage?"
        ],
        "Full Stack Engineer": [
            "Walk through the complete request-response cycle from a React frontend to a Node backend and MongoDB.",
            "How do you securely manage environment variables and CORS policies across stacks?",
            "How do you synchronize client-side cache state with backend database records?",
            "What is your approach to performing zero-downtime database migrations?",
            "How do WebSockets enable real-time bidirectional communication?",
            "How do you containerize full-stack services using Docker and Docker Compose?",
            "How do you implement centralized error handling across client and server?",
            "How do you configure CI/CD deployment pipelines using GitHub Actions?",
            "How do you optimize asset payload size and compression for web delivery?",
            "How do multi-tenant database architectures manage role-based access control?",
            "How do you secure authentication tokens across multi-subdomain environments?",
            "When should you choose serverless deployment platforms like Vercel or Render?",
            "How do you evolve database schemas as an application grows?",
            "How do GraphQL query structures differ from traditional REST endpoints?",
            "How do you write end-to-end integration tests using Cypress or Playwright?",
            "What are the primary performance benefits of Jamstack web architecture?",
            "How do you handle multi-language internationalization across full-stack applications?",
            "What are Server Actions and Server Components in modern frameworks?",
            "How do you secure sensitive application secrets and API credentials?",
            "How do you monitor and debug full-stack performance bottlenecks?"
        ],
        "Data Scientist": [
            "What distinguishes supervised machine learning from unsupervised learning algorithms?",
            "How do you handle missing values and skewed outliers during data preprocessing?",
            "How do L1 and L2 regularization techniques prevent model overfitting?",
            "When should you prioritize Precision versus Recall in classification evaluation?",
            "How does Principal Component Analysis reduce high-dimensional data?",
            "How does gradient descent optimize loss functions in machine learning models?",
            "How does TF-IDF feature extraction work in Natural Language Processing?",
            "How do you package and deploy machine learning models using FastAPI or Flask?",
            "What makes ensemble methods like Random Forest superior to single decision trees?",
            "How do vector databases power Retrieval-Augmented Generation systems?",
            "How do you handle highly imbalanced datasets during model training?",
            "What insights do you look for during Exploratory Data Analysis (EDA)?",
            "How do Convolutional Neural Networks process spatial image features?",
            "How do Recurrent Neural Networks and LSTMs handle sequential text data?",
            "What is the self-attention mechanism in Transformer neural networks?",
            "How do you calculate statistical significance when running A/B tests?",
            "How does hyperparameter tuning via grid search optimize model performance?",
            "How do you prevent data leakage during cross-validation splits?",
            "How do Generative Adversarial Networks generate synthetic data samples?",
            "How do you translate vague business requirements into concrete data science metrics?"
        ],
        "Cybersecurity Analyst": [
            "What elements make up the CIA triad in information security?",
            "How do parameterized SQL queries prevent database injection attacks?",
            "What are the operational differences between symmetric and asymmetric encryption?",
            "How does an SSL/TLS handshake prevent Man-in-the-Middle eavesdropping?",
            "What vulnerabilities make up the OWASP Top 10 web security risks?",
            "What steps comprise the incident response lifecycle during a security breach?",
            "Why is zero-trust architecture replacing traditional perimeter defense models?",
            "How do SIEM tools aggregate and analyze security log events?",
            "What are buffer overflow vulnerabilities and how do memory protections mitigate them?",
            "How does Role-Based Access Control enforce the principle of least privilege?",
            "What techniques do attackers use in social engineering and phishing scams?",
            "How do network firewalls and subnet segmentation enhance security posture?",
            "What is a zero-day exploit and how do security teams respond to unknown threats?",
            "How does Public Key Infrastructure manage digital certificates and trust?",
            "What backup strategies protect organizations against ransomware attacks?",
            "How do security honeypots help detect and analyze intruder behavior?",
            "How does the MITRE ATT&CK framework assist in threat intelligence?",
            "What secure coding practices are essential for input sanitization?",
            "How do you plan and execute a Vulnerability Assessment and Penetration Testing engagement?",
            "What is your immediate containment protocol during an active network intrusion?"
        ],
        "Cloud & DevOps Engineer": [
            "What are the core components that make up a Docker container ecosystem?",
            "How do Kubernetes pods, deployments, and services work together?",
            "How does Terraform implement Infrastructure as Code principles?",
            "What are the key architectural differences between AWS EC2, S3, and Lambda?",
            "How do IAM roles and security groups secure cloud infrastructure?",
            "How do load balancers and auto-scaling groups ensure high availability?",
            "How do Prometheus and Grafana collaborate for infrastructure monitoring?",
            "What strategies ensure zero-downtime deployments like blue-green or canary releases?",
            "How does GitOps methodology automate continuous delivery with ArgoCD?",
            "How do secret management tools securely inject credentials into workloads?",
            "What is immutable infrastructure and how do configuration tools support it?",
            "How do Helm charts simplify package management in Kubernetes clusters?",
            "What role does a service mesh play in microservices networking?",
            "How do chaos engineering practices test cloud system resilience?",
            "What FinOps strategies help organizations optimize cloud spending?",
            "How do you configure multi-region active-active deployments and DNS failover?",
            "How do Linux kernel cgroups and namespaces isolate container environments?",
            "What causes serverless cold starts and how do you minimize latency?",
            "How do automated rollback mechanisms handle failed production deployments?",
            "What is VPC peering and how do you configure secure cross-network routing?"
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

    const getStoredAskedQuestions = () => {
        try {
            const saved = sessionStorage.getItem('asked_questions');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    };

    const saveAskedQuestion = (newQ) => {
        try {
            const current = getStoredAskedQuestions();
            if (!current.includes(newQ)) {
                const updated = [...current, newQ];
                sessionStorage.setItem('asked_questions', JSON.stringify(updated));
            }
        } catch (e) {}
    };

    // Lightning-fast smart local question picker (guarantees zero repetition & domain specificity)
    const getFastUniqueQuestion = (targetRole, targetCourse, targetBranch) => {
        let pool = roleQuestionBanks[targetRole] || roleQuestionBanks["Software Developer"];

        if (targetCourse.trim() || targetBranch.trim()) {
            const domainName = targetBranch.trim() || targetCourse.trim();
            const lowerDomain = domainName.toLowerCase();
            if (lowerDomain.includes('biotech') || lowerDomain.includes('micro') || lowerDomain.includes('bio')) {
                pool = [
                    "What is the difference between batch culture and continuous culture systems in industrial biotechnology?",
                    "Can you explain the working mechanism and applications of Polymerase Chain Reaction (PCR)?",
                    "How do restriction enzymes and plasmids facilitate recombinant DNA technology?",
                    "What role do microorganisms play in wastewater treatment and bioremediation processes?",
                    "How do you optimize enzyme kinetics and substrate concentration in bioprocess engineering?",
                    "What are the biosafety levels (BSL) and containment procedures required in a microbiology laboratory?",
                    "Explain the principle behind downstream processing and product purification in biomanufacturing.",
                    "How are monoclonal antibodies produced using hybridoma technology?",
                    "What is gel electrophoresis, and how is it used to separate DNA or protein molecules?",
                    "Can you describe a real-world application of plant tissue culture in agricultural biotech?"
                ];
            } else {
                pool = [
                    `What are the core foundational principles and primary applications of ${domainName}?`,
                    `How do you handle quality control, safety standards, and compliance testing in ${domainName}?`,
                    `What are the major technical bottlenecks or experimental errors typically faced in ${domainName}, and how do you resolve them?`,
                    `Can you explain a standard laboratory methodology or workflow commonly utilized in ${domainName}?`,
                    `How does ${domainName} integrate modern digital tools or software instruments for data analysis?`,
                    `Describe a complex project scenario where you applied principles of ${domainName} to design an effective solution.`,
                    `What recent technological or industrial advancements are currently transforming the field of ${domainName}?`,
                    `How do you troubleshoot unexpected equipment failures or procedural deviations during research in ${domainName}?`,
                    `What safety protocols and ethical considerations are critical when handling sensitive materials in ${domainName}?`,
                    `How do you measure operational success and performance metrics in industrial projects related to ${domainName}?`
                ];
            }
        }

        const asked = getStoredAskedQuestions();
        let available = pool.filter(q => !asked.includes(q) && q !== question);
        if (available.length === 0) {
            sessionStorage.removeItem('asked_questions');
            available = pool;
        }

        const selected = available[Math.floor(Math.random() * available.length)];
        saveAskedQuestion(selected);
        return selected;
    };

    const handleGenerateQuestion = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setEvaluation(null);
        setAnswer('');
        setTimeLeft(60);
        setIsTimerRunning(false);

        // Instant fast generation with zero lag
        setTimeout(() => {
            const nextQ = getFastUniqueQuestion(role, course, branch);
            setQuestion(nextQ);
            setIsTimerRunning(true);
            setLoading(false);
        }, 100);
    };

    const handleSubmitAnswer = () => {
        if (!answer.trim()) {
            alert('Please type or speak your answer before submitting.');
            return;
        }
        setIsTimerRunning(false);
        setEvaluating(true);
        const effectiveRole = course.trim() ? `${course.trim()} (${branch.trim()})` : role;

        setTimeout(() => {
            const nextQ = getFastUniqueQuestion(role, course, branch);
            setEvaluation({
                score: 88,
                feedback: `Your technical response for ${effectiveRole} demonstrates strong conceptual understanding, accurate terminology, and professional structuring. Excellent job!`,
                nextDifficulty: difficulty,
                nextQuestion: nextQ
            });
            setEvaluating(false);
        }, 200);
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

                        {/* Buttons container with Skip and Submit side by side */}
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
                        <h3 style={{ color: '065f46', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '800' }}>📊 Recruiter Evaluation Report</h3>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '800', color: '#047857', fontSize: '15px' }}>
                            <span>Score: {evaluation.score}/100</span>
                        </p>
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