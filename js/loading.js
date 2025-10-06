// ===================================
// LOADING SCREEN FUNCTIONALITY
// ===================================

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.bikeTrack = document.getElementById('bike-track');
        this.bike = null;
        this.minLoadTime = 1500; // 2 seconds for navigation
        this.initialLoadTime = 3000; // 3 seconds for initial load
        this.isLoading = false;

        // Check if this is truly the first visit
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
            } else {
                // If not initial load, hide immediately
                this.hide();
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

        console.log('Starting initial load animation');
        this.isLoading = true;
        const duration = this.initialLoadTime;

        // Add active class to show loading screen and trigger animations
        this.loadingScreen.classList.add('active');

        this.animateLoading(duration, () => {
            console.log('Initial load complete, hiding now');
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

        console.log('Showing loading for navigation');
        this.isLoading = true;
        const duration = this.minLoadTime;

        // Add active class to show loading screen and trigger animations
        this.loadingScreen.classList.add('active');

        this.animateLoading(duration, () => {
            this.navigate(targetUrl);
        });
    }

    animateLoading(duration, callback) {
        const startTime = Date.now();
        let progress = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);

            this.updateBikePosition(progress);

            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                console.log('Animation complete, executing callback');
                // Ensure callback fires even if there's a tiny delay
                setTimeout(() => {
                    callback();
                }, 100);
            }
        };

        requestAnimationFrame(animate);
    }

    updateBikePosition(progress) {
        if (this.bike && this.bikeTrack) {
            const trackWidth = this.bikeTrack.offsetWidth;
            const bikeWidth = 330;

            // Start at left edge (0), end at right edge
            const startPosition = 0;
            const endPosition = trackWidth - bikeWidth;
            const travelDistance = endPosition - startPosition;

            const currentPosition = startPosition + (travelDistance * (progress / 100));

            this.bike.style.left = `${currentPosition}px`;
        }
    }

    navigate(url) {
        console.log('Navigating to:', url);
        window.location.href = url;
    }

    hide() {
        console.log('Hiding loading screen');
        this.loadingScreen.classList.remove('active');

        // After fade transition, reset state
        setTimeout(() => {
            this.isLoading = false;
            if (this.bike) {
                this.bike.style.left = '0px';
            }
        }, 500); // Match CSS transition duration
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();