// ===================================
// VANTA FOG BACKGROUND
// ===================================

class VantaBackground {
    constructor() {
        this.vantaEffect = null;
        this.init();
    }

    init() {
        // Wait for DOM and scripts to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initVanta());
        } else {
            this.initVanta();
        }
    }

    initVanta() {
        // Wait for scripts to load with retry logic
        const maxAttempts = 20;
        let attempts = 0;
        
        const tryInit = () => {
            attempts++;
            
            // Check if VANTA and THREE are loaded
            if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
                if (attempts < maxAttempts) {
                    setTimeout(tryInit, 100);
                    return;
                }
                console.error('VANTA or THREE.js not loaded after', maxAttempts, 'attempts');
                return;
            }

            // Find the background container
            const bgContainer = document.getElementById('vanta-bg');
            
            if (!bgContainer) {
                if (attempts < maxAttempts) {
                    setTimeout(tryInit, 100);
                    return;
                }
                console.warn('Background container #vanta-bg not found');
                return;
            }

            // Initialize Vanta FOG effect
            try {
                this.vantaEffect = VANTA.FOG({
                    el: bgContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0x1a1a1a,
                    midtoneColor: 0x1a1a1a,
                    lowlightColor: 0xf59e0b,
                    baseColor: 0x1a1a1a,
                    blurFactor: 0.34,
                    speed: 0.60,
                    zoom: 1
                });
                
                console.log('Vanta FOG initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Vanta FOG:', error);
                console.error(error.stack);
            }
        };
        
        tryInit();
    }

    destroy() {
        if (this.vantaEffect) {
            this.vantaEffect.destroy();
            this.vantaEffect = null;
        }
    }
}

// Initialize on load
const vantaBg = new VantaBackground();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    vantaBg.destroy();
});