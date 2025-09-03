import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";

const response = await fetch("blog.md");
const markdown = await response.text();
const sections = markdown.trim().split('## ');
const headerContent = sections[0];
const blogSections = sections.slice(1);

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