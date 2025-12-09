/**
 * Blog Entry Auto-Discovery System
 * Automatically finds and loads blog entries from the entries folder
 */

document.addEventListener('DOMContentLoaded', async function() {
    const blogEntriesContainer = document.getElementById('blog-entries');
    const noEntriesMessage = document.getElementById('no-entries');

    if (!blogEntriesContainer) return;

    // Configuration
    const MAX_ENTRIES = 100; // Maximum number of entries to check for
    const ENTRIES_PATH = 'entries/';

    /**
     * Try to fetch an entry file
     */
    async function fetchEntry(entryNumber) {
        const filename = `${ENTRIES_PATH}entry${entryNumber}.html`;

        try {
            const response = await fetch(filename);
            if (response.ok && response.status === 200) {
                const html = await response.text();
                // Verify it's actually HTML content, not an error page
                if (html.trim().length > 0 && html.includes('entry-container')) {
                    return {
                        number: entryNumber,
                        html: html,
                        exists: true
                    };
                }
            }
            return { exists: false };
        } catch (error) {
            return { exists: false };
        }
    }

    /**
     * Parse entry HTML to extract metadata
     */
    function parseEntryMetadata(html, entryNumber) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract metadata from data attributes or meta tags
        const entryElement = doc.querySelector('[data-entry]') || doc.body;

        return {
            number: entryNumber,
            title: entryElement.getAttribute('data-title') || doc.querySelector('h1, h2')?.textContent || `Entry ${entryNumber}`,
            date: entryElement.getAttribute('data-date') || new Date().toLocaleDateString(),
            excerpt: entryElement.getAttribute('data-excerpt') || doc.querySelector('p')?.textContent?.substring(0, 150) + '...' || '',
            tags: entryElement.getAttribute('data-tags')?.split(',').map(t => t.trim()) || [],
            html: html
        };
    }

    /**
     * Create entry preview card
     */
    function createEntryCard(entry) {
        const card = document.createElement('article');
        card.className = 'blog-entry-card animate-on-scroll';
        card.setAttribute('data-entry-number', entry.number);

        const tagsHTML = entry.tags.length > 0
            ? `<div class="entry-tags">${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}</div>`
            : '';

        card.innerHTML = `
            <div class="entry-header">
                <span class="entry-number">#${entry.number}</span>
                <span class="entry-date">${entry.date}</span>
            </div>
            <h2 class="entry-title">${entry.title}</h2>
            <p class="entry-excerpt">${entry.excerpt}</p>
            ${tagsHTML}
            <a href="entries/entry${entry.number}.html" class="entry-read-more">Read More &rarr;</a>
        `;

        return card;
    }

    /**
     * Discover and load all entries
     */
    async function loadEntries() {
        const entries = [];

        // Show loading state
        blogEntriesContainer.innerHTML = '<div class="blog-loading"><p>Discovering entries...</p></div>';

        // Check for entries sequentially - stop when we find a gap
        let consecutiveNotFound = 0;
        const maxGap = 5; // Stop after 5 consecutive missing entries

        for (let i = 1; i <= MAX_ENTRIES; i++) {
            const result = await fetchEntry(i);

            if (result.exists) {
                const metadata = parseEntryMetadata(result.html, result.number);
                entries.push(metadata);
                consecutiveNotFound = 0; // Reset gap counter
            } else {
                consecutiveNotFound++;
                // If we've found 5 consecutive missing entries, assume we're done
                if (consecutiveNotFound >= maxGap) {
                    break;
                }
            }
        }

        // Sort entries by number (newest first)
        entries.sort((a, b) => b.number - a.number);

        // Display entries
        if (entries.length > 0) {
            blogEntriesContainer.innerHTML = '';
            entries.forEach(entry => {
                const card = createEntryCard(entry);
                blogEntriesContainer.appendChild(card);
            });

            // Trigger scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('visible'), index * 50);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.blog-entry-card').forEach(el => observer.observe(el));

            // Hide no entries message
            if (noEntriesMessage) {
                noEntriesMessage.style.display = 'none';
            }
        } else {
            // No entries found
            blogEntriesContainer.innerHTML = '';
            if (noEntriesMessage) {
                noEntriesMessage.style.display = 'block';
            }
        }

        console.log(` Loaded ${entries.length} blog entries`);
    }

    // Start loading entries
    loadEntries();
});
