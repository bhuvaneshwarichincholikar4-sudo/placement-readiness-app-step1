// Initialize Lucide icons
lucide.createIcons();

// --- Constants & Configuration ---
const SKILL_CATEGORIES = {
    coreCS: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    web: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    data: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    testing: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
};

const DEFAULT_EXTRACTED_SKILLS = {
    coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: ["Communication", "Problem solving", "Basic coding", "Projects"]
};

const ENTERPRISES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Infosys', 'TCS', 'Wipro', 'HCL', 'Accenture', 'Cognizant', 'IBM', 'Adobe', 'Oracle', 'Salesforce'];

// --- Analysis Engine ---
const AnalysisEngine = {
    extractSkills(text) {
        const found = { coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: [] };
        const lowerText = text.toLowerCase();
        let isEmpty = true;

        for (const [catId, keywords] of Object.entries(SKILL_CATEGORIES)) {
            keywords.forEach(kw => {
                const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(lowerText)) {
                    found[catId].push(kw);
                    isEmpty = false;
                }
            });
        }

        if (isEmpty) return JSON.parse(JSON.stringify(DEFAULT_EXTRACTED_SKILLS));
        return found;
    },

    calculateBaseScore(data) {
        let score = 35;
        const allSkills = Object.values(data.extractedSkills).flat();
        const catsWithSkills = Object.entries(data.extractedSkills).filter(([k, v]) => v.length > 0 && k !== 'other').length;

        score += Math.min(catsWithSkills * 5, 30);
        if (data.company.trim()) score += 10;
        if (data.role.trim()) score += 10;
        if (data.jdText.length > 800) score += 10;

        return Math.min(score, 100);
    },

    generateCompanyIntel(companyName, jdText) {
        const lowerName = companyName.toLowerCase();
        const lowerJd = jdText.toLowerCase();
        const isEnterprise = ENTERPRISES.some(e => lowerName.includes(e.toLowerCase()));

        let industry = "Technology Services";
        if (/bank|cash|pay|invest|finance/.test(lowerJd)) industry = "FinTech";
        else if (/health|medical|medicine/.test(lowerJd)) industry = "HealthTech";
        else if (/shop|buy|commerce/.test(lowerJd)) industry = "E-commerce";

        const type = isEnterprise ? "ENTERPRISE" : "STARTUP";
        return {
            name: companyName || "Unknown Venture",
            industry,
            size: isEnterprise ? "Enterprise (2000+)" : "Startup (<200)",
            type,
            hiringFocus: isEnterprise
                ? "Highly structured interviews focused on DSA, core CS fundamentals, and scalability."
                : "Practical, fast-paced assessment focused on stack depth and immediate problem-solving impact."
        };
    },

    generateRoundMapping(intel, skills) {
        const allSkills = Object.values(skills).flat();
        const hasDSA = allSkills.some(s => ['DSA', 'OOP'].includes(s));
        const hasWeb = allSkills.some(s => ['React', 'Node.js', 'JavaScript'].includes(s));

        if (intel.type === "ENTERPRISE") {
            return [
                { roundTitle: "Online Assessment", focusAreas: ["DSA", "Aptitude"], whyItMatters: "Standard filter round to test logic and speed." },
                { roundTitle: "Technical I", focusAreas: ["DSA", "Core CS"], whyItMatters: "Deep dive into problem solving and computer science fundamentals." },
                { roundTitle: "Technical II", focusAreas: ["System Design", "Projects"], whyItMatters: "Evaluating architecture knowledge and practical experience." },
                { roundTitle: "HR", focusAreas: ["Culture", "Goals"], whyItMatters: "Checking long-term alignment and behavioral fit." }
            ];
        } else {
            return [
                { roundTitle: "Initial Screen", focusAreas: ["Experience", "Tech Stack"], whyItMatters: "Filter for candidates with the right tech-stack relevance." },
                { roundTitle: "Practical Coding", focusAreas: ["Live Feature", "Debugging"], whyItMatters: "Assessment of how you write and reason about real code." },
                { roundTitle: "Culture Fit", focusAreas: ["Ownership", "Grit"], whyItMatters: "Crucial for startup teams where high initiative is required." }
            ];
        }
    },

    generateChecklist(skills) {
        const allSkills = Object.values(skills).flat();
        return [
            { roundTitle: "Basics & Aptitude", items: ["Quantitative Aptitude", "Logical Reasoning", "Language Syntax Highlights"] },
            { roundTitle: "DSA focus", items: allSkills.includes('DSA') ? ["Searching/Sorting", "Graph/Tree Basics", "Complexity Analysis"] : ["Basic Arrays", "String manipulation", "Logic checks"] },
            { roundTitle: "Stack & Projects", items: ["Resume project walk-through", "Tech-stack deep dive", "API/Database fundamentals"] }
        ];
    },

    generatePlan(skills) {
        const allSkills = Object.values(skills).flat();
        return [
            { day: "Day 1", focus: "Core CS", tasks: ["Revise OOP/DBMS basics", "Practice 2 Easy DSA problems"] },
            { day: "Day 2-3", focus: "Stack Focus", tasks: ["Detailed revision of " + (allSkills[0] || "Basics"), "Implement a small core feature"] },
            { day: "Day 4-5", focus: "Interview Prep", tasks: ["Mock technical round", "Review project explanations"] },
            { day: "Day 6-7", focus: "Final Polish", tasks: ["Company research", "Behavioral questions prep"] }
        ];
    },

    generateQuestions(skills) {
        const allSkills = Object.values(skills).flat();
        const defaults = ["Tell me about your tech stack choice.", "How do you handle complex bugs?", "Explain your most significant project."];
        return [...allSkills.slice(0, 7).map(s => `Explain the core concepts of ${s}.`), ...defaults].slice(0, 10);
    }
};

// --- History Management ---
const HistoryManager = {
    save(entry) {
        const history = this.getAll();
        const index = history.findIndex(e => e.id === entry.id);
        entry.updatedAt = new Date().toISOString();
        if (index !== -1) {
            history[index] = entry;
        } else {
            history.unshift(entry);
        }
        localStorage.setItem('placement_history_v2', JSON.stringify(history));
    },
    getAll() {
        const raw = localStorage.getItem('placement_history_v2');
        if (!raw) return [];
        try {
            const history = JSON.parse(raw);
            const validHistory = [];
            let corruptionFound = false;

            history.forEach(entry => {
                if (entry && entry.id && entry.jdText) {
                    validHistory.push(entry);
                } else {
                    corruptionFound = true;
                }
            });

            if (corruptionFound) {
                console.warn("Skipped corrupted entries.");
                // We keep valid ones
            }
            return validHistory;
        } catch (e) {
            console.error("Critical storage corruption. Initializing empty history.");
            return [];
        }
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
        const checklist = entry.checklist.map(r => `${r.roundTitle}:\n- ${r.items.join('\n- ')}`).join('\n\n');
        const plan = entry.plan7Days.map(p => `${p.day} [${p.focus}]: ${p.tasks.join(', ')}`).join('\n');
        const questions = entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

        const content = `Placement Readiness Report: ${entry.company || "Unknown"} - ${entry.role || "Dev"}\n` +
            `Score: ${entry.finalScore}%\n\n` +
            `SKILLS:\n${skills}\n\n` +
            `ROUND MAPPING:\n${entry.roundMapping.map(r => `${r.roundTitle}: ${r.focusAreas.join(', ')}`).join('\n')}\n\n` +
            `PREPARATION PLAN:\n${plan}\n\n` +
            `ROUND-WISE CHECKLIST:\n${checklist}\n\n` +
            `INTERVIEW QUESTIONS:\n${questions}`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Placement_Report_${(entry.company || 'Report').replace(/\s/g, '_')}.txt`;
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
                        <div id="validation-warning" style="display:none; background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;">
                            This JD is too short to analyze deeply. Paste full JD for better output.
                        </div>
                        <div class="input-group">
                            <label>Company Name (Optional)</label>
                            <input type="text" id="company" class="input-field" placeholder="e.g. Google, Microsoft">
                        </div>
                        <div class="input-group">
                            <label>Target Role (Optional)</label>
                            <input type="text" id="role" class="input-field" placeholder="e.g. Software Engineer, Backend Dev">
                        </div>
                        <div class="input-group">
                            <label>Job Description <span style="color:red;">*</span></label>
                            <textarea id="jdText" class="input-field" placeholder="Paste the full JD here... (Minimum 200 chars recommended)"></textarea>
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
                        <h3>Empty History</h3>
                        <p>One saved entry couldn't be loaded or no history exists. Create a new analysis.</p>
                        <button class="btn btn-primary" onclick="loadRoute('assessments')" style="margin-top: 24px;">Start Now</button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="history-list">
                        ${history.map(item => `
                            <div class="history-item" onclick="viewResult('${item.id}')">
                                <div class="history-info">
                                    <h4>${item.company || 'Unknown'} — ${item.role || 'Dev'}</h4>
                                    <span class="history-meta">${new Date(item.createdAt).toLocaleDateString()} • Updated ${new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div class="score-badge ${item.finalScore > 75 ? 'score-high' : (item.finalScore > 50 ? 'score-mid' : 'score-low')}">
                                    ${item.finalScore}%
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

            container.innerHTML = `
                <div class="results-grid">
                    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                        <div class="card">
                            <h3 class="card-title">Readiness Score</h3>
                            <div id="live-score" class="score-badge ${data.finalScore > 75 ? 'score-high' : (data.finalScore > 50 ? 'score-mid' : 'score-low')}" style="text-align: center; font-size: 2.5rem; padding: 24px;">
                                ${data.finalScore}%
                            </div>
                            <div class="export-group">
                                <button class="btn btn-secondary btn-icon-sm" onclick="ExportTools.copyText(HistoryManager.get('${data.id}').plan7Days.map(p => p.day + ': ' + p.focus).join('\\n'))">
                                    <i data-lucide="copy"></i> Plan
                                </button>
                                <button class="btn btn-secondary btn-icon-sm" onclick="ExportTools.downloadTxt(HistoryManager.get('${data.id}'))">
                                    <i data-lucide="download"></i> TXT
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">Company Intel</h3>
                            <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text);">${data.company || "General Recruitment"}</div>
                            <div class="intel-badge-group">
                                <span class="intel-badge">${data.roundMapping[0] ? (data.roundMapping.length > 3 ? 'Enterprise' : 'Startup') : 'General'}</span>
                                <span class="intel-badge">Heuristic Analysis</span>
                            </div>
                            <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 12px; font-style: italic;">Note: Intel is generated heuristically for demo purposes.</p>
                        </div>
                        
                        <div class="card">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h3 class="card-title" style="margin:0;">Self Assessment</h3>
                                <span style="font-size:10px; color:var(--color-text-muted);">Toggle skills you know</span>
                            </div>
                            ${Object.entries(data.extractedSkills).filter(([c, s]) => s.length > 0).map(([cat, skills]) => `
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
                        <div class="card">
                            <h3 class="card-title">Interview Round Mapping</h3>
                            <div class="timeline">
                                ${data.roundMapping.map(round => `
                                    <div class="timeline-item">
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-title">${round.roundTitle}</div>
                                            <div style="font-size: 12px; color:var(--color-primary); font-weight:600;">Focus: ${round.focusAreas.join(', ')}</div>
                                            <div class="timeline-explainer">${round.whyItMatters}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">7-Day Preparation Plan</h3>
                            <div class="plan-list">
                                ${data.plan7Days.map(p => `
                                    <div class="plan-day">
                                        <div style="font-weight: 700; color: var(--color-primary);">${p.day} — ${p.focus}</div>
                                        <ul style="margin-top: 4px; font-size: 0.9375rem; list-style: disc; padding-left: 16px;">
                                            ${p.tasks.map(t => `<li>${t}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">Key Interview Questions</h3>
                            <div class="question-list">
                                ${data.questions.map((q, i) => `
                                    <div class="question-item">
                                        <div class="question-text">${i + 1}. ${q}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="action-box">
                            <div>
                                <h3>Action Next</h3>
                                <p>Focus on these ${weakSkills.length} areas first:</p>
                                <div class="weak-skills-list" style="display: flex; gap: 8px; margin-top: 8px;">
                                    ${weakSkills.map(s => `<span class="weak-skill-chip" style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 11px;">${s}</span>`).join('')}
                                </div>
                            </div>
                            <button class="btn" style="background: white; color: var(--color-primary);" onclick="window.navigateTo('dashboard')">
                                Start Training
                            </button>
                        </div>
                    </div>
                </div>
            `;

            lucide.createIcons();
        }
    }
};

function toggleSkill(entryId, skillName) {
    const entry = HistoryManager.get(entryId);
    if (!entry) return;

    if (!entry.skillConfidenceMap) entry.skillConfidenceMap = {};

    if (entry.skillConfidenceMap[skillName] === 'know') {
        entry.skillConfidenceMap[skillName] = 'practice';
    } else {
        entry.skillConfidenceMap[skillName] = 'know';
    }

    let offset = 0;
    const allSkills = Object.values(entry.extractedSkills).flat();
    allSkills.forEach(s => {
        if (entry.skillConfidenceMap[s] === 'know') offset += 2;
        else offset -= 2;
    });

    entry.finalScore = Math.max(0, Math.min(100, entry.baseScore + offset));
    HistoryManager.save(entry);
    loadRoute('results', entry);
}

function runAnalysis() {
    const company = document.getElementById('company').value;
    const role = document.getElementById('role').value;
    const jdText = document.getElementById('jdText').value;
    const warning = document.getElementById('validation-warning');

    if (!jdText.trim()) {
        alert("Job Description is required to run analysis.");
        return;
    }

    if (jdText.length < 200) {
        warning.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // We still allow it but show warning
    } else {
        warning.style.display = 'none';
    }

    const extractedSkills = AnalysisEngine.extractSkills(jdText);
    const baseScore = AnalysisEngine.calculateBaseScore({ company, role, jdText, extractedSkills });
    const intel = AnalysisEngine.generateCompanyIntel(company, jdText);
    const roundMapping = AnalysisEngine.generateRoundMapping(intel, extractedSkills);
    const checklist = AnalysisEngine.generateChecklist(extractedSkills);
    const plan7Days = AnalysisEngine.generatePlan(extractedSkills);
    const questions = AnalysisEngine.generateQuestions(extractedSkills);

    const entry = {
        id: 'anlyz_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills,
        roundMapping,
        checklist,
        plan7Days,
        questions,
        baseScore: baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore
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
window.navigateTo = navigateTo;
window.ExportTools = ExportTools;
window.HistoryManager = HistoryManager;
