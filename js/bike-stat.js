// Bike Stats Tracking System - DEBUG VERSION
class BikeStats {
    constructor() {
        console.log('🚴 BikeStats constructor called');

        // Get DOM elements
        this.totalMilesEl = document.getElementById('total-miles');
        this.elevationEl = document.getElementById('elevation');
        this.rideTimeEl = document.getElementById('ride-time');
        this.avgSpeedEl = document.getElementById('avg-speed');

        console.log('🔍 Elements found:', {
            totalMiles: this.totalMilesEl,
            elevation: this.elevationEl,
            rideTime: this.rideTimeEl,
            avgSpeed: this.avgSpeedEl
        });

        // Exit if not on stats page
        if (!this.totalMilesEl) {
            console.log('⚠️ total-miles element not found!');
            return;
        }

        console.log('📊 Current display values:', {
            miles: this.totalMilesEl.textContent,
            elevation: this.elevationEl.textContent,
            time: this.rideTimeEl.textContent,
            speed: this.avgSpeedEl.textContent
        });

        // Load stats
        this.totalScrollDistance = parseFloat(localStorage.getItem('totalScrollDistance')) || 0;
        this.totalElevation = parseFloat(localStorage.getItem('totalElevation')) || 0;

        console.log('💾 Loaded from localStorage:', {
            distance: this.totalScrollDistance,
            elevation: this.totalElevation
        });

        // Timer
        const storedStart = sessionStorage.getItem('bikeSessionStart');
        if (storedStart) {
            this.sessionStart = parseInt(storedStart);
            console.log('⏱️ Continuing session');
        } else {
            this.sessionStart = Date.now();
            sessionStorage.setItem('bikeSessionStart', this.sessionStart.toString());
            console.log('⏱️ New session started');
        }

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
        console.log('🎯 Initializing...');

        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.trackScroll(), 50);
        });

        // Update display every second
        this.updateInterval = setInterval(() => this.updateDisplay(), 1000);

        // IMMEDIATE first update
        console.log('🔄 Calling updateDisplay() NOW...');
        this.updateDisplay();

        console.log('✅ Init complete');
    }

    trackScroll() {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDelta = currentScroll - this.lastScrollPosition;

        if (scrollDelta > 0 && maxScroll > 0) {
            const pageLines = this.getPageLineCount();
            const metersGained = (scrollDelta / maxScroll) * pageLines;

            this.totalScrollDistance += metersGained;
            localStorage.setItem('totalScrollDistance', this.totalScrollDistance.toString());

            const elevationGain = scrollDelta * 0.5;
            this.totalElevation += elevationGain;
            localStorage.setItem('totalElevation', this.totalElevation.toString());

            console.log(`🚴 Scroll: +${metersGained.toFixed(1)}m, +${elevationGain.toFixed(0)}ft`);
        }

        this.lastScrollPosition = currentScroll;
    }

    metersToMiles(meters) {
        return meters * 0.000621371;
    }

    updateDisplay() {
        console.log('🔄 updateDisplay() called');

        if (!this.totalMilesEl) {
            console.error('❌ totalMilesEl is null!');
            return;
        }

        // Calculate values
        const totalMiles = this.metersToMiles(this.totalScrollDistance);
        const sessionSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
        const hours = Math.floor(sessionSeconds / 3600);
        const minutes = Math.floor((sessionSeconds % 3600) / 60);
        const seconds = sessionSeconds % 60;
        const sessionHours = sessionSeconds / 3600;
        const avgSpeed = sessionHours > 0.001 ? (totalMiles / sessionHours) : 0;

        console.log('📊 Setting values:', {
            miles: totalMiles.toFixed(1),
            elevation: Math.floor(this.totalElevation),
            time: `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            speed: Math.min(avgSpeed, 999).toFixed(1)
        });

        // Update DOM
        this.totalMilesEl.textContent = totalMiles.toFixed(1);
        this.elevationEl.textContent = Math.floor(this.totalElevation).toLocaleString();
        this.rideTimeEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.avgSpeedEl.textContent = Math.min(avgSpeed, 999).toFixed(1);

        console.log('✅ DOM updated');
    }
}

// Initialize with detailed logging
console.log('📜 bike-stat.js loaded, readyState:', document.readyState);

if (!window.bikeStatsInstance) {
    if (document.readyState === 'loading') {
        console.log('⏳ Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOMContentLoaded fired, creating BikeStats');
            window.bikeStatsInstance = new BikeStats();
        });
    } else {
        console.log('📄 DOM already ready, creating BikeStats immediately');
        window.bikeStatsInstance = new BikeStats();
    }
} else {
    console.log('⚠️ BikeStats instance already exists');
}

function resetBikeStats() {
    if (confirm('Reset all bike stats?')) {
        localStorage.removeItem('totalScrollDistance');
        localStorage.removeItem('totalElevation');
        sessionStorage.removeItem('bikeSessionStart');
        location.reload();
    }
}