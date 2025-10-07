// Bike Stats Tracking System - Code Lines Edition
class BikeStats {
    constructor() {
        // Load persistent stats from localStorage
        this.totalMeters = parseFloat(localStorage.getItem('totalMeters')) || 0;
        this.totalElevation = parseFloat(localStorage.getItem('totalElevation')) || 0; // FIX: Start at 0

        // FIX: Use sessionStorage for visited pages (resets per session)
        this.visitedPages = JSON.parse(sessionStorage.getItem('visitedPages')) || [];

        // Session tracking
        this.sessionStart = Date.now();
        this.lastScrollPosition = window.scrollY;

        // Page distances (in LINES OF CODE = meters)
        this.pageLineCount = {
            'index.html': 168,
            'about.html': 196,
            'education.html': 157,
            'experience.html': 198,
            'projects.html': 147,
            'skills.html': 161,
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
        const currentPage = this.getCurrentPage();

        // FIX: Check sessionStorage instead of localStorage
        if (!this.visitedPages.includes(currentPage)) {
            const linesOnPage = this.pageLineCount[currentPage] || 100;
            this.totalMeters += linesOnPage;
            this.visitedPages.push(currentPage);

            // Save to correct storage
            localStorage.setItem('totalMeters', this.totalMeters.toString());
            sessionStorage.setItem('visitedPages', JSON.stringify(this.visitedPages)); // SESSION not LOCAL

            console.log(`🚴 Rode through ${linesOnPage} lines of code on ${currentPage}!`);
        }

        // Track scrolling for elevation
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.trackScroll(), 100); // FIX: Increased debounce
        });

        // Update display every second
        this.updateInterval = setInterval(() => this.updateDisplay(), 1000);

        // Initial display
        this.updateDisplay();
    }

    trackScroll() {
        const currentScroll = window.scrollY;
        const scrollDelta = currentScroll - this.lastScrollPosition;

        if (scrollDelta > 0) {
            const elevationGain = scrollDelta * 0.5;
            this.totalElevation += elevationGain;
            localStorage.setItem('totalElevation', this.totalElevation.toString()); // FIX: toString()
        }

        this.lastScrollPosition = currentScroll;
    }

    metersToMiles(meters) {
        return meters * 0.000621371;
    }

    updateDisplay() {
        const milesEl = document.getElementById('total-miles');
        const elevationEl = document.getElementById('elevation');
        const timeEl = document.getElementById('ride-time');
        const speedEl = document.getElementById('avg-speed');

        if (!milesEl) return;

        // FIX: Round values to prevent flickering
        const totalMiles = Math.round(this.metersToMiles(this.totalMeters) * 10) / 10;
        milesEl.textContent = totalMiles.toFixed(1);

        // Update elevation
        elevationEl.textContent = Math.floor(this.totalElevation).toLocaleString();

        // Session time
        const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
        const hours = Math.floor(sessionSeconds / 3600);
        const minutes = Math.floor((sessionSeconds % 3600) / 60);
        const seconds = sessionSeconds % 60;
        timeEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Average speed
        const sessionHours = sessionSeconds / 3600;
        const avgSpeed = sessionHours > 0.001 ? (totalMiles / sessionHours) : 0;
        const displaySpeed = Math.min(Math.round(avgSpeed * 10) / 10, 999);
        speedEl.textContent = displaySpeed.toFixed(1);
    }
}

// Initialize bike stats
let bikeStatsInstance;
if (!bikeStatsInstance) {
    bikeStatsInstance = new BikeStats();
}

// Reset function
function resetBikeStats() {
    if (confirm('Reset all bike stats? This cannot be undone!')) {
        localStorage.removeItem('totalMeters');
        localStorage.removeItem('totalElevation');
        sessionStorage.removeItem('visitedPages');
        location.reload();
    }
}