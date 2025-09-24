// Application data and state management
class ApplicationManager {
    constructor() {
        this.applications = [];
        this.init();
    }

    init() {
        this.loadData();
        this.renderApplications();
        this.updateStatistics();
        this.bindEvents();
    }

    loadData() {
        // Load from localStorage or use sample data
        const savedData = localStorage.getItem('applicationData');
        if (savedData) {
            this.applications = JSON.parse(savedData);
        } else {
            // Sample data from provided JSON
            this.applications = [
                {
                    "id": 1,
                    "timestamp": "2024-09-20T10:30:00Z",
                    "name": "Arjun Kumar",
                    "rollNumber": "21BCE1234",
                    "contact": "9876543210",
                    "team": "Tech Team",
                    "qualification": "Experienced in JavaScript, React, and Node.js. Led multiple projects in college hackathons and have a strong passion for web development.",
                    "eventIdea": "A music recommendation app that uses AI to suggest songs based on mood and weather conditions.",
                    "portfolio": "https://arjunkumar.dev",
                    "status": "New"
                },
                {
                    "id": 2,
                    "timestamp": "2024-09-21T14:15:00Z",
                    "name": "Priya Sharma",
                    "rollNumber": "21BME5678",
                    "contact": "9123456789",
                    "team": "Design Team",
                    "qualification": "Skilled in UI/UX design, Adobe Creative Suite, and Figma. Created brand identities for 5 startups and have experience in user research.",
                    "eventIdea": "",
                    "portfolio": "https://dribbble.com/priyasharma",
                    "status": "New"
                },
                {
                    "id": 3,
                    "timestamp": "2024-09-22T09:45:00Z",
                    "name": "Vikram Singh",
                    "rollNumber": "21BEC9012",
                    "contact": "8765432109",
                    "team": "Marketing Team",
                    "qualification": "Strong background in digital marketing, content creation, and social media management. Managed Instagram accounts with 10K+ followers.",
                    "eventIdea": "An interactive campus event where students can showcase their talents through live streaming and voting.",
                    "portfolio": "",
                    "status": "New"
                },
                {
                    "id": 4,
                    "timestamp": "2024-09-23T16:20:00Z",
                    "name": "Ananya Gupta",
                    "rollNumber": "21BCE3456",
                    "contact": "7654321098",
                    "team": "Tech Team",
                    "qualification": "Full-stack developer with expertise in Python, Django, and databases. Built 3 web applications from scratch and contributed to open source projects.",
                    "eventIdea": "A collaborative music creation platform where multiple users can contribute to the same song remotely.",
                    "portfolio": "https://github.com/ananyagupta",
                    "status": "New"
                }
            ];
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('applicationData', JSON.stringify(this.applications));
    }

    updateApplicationStatus(applicationId, newStatus) {
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
            application.status = newStatus;
            this.saveData();
            this.updateStatistics();
            
            // Update visual status indicator
            const card = document.querySelector(`[data-app-id="${applicationId}"]`);
            if (card) {
                const statusIndicator = card.querySelector('.status-indicator');
                statusIndicator.className = `status-indicator status-${newStatus.toLowerCase()}`;
                statusIndicator.textContent = newStatus;
            }
        }
    }

    renderApplications() {
        const grid = document.getElementById('applications-grid');
        grid.innerHTML = '';

        this.applications.forEach(app => {
            const card = this.createApplicationCard(app);
            grid.appendChild(card);
        });
    }

    createApplicationCard(app) {
        const card = document.createElement('div');
        card.className = 'application-card';
        card.setAttribute('data-app-id', app.id);

        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        card.innerHTML = `
            <div class="application-header">
                <div class="applicant-info">
                    <h3>${app.name}</h3>
                    <div class="applicant-details">
                        <div><strong>Roll:</strong> ${app.rollNumber}</div>
                        <div><strong>Contact:</strong> ${app.contact}</div>
                        <div><strong>Team:</strong> ${app.team}</div>
                        <div><strong>Applied:</strong> ${formatDate(app.timestamp)}</div>
                    </div>
                </div>
                <div class="status-indicator status-${app.status.toLowerCase()}">
                    ${app.status}
                </div>
            </div>

            <div class="application-content">
                <div class="content-section">
                    <div class="content-label">Qualifications</div>
                    <div class="content-text">${app.qualification}</div>
                </div>

                ${app.eventIdea ? `
                    <div class="content-section">
                        <div class="content-label">Event Idea</div>
                        <div class="content-text">${app.eventIdea}</div>
                    </div>
                ` : ''}

                ${app.portfolio ? `
                    <div class="content-section">
                        <div class="content-label">Portfolio</div>
                        <a href="${app.portfolio}" target="_blank" class="portfolio-link">${app.portfolio}</a>
                    </div>
                ` : ''}
            </div>

            <div class="status-controls">
                <label class="status-checkbox shortlist-option">
                    <input type="checkbox" 
                           data-app-id="${app.id}" 
                           data-status="Shortlisted" 
                           ${app.status === 'Shortlisted' ? 'checked' : ''}>
                    Shortlisted
                </label>
                <label class="status-checkbox reject-option">
                    <input type="checkbox" 
                           data-app-id="${app.id}" 
                           data-status="Rejected" 
                           ${app.status === 'Rejected' ? 'checked' : ''}>
                    Rejected
                </label>
            </div>
        `;

        return card;
    }

    bindEvents() {
        // Handle status checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.appId) {
                this.handleStatusChange(e.target);
            }
        });

        // Handle CSV export
        document.getElementById('export-csv').addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    handleStatusChange(checkbox) {
        const appId = parseInt(checkbox.dataset.appId);
        const newStatus = checkbox.dataset.status;
        const card = checkbox.closest('.application-card');
        const allCheckboxes = card.querySelectorAll('input[type="checkbox"]');

        if (checkbox.checked) {
            // Uncheck other checkboxes (mutually exclusive)
            allCheckboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            this.updateApplicationStatus(appId, newStatus);
        } else {
            // If unchecked, set status to "New"
            this.updateApplicationStatus(appId, 'New');
        }
    }

    updateStatistics() {
        const stats = {
            total: this.applications.length,
            new: this.applications.filter(app => app.status === 'New').length,
            shortlisted: this.applications.filter(app => app.status === 'Shortlisted').length,
            rejected: this.applications.filter(app => app.status === 'Rejected').length
        };

        document.getElementById('total-count').textContent = stats.total;
        document.getElementById('new-count').textContent = stats.new;
        document.getElementById('shortlisted-count').textContent = stats.shortlisted;
        document.getElementById('rejected-count').textContent = stats.rejected;
    }

    exportToCSV() {
        const headers = [
            'ID', 'Name', 'Roll Number', 'Contact', 'Team Preference',
            'Qualifications', 'Event Idea', 'Portfolio', 'Status', 'Applied Date'
        ];

        const csvContent = [
            headers.join(','),
            ...this.applications.map(app => [
                app.id,
                `"${app.name}"`,
                app.rollNumber,
                app.contact,
                `"${app.team}"`,
                `"${app.qualification.replace(/"/g, '""')}"`,
                `"${app.eventIdea.replace(/"/g, '""')}"`,
                app.portfolio,
                app.status,
                new Date(app.timestamp).toISOString().split('T')[0]
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ApplicationManager();
});