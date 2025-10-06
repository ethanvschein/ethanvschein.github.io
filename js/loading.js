class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('progress-bar');
        this.bikeTrack = document.getElementById('bike-track');
        this.bike = null;
        this.minLoadTime = 3000; // 3 seconds for navigation
        this.initialLoadTime = 5000; // 5 seconds for initial load
        this.isLoading = false;
        this.isInitialLoad = true; // Track if this is the first load

        this.loadBikeSVG();
    }

    async loadBikeSVG() {
        try {
            const path = window.location.pathname;
            const svgPath = path.includes('/projects/')
                ? '../assets/images/loading-bike.svg'
                : 'assets/images/loading-bike.svg';

            const response = await fetch(svgPath);
            const svgText = await response.text();
            this.bikeTrack.innerHTML = svgText;
            this.bike = document.getElementById('loading-bike');

            // Initialize after SVG is loaded
            this.init();
        } catch (error) {
            console.error('Error loading bike SVG:', error);
        }
    }

    init() {
        // Show initial loading screen
        this.showInitialLoad();

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachLinkHandlers();
            });
        } else {
            this.attachLinkHandlers();
        }

        // Handle browser back/forward buttons
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.hide();
            }
        });
    }

    showInitialLoad() {
        if (!this.bike) return;

        this.isLoading = true;
        const startTime = Date.now();
        const duration = this.initialLoadTime; // 5 seconds for initial load

        // Show loading screen
        this.loadingScreen.classList.add('active');

        // Animate progress bar and bike
        let progress = 0;
        const interval = 50;
        const increment = (interval / duration) * 100;

        const animationInterval = setInterval(() => {
            progress += increment;

            if (progress >= 100) {
                progress = 100;
                clearInterval(animationInterval);

                // Ensure minimum load time has passed
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, duration - elapsed);

                setTimeout(() => {
                    this.hide();
                    this.isInitialLoad = false; // Mark initial load as complete
                }, remaining);
            }

            this.updateProgress(progress);
        }, interval);
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
        const startTime = Date.now();
        const duration = this.minLoadTime; // 3 seconds for navigation

        // Show loading screen
        this.loadingScreen.classList.add('active');

        // Animate progress bar and bike
        let progress = 0;
        const interval = 50;
        const increment = (interval / duration) * 100;

        const animationInterval = setInterval(() => {
            progress += increment;

            if (progress >= 100) {
                progress = 100;
                clearInterval(animationInterval);

                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, duration - elapsed);

                setTimeout(() => {
                    this.navigate(targetUrl);
                }, remaining);
            }

            this.updateProgress(progress);
        }, interval);
    }

    updateProgress(progress) {
        this.progressBar.style.width = `${progress}%`;

        const bikeTrack = this.bike.parentElement;
        const trackWidth = bikeTrack.offsetWidth;
        const bikeWidth = 220;

        const totalDistance = trackWidth + bikeWidth;
        const currentPosition = -bikeWidth + (totalDistance * (progress / 100));

        this.bike.style.left = `${currentPosition}px`;
    }

    navigate(url) {
        window.location.href = url;
    }

    hide() {
        this.loadingScreen.classList.remove('active');
        this.isLoading = false;
        this.progressBar.style.width = '0%';
        if (this.bike) {
            this.bike.style.left = '-220px';
        }
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();