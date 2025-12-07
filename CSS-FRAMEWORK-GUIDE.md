# 10desires.xyz CSS Framework Guide

Quick reference for building new pages with the streamlined CSS framework.

## CSS Variables

Use these CSS variables throughout your pages for consistency:

### Spacing
```css
var(--spacing-xs)   /* 8px */
var(--spacing-sm)   /* 16px */
var(--spacing-md)   /* 24px */
var(--spacing-lg)   /* 40px */
var(--spacing-xl)   /* 80px */
```

### Colors
```css
var(--text-primary)    /* Main text color */
var(--text-secondary)  /* Secondary text */
var(--text-tertiary)   /* Tertiary text */
var(--bg-primary)      /* Main background */
var(--bg-secondary)    /* Secondary background */
var(--accent)          /* Blue accent */
var(--accent-purple)   /* Purple accent */
var(--border)          /* Border color */
```

### Border Radius
```css
var(--radius-sm)    /* 8px */
var(--radius-md)    /* 16px */
var(--radius-lg)    /* 20px */
var(--radius-pill)  /* 980px (pill-shaped) */
```

## Page Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title — 10desires.xyz</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <!-- Navigation (copy from any existing page) -->
    <nav>...</nav>

    <!-- Mobile Menu (copy from any existing page) -->
    <div class="mobile-menu">...</div>

    <!-- Hero Section -->
    <section class="hero hero-short">
        <p class="hero-eyebrow">eyebrow text</p>
        <h1 class="hero-title hero-title-smaller">Page Title</h1>
        <p class="hero-subtitle hero-subtitle-smaller">Subtitle text here</p>
    </section>

    <!-- Content Sections -->
    <section>
        <div class="section-container">
            <p class="section-eyebrow">Section Label</p>
            <h2 class="section-title">section heading</h2>
            <p class="section-subtitle">Section description</p>

            <!-- Your content here -->
        </div>
    </section>

    <!-- Footer (copy from any existing page) -->
    <footer>...</footer>

    <script src="../main.js"></script>
</body>
</html>
```

## Component Classes

### Hero Variants
```html
<!-- Full height hero (homepage) -->
<section class="hero">

<!-- Short hero (subpages) -->
<section class="hero hero-short">

<!-- Red accent hero (coasters page) -->
<section class="hero hero-short hero-accent-red">
```

### Buttons
```html
<!-- Primary button -->
<a href="#" class="btn-primary">Click Me</a>

<!-- Secondary button (with arrow) -->
<a href="#" class="btn-secondary">Learn More</a>
```

### Cards

#### Generic Card
```html
<div class="card">
    <h3>Card Title</h3>
    <p>Card content</p>
</div>
```

#### Project Card (Music)
```html
<div class="project-card vezzra"> <!-- or: chimera, sunsetter, spcc, luna -->
    <div class="project-icon">⚡</div>
    <h3>Project Name</h3>
    <p class="genre">Genre</p>
    <p>Description</p>
</div>
```

#### Gear Card
```html
<!-- Regular gear card -->
<div class="gear-card">
    <h3>Item Name</h3>
    <ul class="specs">
        <li>Spec detail</li>
    </ul>
</div>

<!-- Featured gear card (spans 2 columns) -->
<div class="gear-card featured">
    <span class="gear-tag">Featured</span>
    <h3>Item Name</h3>
    <p>Description</p>
</div>
```

#### Coaster Card
```html
<div class="coaster-card" onclick="toggleStats(this)">
    <span class="coaster-rank">1</span>
    <div class="coaster-info">
        <h3 class="coaster-name">Coaster Name</h3>
        <p class="coaster-park">Park Name</p>
    </div>
    <span class="coaster-manufacturer">Manufacturer</span>
    <div class="coaster-stats">
        <div class="stat-item">
            <span class="stat-label">Height:</span>
            <span class="stat-value">200 ft</span>
        </div>
    </div>
</div>
```

### Grid Layouts

#### Projects Grid (Auto-fit, min 300px)
```html
<div class="projects-grid">
    <!-- Project cards -->
</div>
```

#### Gear Grid (Auto-fit, min 280px)
```html
<div class="gear-grid">
    <!-- Gear cards -->
</div>
```

#### Passion Cards (2 columns)
```html
<div class="passion-cards">
    <!-- Regular card -->
    <div class="passion-card">
        <div class="passion-icon">🎢</div>
        <h3>Title</h3>
        <p>Content</p>
    </div>

    <!-- Large card (spans 2 columns, 2 column layout) -->
    <div class="passion-card large">
        <div>
            <div class="passion-icon">🎢</div>
            <h3>Title</h3>
            <p>Content</p>
        </div>
        <div>
            <p>Right column content</p>
        </div>
    </div>
</div>
```

#### Work Showcase (2 columns)
```html
<div class="work-showcase">
    <div class="work-card">
        <h3>Job Title</h3>
        <p>Description</p>
        <ul>
            <li>Skill 1</li>
            <li>Skill 2</li>
        </ul>
    </div>
</div>
```

### Scroll Animations

Add fade-in-on-scroll animation to any element:
```html
<div class="animate-on-scroll">
    Content will fade in when scrolled into view
</div>
```

## Section Backgrounds

### Alternating Backgrounds (Gear page style)
```css
.my-section:nth-child(odd) {
    background: var(--bg-primary);
}

.my-section:nth-child(even) {
    background: var(--bg-secondary);
}
```

### Gradient Background
```css
background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
```

## Common Patterns

### Section with Icon Header
```html
<div class="section-header">
    <span class="section-icon">🎸</span>
    <h2 class="section-title">Section Title</h2>
</div>
```

### Centered Content
```html
<div class="section-container">
    <!-- Max-width 1024px, centered -->
</div>
```

### About Content (Narrow, centered)
```html
<div class="about-content">
    <!-- Max-width 680px, centered -->
    <p>Content here</p>
</div>
```

## Quick Tips

1. **Always use CSS variables** instead of hardcoded colors/spacing
2. **Use existing card components** instead of creating custom styles
3. **Copy nav/footer** from existing pages to maintain consistency
4. **Use `.section-container`** to contain content at max-width
5. **Add `.animate-on-scroll`** to cards/sections for smooth reveals
6. **Hero sections** should use `.hero-short` for subpages
7. **Buttons** use `.btn-primary` or `.btn-secondary` classes
8. **Responsive** breakpoint is 768px (automatically handled)

## Example: Creating a New "Photography" Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Photography — 10desires.xyz</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <!-- Copy nav from another page -->
    <nav>...</nav>
    <div class="mobile-menu">...</div>

    <!-- Hero -->
    <section class="hero hero-short">
        <p class="hero-eyebrow">visual storytelling</p>
        <h1 class="hero-title hero-title-smaller">Photography</h1>
        <p class="hero-subtitle hero-subtitle-smaller">capturing moments, one frame at a time.</p>
    </section>

    <!-- Gallery Section -->
    <section>
        <div class="section-container">
            <p class="section-eyebrow">Portfolio</p>
            <h2 class="section-title">recent shots.</h2>
            <p class="section-subtitle">a collection of my favorite captures.</p>

            <div class="gear-grid">
                <div class="gear-card animate-on-scroll">
                    <img src="photo1.jpg" alt="Photo">
                    <h3>Photo Title</h3>
                    <p>Description</p>
                </div>
                <!-- More cards... -->
            </div>
        </div>
    </section>

    <!-- Copy footer from another page -->
    <footer>...</footer>

    <script src="../main.js"></script>
</body>
</html>
```

## Customizing Colors

To add custom colors for a specific section:
```html
<style>
    .my-custom-section .section-eyebrow {
        color: #ff6b6b; /* Custom red */
    }
</style>
```

Or use inline styles for one-off customizations:
```html
<div class="project-card" style="--card-gradient: linear-gradient(135deg, #a8dadc, #f1faee);">
    <div class="project-icon" style="background: linear-gradient(135deg, #457b9d, #a8dadc);">🎨</div>
    <h3>Custom Project</h3>
</div>
```
