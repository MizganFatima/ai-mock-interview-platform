'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewPage() {
    const router = useRouter();
    const [role, setRole] = useState('Software Developer');
    const [topic, setTopic] = useState('');
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

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Full 20 Comprehensive Backup Questions per Custom Stream / Domain
    const customDomainBanks = {
        "bba": [
            "What are the core functions of management in modern business organizations?",
            "Explain Michael Porter's Five Forces model of competitive analysis.",
            "How do you calculate break-even analysis and why is it important for startups?",
            "What is the difference between working capital management and capital budgeting?",
            "Explain the marketing mix (4Ps and 7Ps) with a practical example.",
            "What are the primary leadership styles and when should you apply them?",
            "How do supply chain management strategies reduce operational overhead costs?",
            "What is financial leverage and how does it impact return on equity?",
            "Explain SWOT analysis and how companies use it for strategic planning.",
            "What are the key stages of the consumer decision-making process?",
            "What is balance sheet benchmarking and how are liquidity ratios calculated?",
            "Explain corporate governance principles and executive accountability.",
            "How do international trade tariffs affect global supply chain logistics?",
            "What is matrix organizational structure and how does it manage dual reporting?",
            "Explain customer acquisition cost (CAC) versus lifetime value (LTV).",
            "What is change management framework (Kotter’s 8-step model)?",
            "How do risk management protocols mitigate operational financial volatility?",
            "Explain brand equity management and positioning strategies.",
            "What is zero-based budgeting and how does it differ from traditional budgeting?",
            "How does cross-cultural negotiation impact international joint ventures?"
        ],
        "ba": [
            "What are the major themes and social critiques in modern literature?",
            "Explain the separation of powers in political governance and constitutional framework.",
            "What is cognitive dissonance and how does it affect human behavior in psychology?",
            "How do microeconomics and macroeconomics differ in scope and application?",
            "Explain quantitative versus qualitative methodology in social science research.",
            "What are key historical factors that triggered the Industrial Revolution?",
            "Explain structural functionalism versus conflict theory in sociology.",
            "What is public policy cycle and how are policy interventions evaluated?",
            "How does media representation influence public opinion and cultural narrative?",
            "What is ethics and moral philosophy in decision making?",
            "How do international relations theories explain global diplomatic conflicts?",
            "What is social stratification and how does it impact economic mobility?",
            "Explain human rights frameworks in international law.",
            "What role does cultural anthropology play in studying diverse traditions?",
            "How do urban planning policies affect socio-economic segregation?",
            "Explain behavioral economics and consumer choice irrationality.",
            "What is historiography and how do historical interpretations change over time?",
            "How do literary deconstruction and critical theory alter text analysis?",
            "Explain public administration governance models and bureaucratic efficiency.",
            "What is demographic transition theory and its impact on population growth?"
        ],
        "biotech": [
            "What is the difference between batch culture and continuous culture systems in industrial biotechnology?",
            "Can you explain the working mechanism and applications of Polymerase Chain Reaction (PCR)?",
            "How do restriction enzymes and plasmids facilitate recombinant DNA technology?",
            "What role do microorganisms play in wastewater treatment and bioremediation processes?",
            "How do you optimize enzyme kinetics and substrate concentration in bioprocess engineering?",
            "What are the biosafety levels (BSL) and containment procedures required in a microbiology laboratory?",
            "Explain the principle behind downstream processing and product purification in biomanufacturing.",
            "How are monoclonal antibodies produced using hybridoma technology?",
            "What is gel electrophoresis, and how is it used to separate DNA or protein molecules?",
            "Can you describe a real-world application of plant tissue culture in agricultural biotech?",
            "Explain CRISPR-Cas9 gene editing mechanism and guide RNA design principles.",
            "What is biosimilar drug development and how does it differ from generic drugs?",
            "How do biosensors function in physiological metabolite detection?",
            "Explain bioreactor scale-up challenges related to mass transfer rates and shear stress.",
            "What is metabolic engineering and pathway optimization in microbial factories?",
            "How does protein crystallography help determine 3D structural biology?",
            "Explain micropropagation techniques in microalgae biofuel production.",
            "What are cell-free protein synthesis systems and their advantages?",
            "How do stem cell differentiation pathways work in tissue engineering?",
            "What are the ethical regulatory frameworks for bio-containment of GMO releases?"
        ],
        "phd": [
            "What is the primary research gap your PhD thesis aims to address?",
            "How do you formulate a robust null hypothesis and alternative hypothesis for your research?",
            "What qualitative or quantitative research methodologies are you employing in your study?",
            "How do you ensure ethical compliance and data integrity in academic research?",
            "What criteria do you use to perform a critical literature review and identify peer-reviewed sources?",
            "How do you handle statistical significance and control for confounding variables in your experiments?",
            "What is the significance of peer review in publishing high-impact academic papers?",
            "How do you manage large research datasets and ensure reproducibility of your results?",
            "What theoretical frameworks underpin your domain of advanced study?",
            "How do you plan to secure funding and grants for post-doctoral research projects?",
            "Explain systematic sampling versus stratified random sampling methodologies.",
            "How do you address epistemological assumptions in qualitative research designs?",
            "What is multivariate analysis of variance (MANOVA) and when is it applied?",
            "How do you resolve conflicting experimental results from peer literature?",
            "Explain peer-review revision protocols when responding to Journal Referee reports.",
            "What is the role of metadata standards in archival open-access data repositories?",
            "How do you design longitudinal study controls to minimize attrition bias?",
            "What is patent priority filing strategy during doctoral translational research?",
            "Explain meta-analysis forest plots and heterogeneity tests (I-squared statistic).",
            "How do you communicate complex theoretical discoveries to non-specialist stakeholders?"
        ],
        "bsc": [
            "What are the fundamental principles of scientific inquiry and experimental design?",
            "How do you analyze experimental errors and calculate standard deviations in laboratory reports?",
            "What is the importance of peer-reviewed scientific literature in modern research?",
            "How do you handle hazardous chemical reagents and maintain laboratory safety protocols?",
            "Explain the principles of quantitative versus qualitative chemical and biological analysis.",
            "What role does mathematical modeling play in interpreting scientific phenomena?",
            "How do you calibrate precision laboratory instruments like spectrophotometers or microbalances?",
            "What are the ethical considerations when conducting biological or chemical experiments?",
            "How do you synthesize complex data sets into a comprehensive scientific conclusion?",
            "What are the recent advancements in your specific field of basic science study?",
            "Explain stoichiometry principles in multi-step chemical reaction synthesis.",
            "What is wave-particle duality and photoelectric emission theory in physics?",
            "How do chromatographic separation methods isolate bioactive natural compounds?",
            "Explain thermodynamic laws and enthalpy/entropy equilibrium calculations.",
            "What are cell membrane transport kinetics (active vs passive diffusion)?",
            "How do buffer solutions maintain pH homeostasis against acid-base additions?",
            "Explain atomic absorption spectroscopy principles in trace element detection.",
            "What are Mendelian inheritance patterns and gene linkage mapping?",
            "How do differential equations model population growth kinetics?",
            "Explain crystal field theory and transition metal complex coloration."
        ]
    };

    const subTopicQuestionBanks = {
        "java": [
            "What are the core features and object-oriented principles of Java?",
            "Explain the difference between JDK, JRE, and JVM in Java.",
            "What is method overloading and method overriding in Java?",
            "How does garbage collection work in Java?",
            "What is the difference between String, StringBuilder, and StringBuffer?",
            "Explain the concept of interface and abstract class in Java.",
            "What are Java exceptions and how does try-catch-finally work?",
            "What is multithreading in Java and how do you create a thread?",
            "Explain the Java Collections Framework and difference between ArrayList and LinkedList.",
            "What are lambda expressions and functional interfaces in Java 8?",
            "How do synchronization blocks prevent thread interference in Java?",
            "What is the role of the final keyword with variables, methods, and classes?",
            "Explain volatile and transient keywords in Java multithreading.",
            "What are Generics in Java and how does type erasure work?",
            "How do you implement the Singleton design pattern securely in Java?",
            "What is the difference between Comparable and Comparator interfaces?",
            "Explain the Java Stream API and its performance benefits.",
            "What are Java annotations and how do custom annotations work?",
            "How does dependency injection simplify enterprise Java applications?",
            "What are memory leaks in Java and how do you detect them using profilers?"
        ],
        "c++": [
            "What is the difference between C and C++?",
            "Explain object-oriented programming pillars in C++ (Encapsulation, Inheritance, Polymorphism).",
            "What are constructors and destructors in C++?",
            "What is the difference between shallow copy and deep copy?",
            "Explain pointers and references in C++.",
            "What is operator overloading in C++?",
            "How does memory allocation work using new and delete versus malloc and free?",
            "What are virtual functions and polymorphism in C++?",
            "Explain the Standard Template Library (STL) containers like vectors and maps.",
            "What is a template in C++ and how do function templates work?",
            "What is RAII (Resource Acquisition Is Initialization) in C++?",
            "Explain smart pointers in C++ (unique_ptr, shared_ptr, weak_ptr).",
            "What is move semantics and rvalue references in modern C++?",
            "How do friend functions and friend classes work in C++?",
            "What are pure virtual functions and abstract classes in C++?",
            "Explain exception handling mechanisms using try, catch, and throw in C++.",
            "What is the difference between stack and heap memory allocation in C++?",
            "How do lambda expressions function in C++11 and later?",
            "What is name mangling and how does extern \"C\" resolve it?",
            "How do you optimize loop performance and memory alignment in C++?"
        ],
        "python": [
            "What are the key features of Python and why is it interpreted?",
            "Explain mutable and immutable data types in Python with examples.",
            "What are decorators in Python and how do you use them?",
            "How does memory management work in Python using reference counting and garbage collection?",
            "What is the difference between deepcopy and copy modules?",
            "Explain generators and the yield keyword in Python.",
            "How do you handle exceptions using try, except, and finally blocks?",
            "What are list comprehensions and how do they improve code readability?",
            "Explain the Global Interpreter Lock (GIL) in Python and its impact.",
            "What are lambda functions and how do they differ from regular functions?",
            "What are Python magic methods (dunder methods) and how do they work?",
            "Explain the difference between class methods, static methods, and regular methods.",
            "How do you manage virtual environments and package dependencies using pip?",
            "What are args and kwargs in Python function definitions?",
            "Explain asynchronous programming in Python using asyncio and async/await.",
            "How do context managers and the with statement work in Python?",
            "What is monkey patching in Python and when is it used?",
            "Explain pandas dataframes and data cleaning techniques in Python.",
            "How do you serialize and deserialize Python objects using pickle or json?",
            "What are metaclasses in Python and what is their primary use case?"
        ],
        "javascript": [
            "What is the difference between var, let, and const in JavaScript?",
            "Explain JavaScript closures and how they retain lexical scope.",
            "How does asynchronous programming work using Promises and async/await?",
            "What is the event loop and how does the call stack interact with the callback queue?",
            "Explain prototype-based inheritance in JavaScript.",
            "What is the difference between == and === operators?",
            "How do higher-order functions like map, filter, and reduce work?",
            "What is event bubbling and event delegation in the DOM?",
            "How do you handle errors using try...catch in JavaScript?",
            "What is destructuring assignment and spread/rest operator in ES6?",
            "What are JavaScript generators and how do iterator protocols work?",
            "Explain CORS and how web browsers handle cross-origin security headers.",
            "What is memoization and how do you optimize recursive functions in JavaScript?",
            "How do JavaScript modules (import/export) work across files?",
            "What is structural typing versus nominal typing in web applications?",
            "Explain how the 'this' keyword behaves in various execution contexts.",
            "What are service workers and how do they power progressive web applications?",
            "How do you prevent memory leaks in single-page JavaScript applications?",
            "What is currying in functional programming using JavaScript?",
            "How do web workers enable multithreaded background processing in browsers?"
        ]
    };

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

    const getFastFallbackQuestion = (targetRole, targetTopic, targetCourse, targetBranch) => {
        let pool = [];
        const combinedQuery = `${targetTopic} ${targetCourse} ${targetBranch}`.toLowerCase().trim();

        for (const key of Object.keys(customDomainBanks)) {
            if (combinedQuery.includes(key)) {
                pool = customDomainBanks[key];
                break;
            }
        }

        if (pool.length === 0) {
            for (const key of Object.keys(subTopicQuestionBanks)) {
                if (combinedQuery.includes(key)) {
                    pool = subTopicQuestionBanks[key];
                    break;
                }
            }
        }

        if (pool.length === 0) {
            pool = roleQuestionBanks[targetRole] || roleQuestionBanks["Software Developer"];
        }

        const asked = getStoredAskedQuestions();
        const unasked = pool.filter(q => !asked.includes(q) && q !== question);
        let selected;
        if (unasked.length > 0) {
            selected = unasked[Math.floor(Math.random() * unasked.length)];
        } else {
            sessionStorage.removeItem('asked_questions');
            selected = pool[Math.floor(Math.random() * pool.length)];
        }
        return selected;
    };

    const handleGenerateQuestion = async () => {
        setLoading(true);
        setEvaluation(null);
        setAnswer('');

        const effectiveRole = (course && course.trim() !== '') 
            ? `Student specializing in ${course.trim()} (${branch || 'General'})` 
            : role;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/interview/generate-question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: effectiveRole,
                    topic: topic || 'General',
                    course: course,
                    branch: branch,
                    difficulty: difficulty,
                    language: selectedLanguage
                })
            });

            const data = await res.json();
            if (res.ok && data.question) {
                setQuestion(data.question);
                saveAskedQuestion(data.question);
            } else {
                const fallbackQ = getFastFallbackQuestion(role, topic, course, branch);
                setQuestion(fallbackQ);
                saveAskedQuestion(fallbackQ);
            }
        } catch (err) {
            const fallbackQ = getFastFallbackQuestion(role, topic, course, branch);
            setQuestion(fallbackQ);
            saveAskedQuestion(fallbackQ);
        } finally {
            setLoading(false);
            setTimeLeft(60);
            setIsTimerRunning(true);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;
        setEvaluating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/interview/evaluate-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question,
                    answer,
                    role: course ? `Course: ${course}` : role
                })
            });
            const data = await res.json();
            if (res.ok) {
                setEvaluation(data);
            }
        } catch (err) {
            setEvaluation({ score: 7, feedback: "Good effort! Practice more structured responses." });
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Adaptive AI Interview Engine</h1>
                        <p className="text-xs text-slate-500">Curated Technical Questions per Domain & Custom Course/Branch Practice Workspace</p>
                    </div>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Proctoring Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-lg">🎥</div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800">Proctoring Live Camera Feed</h4>
                            <p className="text-xs text-slate-500">Turn on video camera to enable real-time interview proctoring.</p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleCamera}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition ${cameraActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                    >
                        {cameraActive ? 'Disable Camera View' : 'Enable Camera View'}
                    </button>
                </div>

                {cameraActive && (
                    <div className="bg-black rounded-xl overflow-hidden relative w-64 h-48 mx-auto border shadow">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                    </div>
                )}
                {cameraError && <p className="text-xs text-red-500 text-center">{cameraError}</p>}

                {/* Main Config Workspace */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Target Role</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border p-2 rounded text-sm bg-white"
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
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Sub-Topic / Skill (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g. java, python, biotech" 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Difficulty</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full border p-2 rounded text-sm bg-white"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Language</label>
                            <select 
                                value={selectedLanguage} 
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full border p-2 rounded text-sm bg-white"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">🎓 Custom Course / Stream:</label>
                            <input 
                                type="text" 
                                placeholder="e.g., bsc, bba, phd, ba, biotech" 
                                value={course} 
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full border p-2 rounded text-sm border-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-green-600 mb-1">🌱 Custom Branch / Specialization:</label>
                            <input 
                                type="text" 
                                placeholder="e.g., biotec, finance, civil" 
                                value={branch} 
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full border p-2 rounded text-sm border-green-200"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateQuestion}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition shadow"
                    >
                        {loading ? '✨ Generating Question...' : '✨ Generate New Unique Question'}
                    </button>
                </div>

                {/* Question and Answer Section */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
                        <span className="text-xs font-semibold text-slate-600">Course/Role: {course || role} | Topic: {topic || 'General'} | Level: {difficulty}</span>
                        <div className="space-x-2">
                            <button onClick={speakQuestion} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">🔊 Listen Question</button>
                            <span className="text-xs font-bold text-red-600">⏱ Time Left: {timeLeft}s</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold text-slate-800">{question}</h3>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-slate-700">Your Technical Answer:</label>
                            <button onClick={startListening} className={`text-xs px-3 py-1 rounded border font-medium ${isListening ? 'bg-red-100 text-red-600 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                                {isListening ? 'Listening...' : '🎤 Voice Input'}
                            </button>
                        </div>
                        <textarea 
                            rows={5}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your structured technical explanation here or use voice input..."
                            className="w-full border p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={handleGenerateQuestion} 
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Skip / Next Question →
                        </button>
                        <button 
                            onClick={handleSubmitAnswer}
                            disabled={evaluating || !answer.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                        >
                            {evaluating ? 'Evaluating...' : 'Submit Answer'}
                        </button>
                    </div>

                    {evaluation && (
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg space-y-1">
                            <h4 className="font-bold text-emerald-800 text-sm">Score: {evaluation.score}/10</h4>
                            <p className="text-xs text-emerald-700">{evaluation.feedback}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}