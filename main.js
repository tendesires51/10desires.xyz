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
