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
    DEVELOPER_CONSOLE: {
        id: 'developerConsole',
        name: 'Stop right there, criminal scum!',
        description: 'Opened the developer console in your browser',
        icon: '👮',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('devConsoleOpened') === 'true';
        }
    },
    NOT_FOUND: {
        id: 'notFound',
        name: "We're not in Kansas anymore...",
        description: "Visited a page that doesn't exist",
        icon: '🌪️',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('visited404') === 'true';
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
        this.pendingAchievements = this.getPendingAchievements();
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
     * Get pending achievements (earned but not acknowledged)
     */
    getPendingAchievements() {
        const pending = localStorage.getItem('pendingAchievements');
        return pending ? JSON.parse(pending) : [];
    }

    /**
     * Save pending achievements to localStorage
     */
    savePendingAchievements() {
        localStorage.setItem('pendingAchievements', JSON.stringify(this.pendingAchievements));
    }

    /**
     * Check if an achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    }

    /**
     * Check if an achievement is pending acknowledgment
     */
    isPending(achievementId) {
        return this.pendingAchievements.includes(achievementId);
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
     * Acknowledge a pending achievement (actually unlock it)
     */
    acknowledgePending(achievementId) {
        if (this.isPending(achievementId)) {
            // Remove from pending
            this.pendingAchievements = this.pendingAchievements.filter(id => id !== achievementId);
            this.savePendingAchievements();

            // Actually unlock it
            return this.unlock(achievementId);
        }
        return false;
    }

    /**
     * Check all achievements and add pending ones
     */
    checkAchievements() {
        const newlyPending = [];

        Object.values(this.achievements).forEach(achievement => {
            // Only add to pending if not already unlocked and not already pending
            if (!this.isUnlocked(achievement.id) && !this.isPending(achievement.id) && achievement.checkCondition()) {
                this.pendingAchievements.push(achievement.id);
                this.savePendingAchievements();
                newlyPending.push(achievement);
            }
        });

        return newlyPending;
    }

    /**
     * Show achievement unlock banner
     */
    showAchievementBanner(achievement) {
        // Calculate time since page load
        const pageLoadTime = window.achievementPageLoadTime || Date.now();
        const timeSinceLoad = Date.now() - pageLoadTime;
        const delay = Math.max(0, 2000 - timeSinceLoad); // 2 second minimum delay

        setTimeout(() => {
            // Check if banner already exists
            let banner = document.querySelector('.achievement-banner');

            if (!banner) {
                // Create banner element with new structure
                banner = document.createElement('div');
                banner.className = 'achievement-banner';
                banner.innerHTML = `
                    <div class="achievement-banner-content">
                        <div class="achievement-banner-header">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-text">
                                <div class="achievement-title">Achievement Unlocked!</div>
                                <div class="achievement-description">${achievement.name}</div>
                            </div>
                        </div>
                        <button class="achievement-get-button">Get</button>
                    </div>
                `;
                document.body.appendChild(banner);

                // Add GET button functionality
                const getBtn = banner.querySelector('.achievement-get-button');
                getBtn.addEventListener('click', () => {
                    // Acknowledge the achievement (actually unlock it)
                    achievementManager.acknowledgePending(achievement.id);

                    banner.classList.remove('show');
                    setTimeout(() => {
                        banner.remove();
                        window.location.href = achievement.unlockPage;
                    }, 500);
                });
            }

            // Show banner with animation
            setTimeout(() => banner.classList.add('show'), 100);
        }, delay);
    }

    /**
     * Reset a specific achievement
     */
    resetAchievement(achievementId) {
        this.unlockedAchievements = this.unlockedAchievements.filter(id => id !== achievementId);
        this.saveUnlockedAchievements();
        // Also remove from pending if it was pending
        this.pendingAchievements = this.pendingAchievements.filter(id => id !== achievementId);
        this.savePendingAchievements();
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
        this.pendingAchievements = [];
        localStorage.removeItem('unlockedAchievements');
        localStorage.removeItem('pendingAchievements');
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

    // Check if achievement should be pending
    if (toggleData.count >= 50) {
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
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

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
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
// DEVELOPER CONSOLE ACHIEVEMENT TRACKING
// ========================================

/**
 * Track developer console opening
 * This should be called from a detector in main.js
 */
function trackDevConsoleOpen() {
    if (localStorage.getItem('devConsoleOpened') !== 'true') {
        localStorage.setItem('devConsoleOpened', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'developerConsole') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// 404 PAGE ACHIEVEMENT TRACKING
// ========================================

/**
 * Track 404 page visit
 * This should be called from the 404 page
 */
function track404Visit() {
    if (localStorage.getItem('visited404') !== 'true') {
        localStorage.setItem('visited404', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'notFound') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
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
            localStorage.removeItem('rainbowLoadingEnabled');
            localStorage.removeItem('achievementUnlocked'); // Legacy support
        } else if (achievementId === 'epilepsyWarning') {
            localStorage.removeItem('themeToggles');
            localStorage.removeItem('rainbowTextEnabled');
        } else if (achievementId === 'developerConsole') {
            localStorage.removeItem('devConsoleOpened');
        } else if (achievementId === 'notFound') {
            localStorage.removeItem('visited404');
        }

        // Redirect to home
        window.location.href = '/';
    }
}

/**
 * Reset all achievements
 */
function resetAllAchievements() {
    if (confirm('Are you sure you want to reset ALL achievements? This will delete all progress and cannot be undone.')) {
        // Reset achievement manager
        achievementManager.resetAll();

        // Reset specific achievement data
        localStorage.removeItem('seenTips');
        localStorage.removeItem('themeToggles');
        localStorage.removeItem('rainbowTextEnabled');
        localStorage.removeItem('rainbowLoadingEnabled');
        localStorage.removeItem('devConsoleOpened');
        localStorage.removeItem('visited404');
        localStorage.removeItem('achievementUnlocked'); // Legacy support

        // Reload page to show updated state
        window.location.reload();
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
// RAINBOW LOADING BAR (Refresh Ranger Achievement)
// ========================================

/**
 * Check if rainbow loading bar should be enabled
 */
function isRainbowLoadingEnabled() {
    const isUnlocked = achievementManager.isUnlocked('loadingTipsMaster');
    const isEnabled = localStorage.getItem('rainbowLoadingEnabled') !== 'false'; // default true when unlocked
    return isUnlocked && isEnabled;
}

/**
 * Toggle rainbow loading bar on/off
 */
function toggleRainbowLoading() {
    const current = localStorage.getItem('rainbowLoadingEnabled') !== 'false';
    localStorage.setItem('rainbowLoadingEnabled', (!current).toString());
    updateRainbowLoadingClass();
}

/**
 * Update rainbow-loading class on loading bar based on achievement status
 */
function updateRainbowLoadingClass() {
    const loadingProgress = document.querySelector('.loading-progress');
    if (loadingProgress) {
        if (isRainbowLoadingEnabled()) {
            loadingProgress.classList.add('rainbow-loading');
        } else {
            loadingProgress.classList.remove('rainbow-loading');
        }
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Track page load time for achievement banner delay
window.achievementPageLoadTime = Date.now();

// Automatically check achievements on page load and update nav link
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check for new achievements
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            achievementManager.showAchievementBanner(achievement);
        });

        // Check for existing pending achievements and show banner
        if (newlyPending.length === 0 && achievementManager.pendingAchievements.length > 0) {
            const pendingId = achievementManager.pendingAchievements[0];
            const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === pendingId);
            if (achievement) {
                achievementManager.showAchievementBanner(achievement);
            }
        }

        updateAchievementNavLink();
        updateRainbowTextClass();
        updateRainbowLoadingClass();
    });
} else {
    // Check for new achievements
    const newlyPending = achievementManager.checkAchievements();
    newlyPending.forEach(achievement => {
        achievementManager.showAchievementBanner(achievement);
    });

    // Check for existing pending achievements and show banner
    if (newlyPending.length === 0 && achievementManager.pendingAchievements.length > 0) {
        const pendingId = achievementManager.pendingAchievements[0];
        const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === pendingId);
        if (achievement) {
            achievementManager.showAchievementBanner(achievement);
        }
    }

    updateAchievementNavLink();
    updateRainbowTextClass();
    updateRainbowLoadingClass();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        achievementManager,
        trackLoadingTip,
        trackThemeToggle,
        trackDevConsoleOpen,
        track404Visit,
        getLoadingTipProgress,
        initCelebrationPage,
        resetAchievementProgress,
        updateAchievementNavLink,
        toggleRainbowText,
        isRainbowTextEnabled,
        updateRainbowTextClass,
        toggleRainbowLoading,
        isRainbowLoadingEnabled,
        updateRainbowLoadingClass,
        ACHIEVEMENTS
    };
}
