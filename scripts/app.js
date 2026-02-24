// Initialize Lucide icons
lucide.createIcons();

// --- Analysis Engine ---
const AnalysisEngine = {
    skillKeywords: {
        'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
        'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
        'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
        'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
        'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
    },

    extractSkills(text) {
        const found = {};
        const lowerText = text.toLowerCase();
        let totalCount = 0;

        for (const [category, keywords] of Object.entries(this.skillKeywords)) {
            const matches = keywords.filter(kw => {
                const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                return regex.test(lowerText);
            });
            if (matches.length > 0) {
                found[category] = matches;
                totalCount += matches.length;
            }
        }
        return totalCount > 0 ? found : { 'General': ['General fresher stack'] };
    },

    calculateScore(data) {
        let score = 35;
        const categories = Object.keys(data.extractedSkills);
        score += Math.min(categories.length * 5, 30);
        if (data.company.trim()) score += 10;
        if (data.role.trim()) score += 10;
        if (data.jdText.length > 800) score += 10;
        return Math.min(score, 100);
    },

    generateChecklist(skills) {
        const hasSkill = (s) => Object.values(skills).flat().some(sk => sk.toLowerCase() === s.toLowerCase());

        return [
            {
                title: "Round 1: Aptitude / Basics",
                items: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Core Language Fundamentals", "Coding Basics"]
            },
            {
                title: "Round 2: DSA + Core CS",
                items: [
                    "Arrays & Strings",
                    "Linked Lists & Trees",
                    hasSkill('DSA') ? "Advanced Sorting/Searching" : "Basic Sorting",
                    hasSkill('OS') ? "Process Management & Threading" : "Basic OS Concepts",
                    hasSkill('DBMS') ? "SQL Queries & Normalization" : "Database Basics"
                ]
            },
            {
                title: "Round 3: Tech Interview (Stack)",
                items: [
                    "Project Architecture",
                    ...Object.values(skills).flat().slice(0, 3).map(s => `${s} Deep Dive`),
                    "API Design Principles",
                    "Debugging & Problem Solving"
                ]
            },
            {
                title: "Round 4: Managerial / HR",
                items: ["Behavioral Questions", "Cultural Fit", "Company Research", "Career Goals", "Salary Negotiation Basics"]
            }
        ];
    },

    generatePlan(skills) {
        const allSkills = Object.values(skills).flat();
        const isFrontend = allSkills.some(s => ['React', 'Next.js', 'JavaScript'].includes(s));
        const isBackend = allSkills.some(s => ['Node.js', 'Express', 'Java', 'Python'].includes(s));

        return [
            { day: "Day 1-2", topics: ["Basics + Core CS concepts", "Language syntax fundamentals"] },
            { day: "Day 3-4", topics: ["DSA Practice: Focus on " + (allSkills.includes('DSA') ? "Advanced Topics" : "Standard Patterns"), "Live coding drills"] },
            { day: "Day 5", topics: ["Project Review & Resume alignment", isFrontend ? "Frontend Framework Revision" : (isBackend ? "Backend/API Revision" : "System Design Basics")] },
            { day: "Day 6", topics: ["Mock Interview: Behavioral + Technical", "Solve 3-5 Medium LeetCode problems"] },
            { day: "Day 7", topics: ["Final Revision of Weak Areas", "Formulae & Schema revision"] }
        ];
    },

    generateQuestions(skills) {
        const allSkills = Object.values(skills).flat();
        const bank = {
            'Java': "Explain JVM architecture and how Memory Management works in Java.",
            'Python': "What are Decorators and Generators in Python? Provide a use case.",
            'React': "Explain the Virtual DOM and when you would use useMemo or useCallback.",
            'SQL': "Explain Indexing and when it helps (or hurts) database performance.",
            'DSA': "How would you optimize search in sorted data vs unsorted data?",
            'Node.js': "Explain the Event Loop in Node.js and how it handles async I/O.",
            'Docker': "What is the difference between an Image and a Container in Docker?",
            'AWS': "What are the common AWS services used for scalability (EC2, S3, RDS)?",
            'DBMS': "Explain ACID properties and their importance in transactions."
        };

        const questions = [];
        allSkills.forEach(s => {
            if (bank[s] && questions.length < 8) questions.push({ skill: s, text: bank[s] });
        });

        // Fill up to 10
        const defaults = [
            "Tell me about your most challenging technical project.",
            "Explain a scenario where you had to debug a complex production issue.",
            "How do you stay updated with the latest trends in your technology stack?",
            "What is your approach to learning a new language or framework?"
        ];

        while (questions.length < 10) {
            questions.push({ skill: 'General', text: defaults.pop() });
        }

        return questions;
    }
};

// --- History Management ---
const HistoryManager = {
    save(entry) {
        const history = this.getAll();
        history.unshift(entry);
        localStorage.setItem('placement_history', JSON.stringify(history));
    },
    getAll() {
        return JSON.parse(localStorage.getItem('placement_history') || '[]');
    },
    get(id) {
        return this.getAll().find(e => e.id === id);
    }
};

// --- Routing & UI ---
const routes = {
    'dashboard-content': {
        title: 'Dashboard Overview',
        render: () => {
            const container = document.getElementById('main-content');
            // Simplified dashboard for integration
            container.innerHTML = `
                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="card-title">Quick Action</h3>
                        <p>Analyze a job description to get a personalized preparation plan.</p>
                        <button class="btn btn-primary" onclick="loadRoute('assessments')">New Analysis</button>
                    </div>
                    <div class="card">
                        <h3 class="card-title">History Snapshot</h3>
                        <p>Access your previous analysis reports.</p>
                        <button class="btn btn-secondary" onclick="loadRoute('history')">View History</button>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    },
    'practice': {
        title: 'Practice',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <div class="card">
                    <h2>Practice Problems</h2>
                    <p>Solve coding, aptitude, and logical reasoning problems.</p>
                </div>
            `;
            lucide.createIcons();
        }
    },
    'assessments': {
        title: 'Job Description Analysis',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <div class="analysis-container">
                    <div class="card">
                        <h3 class="card-title">Enter Opportunity Details</h3>
                        <div class="input-group">
                            <label>Company Name</label>
                            <input type="text" id="company" class="input-field" placeholder="e.g. Google, Microsoft">
                        </div>
                        <div class="input-group">
                            <label>Target Role</label>
                            <input type="text" id="role" class="input-field" placeholder="e.g. Software Engineer, Backend Dev">
                        </div>
                        <div class="input-group">
                            <label>Job Description</label>
                            <textarea id="jdText" class="input-field" placeholder="Paste the JD here..."></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="runAnalysis()">
                            Analyze Now
                            <i data-lucide="zap"></i>
                        </button>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    },
    'history': {
        title: 'Analysis History',
        render: () => {
            const container = document.getElementById('main-content');
            const history = HistoryManager.getAll();

            if (history.length === 0) {
                container.innerHTML = `
                    <div class="card" style="text-align: center; padding: 64px;">
                        <i data-lucide="history" style="width: 48px; height: 48px; margin: 0 auto 16px; color: var(--color-text-muted);"></i>
                        <h3>No history found</h3>
                        <p>Start by analyzing your first job description.</p>
                        <button class="btn btn-primary" onclick="loadRoute('assessments')" style="margin-top: 24px;">Start Now</button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="history-list">
                        ${history.map(item => `
                            <div class="history-item" onclick="viewResult('${item.id}')">
                                <div class="history-info">
                                    <h4>${item.company} — ${item.role}</h4>
                                    <span class="history-meta">${new Date(item.createdAt).toLocaleDateString()} • ${item.id.slice(0, 8)}</span>
                                </div>
                                <div class="score-badge ${item.readinessScore > 75 ? 'score-high' : (item.readinessScore > 50 ? 'score-mid' : 'score-low')}">
                                    ${item.readinessScore}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            lucide.createIcons();
        }
    },
    'results': {
        title: 'Preparation Analysis',
        render: (data) => {
            if (!data) return loadRoute('dashboard-content');
            const container = document.getElementById('main-content');

            container.innerHTML = `
                <div class="results-grid">
                    <!-- Sidebar: Readiness & Skills -->
                    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <div class="card">
                            <h3 class="card-title">Readiness Score</h3>
                            <div class="score-badge ${data.readinessScore > 75 ? 'score-high' : (data.readinessScore > 50 ? 'score-mid' : 'score-low')}" style="text-align: center; font-size: 2.5rem; padding: 24px;">
                                ${data.readinessScore}%
                            </div>
                            <p style="font-size: 0.875rem; text-align: center; color: var(--color-text-secondary); margin-top: -8px;">
                                Based on depth of JD and detected skills.
                            </p>
                        </div>
                        
                        <div class="card">
                            <h3 class="card-title">Extracted Skills</h3>
                            ${Object.entries(data.extractedSkills).map(([cat, skills]) => `
                                <div>
                                    <div class="skill-category-label">${cat}</div>
                                    <div class="skill-tag-group">
                                        ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Main Content: Plan & Checklist -->
                    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <div class="card">
                            <h3 class="card-title">Weekly Preparation Plan</h3>
                            <div class="plan-list">
                                ${data.plan.map(p => `
                                    <div class="plan-day">
                                        <div style="font-weight: 700; color: var(--color-primary);">${p.day}</div>
                                        <ul style="margin-top: 4px; font-size: 0.9375rem; list-style: disc; padding-left: 16px;">
                                            ${p.topics.map(t => `<li>${t}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">Round-wise Checklist</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
                                ${data.checklist.map(round => `
                                    <div class="checklist-group">
                                        <h4 style="margin-bottom: 8px;">${round.title}</h4>
                                        <ul style="display: flex; flex-direction: column; gap: 4px;">
                                            ${round.items.map(item => `
                                                <li style="font-size: 0.875rem; display: flex; align-items: center; gap: 8px;">
                                                    <div style="width: 12px; height: 12px; border: 1.5px solid var(--color-border); border-radius: 2px;"></div>
                                                    ${item}
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">Top 10 Interview Questions</h3>
                            <div class="question-list">
                                ${data.questions.map((q, i) => `
                                    <div class="question-item">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                            <span class="badge">${q.skill}</span>
                                            <span style="font-size: 12px; color: var(--color-text-muted);">Q${i + 1}</span>
                                        </div>
                                        <div class="question-text">${q.text}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    },
    'resources': {
        title: 'Resources',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <div class="card">
                    <h2>Resources</h2>
                    <p>Browse study materials, company-wise preparation guides, and interview tips.</p>
                </div>
            `;
            lucide.createIcons();
        }
    },
    'profile': {
        title: 'Profile',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <div class="card">
                    <h2>User Profile</h2>
                    <p>Manage your account settings and view your certificates.</p>
                </div>
            `;
            lucide.createIcons();
        }
    }
};

function runAnalysis() {
    const company = document.getElementById('company').value;
    const role = document.getElementById('role').value;
    const jdText = document.getElementById('jdText').value;

    if (!jdText.trim()) {
        alert("Please provide the Job Description.");
        return;
    }

    const extractedSkills = AnalysisEngine.extractSkills(jdText);
    const score = AnalysisEngine.calculateScore({ company, role, jdText, extractedSkills });
    const checklist = AnalysisEngine.generateChecklist(extractedSkills);
    const plan = AnalysisEngine.generatePlan(extractedSkills);
    const questions = AnalysisEngine.generateQuestions(extractedSkills);

    const entry = {
        id: 'anlyz_' + Date.now(),
        createdAt: new Date().toISOString(),
        company: company || "Unknown Company",
        role: role || "Graduate Engineer Trainee",
        jdText,
        extractedSkills,
        readinessScore: score,
        checklist,
        plan,
        questions
    };

    HistoryManager.save(entry);
    loadRoute('results', entry);
}

function viewResult(id) {
    const entry = HistoryManager.get(id);
    if (entry) {
        loadRoute('results', entry);
    }
}

function navigateTo(view) {
    const landing = document.getElementById('landing-page');
    const dashboard = document.getElementById('dashboard-layout');

    if (view === 'dashboard') {
        landing.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadRoute('dashboard-content');
    } else {
        landing.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
    lucide.createIcons();
}

function loadRoute(routeId, data = null) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');

    const route = routes[routeId];
    if (route) {
        pageTitle.innerText = route.title;
        route.render(data);
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${routeId}'`)) {
            item.classList.add('active');
        }
    });

    lucide.createIcons();
}

// Global hook for navigation
window.loadRoute = loadRoute;
window.runAnalysis = runAnalysis;
window.viewResult = viewResult;
