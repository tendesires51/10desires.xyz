/**
 * Achievement System Framework
 * Reusable achievement tracking and notification system
 */

// ========================================
// ACHIEVEMENT DEFINITIONS
// ========================================

const ACHIEVEMENTS = {
    LOADING_TIPS_MASTER: {
        id: 'loadingTipsMaster',
        name: 'Refresh Ranger',
        description: "You've seen all 50 loading tips!",
        icon: '🎉',
        unlockPage: '/celebration',
        checkCondition: () => {
            const seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');
            const totalTips = typeof loadingTips !== 'undefined' ? loadingTips.length : 50;
            return seenTips.length >= totalTips;
        }
    },
    EPILEPSY_WARNING: {
        id: 'epilepsyWarning',
        name: 'Epilepsy Warning',
        description: 'Toggled the theme 50 times in 10 seconds. Your eyes OK?',
        icon: '⚡',
        unlockPage: '/celebration',
        checkCondition: () => {
            const toggleData = JSON.parse(localStorage.getItem('themeToggles') || '{"count": 0, "timestamp": 0}');
            return toggleData.count >= 50;
        }
    },
    // Add more achievements here:
    // EXAMPLE_ACHIEVEMENT: {
    //     id: 'exampleAchievement',
    //     name: 'Example Achievement',
    //     description: 'This is an example achievement',
    //     icon: '<�',
    //     unlockPage: '/example-unlock',
    //     checkCondition: () => {
    //         // Custom logic to check if achievement is unlocked
    //         return localStorage.getItem('exampleCondition') === 'true';
    //     }
    // }
};

// ========================================
// ACHIEVEMENT MANAGER
// ========================================

class AchievementManager {
    constructor() {
        this.achievements = ACHIEVEMENTS;
        this.unlockedAchievements = this.getUnlockedAchievements();
    }

    /**
     * Get all unlocked achievements from localStorage
     */
    getUnlockedAchievements() {
        const unlocked = localStorage.getItem('unlockedAchievements');
        return unlocked ? JSON.parse(unlocked) : [];
    }

    /**
     * Save unlocked achievements to localStorage
     */
    saveUnlockedAchievements() {
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    }

    /**
     * Check if an achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    }

    /**
     * Unlock an achievement
     */
    unlock(achievementId) {
        if (!this.isUnlocked(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            this.saveUnlockedAchievements();
            // Update nav link when any achievement is unlocked
            if (typeof updateAchievementNavLink === 'function') {
                updateAchievementNavLink();
            }
            // Update rainbow text class if Epilepsy Warning is unlocked
            if (achievementId === 'epilepsyWarning' && typeof updateRainbowTextClass === 'function') {
                updateRainbowTextClass();
            }
            return true;
        }
        return false;
    }

    /**
     * Check all achievements and unlock any that meet conditions
     */
    checkAchievements() {
        const newlyUnlocked = [];

        Object.values(this.achievements).forEach(achievement => {
            if (!this.isUnlocked(achievement.id) && achievement.checkCondition()) {
                if (this.unlock(achievement.id)) {
                    newlyUnlocked.push(achievement);
                }
            }
        });

        return newlyUnlocked;
    }

    /**
     * Show achievement unlock banner
     */
    showAchievementBanner(achievement) {
        // Check if banner already exists
        let banner = document.querySelector('.achievement-banner');

        if (!banner) {
            // Create banner element
            banner = document.createElement('div');
            banner.className = 'achievement-banner';
            banner.innerHTML = `
                <div class="achievement-banner-content">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-text">
                        <div class="achievement-title">Achievement Unlocked!</div>
                        <div class="achievement-description">${achievement.name}</div>
                    </div>
                    <button class="achievement-close" aria-label="Close">&times;</button>
                </div>
            `;
            document.body.appendChild(banner);

            // Add close button functionality
            const closeBtn = banner.querySelector('.achievement-close');
            closeBtn.addEventListener('click', () => {
                banner.classList.remove('show');
                setTimeout(() => banner.remove(), 500);
            });

            // Click banner to go to unlock page
            banner.addEventListener('click', (e) => {
                if (!e.target.classList.contains('achievement-close')) {
                    window.location.href = achievement.unlockPage;
                }
            });

            banner.style.cursor = 'pointer';
        }

        // Show banner with animation
        setTimeout(() => banner.classList.add('show'), 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (banner && banner.classList.contains('show')) {
                banner.classList.remove('show');
                setTimeout(() => banner.remove(), 500);
            }
        }, 5000);
    }

    /**
     * Reset a specific achievement
     */
    resetAchievement(achievementId) {
        this.unlockedAchievements = this.unlockedAchievements.filter(id => id !== achievementId);
        this.saveUnlockedAchievements();
        // Update nav link when achievement is reset
        if (typeof updateAchievementNavLink === 'function') {
            updateAchievementNavLink();
        }
        // Remove rainbow text class if Epilepsy Warning is reset
        if (achievementId === 'epilepsyWarning' && typeof updateRainbowTextClass === 'function') {
            updateRainbowTextClass();
        }
    }

    /**
     * Reset all achievements
     */
    resetAll() {
        this.unlockedAchievements = [];
        localStorage.removeItem('unlockedAchievements');
        // Update nav link when all achievements are reset
        if (typeof updateAchievementNavLink === 'function') {
            updateAchievementNavLink();
        }
        // Remove rainbow text class when all achievements are reset
        if (typeof updateRainbowTextClass === 'function') {
            updateRainbowTextClass();
        }
    }
}

// Create global achievement manager instance
const achievementManager = new AchievementManager();

// Update navigation link based on achievement status
function updateAchievementNavLink() {
    const secretLink = document.querySelector('#secret-link');
    const secretLinkMobile = document.querySelector('#secret-link-mobile');
    const hasAnyUnlocked = achievementManager.getUnlockedAchievements().length > 0;

    if (hasAnyUnlocked) {
        if (secretLink) secretLink.textContent = 'Achievements';
        if (secretLinkMobile) secretLinkMobile.textContent = 'Achievements';
    } else {
        if (secretLink) secretLink.textContent = '???';
        if (secretLinkMobile) secretLinkMobile.textContent = '???';
    }
}

// ========================================
// THEME TOGGLE ACHIEVEMENT TRACKING
// ========================================

/**
 * Track a theme toggle for the Epilepsy Warning achievement
 */
function trackThemeToggle() {
    const now = Date.now();
    const toggleData = JSON.parse(localStorage.getItem('themeToggles') || '{"count": 0, "timestamp": 0}');

    // Reset counter if more than 10 seconds have passed
    if (now - toggleData.timestamp > 10000) {
        toggleData.count = 1;
        toggleData.timestamp = now;
    } else {
        toggleData.count++;
    }

    localStorage.setItem('themeToggles', JSON.stringify(toggleData));

    // Check if achievement should be unlocked
    if (toggleData.count >= 50) {
        const newlyUnlocked = achievementManager.checkAchievements();
        newlyUnlocked.forEach(achievement => {
            if (achievement.id === 'epilepsyWarning') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// LOADING TIPS ACHIEVEMENT TRACKING
// ========================================

/**
 * Track a loading tip as seen
 */
function trackLoadingTip(tipIndex) {
    const seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');

    if (!seenTips.includes(tipIndex)) {
        seenTips.push(tipIndex);
        localStorage.setItem('seenTips', JSON.stringify(seenTips));

        // Check if achievement should be unlocked
        const newlyUnlocked = achievementManager.checkAchievements();
        newlyUnlocked.forEach(achievement => {
            // Set legacy flag for backwards compatibility
            if (achievement.id === 'loadingTipsMaster') {
                localStorage.setItem('achievementUnlocked', 'true');
            }
            achievementManager.showAchievementBanner(achievement);
        });
    }
}

/**
 * Get loading tip progress
 */
function getLoadingTipProgress() {
    const seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');
    const totalTips = typeof loadingTips !== 'undefined' ? loadingTips.length : 50;
    return {
        seen: seenTips.length,
        total: totalTips,
        percentage: Math.round((seenTips.length / totalTips) * 100)
    };
}

// ========================================
// CELEBRATION PAGE HANDLER
// ========================================

/**
 * Initialize celebration page
 * Call this in the celebration page's DOMContentLoaded event
 */
function initCelebrationPage(achievementId) {
    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    if (!achievement) {
        console.error(`Achievement not found: ${achievementId}`);
        return;
    }

    const isUnlocked = achievementManager.isUnlocked(achievementId);
    const lockedSection = document.querySelector('#celebration-locked');
    const unlockedSection = document.querySelector('#celebration-unlocked');
    const celebrationContent = document.querySelector('.celebration-content');
    const progressText = document.querySelector('#progress-text');

    if (isUnlocked) {
        // Show unlocked content
        if (unlockedSection) unlockedSection.style.display = 'block';
        if (celebrationContent) celebrationContent.style.display = 'block';
    } else {
        // Show locked content with progress
        if (lockedSection) lockedSection.style.display = 'block';

        // For loading tips achievement, show progress
        if (achievementId === 'loadingTipsMaster' && progressText) {
            const progress = getLoadingTipProgress();
            progressText.textContent = `You've seen ${progress.seen} out of ${progress.total} tips. Keep refreshing!`;
        }
    }
}

/**
 * Reset achievement progress
 */
function resetAchievementProgress(achievementId) {
    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    if (!achievement) return;

    const confirmMessage = 'Are you sure you want to reset your progress? This will lock this page again and delete all related progress.';

    if (confirm(confirmMessage)) {
        // Reset the achievement
        achievementManager.resetAchievement(achievementId);

        // Reset specific achievement data
        if (achievementId === 'loadingTipsMaster') {
            localStorage.removeItem('seenTips');
            localStorage.removeItem('achievementUnlocked'); // Legacy support
        } else if (achievementId === 'epilepsyWarning') {
            localStorage.removeItem('themeToggles');
            localStorage.removeItem('rainbowTextEnabled');
        }

        // Redirect to home
        window.location.href = '/';
    }
}

// ========================================
// RAINBOW TEXT EFFECT (Epilepsy Warning Achievement)
// ========================================

/**
 * Check if rainbow text effect should be enabled
 */
function isRainbowTextEnabled() {
    const isUnlocked = achievementManager.isUnlocked('epilepsyWarning');
    const isEnabled = localStorage.getItem('rainbowTextEnabled') !== 'false'; // default true when unlocked
    return isUnlocked && isEnabled;
}

/**
 * Toggle rainbow text effect on/off
 */
function toggleRainbowText() {
    const current = localStorage.getItem('rainbowTextEnabled') !== 'false';
    localStorage.setItem('rainbowTextEnabled', (!current).toString());
    updateRainbowTextClass();
}

/**
 * Update rainbow-text class on hero title based on achievement status
 */
function updateRainbowTextClass() {
    const heroTitles = document.querySelectorAll('.hero-title');
    heroTitles.forEach(heroTitle => {
        if (isRainbowTextEnabled()) {
            heroTitle.classList.add('rainbow-text');
        } else {
            heroTitle.classList.remove('rainbow-text');
        }
    });
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Automatically check achievements on page load and update nav link
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        achievementManager.checkAchievements();
        updateAchievementNavLink();
        updateRainbowTextClass();
    });
} else {
    achievementManager.checkAchievements();
    updateAchievementNavLink();
    updateRainbowTextClass();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        achievementManager,
        trackLoadingTip,
        trackThemeToggle,
        getLoadingTipProgress,
        initCelebrationPage,
        resetAchievementProgress,
        updateAchievementNavLink,
        toggleRainbowText,
        isRainbowTextEnabled,
        updateRainbowTextClass,
        ACHIEVEMENTS
    };
}
