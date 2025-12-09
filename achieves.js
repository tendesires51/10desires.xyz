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
    DEDICATED: {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Visited the website 7 days in a row',
        icon: '📅',
        unlockPage: '/celebration',
        checkCondition: () => {
            const streakData = JSON.parse(localStorage.getItem('visitStreak') || '{"streak": 0, "lastVisit": null}');
            return streakData.streak >= 7;
        }
    },
    EDUCATED: {
        id: 'educated',
        name: 'Educated',
        description: 'Clicked on all coaster cards to learn their stats',
        icon: '🎢',
        unlockPage: '/celebration',
        reward: 'Edit Mode - Rearrange coasters into your own ranking',
        checkCondition: () => {
            const clickedCoasters = JSON.parse(localStorage.getItem('clickedCoasters') || '[]');
            return clickedCoasters.length >= 16; // 15 coasters + 1 tied = 16 cards
        }
    },
    BARREL_ROLL: {
        id: 'barrelRoll',
        name: 'Do a barrel roll!',
        description: 'Executed doabarrelroll() in the console',
        icon: '🌀',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('barrelRollExecuted') === 'true';
        }
    },
    BIG_BOX: {
        id: 'bigBox',
        name: 'I think you don\'t know what you\'re saying.',
        description: 'Executed igotabigboxyesido() in the console',
        icon: '📦',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('bigBoxExecuted') === 'true';
        }
    },
    BAD_VISION: {
        id: 'badVision',
        name: 'Bad Vision',
        description: 'Zoomed in to 500% on your browser',
        icon: '👓',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('badVisionUnlocked') === 'true';
        }
    },
    BLASPHEMY: {
        id: 'blasphemy',
        name: 'Blasphemy!',
        description: 'Attempted to drag Iron Gwazi to last place',
        icon: '😱',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('blasphemyCommitted') === 'true';
        }
    },
    PAY_RESPECTS: {
        id: 'payRespects',
        name: 'Press F to Pay Respects',
        description: 'Pressed F to pay respects',
        icon: '🫡',
        unlockPage: '/celebration',
        checkCondition: () => {
            return localStorage.getItem('payRespects') === 'true';
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
// DAILY VISIT STREAK ACHIEVEMENT TRACKING
// ========================================

/**
 * Track daily visit streak
 * This should be called on every page load
 */
function trackDailyVisit() {
    const today = new Date().toDateString(); // Get today's date as a string
    const streakData = JSON.parse(localStorage.getItem('visitStreak') || '{"streak": 0, "lastVisit": null}');

    // If this is the first visit ever
    if (!streakData.lastVisit) {
        streakData.streak = 1;
        streakData.lastVisit = today;
        localStorage.setItem('visitStreak', JSON.stringify(streakData));
        return;
    }

    // If already visited today, don't increment
    if (streakData.lastVisit === today) {
        return;
    }

    // Check if visit is consecutive (yesterday)
    const lastVisitDate = new Date(streakData.lastVisit);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastVisitDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day - increment streak
        streakData.streak++;
        streakData.lastVisit = today;
        localStorage.setItem('visitStreak', JSON.stringify(streakData));

        // Check if achievement should be pending
        if (streakData.streak >= 7) {
            const newlyPending = achievementManager.checkAchievements();
            newlyPending.forEach(achievement => {
                if (achievement.id === 'dedicated') {
                    achievementManager.showAchievementBanner(achievement);
                }
            });
        }
    } else if (diffDays > 1) {
        // Streak broken - reset to 1
        streakData.streak = 1;
        streakData.lastVisit = today;
        localStorage.setItem('visitStreak', JSON.stringify(streakData));
    }
}

/**
 * Get daily visit streak progress
 */
function getDailyVisitProgress() {
    const streakData = JSON.parse(localStorage.getItem('visitStreak') || '{"streak": 0, "lastVisit": null}');
    const targetDays = 7;

    return {
        current: streakData.streak,
        total: targetDays,
        percentage: Math.min(Math.round((streakData.streak / targetDays) * 100), 100)
    };
}

// ========================================
// COASTER CLICKS ACHIEVEMENT TRACKING
// ========================================

/**
 * Track a coaster card click
 * This should be called when a user clicks on a coaster card
 */
function trackCoasterClick(coasterIndex) {
    const clickedCoasters = JSON.parse(localStorage.getItem('clickedCoasters') || '[]');

    if (!clickedCoasters.includes(coasterIndex)) {
        clickedCoasters.push(coasterIndex);
        localStorage.setItem('clickedCoasters', JSON.stringify(clickedCoasters));

        // Check if achievement should be pending
        if (clickedCoasters.length >= 16) {
            const newlyPending = achievementManager.checkAchievements();
            newlyPending.forEach(achievement => {
                if (achievement.id === 'educated') {
                    achievementManager.showAchievementBanner(achievement);
                }
            });
        }
    }
}

/**
 * Get coaster clicks progress
 */
function getCoasterClicksProgress() {
    const clickedCoasters = JSON.parse(localStorage.getItem('clickedCoasters') || '[]');
    const totalCoasters = 16;

    return {
        clicked: clickedCoasters.length,
        total: totalCoasters,
        percentage: Math.round((clickedCoasters.length / totalCoasters) * 100)
    };
}

// ========================================
// BARREL ROLL ACHIEVEMENT TRACKING
// ========================================

/**
 * Track barrel roll execution
 * This should be called when the user executes doabarrelroll() in the console
 */
function trackBarrelRoll() {
    if (localStorage.getItem('barrelRollExecuted') !== 'true') {
        localStorage.setItem('barrelRollExecuted', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'barrelRoll') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// BLASPHEMY ACHIEVEMENT TRACKING
// ========================================

/**
 * Track blasphemy event
 * This should be called when the user attempts to drag Iron Gwazi to last place
 */
function trackBlasphemy() {
    if (localStorage.getItem('blasphemyCommitted') !== 'true') {
        localStorage.setItem('blasphemyCommitted', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'blasphemy') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// PAY RESPECTS ACHIEVEMENT TRACKING
// ========================================

/**
 * Track pay respects event
 * This should be called when the user presses F to pay respects
 */
function trackPayRespects() {
    if (localStorage.getItem('payRespects') !== 'true') {
        localStorage.setItem('payRespects', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'payRespects') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// BIG BOX ACHIEVEMENT TRACKING
// ========================================

/**
 * Track big box execution
 * This should be called when the user executes igotabigboxyesido() in the console
 */
function trackBigBox() {
    if (localStorage.getItem('bigBoxExecuted') !== 'true') {
        localStorage.setItem('bigBoxExecuted', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'bigBox') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// ========================================
// BAD VISION ACHIEVEMENT TRACKING
// ========================================

/**
 * Track zoom level for bad vision achievement
 * Detects when user zooms to 500% or more
 */
function trackZoomLevel() {
    if (localStorage.getItem('badVisionUnlocked') === 'true') {
        return; // Already unlocked
    }

    // Detect zoom level using devicePixelRatio and window.outerWidth/innerWidth
    const zoomLevel = Math.round((window.devicePixelRatio || 1) * 100);

    // Also check visual viewport for more accurate zoom detection
    const visualZoom = window.visualViewport ?
        Math.round((window.innerWidth / window.visualViewport.width) * 100) : zoomLevel;

    const currentZoom = Math.max(zoomLevel, visualZoom);

    if (currentZoom >= 500) {
        localStorage.setItem('badVisionUnlocked', 'true');

        // Check if achievement should be pending
        const newlyPending = achievementManager.checkAchievements();
        newlyPending.forEach(achievement => {
            if (achievement.id === 'badVision') {
                achievementManager.showAchievementBanner(achievement);
            }
        });
    }
}

// Track zoom level on page load and resize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        trackZoomLevel();
    });
} else {
    trackZoomLevel();
}

// Monitor zoom changes
window.addEventListener('resize', trackZoomLevel);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', trackZoomLevel);
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
        } else if (achievementId === 'dedicated') {
            localStorage.removeItem('visitStreak');
        } else if (achievementId === 'educated') {
            localStorage.removeItem('clickedCoasters');
        } else if (achievementId === 'barrelRoll') {
            localStorage.removeItem('barrelRollExecuted');
        } else if (achievementId === 'blasphemy') {
            localStorage.removeItem('blasphemyCommitted');
        } else if (achievementId === 'payRespects') {
            localStorage.removeItem('payRespects');
        } else if (achievementId === 'bigBox') {
            localStorage.removeItem('bigBoxExecuted');
        } else if (achievementId === 'badVision') {
            localStorage.removeItem('badVisionUnlocked');
            localStorage.removeItem('blurFilterEnabled');
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
        localStorage.removeItem('visitStreak');
        localStorage.removeItem('clickedCoasters');
        localStorage.removeItem('barrelRollExecuted');
        localStorage.removeItem('blasphemyCommitted');
        localStorage.removeItem('payRespects');
        localStorage.removeItem('bigBoxExecuted');
        localStorage.removeItem('badVisionUnlocked');
        localStorage.removeItem('blurFilterEnabled');
        localStorage.removeItem('editModeEnabled');
        localStorage.removeItem('customCoasterOrder');
        localStorage.removeItem('achievementUnlocked'); // Legacy support

        // Reload page to show updated state
        window.location.reload();
    }
}

/**
 * Export all achievements data to a JSON file
 */
function exportAchievements() {
    const achievementData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        achievements: {
            unlockedAchievements: JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'),
            acknowledgedAchievements: JSON.parse(localStorage.getItem('acknowledgedAchievements') || '[]'),
            pendingAchievements: JSON.parse(localStorage.getItem('pendingAchievements') || '[]')
        },
        progress: {
            seenTips: JSON.parse(localStorage.getItem('seenTips') || '[]'),
            themeToggles: localStorage.getItem('themeToggles') || '0',
            devConsoleOpened: localStorage.getItem('devConsoleOpened') || 'false',
            visited404: localStorage.getItem('visited404') || 'false',
            visitStreak: JSON.parse(localStorage.getItem('visitStreak') || '{"streak": 0, "lastVisit": null}'),
            clickedCoasters: JSON.parse(localStorage.getItem('clickedCoasters') || '[]'),
            barrelRollExecuted: localStorage.getItem('barrelRollExecuted') || 'false',
            bigBoxExecuted: localStorage.getItem('bigBoxExecuted') || 'false',
            badVisionUnlocked: localStorage.getItem('badVisionUnlocked') || 'false'
        },
        preferences: {
            rainbowTextEnabled: localStorage.getItem('rainbowTextEnabled') !== 'false',
            rainbowLoadingEnabled: localStorage.getItem('rainbowLoadingEnabled') !== 'false',
            blurFilterEnabled: localStorage.getItem('blurFilterEnabled') !== 'false',
            editModeEnabled: localStorage.getItem('editModeEnabled') !== 'false',
            customCoasterOrder: JSON.parse(localStorage.getItem('customCoasterOrder') || 'null')
        }
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(achievementData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `10desires-achievements-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Achievements exported successfully! Save this file to import on another device.');
}

/**
 * Import achievements data from a JSON file
 */
function importAchievements() {
    const fileInput = document.getElementById('import-file-input');
    if (!fileInput) return;

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // Validate data structure
                if (!data.version || !data.achievements || !data.progress || !data.preferences) {
                    alert('❌ Invalid achievement file format.');
                    return;
                }

                // Confirm import
                if (!confirm('This will replace all current achievements with the imported data. Continue?')) {
                    return;
                }

                // Import achievements
                localStorage.setItem('unlockedAchievements', JSON.stringify(data.achievements.unlockedAchievements));
                localStorage.setItem('acknowledgedAchievements', JSON.stringify(data.achievements.acknowledgedAchievements));
                localStorage.setItem('pendingAchievements', JSON.stringify(data.achievements.pendingAchievements));

                // Import progress
                localStorage.setItem('seenTips', JSON.stringify(data.progress.seenTips));
                localStorage.setItem('themeToggles', data.progress.themeToggles);
                localStorage.setItem('devConsoleOpened', data.progress.devConsoleOpened);
                localStorage.setItem('visited404', data.progress.visited404);
                localStorage.setItem('visitStreak', JSON.stringify(data.progress.visitStreak));
                localStorage.setItem('clickedCoasters', JSON.stringify(data.progress.clickedCoasters));
                localStorage.setItem('barrelRollExecuted', data.progress.barrelRollExecuted);
                localStorage.setItem('bigBoxExecuted', data.progress.bigBoxExecuted);
                localStorage.setItem('badVisionUnlocked', data.progress.badVisionUnlocked);

                // Import preferences
                localStorage.setItem('rainbowTextEnabled', data.preferences.rainbowTextEnabled.toString());
                localStorage.setItem('rainbowLoadingEnabled', data.preferences.rainbowLoadingEnabled.toString());
                localStorage.setItem('blurFilterEnabled', data.preferences.blurFilterEnabled.toString());
                localStorage.setItem('editModeEnabled', data.preferences.editModeEnabled.toString());
                if (data.preferences.customCoasterOrder) {
                    localStorage.setItem('customCoasterOrder', JSON.stringify(data.preferences.customCoasterOrder));
                }

                alert('✅ Achievements imported successfully! The page will now reload.');
                window.location.reload();

            } catch (error) {
                console.error('Import error:', error);
                alert('❌ Error importing achievements. Please check the file and try again.');
            }
        };

        reader.readAsText(file);
    };

    // Trigger file selection
    fileInput.click();
}

// ========================================
// F EMOJI REPLACEMENT (Pay Respects Achievement)
// ========================================

/**
 * Check if F emoji replacement should be enabled
 */
function isFEmojiEnabled() {
    const isUnlocked = achievementManager.isUnlocked('payRespects');
    const isEnabled = localStorage.getItem('fEmojiEnabled') !== 'false'; // default true when unlocked
    return isUnlocked && isEnabled;
}

/**
 * Toggle F emoji replacement on/off
 */
function toggleFEmoji() {
    const current = localStorage.getItem('fEmojiEnabled') !== 'false';
    localStorage.setItem('fEmojiEnabled', (!current).toString());

    // Reload page to apply/remove changes
    window.location.reload();
}

/**
 * Apply F emoji replacement to the page
 */
function applyFEmojiReplacement() {
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
// BLUR FILTER EFFECT (Bad Vision Achievement)
// ========================================

/**
 * Toggle blur filter effect
 */
function toggleBlurFilter() {
    const current = localStorage.getItem('blurFilterEnabled') !== 'false';
    localStorage.setItem('blurFilterEnabled', (!current).toString());
    updateBlurFilterClass();
}

/**
 * Check if blur filter is enabled
 */
function isBlurFilterEnabled() {
    return achievementManager.isUnlocked('badVision') &&
           localStorage.getItem('blurFilterEnabled') !== 'false';
}

/**
 * Update blur-filter class on body based on achievement status
 */
function updateBlurFilterClass() {
    if (isBlurFilterEnabled()) {
        document.body.classList.add('blur-filter');
    } else {
        document.body.classList.remove('blur-filter');
    }
}

/**
 * Toggle Edit Mode for coaster ranking
 */
function toggleEditMode() {
    const current = localStorage.getItem('editModeEnabled') !== 'false';
    localStorage.setItem('editModeEnabled', (!current).toString());
    updateEditModeClass();
}

/**
 * Check if Edit Mode is enabled
 */
function isEditModeEnabled() {
    return achievementManager.isUnlocked('educated') &&
           localStorage.getItem('editModeEnabled') !== 'false';
}

/**
 * Update edit-mode class on body based on achievement status
 */
function updateEditModeClass() {
    if (isEditModeEnabled()) {
        document.body.classList.add('edit-mode');
        enableCoasterDragAndDrop();
    } else {
        document.body.classList.remove('edit-mode');
        disableCoasterDragAndDrop();
    }
}

/**
 * Enable drag and drop for coaster cards
 */
function enableCoasterDragAndDrop() {
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = coasterList.querySelectorAll('.coaster-card');

    cards.forEach((card, index) => {
        card.draggable = true;
        card.style.cursor = 'move';

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Load custom order if it exists
    loadCustomCoasterOrder();

    // Update ranks to show 1-16 in edit mode
    updateCoasterRanks();
}

/**
 * Disable drag and drop for coaster cards
 */
function disableCoasterDragAndDrop() {
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = coasterList.querySelectorAll('.coaster-card');

    cards.forEach(card => {
        card.draggable = false;
        card.style.cursor = '';

        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragover', handleDragOver);
        card.removeEventListener('drop', handleDrop);
        card.removeEventListener('dragend', handleDragEnd);
    });

    // Restore original order
    restoreOriginalCoasterOrder();

    // Update ranks to restore tied ranking in normal mode
    updateCoasterRanks();
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const coasterList = document.querySelector('.coaster-list');
        const allCards = Array.from(coasterList.querySelectorAll('.coaster-card'));
        const draggedIndex = allCards.indexOf(draggedElement);
        const targetIndex = allCards.indexOf(this);

        // Check if Iron Gwazi is being dragged to last place
        const draggedName = draggedElement.querySelector('.coaster-name')?.textContent;
        const isIronGwazi = draggedName === 'Iron Gwazi';
        const totalCards = allCards.length;

        // Check if target position would be last (position 16)
        let wouldBeLastPosition = false;
        if (draggedIndex < targetIndex) {
            // Dragging down - would be last if target is the last card
            wouldBeLastPosition = (targetIndex === totalCards - 1);
        } else {
            // Dragging up - would be last if target is the last card
            wouldBeLastPosition = (targetIndex === totalCards - 1);
        }

        // BLASPHEMY DETECTED!
        if (isIronGwazi && wouldBeLastPosition) {
            // Track the achievement
            if (typeof trackBlasphemy === 'function') {
                trackBlasphemy();
            }

            // Move Iron Gwazi back to the top instead
            coasterList.insertBefore(draggedElement, allCards[0]);

            // Show a message in console
            console.log('😱 BLASPHEMY! Iron Gwazi refuses to be ranked last and returns to the top!');

            // Update rank numbers
            updateCoasterRanks();
            saveCustomCoasterOrder();

            return false;
        }

        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }

        // Update rank numbers
        updateCoasterRanks();
        saveCustomCoasterOrder();
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '';
    draggedElement = null;
}

/**
 * Update rank numbers after reordering
 */
function updateCoasterRanks() {
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = coasterList.querySelectorAll('.coaster-card');
    const isEditMode = document.body.classList.contains('edit-mode');

    cards.forEach((card, index) => {
        const rankSpan = card.querySelector('.coaster-rank');
        if (rankSpan) {
            if (isEditMode) {
                // In edit mode, use sequential 1-16 ranking
                rankSpan.textContent = index + 1;

                // Hide the "Tied" label in edit mode
                const tiedLabel = card.querySelector('.tied-label');
                if (tiedLabel) {
                    tiedLabel.style.display = 'none';
                }
            } else {
                // In normal mode, respect the tied ranking
                let currentRank = 1;
                for (let i = 0; i <= index; i++) {
                    if (i === index) {
                        rankSpan.textContent = currentRank;
                    } else if (!cards[i].classList.contains('tied') || i === 0) {
                        currentRank++;
                    }
                }

                // Show the "Tied" label in normal mode
                const tiedLabel = card.querySelector('.tied-label');
                if (tiedLabel) {
                    tiedLabel.style.display = '';
                }
            }
        }
    });
}

/**
 * Save custom coaster order to localStorage
 */
function saveCustomCoasterOrder() {
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = coasterList.querySelectorAll('.coaster-card');
    const order = Array.from(cards).map(card => {
        const name = card.querySelector('.coaster-name').textContent;
        const park = card.querySelector('.coaster-park').textContent;
        return { name, park };
    });

    localStorage.setItem('customCoasterOrder', JSON.stringify(order));
}

/**
 * Load custom coaster order from localStorage
 */
function loadCustomCoasterOrder() {
    const customOrder = localStorage.getItem('customCoasterOrder');
    if (!customOrder) return;

    const order = JSON.parse(customOrder);
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = Array.from(coasterList.querySelectorAll('.coaster-card'));

    // Reorder cards based on saved order
    order.forEach((item, index) => {
        const card = cards.find(c => {
            const name = c.querySelector('.coaster-name').textContent;
            const park = c.querySelector('.coaster-park').textContent;
            return name === item.name && park === item.park;
        });

        if (card) {
            coasterList.appendChild(card);
        }
    });

    updateCoasterRanks();
}

/**
 * Restore original coaster order
 */
function restoreOriginalCoasterOrder() {
    const coasterList = document.querySelector('.coaster-list');
    if (!coasterList) return;

    const cards = Array.from(coasterList.querySelectorAll('.coaster-card'));

    // Sort cards by their original rank (stored in data attribute or by reading the rank)
    // For simplicity, we'll reload the page or just update ranks back to original
    // Since we don't have original order stored, we'll just update the ranks sequentially
    updateCoasterRanks();
}

/**
 * Generate shareable image of coaster ranking
 */
async function generateShareableImage() {
    const button = document.getElementById('share-ranking-btn');
    if (!button) return;

    // Disable button during generation
    button.disabled = true;
    button.textContent = '⏳ Generating...';

    try {
        const coasterList = document.querySelector('.coaster-list');
        if (!coasterList) return;

        // Create a canvas for the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const width = 800;
        const padding = 40;
        const cards = coasterList.querySelectorAll('.coaster-card');
        const cardHeight = 80;
        const cardSpacing = 12;
        const headerHeight = 120;
        const footerHeight = 60;
        const height = headerHeight + (cards.length * (cardHeight + cardSpacing)) + footerHeight;

        canvas.width = width;
        canvas.height = height;

        // Get theme colors
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDarkMode ? '#0f0f0f' : '#ffffff';
        const cardBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
        const textPrimary = isDarkMode ? '#e0e0e0' : '#1a1a1a';
        const textSecondary = isDarkMode ? '#a0a0a0' : '#666666';
        const accent = '#bf5af2';
        const border = isDarkMode ? '#2a2a2a' : '#e0e0e0';

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Draw header
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('My Ranking of 10desires\' top 16 coasters', width / 2, 50);

        ctx.fillStyle = textSecondary;
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.fillText('Ranked on 10desires.xyz', width / 2, 85);

        // Draw coaster cards
        let yPos = headerHeight;
        cards.forEach((card, index) => {
            const rank = card.querySelector('.coaster-rank').textContent;
            const name = card.querySelector('.coaster-name').textContent;
            const park = card.querySelector('.coaster-park').textContent;
            const manufacturer = card.querySelector('.coaster-manufacturer').textContent;

            // Draw card background
            ctx.fillStyle = cardBg;
            ctx.fillRect(padding, yPos, width - (padding * 2), cardHeight);

            // Draw border
            ctx.strokeStyle = border;
            ctx.lineWidth = 1;
            ctx.strokeRect(padding, yPos, width - (padding * 2), cardHeight);

            // Draw rank
            ctx.fillStyle = accent;
            ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(rank, padding + 20, yPos + 48);

            // Draw coaster name
            ctx.fillStyle = textPrimary;
            ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
            ctx.fillText(name, padding + 80, yPos + 35);

            // Draw park
            ctx.fillStyle = textSecondary;
            ctx.font = '14px system-ui, -apple-system, sans-serif';
            ctx.fillText(park, padding + 80, yPos + 58);

            // Draw manufacturer (right aligned)
            ctx.fillStyle = accent;
            ctx.font = '14px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(manufacturer, width - padding - 20, yPos + 48);

            yPos += cardHeight + cardSpacing;
        });

        // Draw footer
        ctx.fillStyle = textSecondary;
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Created with Edit Mode achievement • 10desires.xyz', width / 2, yPos + 30);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-top-16-coasters-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Re-enable button
            button.disabled = false;
            button.textContent = '📸 Generate Shareable Image';
        });

    } catch (error) {
        console.error('Error generating image:', error);
        button.disabled = false;
        button.textContent = '📸 Generate Shareable Image';
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
        // Track daily visit for streak achievement
        trackDailyVisit();

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
        updateBlurFilterClass();
        updateEditModeClass();

        // Apply F emoji replacement if enabled
        if (typeof isFEmojiEnabled === 'function' && isFEmojiEnabled()) {
            applyFEmojiReplacement();
        }

        // Add event listener for share ranking button
        const shareBtn = document.getElementById('share-ranking-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', generateShareableImage);
        }
    });
} else {
    // Track daily visit for streak achievement
    trackDailyVisit();

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
    updateBlurFilterClass();
    updateEditModeClass();

    // Apply F emoji replacement if enabled
    if (typeof isFEmojiEnabled === 'function' && isFEmojiEnabled()) {
        applyFEmojiReplacement();
    }

    // Add event listener for share ranking button
    const shareBtn = document.getElementById('share-ranking-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', generateShareableImage);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        achievementManager,
        trackLoadingTip,
        trackThemeToggle,
        trackDevConsoleOpen,
        track404Visit,
        trackDailyVisit,
        trackCoasterClick,
        trackBarrelRoll,
        trackBlasphemy,
        trackPayRespects,
        trackBigBox,
        getLoadingTipProgress,
        getDailyVisitProgress,
        getCoasterClicksProgress,
        initCelebrationPage,
        resetAchievementProgress,
        resetAllAchievements,
        updateAchievementNavLink,
        toggleRainbowText,
        isRainbowTextEnabled,
        updateRainbowTextClass,
        toggleRainbowLoading,
        isRainbowLoadingEnabled,
        toggleFEmoji,
        isFEmojiEnabled,
        applyFEmojiReplacement,
        updateRainbowLoadingClass,
        toggleBlurFilter,
        isBlurFilterEnabled,
        updateBlurFilterClass,
        toggleEditMode,
        isEditModeEnabled,
        updateEditModeClass,
        exportAchievements,
        importAchievements,
        ACHIEVEMENTS
    };
}

// Make functions globally available for onclick handlers
window.exportAchievements = exportAchievements;
window.importAchievements = importAchievements;
