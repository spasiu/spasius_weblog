#!/usr/bin/env node

import { config } from 'dotenv'; config();

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// RSS feed configuration
const SITE_URL = process.env.SITE_URL; // Update this to your actual domain
const SITE_TITLE = process.env.SITE_TITLE;
const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION;
const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL;

function generateId(heading) {
  // Use the same logic as script.js: lowercase and replace spaces/dots with dashes
  return heading.toLowerCase().replaceAll(/\s|\./g, '-');
}

function extractDateFromHeading(heading) {
  // Extract date in format YYYY.MM.DD from the heading
  const match = heading.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(); // Default to current date if no date found
}

function extractTitleFromHeading(heading) {
  // Remove the date part from the heading to get clean title
  const match = heading.match(/\d{4}\.\d{2}\.\d{2}/);
  return match ? heading.slice(0, match.index).trim() : heading.trim();
}

function processMarkdownContent(content) {
  // Convert markdown to HTML
  let html = md.render(content);
  
  // Convert relative image paths to absolute URLs
  html = html.replace(/src="assets\//g, `src="${SITE_URL}/assets/`);
  
  // Ensure all links are absolute
  html = html.replace(/href="(?!http)/g, `href="${SITE_URL}/`);
  
  return html;
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateRSSFeed() {
  // Read the blog markdown file
  const blogPath = join(__dirname, 'public', 'blog.md');
  const markdown = readFileSync(blogPath, 'utf-8');
  
  // Split into sections like script.js does
  const sections = markdown.trim().split('## ');
  const headerContent = sections[0];
  
  // Filter out draft posts and process sections
  const blogSections = sections.slice(1).filter((section) => {
    const splitIndex = section.indexOf('\n');
    const heading = section.slice(0, splitIndex);
    // Exclude sections that contain [draft] in the heading (case-insensitive)
    return !heading.toLowerCase().includes('[draft]');
  });

  // Process each blog section into RSS items
  const rssItems = blogSections.map((section) => {
    const splitIndex = section.indexOf('\n');
    const heading = section.slice(0, splitIndex);
    const content = section.slice(splitIndex + 1).trim();
    
    const id = generateId(heading);
    const title = extractTitleFromHeading(heading);
    const date = extractDateFromHeading(heading);
    const htmlContent = processMarkdownContent(content);
    
    // Generate the item URL
    const itemUrl = `${SITE_URL}/#${id}`;
    
    // Format date for RSS (RFC 2822 format)
    const pubDate = date.toUTCString();
    
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${itemUrl}</link>
      <guid>${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${htmlContent}]]></description>
    </item>`;
  }).join('\n');

  // Get the latest post date for the channel lastBuildDate
  const latestDate = blogSections.length > 0 
    ? extractDateFromHeading(blogSections[0].split('\n')[0])
    : new Date();

  // Generate the complete RSS feed
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${AUTHOR_EMAIL}</managingEditor>
    <webMaster>${AUTHOR_EMAIL}</webMaster>
${rssItems}
  </channel>
</rss>`;

  // Write the RSS feed to public/rss.xml
  const rssPath = join(__dirname, 'public', 'rss.xml');
  writeFileSync(rssPath, rssFeed, 'utf-8');
  
  console.log(`✅ RSS feed generated successfully at ${rssPath}`);
  console.log(`📝 Generated ${blogSections.length} RSS items`);
}

// Run the script
try {
  generateRSSFeed();
} catch (error) {
  console.error('❌ Error generating RSS feed:', error.message);
  process.exit(1);
}
