// Bike Stats Tracking System - Scroll-Based Distance (Re-scroll Counting)
class BikeStats {
    constructor() {
        // Persistent stats from localStorage
        this.totalScrollDistance = parseFloat(localStorage.getItem('totalScrollDistance')) || 0;
        this.totalElevation = parseFloat(localStorage.getItem('totalElevation')) || 0;

        // ===== PERSISTENT SESSION TIMER =====
        const storedSessionStart = sessionStorage.getItem('sessionStart');
        if (storedSessionStart) {
            this.sessionStart = parseInt(storedSessionStart);
            console.log(`🚴 Continuing session from ${new Date(this.sessionStart).toLocaleTimeString()}`);
        } else {
            this.sessionStart = Date.now();
            sessionStorage.setItem('sessionStart', this.sessionStart.toString());
            console.log(`🚴 New session started at ${new Date(this.sessionStart).toLocaleTimeString()}`);
        }

        // Track scroll position (no max tracking - allow re-scrolling!)
        this.lastScrollPosition = window.scrollY;

        // Page line counts (lines of code = meters when fully scrolled)
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

    getPageLineCount() {
        const currentPage = this.getCurrentPage();
        return this.pageLineCount[currentPage] || 100;
    }

    init() {
        // Track scrolling for distance AND elevation
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
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Calculate scroll delta (positive = scrolling down)
        const scrollDelta = currentScroll - this.lastScrollPosition;

        // ===== COUNT ALL DOWNWARD SCROLLING =====
        if (scrollDelta > 0) {
            const pageLines = this.getPageLineCount();

            // Convert pixels scrolled to "meters" based on page line count
            // Formula: (pixels scrolled / total scrollable pixels) × total lines = meters traveled
            const metersGained = (scrollDelta / maxScroll) * pageLines;

            this.totalScrollDistance += metersGained;
            localStorage.setItem('totalScrollDistance', this.totalScrollDistance.toString());

            console.log(`🚴 Distance: +${metersGained.toFixed(2)}m (total: ${this.totalScrollDistance.toFixed(1)}m)`);

            // ELEVATION: Scrolling down = climbing up
            const elevationGain = scrollDelta * 0.5; // 2 pixels = 1 foot
            this.totalElevation += elevationGain;
            localStorage.setItem('totalElevation', this.totalElevation.toString());
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

        if (!milesEl) return; // Not on a page with stats

        // Total Miles (from total scroll distance)
        const totalMiles = this.metersToMiles(this.totalScrollDistance);
        milesEl.textContent = totalMiles.toFixed(1);

        // Elevation
        elevationEl.textContent = Math.floor(this.totalElevation).toLocaleString();

        // Session Time (persists across pages)
        const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
        const hours = Math.floor(sessionSeconds / 3600);
        const minutes = Math.floor((sessionSeconds % 3600) / 60);
        const seconds = sessionSeconds % 60;
        timeEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Average Speed (miles per hour)
        const sessionHours = sessionSeconds / 3600;
        const avgSpeed = sessionHours > 0.001 ? (totalMiles / sessionHours) : 0;
        const displaySpeed = Math.min(avgSpeed, 999);
        speedEl.textContent = displaySpeed.toFixed(1);
    }
}

// Initialize (singleton pattern)
let bikeStatsInstance;
if (!bikeStatsInstance) {
    bikeStatsInstance = new BikeStats();
}

// Reset function
function resetBikeStats() {
    if (confirm('Reset all bike stats? This cannot be undone!')) {
        // Clear all localStorage
        localStorage.removeItem('totalScrollDistance');
        localStorage.removeItem('totalElevation');

        // Clear all sessionStorage
        sessionStorage.clear();

        location.reload();
    }
}