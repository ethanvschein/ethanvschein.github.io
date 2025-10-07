// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-card, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(el);
});

class BikeMetrics {
    constructor() {
        // Check if elements exist
        this.totalMilesEl = document.getElementById('total-miles');
        this.elevationEl = document.getElementById('elevation');
        this.rideTimeEl = document.getElementById('ride-time');
        this.avgSpeedEl = document.getElementById('avg-speed');

        // Exit if not on a page with bike stats
        if (!this.totalMilesEl) return;

        // Starting values (update these with your real stats!)
        this.totalMiles = 3847;
        this.elevation = 127420;
        this.avgSpeed = 18.4;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        // Update every second
        setInterval(() => this.update(), 1000);

        // Initial update
        this.update();
    }

    update() {
        // Slowly increment lifetime stats (simulates continuous riding)
        this.totalMiles += 0.008; // ~7 miles per day
        this.elevation += 0.4; // ~350 feet per day

        // Update display
        if (this.totalMilesEl) {
            this.totalMilesEl.textContent = Math.floor(this.totalMiles).toLocaleString();
        }

        if (this.elevationEl) {
            this.elevationEl.textContent = Math.floor(this.elevation).toLocaleString();
        }

        // Update session time (time since page load)
        if (this.rideTimeEl) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            this.rideTimeEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // Slightly fluctuate average speed for realism
        if (this.avgSpeedEl) {
            const fluctuation = (Math.sin(Date.now() / 3000) * 0.3);
            const currentSpeed = (this.avgSpeed + fluctuation).toFixed(1);
            this.avgSpeedEl.textContent = currentSpeed;
        }
    }
}

// Initialize after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BikeMetrics();
    });
} else {
    new BikeMetrics();
}

// Scroll progress bar
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ===================================
// BICYCLE SCROLL INDICATOR
// ===================================

// Create bicycle scroll indicator
const bikeIndicator = document.createElement('div');
bikeIndicator.className = 'bike-scroll-indicator';
bikeIndicator.innerHTML = `
    <div class="bike-scroll-track"></div>
    <div class="bike-icon">
        <img src="assets/svgs/bikeicon.svg" alt="Bicycle">
    </div>
`;
document.body.appendChild(bikeIndicator);

const bikeTrack = bikeIndicator.querySelector('.bike-scroll-track');
const bikeIcon = bikeIndicator.querySelector('.bike-icon');

// Update bicycle position on scroll
function updateBikePosition() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

    // Update track width
    bikeTrack.style.width = scrollPercentage + '%';

    // Update bike position (with a small offset so it stays on the track)
    const maxLeft = Math.min(scrollPercentage, 100);
    bikeIcon.style.left = `calc(${maxLeft}% - 15px)`;
}

// Listen for scroll events
window.addEventListener('scroll', updateBikePosition);
window.addEventListener('resize', updateBikePosition);

// Initial position
updateBikePosition();