# Achievement System Framework

A reusable framework for creating and tracking achievements across the 10desires.xyz site.

## Files

- **`achieves.css`** - All achievement-related styles (celebration pages, banners, progress displays)
- **`achieves.js`** - Core achievement tracking system and manager
- **`celebration/celebration.js`** - Example implementation for Loading Tips Master achievement

## Quick Start

### 1. Include the Achievement System

Add to your HTML `<head>`:
```html
<link rel="stylesheet" href="../achieves.css">
```

Add before closing `</body>`:
```html
<script src="../achieves.js"></script>
```

### 2. Define a New Achievement

Edit `achieves.js` and add to the `ACHIEVEMENTS` object:

```javascript
const ACHIEVEMENTS = {
    YOUR_ACHIEVEMENT: {
        id: 'yourAchievement',
        name: 'Achievement Name',
        description: 'You did something cool!',
        icon: '🏆',
        unlockPage: '/your-celebration-page',
        checkCondition: () => {
            // Return true when achievement should unlock
            return localStorage.getItem('someCondition') === 'true';
        }
    }
};
```

### 3. Track Achievement Progress

Wherever you want to track progress, call:

```javascript
// Example: Track a specific action
function trackAction() {
    // Your action logic here

    // Check if achievement should unlock
    const newlyUnlocked = achievementManager.checkAchievements();
    newlyUnlocked.forEach(achievement => {
        achievementManager.showAchievementBanner(achievement);
    });
}
```

### 4. Create a Celebration Page

Use the celebration page template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Achievement Unlocked! — 10desires.xyz</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../achieves.css">
</head>
<body>
    <!-- Copy nav from another page -->
    <nav>...</nav>

    <section class="hero hero-short celebration-hero">
        <!-- Locked State -->
        <div id="celebration-locked" class="celebration-state" style="display: none;">
            <p class="hero-eyebrow">Not Yet...</p>
            <h1 class="hero-title hero-title-smaller celebration-title rainbow-text">
                Locked!
            </h1>
            <p class="hero-subtitle hero-subtitle-smaller">
                Complete the requirement to unlock this achievement.
            </p>
            <div class="hero-cta">
                <a href="/" class="btn-primary">Go Back</a>
            </div>
            <div class="progress-section">
                <p class="progress-text" id="progress-text"></p>
            </div>
        </div>

        <!-- Unlocked State -->
        <div id="celebration-unlocked" class="celebration-state" style="display: none;">
            <p class="hero-eyebrow">Congratulations!</p>
            <h1 class="hero-title hero-title-smaller celebration-title rainbow-text">
                🎉 You Did It 🎉
            </h1>
            <p class="hero-subtitle hero-subtitle-smaller">
                Achievement unlocked!
            </p>
        </div>
    </section>

    <section id="about" style="display: none;" class="celebration-content">
        <div class="section-container celebration-reward-section">
            <p class="section-eyebrow celebration-eyebrow">Your Reward</p>
            <h2 class="section-title celebration-section-title">Achievement Complete</h2>
            <p class="section-subtitle celebration-section-subtitle">Great job!</p>

            <div class="celebration-body">
                <p class="celebration-paragraph">Description of the achievement...</p>
                <div class="celebration-reset-section">
                    <button class="btn-primary" onclick="resetProgress()">Reset Progress</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Copy footer from another page -->
    <footer>...</footer>

    <script src="../tips.js"></script>
    <script src="../main.js"></script>
    <script src="../achieves.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initCelebrationPage('yourAchievement');
        });

        function resetProgress() {
            resetAchievementProgress('yourAchievement');
        }
    </script>
</body>
</html>
```

## API Reference

### Achievement Manager

```javascript
// Global instance
achievementManager

// Check if achievement is unlocked
achievementManager.isUnlocked('achievementId')

// Unlock an achievement manually
achievementManager.unlock('achievementId')

// Check all achievements
achievementManager.checkAchievements()

// Show unlock banner
achievementManager.showAchievementBanner(achievement)

// Reset an achievement
achievementManager.resetAchievement('achievementId')

// Reset all achievements
achievementManager.resetAll()
```

### Helper Functions

```javascript
// For loading tips achievement
trackLoadingTip(tipIndex)
getLoadingTipProgress()

// For celebration pages
initCelebrationPage('achievementId')
resetAchievementProgress('achievementId')
```

## Achievement Banner

The achievement banner automatically appears when an achievement is unlocked:

- Slides up from bottom
- Shows achievement icon and name
- Click to navigate to unlock page
- Auto-dismisses after 5 seconds
- Can be manually closed with × button

## CSS Classes Reference

### Celebration Hero
- `.celebration-hero` - Hero section for celebration pages (70vh)
- `.celebration-state` - Container for locked/unlocked states
- `.celebration-title` - Title styling

### Progress Display
- `.progress-section` - Glassmorphic progress card
- `.progress-text` - Progress text styling

### Content Sections
- `.celebration-content` - Main content wrapper
- `.celebration-reward-section` - Centered reward section
- `.celebration-body` - Body content container (680px max-width)
- `.celebration-paragraph` - Standard paragraph
- `.celebration-stat` - Highlighted stat card
- `.celebration-reset-section` - Reset button section

### Achievement Banner
- `.achievement-banner` - Fixed position notification banner
- `.achievement-banner.show` - Visible state
- `.achievement-icon` - Large emoji/icon
- `.achievement-title` - "Achievement Unlocked!" text
- `.achievement-description` - Achievement name

## Example: Loading Tips Master Achievement

The existing Loading Tips Master achievement demonstrates the full system:

**Definition** (`achieves.js`):
```javascript
LOADING_TIPS_MASTER: {
    id: 'loadingTipsMaster',
    name: 'Loading Tips Master',
    description: "You've seen all 50 loading tips!",
    icon: '🎉',
    unlockPage: '/celebration',
    checkCondition: () => {
        const seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');
        const totalTips = typeof loadingTips !== 'undefined' ? loadingTips.length : 50;
        return seenTips.length >= totalTips;
    }
}
```

**Tracking** (in loading screen logic):
```javascript
trackLoadingTip(tipIndex);
```

**Celebration Page** (`celebration/index.html` + `celebration/celebration.js`):
```javascript
initCelebrationPage('loadingTipsMaster');
```

## Best Practices

1. **Achievement IDs**: Use camelCase for IDs (e.g., `loadingTipsMaster`)
2. **Icons**: Use single emoji characters for best results
3. **Unlock Pages**: Create dedicated celebration pages for each achievement
4. **Progress**: Store achievement-specific data with prefixed localStorage keys
5. **Testing**: Use `achievementManager.unlock('id')` in console to test celebration pages
6. **Reset**: Always provide a reset option on celebration pages

## Adding to Existing Pages

To add achievement tracking to an existing page:

1. Include `achieves.js` in the page
2. Define your achievement in `ACHIEVEMENTS`
3. Call `achievementManager.checkAchievements()` when conditions might be met
4. The system automatically shows banners and tracks unlocks

No need to modify existing celebration styles in `styles.css` - `achieves.css` handles everything!
