// Bike Stats Tracking System - Code Lines Edition
class BikeStats {
    constructor() {
        // Load persistent stats from localStorage
        this.totalMeters = parseFloat(localStorage.getItem('totalMeters')) || 0;
        this.totalElevation = parseFloat(localStorage.getItem('totalElevation')) || 127420;
        this.visitedPages = JSON.parse(localStorage.getItem('visitedPages')) || [];

        // Session tracking
        this.sessionStart = Date.now();
        this.lastScrollPosition = window.scrollY;

        // Page distances (in LINES OF CODE = meters)
        // Update these with your actual line counts!
        this.pageLineCount = {
            'index.html': 168,
            'about.html': 196,
            'education.html': 157,
            'experience.html': 198,
            'projects.html': 147,
            'skills.html': 161,

            // Project pages
            'sensiblerobotics.html': 1071,
            'kindhumanoid.html': 684,
            'ucsf.html': 688,
            'lamp.html': 712,
            'comsol.html': 699,
            'riscv.html': 112,
            'surge.html': 152
        };

        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    init() {
        // Check if this is a new page visit
        const currentPage = this.getCurrentPage();
        const pageKey = `visited_${currentPage}`;

        // If first visit to this page in this session
        if (!this.visitedPages.includes(currentPage)) {
            const linesOnPage = this.pageLineCount[currentPage] || 100;
            this.totalMeters += linesOnPage;
            this.visitedPages.push(currentPage);

            // Save to localStorage
            localStorage.setItem('totalMeters', this.totalMeters.toFixed(2));
            localStorage.setItem('visitedPages', JSON.stringify(this.visitedPages));

            console.log(`🚴 Rode through ${linesOnPage} lines of code on ${currentPage}!`);
        }

        // Track scrolling for elevation
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.trackScroll(), 50);
        });

        // Update display every second
        setInterval(() => this.updateDisplay(), 1000);

        // Initial display
        this.updateDisplay();
    }

    trackScroll() {
        const currentScroll = window.scrollY;

        // Track elevation (upward scrolling = climbing)
        const scrollDelta = currentScroll - this.lastScrollPosition;

        if (scrollDelta > 0) {
            // Scrolling down page = climbing up in elevation
            // Convert pixels to feet (2 pixels = 1 foot of elevation)
            const elevationGain = scrollDelta * 0.5;
            this.totalElevation += elevationGain;
            localStorage.setItem('totalElevation', Math.floor(this.totalElevation));
        }

        this.lastScrollPosition = currentScroll;
    }

    metersToMiles(meters) {
        return meters * 0.000621371; // 1 meter = 0.000621371 miles
    }

    updateDisplay() {
        // Get display elements
        const milesEl = document.getElementById('total-miles');
        const elevationEl = document.getElementById('elevation');
        const timeEl = document.getElementById('ride-time');
        const speedEl = document.getElementById('avg-speed');

        if (!milesEl) return; // Not on index page

        // Update session time
        const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
        const hours = Math.floor(sessionSeconds / 3600);
        const minutes = Math.floor((sessionSeconds % 3600) / 60);
        const seconds = sessionSeconds % 60;

        timeEl.textContent =
            `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Convert meters to miles and update
        const totalMiles = this.metersToMiles(this.totalMeters);
        milesEl.textContent = totalMiles.toFixed(1);

        // Update elevation (formatted with commas)
        elevationEl.textContent = Math.floor(this.totalElevation).toLocaleString();

        // Calculate and update average speed (mph)
        const sessionHours = sessionSeconds / 3600;
        const avgSpeed = sessionHours > 0.001 ? (totalMiles / sessionHours) : 0;

        // Cap at reasonable speed to avoid crazy numbers at start
        const displaySpeed = Math.min(avgSpeed, 999);
        speedEl.textContent = displaySpeed.toFixed(1);
    }
}

// Initialize bike stats
new BikeStats();

// Reset function
function resetBikeStats() {
    if (confirm('Reset all bike stats? This cannot be undone!')) {
        localStorage.setItem('totalMeters', '0');
        localStorage.setItem('totalElevation', '0');
        localStorage.setItem('visitedPages', '[]');
        location.reload();
    }
}