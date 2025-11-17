// ===================================
// PROJECT BACKGROUND (Randomized Topology)
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

    // Generate random parameters for unique pattern/direction each load
    getRandomConfig() {
        // Random points (more = denser pattern)
        const points = 8 + Math.floor(Math.random() * 10);  // 8-17 points
        
        // Random max distance (affects connection reach)
        const maxDistance = 15 + Math.random() * 15;  // 15-30
        
        // Random spacing (affects node distribution)
        const spacing = 10 + Math.random() * 10;  // 10-20
        
        // Random scale (zoom level)
        const scale = 0.7 + Math.random() * 0.8;  // 0.7-1.5

        return {
            points,
            maxDistance,
            spacing,
            scale
        };
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

            // Get randomized config
            const randomConfig = this.getRandomConfig();
            
            // Initialize Vanta TOPOLOGY with random pattern but fixed colors
            try {
                this.vantaEffect = VANTA.TOPOLOGY({
                    el: bgContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    
                    // MUTED COLORS (darker/more subtle)
                    color: 0x4a3820,          // Dark muted gold
                    backgroundColor: 0x1a1a1a, // Very dark background
                    
                    // RANDOMIZED PATTERN PARAMETERS
                    scale: randomConfig.scale,
                    scaleMobile: randomConfig.scale,
                    points: randomConfig.points,
                    maxDistance: randomConfig.maxDistance,
                    spacing: randomConfig.spacing
                });
                
                // Apply transparency to the canvas after creation
                setTimeout(() => {
                    const canvas = bgContainer.querySelector('canvas');
                    if (canvas) {
                        canvas.style.opacity = '0.3';  // Make it 30% visible
                    }
                }, 100);
                
                // Log the random config for debugging
                console.log('Project Background initialized with pattern:', {
                    points: randomConfig.points,
                    maxDistance: randomConfig.maxDistance.toFixed(2),
                    spacing: randomConfig.spacing.toFixed(2),
                    scale: randomConfig.scale.toFixed(2)
                });
                
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