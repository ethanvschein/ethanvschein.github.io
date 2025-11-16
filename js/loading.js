// ===================================
// LOADING SCREEN FUNCTIONALITY
// ===================================

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');

        // Exit if loading screen doesn't exist
        if (!this.loadingScreen) return;

        this.bikeTrack = document.getElementById('bike-track');
        this.bike = null;
        this.initialLoadTime = 3000;
        this.isLoading = false;

        // Get current page filename and path
        const path = window.location.pathname;
        const fileName = path.split('/').pop();

        // Check if we're in the projects subfolder
        // (not counting the portfolio base folder)
        const isInProjectsFolder = path.includes('/projects/');

        // Is this index.html?
        this.isIndexPage = fileName === 'index.html' || fileName === '' || path.endsWith('/');

        // First index visit?
        this.isFirstIndexVisit = this.isIndexPage && !sessionStorage.getItem('hasSeenInitialIndex');

        // Is this a refresh?
        this.isRefresh = this.checkIfRefresh();

        // Show loading screen on first index visit OR any refresh
        if (this.isFirstIndexVisit || this.isRefresh) {
            this.loadingScreen.classList.add('active');
            this.loadingScreen.style.display = 'flex';
            document.body.classList.add('loading');
            this.isLoading = true;
        } else {
            this.loadingScreen.style.display = 'none';
        }

        // Load SVG with correct path
        this.loadBikeSVG(isInProjectsFolder);
    }

    checkIfRefresh() {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            return navEntries[0].type === 'reload';
        }
        if (performance.navigation) {
            return performance.navigation.type === 1;
        }
        return false;
    }

    async loadBikeSVG(isInProjectsFolder) {
        try {
            // If in projects folder, go up one level (../)
            // Otherwise use current level
            const svgPath = isInProjectsFolder
                ? '../assets/svgs/loading/loading-bike.svg'
                : 'assets/svgs/loading/loading-bike.svg';

            const response = await fetch(svgPath);
            if (!response.ok) throw new Error('SVG load failed');

            const svgText = await response.text();
            this.bikeTrack.innerHTML = svgText;
            this.bike = document.getElementById('loading-bike');

            if ((this.isFirstIndexVisit || this.isRefresh) && this.bike) {
                this.showInitialLoad();
                if (this.isFirstIndexVisit) {
                    sessionStorage.setItem('hasSeenInitialIndex', 'true');
                }
            } else if (!this.bike) {
                this.hide();
            }

            this.init();
        } catch (error) {
            this.hide();
        }
    }

    init() {
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.hide();
            }
        });
    }

    showInitialLoad() {
        if (!this.bike) return;
        
        // Start the animation immediately for smooth movement
        // The page will load behind the loading screen
        const startTime = performance.now();
        const minLoadTime = 2500; // Minimum 2.5 seconds for smooth animation
        
        // Start animation immediately
        this.animateLoading(minLoadTime, () => {
            // Wait for page to fully load before hiding
            const checkLoad = () => {
                if (document.readyState === 'complete') {
                    // Ensure minimum time has passed
                    const elapsed = performance.now() - startTime;
                    const remaining = Math.max(0, minLoadTime - elapsed);
                    setTimeout(() => this.hide(), remaining);
                } else {
                    window.addEventListener('load', () => {
                        const elapsed = performance.now() - startTime;
                        const remaining = Math.max(0, minLoadTime - elapsed);
                        setTimeout(() => this.hide(), remaining);
                    }, { once: true });
                }
            };
            
            checkLoad();
        });
    }

    animateLoading(duration, callback) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            this.updateBikePosition(progress);
            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete, call callback
                if (callback) callback();
            }
        };
        requestAnimationFrame(animate);
    }

    updateBikePosition(progress) {
        if (this.bike && this.bikeTrack) {
            const trackWidth = this.bikeTrack.offsetWidth;
            const bikeWidth = 330;
            const maxPosition = Math.max(0, trackWidth - bikeWidth);
            // Use transform for better performance and smoother animation
            const position = maxPosition * (progress / 100);
            // Use transform for GPU acceleration and smooth movement
            this.bike.style.transform = `translateX(${position}px)`;
        }
    }

    hide() {
        if (!this.loadingScreen) return;
        this.loadingScreen.classList.remove('active');
        document.body.classList.remove('loading');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.isLoading = false;
            if (this.bike) {
                // Reset bike position for next time
                this.bike.style.transform = 'translateX(0)';
            }
        }, 500);
    }
}

const loadingScreen = new LoadingScreen();