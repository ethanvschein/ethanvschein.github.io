// ===================================
// PROJECT BACKGROUND (Static Topology)
// ===================================

class ProjectBackground {
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
            
            // Check if VANTA and p5 are loaded
            if (typeof VANTA === 'undefined' || typeof p5 === 'undefined') {
                if (attempts < maxAttempts) {
                    setTimeout(tryInit, 100);
                    return;
                }
                console.error('Project Background: VANTA or p5.js not loaded after', maxAttempts, 'attempts');
                return;
            }

            // Find the background container
            const bgContainer = document.getElementById('project-bg');
            
            if (!bgContainer) {
                if (attempts < maxAttempts) {
                    setTimeout(tryInit, 100);
                    return;
                }
                console.warn('Project Background: Container #project-bg not found');
                return;
            }

            // Initialize Vanta TOPOLOGY with fixed settings
            try {
                this.vantaEffect = VANTA.TOPOLOGY({
                    el: bgContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0xf59e0b,          // Olive/greenish color
                    backgroundColor: 0x1a1a1a  // Dark gray (assuming 0x2222 meant 0x222222)
                });
                
                console.log('Project Background initialized successfully');
                
            } catch (error) {
                console.error('Failed to initialize Project Background:', error);
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
const projectBg = new ProjectBackground();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    projectBg.destroy();
});