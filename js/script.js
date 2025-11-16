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

// Add scroll effect to navbar - keep original color
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    // Keep the original navbar color regardless of scroll position
    navbar.style.backgroundColor = 'rgba(26, 26, 26, 1)';
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

// ===================================
// BICYCLE SCROLL INDICATOR (FIXED)
// ===================================

// Create bicycle scroll indicator
const bikeIndicator = document.createElement('div');
bikeIndicator.className = 'bike-scroll-indicator';
bikeIndicator.innerHTML = `
    <div class="bike-scroll-track"></div>
    <div class="bike-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M312.1 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h25.7l34.6 64H222.9l-27.4-38C191 99.7 183.7 96 176 96H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h43.7l22.1 30.7-26.6 53.1c-10-2.5-20.5-3.8-31.2-3.8C57.3 224 0 281.3 0 352s57.3 128 128 128c65.3 0 119.1-48.9 127-112h49c8.5 0 16.3-4.5 20.7-11.8l84.8-143.5 21.7 40.1C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L375.4 48.8C369.8 38.4 359 32 347.2 32H312.1zM458.6 303.7l32.3 59.7c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-32.3-59.7c3.6-.6 7.4-.9 11.2-.9 39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72c0-18.6 7-35.5 18.6-48.3zM133.2 368h65c-7.3 32.1-36 56-70.2 56-39.8 0-72-32.2-72-72s32.2-72 72-72c1.7 0 3.4 .1 5.1 .2l-24.2 48.5c-9 18.1 4.1 39.4 24.3 39.4zm33.7-48l50.7-101.3 72.9 101.2-.1 .1H166.8zm90.6-128H365.9L317 274.8 257.4 192z"/>
        </svg>
    </div>
`;

// Add to page AFTER body loads
if (document.body) {
    document.body.appendChild(bikeIndicator);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(bikeIndicator);
    });
}

const bikeTrack = bikeIndicator.querySelector('.bike-scroll-track');
const bikeIcon = bikeIndicator.querySelector('.bike-icon');

// Update bicycle position on scroll
function updateBikePosition() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    const clampedPercentage = Math.min(Math.max(scrollPercentage, 0), 100);

    // Update track width (orange bar grows)
    if (bikeTrack) {
        bikeTrack.style.width = clampedPercentage + '%';
    }

    // Update bike position (rides at the end of the bar)
    if (bikeIcon) {
        bikeIcon.style.left = clampedPercentage + '%';
    }
}

// Listen for scroll events with throttle
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateBikePosition();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('resize', updateBikePosition);

// Initial position
updateBikePosition();