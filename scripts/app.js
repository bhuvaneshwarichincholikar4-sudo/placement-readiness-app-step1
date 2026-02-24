// Initialize Lucide icons
lucide.createIcons();

const routes = {
    'dashboard-content': {
        title: 'Dashboard Overview',
        render: () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <div class="dashboard-grid">
                    <!-- Column 1: Overall Readiness -->
                    <div class="card">
                        <h3 class="card-title">Overall Readiness</h3>
                        <p class="card-desc">Your comprehensive placement preparedness score.</p>
                        <div class="circular-progress-container">
                            <svg class="circular-progress" viewBox="0 0 160 160">
                                <circle class="bg" cx="80" cy="80" r="70"></circle>
                                <circle class="fg" cx="80" cy="80" r="70" style="stroke-dashoffset: ${440 - (440 * 72) / 100};"></circle>
                            </svg>
                            <div class="progress-text">
                                <span class="score">72</span>
                                <span class="label">Readiness Score</span>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Skill Breakdown -->
                    <div class="card">
                        <h3 class="card-title">Skill Breakdown</h3>
                        <p class="card-desc">Analysis across core competency areas.</p>
                        <canvas id="skillRadarChart" style="max-height: 250px;"></canvas>
                    </div>

                    <!-- Column 1: Continue Practice -->
                    <div class="card">
                        <h3 class="card-title">Continue Practice</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="font-weight: 600; font-size: 1.125rem;">Dynamic Programming</p>
                                <p class="card-desc">3 of 10 modules completed</p>
                            </div>
                            <button class="btn btn-primary btn-sm" style="padding: 8px 16px;">
                                Continue
                                <i data-lucide="play" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: 30%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Weekly Goals -->
                    <div class="card">
                        <h3 class="card-title">Weekly Goals</h3>
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar-label">
                                <span>Problems Solved</span>
                                <span style="font-weight: 600;">12/20</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: 60%;"></div>
                            </div>
                        </div>
                        <div class="activity-tracker">
                            <div class="day-circle active">M</div>
                            <div class="day-circle active">T</div>
                            <div class="day-circle active">W</div>
                            <div class="day-circle">T</div>
                            <div class="day-circle active">F</div>
                            <div class="day-circle">S</div>
                            <div class="day-circle">S</div>
                        </div>
                    </div>

                    <!-- Full Width: Upcoming Assessments -->
                    <div class="card" style="grid-column: 1 / -1;">
                        <h3 class="card-title">Upcoming Assessments</h3>
                        <div class="assessment-list">
                            <div class="assessment-item">
                                <div class="assessment-icon"><i data-lucide="code-2"></i></div>
                                <div class="assessment-info">
                                    <div class="assessment-name">DSA Mock Test</div>
                                    <div class="assessment-time">Tomorrow, 10:00 AM</div>
                                </div>
                                <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 12px;">Set Reminder</button>
                            </div>
                            <div class="assessment-item">
                                <div class="assessment-icon"><i data-lucide="layout"></i></div>
                                <div class="assessment-info">
                                    <div class="assessment-name">System Design Review</div>
                                    <div class="assessment-time">Wed, 2:00 PM</div>
                                </div>
                                <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 12px;">Set Reminder</button>
                            </div>
                            <div class="assessment-item">
                                <div class="assessment-icon"><i data-lucide="users-2"></i></div>
                                <div class="assessment-info">
                                    <div class="assessment-name">HR Interview Prep</div>
                                    <div class="assessment-time">Friday, 11:00 AM</div>
                                </div>
                                <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 12px;">Set Reminder</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize Radar Chart
            setTimeout(() => {
                const ctx = document.getElementById('skillRadarChart').getContext('2d');
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['DSA', 'System Design', 'Communication', 'Resume', 'Aptitude'],
                        datasets: [{
                            label: 'Current Skill Level',
                            data: [75, 60, 80, 85, 70],
                            backgroundColor: 'rgba(79, 70, 229, 0.2)',
                            borderColor: 'hsl(245, 58%, 51%)',
                            borderWidth: 2,
                            pointBackgroundColor: 'hsl(245, 58%, 51%)',
                        }]
                    },
                    options: {
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: { display: false }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
                lucide.createIcons();
            }, 0);
        }
    },
    'practice': {
        title: 'Practice',
        content: `
            <div class="card">
                <h2>Practice Problems</h2>
                <p>Solve coding, aptitude, and logical reasoning problems.</p>
            </div>
        `
    },
    'assessments': {
        title: 'Assessments',
        content: `
            <div class="card">
                <h2>Assessments</h2>
                <p>Take mock tests and get detailed feedback on your performance.</p>
            </div>
        `
    },
    'resources': {
        title: 'Resources',
        content: `
            <div class="card">
                <h2>Resources</h2>
                <p>Browse study materials, company-wise preparation guides, and interview tips.</p>
            </div>
        `
    },
    'profile': {
        title: 'Profile',
        content: `
            <div class="card">
                <h2>User Profile</h2>
                <p>Manage your account settings and view your certificates.</p>
            </div>
        `
    }
};

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

function loadRoute(routeId) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');

    const route = routes[routeId];
    if (route) {
        pageTitle.innerText = route.title;
        if (route.render) {
            route.render();
        } else {
            mainContent.innerHTML = route.content;
        }
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(`'${routeId}'`)) {
            item.classList.add('active');
        }
    });

    lucide.createIcons();
}
