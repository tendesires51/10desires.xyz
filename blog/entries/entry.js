/**
 * Blog Entry Framework
 * Handles interactions and enhancements for individual blog entries
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on individual entry pages
    const isEntryPage = window.location.pathname.includes('/entries/entry');

    if (!isEntryPage) return;

    /**
     * Add copy buttons to code blocks
     */
    function addCopyButtonsToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;

            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-button';
            copyButton.innerHTML = '=Ë Copy';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');

            // Position the pre element relatively
            pre.style.position = 'relative';

            // Add button to pre element
            pre.appendChild(copyButton);

            // Copy functionality
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    copyButton.innerHTML = ' Copied!';
                    copyButton.style.backgroundColor = 'var(--accent)';

                    setTimeout(() => {
                        copyButton.innerHTML = '=Ë Copy';
                        copyButton.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    copyButton.innerHTML = 'L Failed';

                    setTimeout(() => {
                        copyButton.innerHTML = '=Ë Copy';
                    }, 2000);
                }
            });
        });
    }

    /**
     * Add smooth scroll to anchor links
     */
    function addSmoothScrollToAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /**
     * Add reading progress indicator
     */
    function addReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressBarFill = progressBar.querySelector('.reading-progress-bar');

        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;

            progressBarFill.style.width = Math.min(progress, 100) + '%';
        }

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    /**
     * Add table of contents if headers exist
     */
    function generateTableOfContents() {
        const entryContent = document.querySelector('.entry-content');
        if (!entryContent) return;

        const headers = entryContent.querySelectorAll('h2, h3');
        if (headers.length < 3) return; // Only add TOC if there are 3+ headers

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Table of Contents</h3><ul class="toc-list"></ul>';

        const tocList = toc.querySelector('.toc-list');

        headers.forEach((header, index) => {
            // Add ID to header if it doesn't have one
            if (!header.id) {
                header.id = `section-${index}`;
            }

            const li = document.createElement('li');
            li.className = header.tagName === 'H3' ? 'toc-item toc-item-sub' : 'toc-item';

            const link = document.createElement('a');
            link.href = `#${header.id}`;
            link.textContent = header.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            li.appendChild(link);
            tocList.appendChild(li);
        });

        // Insert TOC after first paragraph
        const firstParagraph = entryContent.querySelector('p');
        if (firstParagraph) {
            firstParagraph.after(toc);
        } else {
            entryContent.insertBefore(toc, entryContent.firstChild);
        }
    }

    /**
     * Add external link indicators
     */
    function markExternalLinks() {
        const links = document.querySelectorAll('.entry-content a[href^="http"]');

        links.forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.classList.add('external-link');
            }
        });
    }

    // Initialize all enhancements
    addCopyButtonsToCodeBlocks();
    addSmoothScrollToAnchors();
    addReadingProgressBar();
    generateTableOfContents();
    markExternalLinks();

    console.log(' Entry enhancements loaded');
});
