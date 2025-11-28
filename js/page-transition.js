// ===================================
// PAGE TRANSITION LOADER
// ===================================

(function() {
    'use strict';
    
    const MIN_DISPLAY_TIME_AFTER_LOAD = 300; // 0.3 seconds after page loads
    let loaderStartTime = null;
    let pageLoadTime = null;
    
    function init() {
        const loader = document.getElementById('page-transition-loader');
        if (!loader) return;
        
        // If we came from a transition, the loader is already visible
        const wasTransition = sessionStorage.getItem('pageTransition') === 'true';
        const transitionTime = sessionStorage.getItem('pageTransitionTime');
        
        if (wasTransition) {
            sessionStorage.removeItem('pageTransition');
            sessionStorage.removeItem('pageTransitionTime');
            
            // Loader is already shown by inline script, ensure active class is set
            // Apply robust styling to prevent white flash during transition
            loader.classList.add('active');
            // Add class to body to prevent navbar white flash via CSS
            document.body.classList.add('page-transitioning');
            // Remove transitions to prevent any flashing during the transition
            loader.style.transition = 'none';
            loader.style.backgroundColor = '#1a1a1a';
            loader.style.zIndex = '99999';
            
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = '#1a1a1a';
            
            // Ensure navbar and all child elements have dark background and no transitions to prevent white flash
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundColor = '#1a1a1a';
                navbar.style.transition = 'none';
                navbar.style.backdropFilter = 'none';
                
                // Also ensure nav-menu and nav-container have dark backgrounds
                const navMenu = navbar.querySelector('.nav-menu');
                const navContainer = navbar.querySelector('.nav-container');
                if (navMenu) {
                    navMenu.style.backgroundColor = 'transparent';
                }
                if (navContainer) {
                    navContainer.style.backgroundColor = 'transparent';
                }
            }
            
            // Track time
            if (transitionTime) {
                loaderStartTime = parseInt(transitionTime, 10);
            } else {
                loaderStartTime = Date.now();
            }
        }
        
        // Hide loader after page loads with minimum display time
        function hideLoader() {
            pageLoadTime = Date.now();
            
            // Calculate minimum wait time: 0.5s after page load
            const elapsedSinceLoad = Date.now() - pageLoadTime;
            const remainingTime = Math.max(0, MIN_DISPLAY_TIME_AFTER_LOAD - elapsedSinceLoad);
            
            setTimeout(function() {
                // Remove transitions first to prevent any flashing
                loader.style.transition = 'none';
                
                // Remove active class (this will trigger CSS to hide it)
                loader.classList.remove('active');
                
                // Force hide with inline styles (but keep display:flex for next transition)
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                loader.style.pointerEvents = 'none';
                
                // Remove the style tag created by document.write if it exists
                const styleTags = document.querySelectorAll('style');
                styleTags.forEach(function(style) {
                    if (style.textContent && style.textContent.includes('page-transition-loader')) {
                        style.remove();
                    }
                });
                
                // Remove body class to allow navbar to return to normal styling
                document.body.classList.remove('page-transitioning');
                
                // Restore body overflow and background
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                document.body.style.backgroundColor = '';
                
                // Restore navbar background and child elements (CSS will handle it)
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    navbar.style.backgroundColor = '';
                    navbar.style.transition = '';
                    navbar.style.backdropFilter = '';
                    
                    const navMenu = navbar.querySelector('.nav-menu');
                    const navContainer = navbar.querySelector('.nav-container');
                    if (navMenu) {
                        navMenu.style.backgroundColor = '';
                    }
                    if (navContainer) {
                        navContainer.style.backgroundColor = '';
                    }
                }
                
                loaderStartTime = null;
                pageLoadTime = null;
            }, remainingTime);
        }
        
        // Wait for page to fully load
        if (wasTransition) {
            if (document.readyState === 'complete') {
                // Page already loaded, hide immediately
                hideLoader();
            } else {
                // Wait for page to load
                window.addEventListener('load', function() {
                    hideLoader();
                }, { once: true });
                
                // Fallback: hide after a maximum time (10 seconds)
                setTimeout(function() {
                    if (loader.classList.contains('active')) {
                        hideLoader();
                    }
                }, 10000);
            }
        }
        
        // Helper function to show loader and navigate
        function showLoaderAndNavigate(url) {
            // Show loader immediately and set background colors to prevent white flash
            loader.classList.add('active');
            // Add class to body to prevent navbar white flash via CSS
            document.body.classList.add('page-transitioning');
            // Remove transitions to prevent any flashing
            loader.style.transition = 'none';
            loader.style.backgroundColor = '#1a1a1a';
            loader.style.zIndex = '99999';
            
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = '#1a1a1a';
            
            // Ensure navbar and all child elements have dark background and no transitions
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundColor = '#1a1a1a';
                navbar.style.transition = 'none';
                navbar.style.backdropFilter = 'none';
                
                // Also ensure nav-menu and nav-container have dark backgrounds
                const navMenu = navbar.querySelector('.nav-menu');
                const navContainer = navbar.querySelector('.nav-container');
                if (navMenu) {
                    navMenu.style.backgroundColor = 'transparent';
                }
                if (navContainer) {
                    navContainer.style.backgroundColor = 'transparent';
                }
            }
            
            loaderStartTime = Date.now();
            
            // Mark navigation for next page
            sessionStorage.setItem('pageTransition', 'true');
            sessionStorage.setItem('pageTransitionTime', Date.now().toString());
            
            // Navigate after a small delay to ensure loader is visible
            setTimeout(function() {
                window.location.href = url;
            }, 50);
        }
        
        // Helper function to check if URL is an internal HTML link
        function isInternalHtmlLink(href) {
            if (!href) return false;
            
            // Skip special links
            if (href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:')) {
                return false;
            }
            
            // Check if external
            if (href.startsWith('http://') || href.startsWith('https://')) {
                try {
                    const linkUrl = new URL(href);
                    if (linkUrl.origin !== window.location.origin) {
                        return false;
                    }
                } catch (err) {
                    return false;
                }
            }
            
            // Check if it's an internal HTML link
            return href.endsWith('.html') || 
                   href === '/' || 
                   href.endsWith('/') ||
                   href.startsWith('../') ||
                   href.startsWith('./') ||
                   (!href.includes('://') && !href.startsWith('#') && href.length > 0);
        }
        
        // Handle link clicks
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) {
                // Check if element has onclick with location.href
                const element = e.target.closest('[onclick]');
                if (element) {
                    const onclickAttr = element.getAttribute('onclick');
                    if (onclickAttr && onclickAttr.includes("location.href")) {
                        // Extract URL from onclick attribute
                        const match = onclickAttr.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
                        if (match && match[1]) {
                            const href = match[1];
                            if (isInternalHtmlLink(href)) {
                                e.preventDefault();
                                e.stopPropagation();
                                // Remove the onclick to prevent double navigation
                                element.removeAttribute('onclick');
                                showLoaderAndNavigate(href);
                            }
                        }
                    }
                }
                return;
            }
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Skip special links
            if (href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                link.hasAttribute('download') ||
                link.target === '_blank') {
                return;
            }
            
            if (!isInternalHtmlLink(href)) return;
            
            e.preventDefault();
            showLoaderAndNavigate(link.href);
        }, true);
    }
    
    // Initialize as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
