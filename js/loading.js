// ===================================
// LOADING SCREEN FUNCTIONALITY
// ===================================

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('progress-bar');
        this.bikeTrack = document.getElementById('bike-track');
        this.bike = null;
        this.minLoadTime = 2000; // 2 seconds for navigation
        this.initialLoadTime = 5000; // 5 seconds for initial load
        this.isLoading = false;

        // Check if this is truly the first visit (use sessionStorage)
        this.isInitialLoad = !sessionStorage.getItem('hasLoadedBefore');

        this.loadBikeSVG();
    }

    async loadBikeSVG() {
        try {
            const path = window.location.pathname;
            const svgPath = path.includes('/projects/')
                ? '../assets/images/loading/loading-bike.svg'
                : 'assets/images/loading/loading-bike.svg';

            const response = await fetch(svgPath);
            const svgText = await response.text();
            this.bikeTrack.innerHTML = svgText;
            this.bike = document.getElementById('loading-bike');

            // Only show initial load on first visit
            if (this.isInitialLoad) {
                this.showInitialLoad();
                sessionStorage.setItem('hasLoadedBefore', 'true');
            }

            // Initialize link handlers
            this.init();
        } catch (error) {
            console.error('Error loading bike SVG:', error);
            this.hide();
        }
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachLinkHandlers();
            });
        } else {
            this.attachLinkHandlers();
        }

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.hide();
            }
        });
    }

    showInitialLoad() {
        if (!this.bike || this.isLoading) return;

        this.isLoading = true;
        const startTime = Date.now();
        const duration = this.initialLoadTime;

        this.loadingScreen.classList.add('active');

        this.animateLoading(duration, () => {
            this.hide();
            this.isInitialLoad = false;
        });
    }

    attachLinkHandlers() {
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.getAttribute('href');

            if (this.isInternalLink(href)) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.show(href);
                });
            }
        });
    }

    isInternalLink(href) {
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('//')) {
            return false;
        }
        return true;
    }

    show(targetUrl) {
        if (this.isLoading || !this.bike) return;

        this.isLoading = true;
        const duration = this.minLoadTime;

        this.loadingScreen.classList.add('active');

        this.animateLoading(duration, () => {
            this.navigate(targetUrl);
        });
    }

    animateLoading(duration, callback) {
        const startTime = Date.now();
        let progress = 0;
        const interval = 16; // ~60fps

        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);

            this.updateProgress(progress);

            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                const remaining = Math.max(0, duration - elapsed);
                setTimeout(callback, remaining);
            }
        };

        requestAnimationFrame(animate);
    }

    updateProgress(progress) {
        // Update progress bar
        this.progressBar.style.width = `${progress}%`;

        // Update bike position - synchronized with progress bar
        if (this.bike && this.bikeTrack) {
            const trackWidth = this.bikeTrack.offsetWidth;
            const bikeWidth = 330; // Updated for 1.5x size

            // Start position: fully visible on left edge (0px)
            // End position: fully visible on right edge (trackWidth - bikeWidth)
            const startPosition = 0;
            const endPosition = trackWidth - bikeWidth;
            const travelDistance = endPosition - startPosition;

            const currentPosition = startPosition + (travelDistance * (progress / 100));

            this.bike.style.left = `${currentPosition}px`;
        }
    }

    navigate(url) {
        window.location.href = url;
    }

    hide() {
        this.loadingScreen.classList.remove('active');
        this.isLoading = false;
        this.progressBar.style.width = '0%';
        if (this.bike) {
            this.bike.style.left = '0px'; // Reset to start position
        }
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();