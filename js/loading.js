// ===================================
// LOADING SCREEN FUNCTIONALITY
// ===================================

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');

        // Exit if loading screen doesn't exist on this page
        if (!this.loadingScreen) return;

        this.bikeTrack = document.getElementById('bike-track');
        this.bike = null;
        this.initialLoadTime = 3000;
        this.isLoading = false;

        // Check if we're on index.html
        this.isIndexPage = window.location.pathname === '/' ||
                           window.location.pathname.endsWith('index.html') ||
                           window.location.pathname.endsWith('/');

        // Check if this is the first visit to index.html
        this.isFirstIndexVisit = this.isIndexPage && !sessionStorage.getItem('hasSeenInitialIndex');

        // Check if this is a refresh
        this.isRefresh = this.checkIfRefresh();

        // Show loading screen if:
        // 1. First visit to index.html, OR
        // 2. Refresh on ANY page
        if (this.isFirstIndexVisit || this.isRefresh) {
            this.loadingScreen.classList.add('active');
            this.loadingScreen.style.display = 'flex';
            this.isLoading = true;
        } else {
            this.loadingScreen.style.display = 'none';
        }

        this.loadBikeSVG();
    }

    checkIfRefresh() {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            const navEntry = navEntries[0];
            return navEntry.type === 'reload';
        }

        if (performance.navigation) {
            return performance.navigation.type === 1;
        }

        return false;
    }

    async loadBikeSVG() {
        try {
            // Determine correct SVG path based on current location
            const path = window.location.pathname;
            const svgPath = path.includes('/projects/')
                ? '../assets/svgs/loading/loading-bike.svg'
                : 'assets/svgs/loading/loading-bike.svg';

            const response = await fetch(svgPath);
            const svgText = await response.text();
            this.bikeTrack.innerHTML = svgText;
            this.bike = document.getElementById('loading-bike');

            // Start animation if conditions are met
            if (this.isFirstIndexVisit || this.isRefresh) {
                this.showInitialLoad();

                // Mark that we've seen the initial index page
                if (this.isFirstIndexVisit) {
                    sessionStorage.setItem('hasSeenInitialIndex', 'true');
                }
            }

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
        if (!this.bike) return;

        this.animateLoading(this.initialLoadTime, () => {
            this.hide();
        });
    }

    attachLinkHandlers() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (this.isInternalLink(href)) {
                link.addEventListener('click', (e) => {
                    return;
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
                setTimeout(callback, 100);
            }
        };

        requestAnimationFrame(animate);
    }

    updateBikePosition(progress) {
        if (this.bike && this.bikeTrack) {
            const trackWidth = this.bikeTrack.offsetWidth;
            const bikeWidth = 330;
            const startPosition = 0;
            const endPosition = trackWidth - bikeWidth;
            const travelDistance = endPosition - startPosition;
            const currentPosition = startPosition + (travelDistance * (progress / 100));

            this.bike.style.left = `${currentPosition}px`;
        }
    }

    hide() {
        this.loadingScreen.classList.remove('active');

        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.isLoading = false;
            if (this.bike) {
                this.bike.style.left = '0px';
            }
        }, 500);
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();