// Initialize Lucide icons
lucide.createIcons();

const routes = {
    'dashboard-content': {
        title: 'Dashboard',
        content: `
            <div class="card">
                <h2>Welcome back, Candidate!</h2>
                <p>Track your preparation progress and see upcoming assessments.</p>
                <div style="margin-top: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
                        <h3>Active Streaks</h3>
                        <p style="font-size: 24px; font-weight: 700; color: hsl(245, 58%, 51%);">12 Days</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
                        <h3>Problems Solved</h3>
                        <p style="font-size: 24px; font-weight: 700; color: hsl(245, 58%, 51%);">148</p>
                    </div>
                </div>
            </div>
        `
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

    // Refresh icons
    lucide.createIcons();
}

function loadRoute(routeId) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');

    const route = routes[routeId];
    if (route) {
        mainContent.innerHTML = route.content;
        pageTitle.innerText = route.title;
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(`'${routeId}'`)) {
            item.classList.add('active');
        }
    });

    // Refresh icons in dynamic content
    lucide.createIcons();
}

// Initial load (if needed, default to landing)
window.onload = () => {
    // Current setup starts at landing
};
