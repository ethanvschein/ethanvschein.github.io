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
        this.animateLoading(this.initialLoadTime, () => this.hide());
    }

    animateLoading(duration, callback) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            this.updateBikePosition(progress);
            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(callback, 100);
            }
        };
        requestAnimationFrame(animate);
    }

    updateBikePosition(progress) {
        if (this.bike && this.bikeTrack) {
            const trackWidth = this.bikeTrack.offsetWidth;
            const bikeWidth = 330;
            const maxPosition = Math.max(0, trackWidth - bikeWidth);
            this.bike.style.left = `${maxPosition * (progress / 100)}px`;
        }
    }

    hide() {
        if (!this.loadingScreen) return;
        this.loadingScreen.classList.remove('active');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.isLoading = false;
            if (this.bike) this.bike.style.left = '0px';
        }, 500);
    }
}

const loadingScreen = new LoadingScreen();