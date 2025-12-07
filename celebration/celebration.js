// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has unlocked the achievement
    const achievementUnlocked = localStorage.getItem('achievementUnlocked') === 'true';
    const seenTips = JSON.parse(localStorage.getItem('seenTips') || '[]');
    const totalTips = typeof loadingTips !== 'undefined' ? loadingTips.length : 50;

    const lockedSection = document.querySelector('#celebration-locked');
    const unlockedSection = document.querySelector('#celebration-unlocked');
    const celebrationContent = document.querySelector('.celebration-content');
    const progressText = document.querySelector('#progress-text');

    if (achievementUnlocked) {
        // Show unlocked content
        if (unlockedSection) unlockedSection.style.display = 'block';
        if (celebrationContent) celebrationContent.style.display = 'block';
    } else {
        // Show locked content with progress
        if (lockedSection) lockedSection.style.display = 'block';
        const progress = seenTips.length;
        if (progressText) {
            progressText.textContent = `You've seen ${progress} out of ${totalTips} tips. Keep refreshing!`;
        }
    }
});

// Reset progress function
function resetProgress() {
    if (confirm('Are you sure you want to reset your progress? This will delete all your seen tips and lock this page again.')) {
        localStorage.removeItem('seenTips');
        localStorage.removeItem('achievementUnlocked');
        window.location.href = '/';
    }
}
