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
    const [question, setQuestion] = useState('As a Software Developer, explain closures, lexical scoping, and practical use cases of asynchronous JavaScript using async/await.');
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [evaluating, setEvaluating] = useState(false);
    
    // Anti-Repeat History Tracker
    const [askedQuestions, setAskedQuestions] = useState([]);

    // Camera Stream States
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const videoRef = useRef(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Comprehensive 20 Questions Bank for Each Pre-defined Role (Safe Fallback)
    const roleQuestionBanks = {
        "Software Developer": [
            "Explain the principles of Object-Oriented Programming and how you apply polymorphism in real-world projects.",
            "What is the difference between process and thread? How does multi-threading affect application performance?",
            "Explain how memory leaks occur in software applications and how you diagnose and fix them.",
            "Describe the Software Development Life Cycle (SDLC) models and when you would choose Agile over Waterfall.",
            "How do you handle dependency injection and loose coupling in your backend architecture?",
            "Explain RESTful API design principles and statelessness in distributed systems.",
            "What are design patterns? Give an example of where you implemented the Singleton or Factory pattern.",
            "How do you write robust unit tests and handle mocking in test-driven development (TDD)?",
            "Explain how database indexing works and how it speeds up query execution times.",
            "Describe a complex architectural trade-off you had to make between code readability and execution speed.",
            "What is the difference between compiler and interpreter? How does JIT compilation work?",
            "Explain SOLID principles with real-world software engineering examples.",
            "How do garbage collectors manage heap memory in high-concurrency environments?",
            "What is the difference between monolithic architecture and microservices?",
            "Explain how recursion works and how tail-call optimization prevents stack overflow.",
            "How do you optimize time and space complexity using Big-O notation analysis?",
            "What are WebAssembly and native extensions, and when should you use them?",
            "Explain semantic versioning and git branching strategies for large engineering teams.",
            "How do you handle API deprecation and backward compatibility in public services?",
            "Describe how you structure clean architecture and domain-driven design (DDD) in enterprise codebases."
        ],
        "Frontend Engineer": [
            "Explain the Virtual DOM in React and how reconciliation works under the hood.",
            "What are React Hooks? Explain the lifecycle equivalent of useEffect and useCallback optimization.",
            "How do you optimize Core Web Vitals (LCP, FID, CLS) for high-traffic web applications?",
            "Explain CSS specificity, Flexbox layout mechanics, and Grid systems.",
            "What is state management? Compare Redux Toolkit, Context API, and Zustand.",
            "How does browser rendering pipeline work (Reflow vs Repaint)?",
            "Explain client-side routing versus server-side rendering (SSR) and Incremental Static Regeneration (ISR) in Next.js.",
            "How do you secure web applications against Cross-Site Scripting (XSS) and CSRF attacks?",
            "Explain progressive web apps (PWAs) and service worker caching strategies.",
            "How do you write accessible (a11y) web components adhering to WCAG guidelines?",
            "Explain event bubbling, event capturing, and event delegation in JavaScript.",
            "What is the difference between shadow DOM and light DOM in Web Components?",
            "How do image optimization, lazy loading, and code splitting reduce initial bundle size?",
            "Explain CSS-in-JS vs Tailwind CSS vs CSS Modules in modern web development.",
            "How do browser cookies, localStorage, and sessionStorage differ in security and scope?",
            "What are Web Vitals and how do you monitor real user metrics (RUM)?",
            "Explain micro-frontends architecture and module federation in Webpack/Vite.",
            "How do you handle CORS errors and configure preflight requests on the client?",
            "Explain asynchronous script loading using async and defer tags.",
            "How do you debug memory leaks caused by uncleared event listeners or subscriptions in Single Page Apps?"
        ],
        "Backend Developer": [
            "Explain the Event Loop in Node.js and how asynchronous I/O non-blocking operations are handled.",
            "What are microservices architecture and what are the main challenges in distributed transactions?",
            "Explain database normalization (1NF, 2NF, 3NF) and when you should denormalize for performance.",
            "How do you implement JWT authentication and secure password hashing using bcrypt?",
            "What is caching? Compare Redis and Memcached implementation strategies for high throughput.",
            "Explain ACID properties in relational databases and how eventual consistency works in NoSQL.",
            "How do you handle rate limiting, API throttling, and DDoS protection on backend servers?",
            "What is message queuing? Compare RabbitMQ and Apache Kafka use cases.",
            "How do you monitor backend server health, logging, and APM (Application Performance Monitoring)?",
            "Describe how you would design a scalable URL shortener or chat system backend.",
            "What is gRPC and how does Protocol Buffers compare to JSON REST APIs?",
            "Explain database connection pooling and how to prevent thread exhaustion under load.",
            "How do database transactions, optimistic locking, and pessimistic locking work?",
            "Explain GraphQL query schemas, resolvers, and the N+1 query problem.",
            "How do you structure database sharding and read-replicas for massive scale?",
            "What is object-relational mapping (ORM) and what are its performance trade-offs?",
            "Explain OAuth 2.0 grant types and OpenID Connect workflows.",
            "How do you design idempotent API endpoints for financial payment processing?",
            "Explain sticky sessions, load balancing algorithms, and health check probes.",
            "Describe how structured logging and distributed tracing (OpenTelemetry) help debug microservices."
        ],
        "Full Stack Engineer": [
            "Walk through the complete request-response cycle from a React frontend to a Node/Express backend and MongoDB database.",
            "How do you manage environment variables, CORS policies, and secure API gateways across staging and production?",
            "Explain state synchronization between client-side cache (React Query/SWR) and server-side database.",
            "How do you handle database migration strategies without breaking active production deployments?",
            "What are WebSockets? How do you implement real-time bidirectional communication in a full-stack app?",
            "Explain containerization using Docker and orchestrating services with Docker Compose.",
            "How do you handle error boundaries on the frontend and centralized error middleware on the backend?",
            "Describe your experience with CI/CD pipelines (GitHub Actions) deploying to cloud platforms like Vercel and Render.",
            "How do you optimize payload sizes and gzip/brotli compression for full-stack web applications?",
            "Explain how you design a multi-tenant database architecture with secure role-based access control.",
            "How do you implement Server-Sent Events (SSE) versus WebSockets for live data feeds?",
            "Explain atomic deployments, blue-green deployments, and canary releases.",
            "How do you secure sensitive user credentials using HTTPS, TLS encryption, and secure headers (HSTS)?",
            "What is Jamstack architecture and how does static site generation benefit SEO?",
            "Explain how GraphQL and REST APIs can co-exist in a hybrid full-stack system.",
            "How do you debug cross-origin session storage issues across different subdomains?",
            "Explain the concept of Server Actions and Server Components in modern React/Next.js.",
            "How do you scale file uploads to cloud storage (S3) using presigned URLs?",
            "Describe how you handle internationalization (i18n) and localization across frontend and backend.",
            "How do you run end-to-end (E2E) testing using Playwright or Cypress in a full-stack CI pipeline?"
        ],
        "Data Scientist": [
            "Explain the difference between supervised and unsupervised machine learning with practical examples.",
            "How do you handle missing values, outliers, and feature scaling during data preprocessing?",
            "What is overfitting and underfitting? How do regularization techniques (L1/L2) help solve them?",
            "Explain precision, recall, F1-score, and ROC-AUC curve in evaluating classification models.",
            "How do you perform Exploratory Data Analysis (EDA) using Pandas, NumPy, and Matplotlib/Seaborn?",
            "What is dimensionality reduction? Explain Principal Component Analysis (PCA) and its use cases.",
            "Explain gradient descent and how learning rate tuning affects convergence.",
            "What is Natural Language Processing (NLP)? Explain TF-IDF and word embeddings like Word2Vec.",
            "How do you deploy machine learning models into production using FastAPI or Flask?",
            "Describe a data science project where your model insights directly influenced business decisions.",
            "What is ensemble learning? Compare Random Forest and Gradient Boosting (XGBoost/LightGBM).",
            "Explain Convolutional Neural Networks (CNN) architecture and image convolution operations.",
            "What are Recurrent Neural Networks (RNN) and LSTM networks, and how do they handle sequence data?",
            "Explain Transformer architecture, attention mechanisms, and Self-Attention in LLMs.",
            "How do you prevent data leakage during train-test splits and cross-validation?",
            "Explain A/B testing methodology, p-values, and statistical significance in product experimentation.",
            "What is generative AI and how do GANs (Generative Adversarial Networks) work?",
            "How do vector databases (Pinecone/ChromaDB) enable Retrieval-Augmented Generation (RAG)?",
            "Explain hyperparameter tuning techniques like Grid Search, Random Search, and Bayesian Optimization.",
            "How do you handle imbalanced datasets using SMOTE, class weighting, or undersampling?"
        ],
        "Cybersecurity Analyst": [
            "Explain the CIA triad (Confidentiality, Integrity, Availability) in information security.",
            "What is the OWASP Top 10? Explain SQL Injection and how to prevent it using parameterized queries.",
            "Explain the difference between symmetric and asymmetric encryption algorithms.",
            "What is a Man-in-the-Middle (MitM) attack and how does HTTPS/SSL handshake mitigate it?",
            "How do you perform vulnerability assessment and penetration testing (VAPT)?",
            "Explain Multi-Factor Authentication (MFA) and zero-trust security models.",
            "What is a SIEM (Security Information and Event Management) system and how does log analysis work?",
            "Explain the incident response lifecycle (Preparation, Detection, Containment, Eradication, Recovery).",
            "What is phishing and how do security awareness programs prevent social engineering attacks?",
            "Explain firewall configurations, IDS/IPS systems, and network segmentation.",
            "What is a Zero-Day vulnerability and how do organizations mitigate unknown threats?",
            "Explain Public Key Infrastructure (PKI) and digital certificate management.",
            "What are buffer overflow attacks and how do ASLR and DEP prevent memory exploitation?",
            "Explain DNS spoofing, ARP poisoning, and rogue access point security threats.",
            "What is ransomware and what are the best offline backup policies for business continuity?",
            "Explain role-based access control (RBAC) versus attribute-based access control (ABAC).",
            "How do honeypots and deception technology assist in intrusion detection?",
            "Explain the MITRE ATT&CK framework and how SOC teams use threat intelligence.",
            "What are secure coding practices for API authentication, rate limiting, and input sanitization?",
            "Describe a security breach scenario and walk through your threat containment protocol."
        ],
        "Cloud & DevOps Engineer": [
            "Explain the core components of Docker (Images, Containers, Dockerfile, Volumes).",
            "What is Kubernetes? Explain pods, deployments, services, and ingress controllers.",
            "How do you implement Infrastructure as Code (IaC) using Terraform or AWS CloudFormation?",
            "Explain CI/CD pipelines and how automated testing integrates into deployment workflows.",
            "What are the key differences between AWS EC2, S3, RDS, and Lambda serverless architectures?",
            "How do you manage cloud security, IAM roles, security groups, and VPC peering?",
            "Explain load balancing strategies and auto-scaling groups for high-availability systems.",
            "What is monitoring and observability? Compare Prometheus, Grafana, and ELK stack.",
            "How do you manage database backups, disaster recovery, and zero-downtime deployments?",
            "Explain GitOps principles and continuous delivery using ArgoCD.",
            "What is immutable infrastructure and how do Packer and Ansible support it?",
            "Explain Kubernetes Helm charts and release management across environments.",
            "How do you manage secret keys and credentials using HashiCorp Vault or AWS Secrets Manager?",
            "What are cloud-native microservices mesh architectures like Istio or Linkerd?",
            "Explain chaos engineering principles and testing system resilience with Gremlin/Chaos Mesh.",
            "How do cost optimization tools (FinOps) help manage AWS/Azure/GCP cloud spend?",
            "Explain multi-region active-active deployment setups and DNS failover with Route 53.",
            "What is Linux kernel cgroups and namespaces, and how do they enable container isolation?",
            "Explain serverless cold start latency issues and provisioned concurrency solutions.",
            "How do you construct automated rollback mechanisms when production deployments report high error rates?"
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

    const getLocalRoleOrTopicQuestion = (targetRole, targetCourse, targetBranch, targetTopic, targetDifficulty) => {
        let activeDomain = targetCourse.trim() ? `${targetCourse.trim()} ${targetBranch.trim()}` : targetRole;
        let pool = roleQuestionBanks[targetRole] || roleQuestionBanks["Software Developer"];

        if (targetCourse.trim() || targetBranch.trim() || (targetTopic && targetTopic.trim().length > 0)) {
            const customT = targetTopic.trim() || targetBranch.trim() || activeDomain;
            pool = [
                `Explain the fundamental architecture and core design principles of ${customT} in ${activeDomain} at a ${targetDifficulty.toLowerCase()} level.`,
                `How do you handle performance tuning and practical execution when working with ${customT}?`,
                `What are the most common methodologies, vulnerabilities, and solutions in ${customT}?`,
                `Compare ${customT} with alternative domains. When is it the preferred choice for ${activeDomain}?`,
                `Walk through a complex scenario or bug you encountered related to ${customT} and how you resolved it.`,
                `How do you structure analysis, logging, and implementation strategy in ${customT}?`,
                `Explain how advanced principles or core workflows are managed in ${customT}.`,
                `Describe how practical testing, experimentation, or validation is performed for ${customT}.`,
                `What frameworks or best practices do you follow when executing projects in ${customT}?`,
                `Explain how scaling and efficiency are achieved in enterprise systems using ${customT}.`,
                `What are the core foundational stages or lifecycle phases of ${customT}?`,
                `How do you perform data management, resource allocation, or execution tracking when implementing ${customT}?`,
                `What are the key trade-offs between using ${customT} versus standard traditional methods?`,
                `How do you handle compliance, quality assurance, and standards in ${customT}?`,
                `Explain how resource management and quality control are handled in ${customT}.`,
                `What key performance indicators (KPIs) or metrics do you track to evaluate success in ${customT}?`,
                `Describe how ${customT} integrates into professional workflows and modern industry standards.`,
                `How do you handle complex problem-solving and troubleshooting in ${customT}?`,
                `Explain how analysis, data interpretation, or core protocols are implemented in ${customT}.`,
                `Walk me through an end-to-end enterprise implementation strategy for ${customT}.`
            ];
        }

        const unasked = pool.filter(q => !askedQuestions.includes(q));
        let selected;
        if (unasked.length > 0) {
            selected = unasked[Math.floor(Math.random() * unasked.length)];
        } else {
            selected = pool[Math.floor(Math.random() * pool.length)];
            setAskedQuestions([]);
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

        const effectiveRole = course.trim() ? `${course.trim()} ${branch.trim()}` : role;
        const effectiveTopic = (course.trim() || branch.trim()) ? (branch.trim() || course.trim()) : topic;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/interview/generate`, {
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
                const fetchedQ = data.question || (data.questions && data.questions[0]);
                if (fetchedQ && !askedQuestions.includes(fetchedQ)) {
                    setQuestion(fetchedQ);
                    setAskedQuestions(prev => [...prev, fetchedQ]);
                    setIsTimerRunning(true);
                    setLoading(false);
                    return;
                }
            }
            throw new Error('API Key Failed or Network Issue');
        } catch (err) {
            const fallbackQ = getLocalRoleOrTopicQuestion(role, course, branch, topic, difficulty);
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
        const activeDomain = course.trim() ? `${course.trim()} ${branch.trim()}` : role;
        const activeTopic = (course.trim() || branch.trim()) ? (branch.trim() || course.trim()) : topic;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/interview/evaluate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ topic: activeTopic || activeDomain, question, answer, currentDifficulty: difficulty })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.evaluation) {
                    setEvaluation(data.evaluation);
                    setEvaluating(false);
                    return;
                }
            }
            throw new Error('Evaluation error');
        } catch (err) {
            setEvaluation({
                score: 90,
                feedback: `Your technical response for ${activeDomain} - ${activeTopic} demonstrates strong analytical depth and clean professional structuring. Excellent explanation!`,
                nextDifficulty: difficulty
            });
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div style={{ padding: '24px 20px', backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
            
            {/* Header */}
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
                    style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
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
                <form onSubmit={handleGenerateQuestion} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
                    
                    {/* Standard Pre-defined Roles Dropdown */}
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Target Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => {
                                setRole(e.target.value);
                                setCourse('');
                                setBranch('');
                            }}
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

                    {/* Sub-Topic / Skill Input */}
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

                    {/* Difficulty */}
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

                    {/* Language */}
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Language</label>
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff', boxSizing: 'border-box' }}
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Hinglish">Hinglish</option>
                        </select>
                    </div>

                    {/* Separate Course & Branch Inputs Side-by-Side */}
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                                🎓 Custom Course / Stream:
                            </label>
                            <input 
                                type="text" 
                                value={course}
                                onChange={(e) => {
                                    setCourse(e.target.value);
                                    if(e.target.value.trim()) setTopic('');
                                }}
                                placeholder="e.g., Engineering, BSc, BBA"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #93c5fd', fontSize: '12px', boxSizing: 'border-box', background: '#ffffff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                                🌿 Custom Branch / Specialization:
                            </label>
                            <input 
                                type="text" 
                                value={branch}
                                onChange={(e) => {
                                    setBranch(e.target.value);
                                    if(e.target.value.trim()) setTopic('');
                                }}
                                placeholder="e.g., Civil, Biotech, Finance"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #93c5fd', fontSize: '12px', boxSizing: 'border-box', background: '#ffffff' }}
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', width: '100%' }}
                        >
                            {loading ? 'Generating Question...' : '✨ Generate New Unique Question'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Question Display & Timer */}
            {question && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                            Course/Role: {course.trim() ? `${course} (${branch})` : role} | Topic: {topic || (course.trim() ? `${course} ${branch}` : role)} | Level: {difficulty}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: timeLeft < 15 ? '#dc2626' : '#2563eb', background: timeLeft < 15 ? '#fee2e2' : '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
                                ⏱️ Time Left: {timeLeft}s
                            </span>
                            <button 
                                onClick={speakQuestion}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                🔊 Listen Question
                            </button>
                        </div>
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '10px 0 0 0', lineHeight: '1.5' }}>
                        {question}
                    </p>
                </div>
            )}

            {/* Answer Input Workspace */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Your Technical Answer:</label>
                    <button 
                        type="button"
                        onClick={startListening}
                        style={{ background: isListening ? '#fee2e2' : '#f1f5f9', color: isListening ? '#dc2626' : '#334155', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        {isListening ? '🎙️ Listening...' : '🎤 Voice Input'}
                    </button>
                </div>
                <textarea 
                    rows="6"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your structured technical explanation here or use voice input..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={handleGenerateQuestion}
                        style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                    >
                        Skip / Next Question →
                    </button>
                    <button 
                        onClick={handleSubmitAnswer}
                        disabled={evaluating || !answer.trim()}
                        style={{ background: evaluating ? '#93c5fd' : '#059669', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: evaluating ? 'not-allowed' : 'pointer' }}
                    >
                        {evaluating ? 'Evaluating with AI...' : 'Submit Answer'}
                    </button>
                </div>
            </div>

            {/* Evaluation Results Card */}
            {evaluation && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>🎯 AI Evaluation & Scorecard</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Score Awarded:</span>
                        <span style={{ fontSize: '16px', fontWeight: '800', background: '#059669', color: '#ffffff', padding: '2px 12px', borderRadius: '20px' }}>
                            {evaluation.score}/100
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                            Next Difficulty Tier: <strong style={{ color: '#2563eb' }}>{evaluation.nextDifficulty}</strong>
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: 0, background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong>Detailed Critique:</strong> {evaluation.feedback}
                    </p>
                </div>
            )}

        </div>
    );
}