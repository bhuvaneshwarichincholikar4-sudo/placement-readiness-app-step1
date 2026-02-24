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

    enterprises: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Infosys', 'TCS', 'Wipro', 'HCL', 'Accenture', 'Cognizant', 'IBM', 'Adobe', 'Oracle', 'Salesforce'],

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

    generateCompanyIntel(companyName, jdText) {
        const lowerName = companyName.toLowerCase();
        const lowerJd = jdText.toLowerCase();

        const isEnterprise = this.enterprises.some(e => lowerName.includes(e.toLowerCase()));

        let industry = "Technology Services";
        if (/bank|cash|pay|invest|finance/.test(lowerJd)) industry = "FinTech";
        else if (/health|medical|medicine/.test(lowerJd)) industry = "HealthTech";
        else if (/shop|buy|commerce/.test(lowerJd)) industry = "E-commerce";
        else if (/social|media|chat/.test(lowerJd)) industry = "Social Media / Content";

        return {
            name: companyName || "Unknown Venture",
            industry: industry,
            size: isEnterprise ? "Enterprise (2000+)" : "Startup (<200)",
            type: isEnterprise ? "ENTERPRISE" : "STARTUP",
            hiringFocus: isEnterprise
                ? "Highly structured interviews focused on DSA, core CS fundamentals, and scalability."
                : "Practical, fast-paced assessment focused on stack depth and immediate problem-solving impact."
        };
    },

    generateRoundMapping(intel, skills) {
        const hasDSA = Object.values(skills).flat().some(s => ['DSA', 'OOP'].includes(s));
        const hasWeb = Object.values(skills).flat().some(s => ['React', 'Node.js', 'JavaScript'].includes(s));

        if (intel.type === "ENTERPRISE" && hasDSA) {
            return [
                { title: "Online Assessment", explainer: "Filter round covering Aptitude and 2-3 DSA problems." },
                { title: "Technical Interview I", explainer: "Deep dive into DSA, complexity analysis, and Core CS." },
                { title: "Technical Interview II", explainer: "Focus on Projects, System Design, and Problem Solving." },
                { title: "HR / Culture Round", explainer: "Discussion on goals, behavioral traits, and company fit." }
            ];
        } else if (intel.type === "STARTUP" && hasWeb) {
            return [
                { title: "Practical Coding Challenge", explainer: "Take-home task or live pair programming on a real feature." },
                { title: "Technical Discussion", explainer: "Explaining your tech choices, stack depth, and debugging skill." },
                { title: "Founder / Culture fit", explainer: "Checking for ownership mindset and team alignment." }
            ];
        } else {
            return [
                { title: "Initial Screening", explainer: "Brief call to understand your background and experience." },
                { title: "Technical Evaluation", explainer: "Standard round covering your stack and basics." },
                { title: "Final Discussion", explainer: "Closing round with the hiring manager." }
            ];
        }
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
        const index = history.findIndex(e => e.id === entry.id);
        if (index !== -1) {
            history[index] = entry;
        } else {
            history.unshift(entry);
        }
        localStorage.setItem('placement_history', JSON.stringify(history));
    },
    getAll() {
        return JSON.parse(localStorage.getItem('placement_history') || '[]');
    },
    get(id) {
        return this.getAll().find(e => e.id === id);
    }
};

// --- Export Tools ---
const ExportTools = {
    copyText(text) {
        navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    },
    downloadTxt(entry) {
        const skills = Object.entries(entry.extractedSkills).map(([c, s]) => `${c}: ${s.join(', ')}`).join('\n');
        const checklist = entry.checklist.map(r => `${r.title}:\n- ${r.items.join('\n- ')}`).join('\n\n');
        const plan = entry.plan.map(p => `${p.day}: ${p.topics.join(', ')}`).join('\n');
        const questions = entry.questions.map((q, i) => `${i + 1}. [${q.skill}] ${q.text}`).join('\n');

        const content = `Placement Readiness Report: ${entry.company} - ${entry.role}\n` +
            `Score: ${entry.readinessScore}%\n\n` +
            `INTEL:\nIndustry: ${entry.companyIntel.industry}\nSize: ${entry.companyIntel.size}\n\n` +
            `SKILLS:\n${skills}\n\n` +
            `PREPARATION PLAN:\n${plan}\n\n` +
            `ROUND-WISE CHECKLIST:\n${checklist}\n\n` +
            `INTERVIEW QUESTIONS:\n${questions}`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Placement_Report_${entry.company.replace(/\s/g, '_')}.txt`;
        a.click();
    }
};

// --- Routing & UI ---
const routes = {
    'dashboard-content': {
        title: 'Dashboard Overview',
        render: () => {
            const container = document.getElementById('main-content');
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

            const confidence = data.skillConfidenceMap || {};
            const allSkillsList = Object.values(data.extractedSkills).flat();
            const weakSkills = allSkillsList.filter(s => confidence[s] !== 'know').slice(0, 3);
            const intel = data.companyIntel;

            container.innerHTML = `
                <div class="results-grid">
                    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <!-- Readiness Card -->
                        <div class="card">
                            <h3 class="card-title">Readiness Score</h3>
                            <div id="live-score" class="score-badge ${data.readinessScore > 75 ? 'score-high' : (data.readinessScore > 50 ? 'score-mid' : 'score-low')}" style="text-align: center; font-size: 2.5rem; padding: 24px;">
                                ${data.readinessScore}%
                            </div>
                            <div class="export-group">
                                <button class="btn btn-secondary btn-icon-sm" onclick="ExportTools.copyText(HistoryManager.get('${data.id}').plan.map(p => p.day + ': ' + p.topics.join(', ')).join('\\n'))">
                                    <i data-lucide="copy"></i> Plan
                                </button>
                                <button class="btn btn-secondary btn-icon-sm" onclick="ExportTools.downloadTxt(HistoryManager.get('${data.id}'))">
                                    <i data-lucide="download"></i> TXT
                                </button>
                            </div>
                        </div>

                        <!-- Company Intel Card -->
                        <div class="card">
                            <h3 class="card-title">Company Intel</h3>
                            <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text);">${intel.name}</div>
                            <div class="intel-badge-group">
                                <span class="intel-badge">${intel.industry}</span>
                                <span class="intel-badge">${intel.size}</span>
                            </div>
                            <div style="margin-top: var(--space-md); font-size: 0.875rem;">
                                <strong>Hiring Focus:</strong>
                                <div class="hiring-focus-box" style="margin-top: 8px;">
                                    ${intel.hiringFocus}
                                </div>
                            </div>
                            <div class="demo-note">Demo Mode: Company intel generated heuristically.</div>
                        </div>
                        
                        <!-- Skills Card -->
                        <div class="card">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h3 class="card-title" style="margin:0;">Self Assessment</h3>
                                <span style="font-size:10px; color:var(--color-text-muted);">Toggle skills you know</span>
                            </div>
                            ${Object.entries(data.extractedSkills).map(([cat, skills]) => `
                                <div>
                                    <div class="skill-category-label">${cat}</div>
                                    <div class="skill-tag-group">
                                        ${skills.map(s => `
                                            <span class="skill-tag ${confidence[s] === 'know' ? 'active' : ''}" 
                                                  onclick='toggleSkill("${data.id}", "${s}")'>
                                                ${s}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <!-- Round Mapping Timeline -->
                        <div class="card">
                            <h3 class="card-title">Interview Round Mapping</h3>
                            <div class="timeline">
                                ${data.roundMapping.map(round => `
                                    <div class="timeline-item">
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-title">${round.title}</div>
                                            <div class="timeline-explainer">Why it matters: ${round.explainer}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Preparation Plan -->
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

                        <!-- Questions -->
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

                        <!-- Action Box -->
                        <div class="action-box">
                            <div>
                                <h3>Ready to start?</h3>
                                <p>You have ${weakSkills.length} key areas to focus on:</p>
                                <div class="weak-skills-list" style="display: flex; gap: 8px; margin-top: 8px;">
                                    ${weakSkills.map(s => `<span class="weak-skill-chip" style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 11px;">${s}</span>`).join('')}
                                </div>
                            </div>
                            <button class="btn" style="background: white; color: var(--color-primary);" onclick="window.navigateTo('practice')">
                                Start Day 1 Plan
                            </button>
                        </div>
                    </div>
                </div>
            `;

            lucide.createIcons();
        }
    },
    'practice': {
        title: 'Practice Modules',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `<div class="card"><h2>Practice Hub</h2><p>Curated learning modules based on your analysis.</p></div>`;
            lucide.createIcons();
        }
    }
};

function toggleSkill(entryId, skillName) {
    const entry = HistoryManager.get(entryId);
    if (!entry) return;

    if (!entry.skillConfidenceMap) entry.skillConfidenceMap = {};
    if (entry.baseReadinessScore === undefined) entry.baseReadinessScore = entry.readinessScore;

    if (entry.skillConfidenceMap[skillName] === 'know') {
        entry.skillConfidenceMap[skillName] = 'practice';
    } else {
        entry.skillConfidenceMap[skillName] = 'know';
    }

    let dynamicScore = entry.baseReadinessScore;
    Object.values(entry.extractedSkills).flat().forEach(s => {
        if (entry.skillConfidenceMap[s] === 'know') dynamicScore += 2;
        else dynamicScore -= 2;
    });

    entry.readinessScore = Math.max(0, Math.min(100, dynamicScore));
    HistoryManager.save(entry);
    loadRoute('results', entry);
}

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
    const companyIntel = AnalysisEngine.generateCompanyIntel(company, jdText);
    const roundMapping = AnalysisEngine.generateRoundMapping(companyIntel, extractedSkills);
    const checklist = AnalysisEngine.generateChecklist(extractedSkills);
    const plan = AnalysisEngine.generatePlan(extractedSkills);
    const questions = AnalysisEngine.generateQuestions(extractedSkills);

    const entry = {
        id: 'anlyz_' + Date.now(),
        createdAt: new Date().toISOString(),
        company: company || "Unknown Venture",
        role: role || "Graduate Engineer Trainee",
        jdText,
        extractedSkills,
        companyIntel,
        roundMapping,
        baseReadinessScore: score,
        readinessScore: score,
        skillConfidenceMap: {},
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
    const pageTitle = document.getElementById('page-title');

    const route = routes[routeId];
    if (route) {
        pageTitle.innerText = route.title;
        route.render(data);
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${routeId}'`)) {
            item.classList.add('active');
        }
    });

    lucide.createIcons();
}

window.loadRoute = loadRoute;
window.runAnalysis = runAnalysis;
window.viewResult = viewResult;
window.toggleSkill = toggleSkill;
window.ExportTools = ExportTools;
window.navigateTo = navigateTo;
window.HistoryManager = HistoryManager;
