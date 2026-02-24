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

const TEST_CHECKLIST_SCHEMA = [
    { id: 't1', label: 'JD required validation works', hint: 'Go to Job Analysis and try to analyze with empty JD.' },
    { id: 't2', label: 'Short JD warning shows for <200 chars', hint: 'Paste a very short sentence in the JD and check for amber warning.' },
    { id: 't3', label: 'Skills extraction groups correctly', hint: 'Paste "React, Java, SQL" and check if tags appear in correct sections.' },
    { id: 't4', label: 'Round mapping changes based on company + skills', hint: 'Try "Google" vs "MyStartup" to see different timelines.' },
    { id: 't5', label: 'Score calculation is deterministic', hint: 'Same JD should result in same base score every time.' },
    { id: 't6', label: 'Skill toggles update score live', hint: 'Toggle a skill tag on the results page and watch the score badge.' },
    { id: 't7', label: 'Changes persist after refresh', hint: 'Toggle a skill, refresh the page, and check if it stayed toggled.' },
    { id: 't8', label: 'History saves and loads correctly', hint: 'Go to Analysis History and click an old entry.' },
    { id: 't9', label: 'Export buttons copy the correct content', hint: 'Click "Copy Plan" and paste it into a notepad.' },
    { id: 't10', label: 'No console errors on core pages', hint: 'Open dev tools (F12) and check the Console tab.' }
];

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

// --- History & Storage Management ---
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
            return history.filter(entry => entry && entry.id && entry.jdText);
        } catch (e) {
            return [];
        }
    },
    get(id) {
        return this.getAll().find(e => e.id === id);
    },
    getChecklist() {
        return JSON.parse(localStorage.getItem('prp_test_checklist') || '{}');
    },
    saveChecklist(data) {
        localStorage.setItem('prp_test_checklist', JSON.stringify(data));
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
    'dashboard-content': { title: 'Dashboard Overview', render: () => renderDashboard() },
    'assessments': { title: 'Job Description Analysis', render: () => renderAnalysisForm() },
    'history': { title: 'Analysis History', render: () => renderHistory() },
    'results': { title: 'Preparation Analysis', render: (data) => renderResults(data) },
    'prp-test': { title: 'Built-in Test Checklist', render: () => renderTestChecklist() },
    'prp-ship': { title: 'Ready to Ship', render: () => renderShipLock() }
};

function renderDashboard() {
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
            <div class="card">
                <h3 class="card-title">Test Environment</h3>
                <p>Verify all features before final deployment.</p>
                <button class="btn btn-secondary" onclick="loadRoute('prp-test')">Go to Checklist</button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderAnalysisForm() {
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

function renderHistory() {
    const container = document.getElementById('main-content');
    const history = HistoryManager.getAll();
    if (history.length === 0) {
        container.innerHTML = `<div class="card" style="text-align: center; padding: 64px;"><h3>Empty History</h3><p>Start by analyzing your first job description.</p></div>`;
    } else {
        container.innerHTML = `<div class="history-list">${history.map(item => `
            <div class="history-item" onclick="viewResult('${item.id}')">
                <div class="history-info">
                    <h4>${item.company || 'Unknown'} — ${item.role || 'Dev'}</h4>
                    <span class="history-meta">${new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="score-badge ${item.finalScore > 75 ? 'score-high' : 'score-mid'}">${item.finalScore}%</div>
            </div>
        `).join('')}</div>`;
    }
    lucide.createIcons();
}

function renderResults(data) {
    if (!data) return loadRoute('dashboard-content');
    const container = document.getElementById('main-content');
    const confidence = data.skillConfidenceMap || {};
    const weakSkills = Object.values(data.extractedSkills).flat().filter(s => confidence[s] !== 'know').slice(0, 3);

    container.innerHTML = `
        <div class="results-grid">
            <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                <div class="card">
                    <div id="live-score" class="score-badge ${data.finalScore > 75 ? 'score-high' : 'score-mid'}" style="text-align: center; font-size: 2.5rem; padding: 24px;">${data.finalScore}%</div>
                    <div class="export-group">
                        <button class="btn btn-secondary btn-icon-sm" onclick="ExportTools.downloadTxt(HistoryManager.get('${data.id}'))"><i data-lucide="download"></i> TXT</button>
                    </div>
                </div>
                <div class="card">
                    <h3 class="card-title">Self Assessment</h3>
                    ${Object.entries(data.extractedSkills).filter(([c, s]) => s.length > 0).map(([cat, skills]) => `
                        <div>
                            <div class="skill-category-label">${cat}</div>
                            <div class="skill-tag-group">
                                ${skills.map(s => `<span class="skill-tag ${confidence[s] === 'know' ? 'active' : ''}" onclick='toggleSkill("${data.id}", "${s}")'>${s}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
                <div class="card">
                    <h3 class="card-title">Interview Round Mapping</h3>
                    <div class="timeline">
                        ${data.roundMapping.map(r => `<div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><div class="timeline-title">${r.roundTitle}</div><div class="timeline-explainer">${r.whyItMatters}</div></div></div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderTestChecklist() {
    const container = document.getElementById('main-content');
    const saved = HistoryManager.getChecklist();
    const passedCount = TEST_CHECKLIST_SCHEMA.filter(t => saved[t.id]).length;

    container.innerHTML = `
        <div class="checklist-container">
            <div class="status-box ${passedCount === 10 ? 'status-success' : 'status-warning'}">
                <h3 style="margin:0;">Tests Passed: ${passedCount} / 10</h3>
                ${passedCount < 10 ? '<p style="margin-top:8px;">Fix issues before shipping.</p>' : '<p style="margin-top:8px;">All tests passed! Ready to ship.</p>'}
            </div>
            
            <div class="card">
                ${TEST_CHECKLIST_SCHEMA.map(test => `
                    <div class="checklist-item ${saved[test.id] ? 'checked' : ''}">
                        <input type="checkbox" id="${test.id}" ${saved[test.id] ? 'checked' : ''} onchange="toggleCheck('${test.id}')">
                        <div style="flex:1;">
                            <label for="${test.id}" style="font-weight:700; cursor:pointer;">${test.label}</label>
                            <div class="checklist-hint">How to test: ${test.hint}</div>
                        </div>
                    </div>
                `).join('')}
                
                <div style="display:flex; gap:16px; margin-top:24px;">
                    <button class="btn btn-secondary" onclick="resetChecklist()">Reset Checklist</button>
                    <button class="btn btn-primary" onclick="loadRoute('prp-ship')">Proceed to Ship</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderShipLock() {
    const container = document.getElementById('main-content');
    const saved = HistoryManager.getChecklist();
    const passedCount = TEST_CHECKLIST_SCHEMA.filter(t => saved[t.id]).length;

    if (passedCount < 10) {
        container.innerHTML = `
            <div class="lock-screen card">
                <i data-lucide="lock" class="lock-icon" style="margin: 0 auto;"></i>
                <h2>Route Locked</h2>
                <p>Final shipping is locked until all 10 checklist items are verified.</p>
                <button class="btn btn-primary" onclick="loadRoute('prp-test')" style="margin-top:24px; align-self:center;">Return to Checklist</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="lock-screen card">
                <i data-lucide="unlock" class="lock-icon" style="margin:0 auto; color: var(--color-primary);"></i>
                <h2>Ready to Ship!</h2>
                <p>All quality checks passed. The platform is hardened and ready for production.</p>
                <button class="btn btn-primary" onclick="alert('Platform deployed to production!')" style="margin-top:24px; align-self:center;">Final Deploy</button>
            </div>
        `;
    }
    lucide.createIcons();
}

function toggleCheck(id) {
    const saved = HistoryManager.getChecklist();
    saved[id] = !saved[id];
    HistoryManager.saveChecklist(saved);
    renderTestChecklist();
}

function resetChecklist() {
    HistoryManager.saveChecklist({});
    renderTestChecklist();
}

function toggleSkill(entryId, skillName) {
    const entry = HistoryManager.get(entryId);
    if (!entry) return;
    if (!entry.skillConfidenceMap) entry.skillConfidenceMap = {};
    entry.skillConfidenceMap[skillName] = (entry.skillConfidenceMap[skillName] === 'know') ? 'practice' : 'know';
    let offset = 0;
    Object.values(entry.extractedSkills).flat().forEach(s => {
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
    if (!jdText.trim()) { alert("Job Description is required."); return; }
    if (jdText.length < 200) { warning.style.display = 'block'; window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else { warning.style.display = 'none'; }
    const extractedSkills = AnalysisEngine.extractSkills(jdText);
    const baseScore = AnalysisEngine.calculateBaseScore({ company, role, jdText, extractedSkills });
    const intel = AnalysisEngine.generateCompanyIntel(company, jdText);
    const roundMapping = AnalysisEngine.generateRoundMapping(intel, extractedSkills);
    const entry = {
        id: 'anlyz_' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        company, role, jdText, extractedSkills, roundMapping, checklist: AnalysisEngine.generateChecklist(extractedSkills),
        plan7Days: AnalysisEngine.generatePlan(extractedSkills), questions: AnalysisEngine.generateQuestions(extractedSkills),
        baseScore, skillConfidenceMap: {}, finalScore: baseScore
    };
    HistoryManager.save(entry);
    loadRoute('results', entry);
}

function viewResult(id) {
    const entry = HistoryManager.get(id);
    if (entry) loadRoute('results', entry);
}

function loadRoute(routeId, data = null) {
    const pageTitle = document.getElementById('page-title');
    const route = routes[routeId];
    if (route) { pageTitle.innerText = route.title; route.render(data); }
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${routeId}'`)) item.classList.add('active');
    });
    lucide.createIcons();
}

window.loadRoute = loadRoute;
window.runAnalysis = runAnalysis;
window.viewResult = viewResult;
window.toggleSkill = toggleSkill;
window.toggleCheck = toggleCheck;
window.resetChecklist = resetChecklist;
window.navigateTo = (v) => {
    document.getElementById('landing-page').classList.toggle('hidden', v === 'dashboard');
    document.getElementById('dashboard-layout').classList.toggle('hidden', v !== 'dashboard');
    if (v === 'dashboard') loadRoute('dashboard-content');
};
window.ExportTools = ExportTools;
window.HistoryManager = HistoryManager;
