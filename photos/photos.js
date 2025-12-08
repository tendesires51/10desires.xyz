/**
 * Photo Gallery JavaScript
 * Handles lightbox, navigation, and interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// Photo gallery state
let currentPhotoIndex = 0;
const photoItems = document.querySelectorAll('.photo-item');
const totalPhotos = photoItems.length;

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const currentPhotoSpan = document.getElementById('current-photo');
const totalPhotosSpan = document.getElementById('total-photos');

// Set total photos count
if (totalPhotosSpan) {
    totalPhotosSpan.textContent = totalPhotos;
}

/**
 * Open lightbox with specific photo
 */
function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close lightbox
 */
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Update lightbox image
 */
function updateLightboxImage() {
    const photoItem = photoItems[currentPhotoIndex];
    const img = photoItem.querySelector('img');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    if (currentPhotoSpan) {
        currentPhotoSpan.textContent = currentPhotoIndex + 1;
    }
}

/**
 * Navigate to next photo
 */
function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
    updateLightboxImage();
}

/**
 * Navigate to previous photo
 */
function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
    updateLightboxImage();
}

// Event Listeners
photoItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextPhoto();
    });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevPhoto();
    });
}

// Close lightbox when clicking outside the image
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Prevent clicks on lightbox content from closing
const lightboxContent = document.querySelector('.lightbox-content');
if (lightboxContent) {
    lightboxContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextPhoto();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPhoto();
        }
    }
});

// Lazy loading animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

photoItems.forEach(item => {
    observer.observe(item);
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next photo
            nextPhoto();
        } else {
            // Swipe right - previous photo
            prevPhoto();
        }
    }
}

// Prevent body scroll when lightbox is open
function preventScroll(e) {
    if (lightbox.style.display === 'flex') {
        e.preventDefault();
    }
}

// Add mousewheel support for navigation in lightbox (with debouncing)
let wheelTimeout;
if (lightbox) {
    lightbox.addEventListener('wheel', (e) => {
        if (lightbox.classList.contains('active')) {
            e.preventDefault();

            // Debounce wheel events to prevent rapid scrolling
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    nextPhoto();
                } else {
                    prevPhoto();
                }
            }, 50);
        }
    }, { passive: false });
}

// Preload adjacent images for smoother navigation
function preloadAdjacentImages() {
    const nextIndex = (currentPhotoIndex + 1) % totalPhotos;
    const prevIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;

    const nextImg = new Image();
    const prevImg = new Image();

    nextImg.src = photoItems[nextIndex].querySelector('img').src;
    prevImg.src = photoItems[prevIndex].querySelector('img').src;
}

// Call preload when opening lightbox or changing photos
const originalUpdateLightboxImage = updateLightboxImage;
updateLightboxImage = function() {
    originalUpdateLightboxImage();
    preloadAdjacentImages();
};

}); // End DOMContentLoaded
