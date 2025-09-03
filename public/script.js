import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";

const response = await fetch("blog.md");
const markdown = await response.text();
const sections = markdown.trim().split('## ');
const headerContent = sections[0];
// Filter out draft posts (those with [draft] in the heading)
const blogSections = sections.slice(1).filter((section) => {
    const splitIndex = section.indexOf('\n');
    const heading = section.slice(0, splitIndex);
    // Exclude sections that contain [draft] in the heading (case-insensitive)
    return !heading.toLowerCase().includes('[draft]');
});

// Process header content
const processedHeader = marked.parse(headerContent);

// Process each blog section
const processedSections = blogSections.map((md) => {
    const splitIndex = md.indexOf('\n');
    const heading = md.slice(0, splitIndex);
    const content = md.slice(splitIndex + 1).trim();
    const id = heading.toLowerCase().replaceAll(/\s|\./g, '-');
    const match = heading.match(/\d{4}\.\d{2}\.\d{2}/);
    const title = match ? heading.slice(0, match.index) : heading;
    const date = match?.[0];
    
    // Parse the content through marked first
    const processedContent = marked.parse(content);
    
    return `<h2 class="title" id="${id}">${title} ${date ? `<span class="date">${date}</span>` : ''}</h2>
<div style="display: none;" class="post" id="post-${id}">${processedContent}</div>
`;
}).join('');

const html = processedHeader + processedSections;
document.querySelector("#markdown").innerHTML = html;

// Initialize image expansion after content is inserted
initImageExpansion();
// Initialize table column sizing after content is inserted
initTableColumnSizing();

document.querySelectorAll(".title").forEach(title => {
    title.addEventListener("click", () => {
        const currentHash = window.location.hash.slice(1);
        const clickedId = title.id;
        
        if (currentHash === clickedId) {

            closePost();
        } else {

            window.location.hash = clickedId;
            openPost();
        }
    });

    title.classList.add('collapsed');
});

function openPost() {
    const postId = window.location.hash.slice(1);
    const post = document.querySelector(`#post-${postId}`);
    const title = document.querySelector(`#${postId}`);
    
    document.querySelectorAll(".post").forEach(p => {
        p.style.display = "none";
    });

    document.querySelectorAll(".title").forEach(t => {
        t.classList.remove('expanded');
        t.classList.add('collapsed');
    });
    
    post.style.display = "block";
    title.classList.remove('collapsed');
    title.classList.add('expanded');
}

function closePost() {
    document.querySelectorAll(".post").forEach(p => {
        p.style.display = "none";
    });

    document.querySelectorAll(".title").forEach(t => {
        t.classList.remove('expanded');
        t.classList.add('collapsed');
    });

    history.pushState("", document.title, window.location.pathname + window.location.search);
}

if (window.location.hash) {
    openPost();
}

// Listen for hash changes (browser back/forward, direct URL navigation)
window.addEventListener('hashchange', () => {
    if (window.location.hash) {
        openPost();
    } else {
        closePost();
    }
});

// Dark mode functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const html = document.documentElement;
    const toggleIcon = document.querySelector('.toggle-icon');
    
    // Check for saved dark mode preference or default to light mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply initial mode
    if (isDarkMode) {
        body.classList.add('dark-mode');
        html.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
    } else {
        toggleIcon.textContent = '🌙';
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        html.classList.toggle('dark-mode');
        const isNowDarkMode = body.classList.contains('dark-mode');
        
        // Update icon
        toggleIcon.textContent = isNowDarkMode ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('darkMode', isNowDarkMode);
    });
}

// Initialize dark mode after DOM is loaded
initDarkMode();

// Image expansion functionality
function initImageExpansion() {
    // Add click handlers to all images and set up tooltips
    document.querySelectorAll('img').forEach(img => {
        // Add tooltip using alt text
        const altText = img.getAttribute('alt');
        if (altText && altText.trim()) {
            img.setAttribute('title', altText);
        }
        
        // Add click handler for expansion
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            img.classList.toggle('expanded');
        });
    });
}

// Table column sizing based on content volume
function initTableColumnSizing() {
    document.querySelectorAll('table').forEach(table => {
        // Set table-layout to fixed for manual column control
        table.style.tableLayout = 'fixed';
        
        const headers = table.querySelectorAll('th');
        const rows = table.querySelectorAll('tr');
        
        if (headers.length === 0) return;
        
        // Calculate character count for each column
        const columnCharCounts = Array(headers.length).fill(0);
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            cells.forEach((cell, index) => {
                if (index < columnCharCounts.length) {
                    // Count visible text characters, excluding HTML tags
                    const textContent = cell.textContent || cell.innerText || '';
                    columnCharCounts[index] += textContent.trim().length;
                }
            });
        });
        
        // Calculate total character count
        const totalChars = columnCharCounts.reduce((sum, count) => sum + count, 0);
        
        if (totalChars === 0) return; // Avoid division by zero
        
        // Set minimum width percentage (so no column is too narrow)
        const minWidthPercent = 8;
        const availablePercent = 100 - (minWidthPercent * headers.length);
        
        // Calculate proportional widths
        const columnWidths = columnCharCounts.map(count => {
            const proportionalPercent = (count / totalChars) * availablePercent;
            return minWidthPercent + proportionalPercent;
        });
        
        // Apply the calculated widths
        headers.forEach((header, index) => {
            header.style.width = columnWidths[index] + '%';
        });
    });
}
