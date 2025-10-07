// Bike Stats Tracking System - FIXED VERSION
class BikeStats {
    constructor() {
        console.log('🚴 BikeStats initializing...');

        // Get DOM elements first
        this.totalMilesEl = document.getElementById('total-miles');
        this.elevationEl = document.getElementById('elevation');
        this.rideTimeEl = document.getElementById('ride-time');
        this.avgSpeedEl = document.getElementById('avg-speed');

        // Exit if not on stats page
        if (!this.totalMilesEl) {
            console.log('⚠️ Not on stats page, skipping initialization');
            return;
        }

        // ===== FIX: PERSISTENT STATS =====
        this.totalScrollDistance = parseFloat(localStorage.getItem('totalScrollDistance')) || 0;
        this.totalElevation = parseFloat(localStorage.getItem('totalElevation')) || 0;

        console.log(`📊 Loaded stats: ${this.totalScrollDistance.toFixed(1)}m, ${this.totalElevation.toFixed(0)}ft`);

        // ===== FIX: PERSISTENT TIMER =====
        const storedStart = sessionStorage.getItem('bikeSessionStart');
        if (storedStart) {
            this.sessionStart = parseInt(storedStart);
            const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
            console.log(`⏱️ Continuing session (${elapsed}s elapsed)`);
        } else {
            this.sessionStart = Date.now();
            sessionStorage.setItem('bikeSessionStart', this.sessionStart.toString());
            console.log(`⏱️ New session started`);
        }

        // Track scroll
        this.lastScrollPosition = window.scrollY;

        // Page line counts
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
        return path.split('/').pop() || 'index.html';
    }

    getPageLineCount() {
        return this.pageLineCount[this.getCurrentPage()] || 100;
    }

    init() {
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.trackScroll(), 50);
        });

        // Update display every second
        setInterval(() => this.updateDisplay(), 1000);

        // Immediate first update
        this.updateDisplay();

        console.log('✅ BikeStats initialized successfully');
    }

    trackScroll() {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDelta = currentScroll - this.lastScrollPosition;

        // Only count downward scrolling
        if (scrollDelta > 0 && maxScroll > 0) {
            const pageLines = this.getPageLineCount();
            const metersGained = (scrollDelta / maxScroll) * pageLines;

            this.totalScrollDistance += metersGained;
            localStorage.setItem('totalScrollDistance', this.totalScrollDistance.toString());

            // Elevation
            const elevationGain = scrollDelta * 0.5;
            this.totalElevation += elevationGain;
            localStorage.setItem('totalElevation', this.totalElevation.toString());

            console.log(`🚴 +${metersGained.toFixed(1)}m (total: ${this.totalScrollDistance.toFixed(1)}m)`);
        }

        this.lastScrollPosition = currentScroll;
    }

    metersToMiles(meters) {
        return meters * 0.000621371;
    }

    updateDisplay() {
        if (!this.totalMilesEl) return;

        // Miles
        const totalMiles = this.metersToMiles(this.totalScrollDistance);
        this.totalMilesEl.textContent = totalMiles.toFixed(1);

        // Elevation
        this.elevationEl.textContent = Math.floor(this.totalElevation).toLocaleString();

        // Session time
        const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
        const hours = Math.floor(sessionSeconds / 3600);
        const minutes = Math.floor((sessionSeconds % 3600) / 60);
        const seconds = sessionSeconds % 60;
        this.rideTimeEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Speed
        const sessionHours = sessionSeconds / 3600;
        const avgSpeed = sessionHours > 0.001 ? (totalMiles / sessionHours) : 0;
        this.avgSpeedEl.textContent = Math.min(avgSpeed, 999).toFixed(1);
    }
}

// ===== CRITICAL: Wait for DOM before initializing =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, starting BikeStats');
        window.bikeStatsInstance = new BikeStats();
    });
} else {
    console.log('📄 DOM already loaded, starting BikeStats');
    window.bikeStatsInstance = new BikeStats();
}

// Reset function
function resetBikeStats() {
    if (confirm('Reset all bike stats? This cannot be undone!')) {
        localStorage.removeItem('totalScrollDistance');
        localStorage.removeItem('totalElevation');
        sessionStorage.removeItem('bikeSessionStart');
        location.reload();
    }
}