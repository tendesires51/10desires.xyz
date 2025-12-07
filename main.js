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
if (loadingTipElement && typeof loadingTips !== 'undefined') {
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    loadingTipElement.textContent = randomTip;

    // Track seen tips
    let seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');
    if (!seenTips.includes(randomTip)) {
        seenTips.push(randomTip);
        localStorage.setItem('seenTips', JSON.stringify(seenTips));

        // Check if user has seen all tips
        if (seenTips.length === loadingTips.length) {
            localStorage.setItem('achievementUnlocked', 'true');

            // Show achievement banner after loading screen
            setTimeout(() => {
                showAchievementBanner();
            }, 2000);
        }
    }
}

// Achievement banner function
function showAchievementBanner() {
    const banner = document.createElement('div');
    banner.className = 'achievement-banner';
    banner.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h3>Achievement Unlocked!</h3>
                <p>you've seen all 50 loading tips. welcome to the secret club.</p>
                <a href="/celebration" class="achievement-link">claim your prize →</a>
            </div>
            <button class="achievement-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => banner.classList.add('show'), 100);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 500);
    }, 10000);
}

// Update secret link text if achievement is unlocked
const secretLink = document.querySelector('#secret-link');
const secretLinkMobile = document.querySelector('#secret-link-mobile');
const achievementUnlocked = localStorage.getItem('achievementUnlocked') === 'true';

if (achievementUnlocked) {
    if (secretLink) secretLink.textContent = 'Celebration';
    if (secretLinkMobile) secretLinkMobile.textContent = 'Celebration';
}

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

    // Add rainbow text shadow animation to title after it loads
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('rainbow-text');
        }
    }, 1400);
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
