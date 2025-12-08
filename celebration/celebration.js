/**
 * Achievements Hub Page
 * Displays all achievements in a grid layout
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initAchievementsPage();
});

/**
 * Initialize the achievements page
 */
function initAchievementsPage() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    // Get all achievements
    const achievements = Object.values(ACHIEVEMENTS);
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievementManager.getUnlockedAchievements();
    const totalUnlocked = unlockedAchievements.length;
    const percentage = totalAchievements > 0 ? Math.round((totalUnlocked / totalAchievements) * 100) : 0;

    // Update stats
    document.getElementById('total-unlocked').textContent = totalUnlocked;
    document.getElementById('total-achievements').textContent = totalAchievements;
    document.getElementById('completion-percentage').textContent = `${percentage}%`;

    // Clear grid
    grid.innerHTML = '';

    // Create achievement cards
    achievements.forEach(achievement => {
        const isUnlocked = achievementManager.isUnlocked(achievement.id);
        const card = createAchievementCard(achievement, isUnlocked);
        grid.appendChild(card);
    });
}

/**
 * Create an achievement card element
 */
function createAchievementCard(achievement, isUnlocked) {
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

    // Get progress for this achievement if applicable
    let progressHTML = '';
    if (!isUnlocked) {
        if (achievement.id === 'loadingTipsMaster') {
            const progress = getLoadingTipProgress();
            progressHTML = `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <p class="progress-label">${progress.seen}/${progress.total} seen</p>
                </div>
            `;
        } else if (achievement.id === 'epilepsyWarning') {
            const toggleData = JSON.parse(localStorage.getItem('themeToggles') || '{"count": 0, "timestamp": 0}');
            const now = Date.now();
            // Only show progress if within the 10 second window
            const isActive = (now - toggleData.timestamp) <= 10000;
            const count = isActive ? toggleData.count : 0;
            const percentage = Math.min((count / 50) * 100, 100);
            progressHTML = `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <p class="progress-label">${count}/50 toggles ${isActive ? '(active)' : ''}</p>
                </div>
            `;
        } else if (achievement.id === 'dedicated') {
            const progress = getDailyVisitProgress();
            progressHTML = `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <p class="progress-label">${progress.current}/${progress.total} days</p>
                </div>
            `;
        } else if (achievement.id === 'educated') {
            const progress = getCoasterClicksProgress();
            progressHTML = `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <p class="progress-label">${progress.clicked}/${progress.total} clicked</p>
                </div>
            `;
        }
    }

    // Add toggles for achievement rewards
    let toggleHTML = '';
    if (isUnlocked && achievement.id === 'epilepsyWarning') {
        const isEnabled = typeof isRainbowTextEnabled === 'function' ? isRainbowTextEnabled() : true;
        toggleHTML = `
            <div class="achievement-toggle">
                <label class="toggle-switch">
                    <input type="checkbox" id="rainbow-toggle" ${isEnabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Rainbow Text Effect</span>
            </div>
        `;
    } else if (isUnlocked && achievement.id === 'loadingTipsMaster') {
        const isEnabled = typeof isRainbowLoadingEnabled === 'function' ? isRainbowLoadingEnabled() : true;
        toggleHTML = `
            <div class="achievement-toggle">
                <label class="toggle-switch">
                    <input type="checkbox" id="rainbow-loading-toggle" ${isEnabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Rainbow Loading Bar</span>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="achievement-icon ${!isUnlocked ? 'locked-icon' : ''}">${isUnlocked ? achievement.icon : '🔒'}</div>
        <div class="achievement-info">
            <h3 class="achievement-name">${isUnlocked ? achievement.name : '???'}</h3>
            <p class="achievement-desc">${isUnlocked ? achievement.description : 'Keep exploring to unlock this achievement!'}</p>
            ${progressHTML}
            ${toggleHTML}
        </div>
        ${isUnlocked ? '<span class="achievement-badge">✓</span>' : ''}
    `;

    // Add toggle event listeners for achievement rewards
    if (isUnlocked && achievement.id === 'epilepsyWarning') {
        // Need to wait for the card to be in DOM before adding listener
        setTimeout(() => {
            const toggle = card.querySelector('#rainbow-toggle');
            if (toggle) {
                // Ensure toggle reflects current state
                toggle.checked = typeof isRainbowTextEnabled === 'function' ? isRainbowTextEnabled() : true;

                toggle.addEventListener('change', (e) => {
                    e.stopPropagation(); // Prevent card click event
                    if (typeof toggleRainbowText === 'function') {
                        toggleRainbowText();
                    }
                });
            }
        }, 0);
    } else if (isUnlocked && achievement.id === 'loadingTipsMaster') {
        setTimeout(() => {
            const toggle = card.querySelector('#rainbow-loading-toggle');
            if (toggle) {
                // Ensure toggle reflects current state
                toggle.checked = typeof isRainbowLoadingEnabled === 'function' ? isRainbowLoadingEnabled() : true;

                toggle.addEventListener('change', (e) => {
                    e.stopPropagation(); // Prevent card click event
                    if (typeof toggleRainbowLoading === 'function') {
                        toggleRainbowLoading();
                    }
                });
            }
        }, 0);
    }

    // Make unlocked cards clickable if they have an unlock page
    if (isUnlocked && achievement.unlockPage) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on toggle
            if (!e.target.closest('.achievement-toggle')) {
                window.location.href = achievement.unlockPage;
            }
        });
    }

    return card;
}
