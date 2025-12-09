// Loading screen functionality
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1600);
    }
});

// Display random loading tip and track seen tips (loadingTips is loaded from tips.js)
const loadingTipElement = document.querySelector('.loading-tip');
let currentTipIndex = null;

if (loadingTipElement && typeof loadingTips !== 'undefined') {
    currentTipIndex = Math.floor(Math.random() * loadingTips.length);
    const randomTip = loadingTips[currentTipIndex];
    loadingTipElement.textContent = randomTip;
}

// Track the tip after DOM loads to ensure achieves.js is available
document.addEventListener('DOMContentLoaded', () => {
    if (currentTipIndex !== null && typeof trackLoadingTip === 'function') {
        trackLoadingTip(currentTipIndex);
    }
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const nav = document.querySelector('nav');

// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

function updateNavBackground() {
    if (window.scrollY > 50) {
        nav.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg-scrolled');
    } else {
        nav.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
    }
}

// Load saved theme or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
} else if (systemPrefersDark) {
    html.setAttribute('data-theme', 'dark');
}

updateNavBackground();

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTimeout(updateNavBackground, 10);

    // Track theme toggle for achievement
    if (typeof trackThemeToggle === 'function') {
        trackThemeToggle();
    }
});

// Scroll animations with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 50);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Smooth scroll for anchor links (only on index.html, but won't break other pages)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Update nav background on scroll
window.addEventListener('scroll', updateNavBackground);

// Toggle coaster stats dropdown
function toggleStats(card) {
    // Close all other open dropdowns
    document.querySelectorAll('.coaster-card.active').forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });

    // Toggle the clicked card
    card.classList.toggle('active');

    // Track coaster click for achievement (only on first click/open)
    if (card.classList.contains('active') && typeof trackCoasterClick === 'function') {
        // Get the index of this card in the coaster list
        const allCards = Array.from(document.querySelectorAll('.coaster-card'));
        const cardIndex = allCards.indexOf(card);
        if (cardIndex !== -1) {
            trackCoasterClick(cardIndex);
        }
    }
}

// Create floating particles for hero section
function createHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = duration + 's';

        // Random animation delay
        particle.style.animationDelay = Math.random() * 5 + 's';

        hero.appendChild(particle);
    }
}

// Initialize particles when DOM is loaded
if (document.querySelector('.hero')) {
    createHeroParticles();

    // Rainbow text is now controlled by the achievement system in achieves.js
    // It will be added automatically if the Epilepsy Warning achievement is unlocked
}

// Cookie utility functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Cookie consent banner functionality
function initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    // Check if user has already made a choice
    const cookieConsent = getCookie('cookieConsent');

    if (!cookieConsent) {
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }

    // Accept button
    const acceptBtn = banner.querySelector('.cookie-btn-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            // Set cookie for 30 days
            setCookie('cookieConsent', 'accepted', 30);
            banner.classList.remove('show');
            // You can add analytics tracking code here
            console.log('Cookies accepted');
        });
    }

    // Decline button
    const declineBtn = banner.querySelector('.cookie-btn-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            // Set cookie for 30 days
            setCookie('cookieConsent', 'declined', 30);
            banner.classList.remove('show');
            console.log('Cookies declined');
        });
    }
}

// Initialize cookie banner when DOM is loaded
initCookieBanner();

// ========================================
// BARREL ROLL EASTER EGG
// ========================================

// Barrel Roll Console Command
window.doabarrelroll = function() {
    // Track achievement
    if (typeof trackBarrelRoll === 'function') {
        trackBarrelRoll();
    }

    // Apply barrel roll animation
    document.body.classList.add('do-a-barrel-roll');

    // Remove the class after animation completes to allow repeating
    setTimeout(() => {
        document.body.classList.remove('do-a-barrel-roll');
    }, 4000);

    console.log('🌀 Do a barrel roll!');
};

// Big Box Console Command
window.igotabigboxyesido = function() {
    // Track achievement
    if (typeof trackBigBox === 'function') {
        trackBigBox();
    }

    console.log('%c📦 I got a big box how \'bout you?', 'color: #bf5af2; font-size: 14px; font-weight: bold;');
    return '📦 I got a big box how \'bout you?';
};

// Display hints in console
console.log('%c💡 Tip: Try typing "doabarrelroll()" in the console!', 'color: #0071e3; font-size: 12px;');

// ========================================
// PRESS F TO PAY RESPECTS
// ========================================

/**
 * Replace all F's on the page with regional indicator F emoji
 */
function replaceAllFsWithEmoji() {
    const walkTextNodes = (node) => {
        if (node.nodeType === 3) { // Text node
            const originalText = node.nodeValue;
            const newText = originalText.replace(/F/g, '🇫').replace(/f/g, '🇫');
            if (originalText !== newText) {
                node.nodeValue = newText;
            }
        } else {
            // Skip script, style, and input elements
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' &&
                node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA') {
                for (let child of node.childNodes) {
                    walkTextNodes(child);
                }
            }
        }
    };

    walkTextNodes(document.body);
    console.log('🇫 All F\'s have been replaced with regional indicator F emoji!');
}

// Listen for F key press
document.addEventListener('keydown', (e) => {
    // Check if F key is pressed (not in an input field or textarea)
    if (e.key === 'f' || e.key === 'F') {
        const activeElement = document.activeElement;
        const isInputField = activeElement.tagName === 'INPUT' ||
                            activeElement.tagName === 'TEXTAREA' ||
                            activeElement.isContentEditable;

        // Only trigger if not typing in an input field
        if (!isInputField) {
            // Track achievement (only once)
            if (typeof trackPayRespects === 'function') {
                trackPayRespects();
            }

            console.log('🫡 Respects paid.');
        }
    }
});

// ========================================
// DEVELOPER CONSOLE DETECTOR
// ========================================

// Detect when developer console is opened
(function() {
    const devtools = /./;
    devtools.toString = function() {
        if (typeof trackDevConsoleOpen === 'function') {
            trackDevConsoleOpen();
        }
        return '';
    };

    // Trigger the detector
    console.log('%c', devtools);

    // Detect F12 keypress and keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
            if (typeof trackDevConsoleOpen === 'function') {
                setTimeout(trackDevConsoleOpen, 100);
            }
        }
    });
})();
