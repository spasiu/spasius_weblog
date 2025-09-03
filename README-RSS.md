# RSS Feed Generation

This project includes a Node.js script that automatically generates an RSS feed from your `public/blog.md` file.

## How it works

The script (`generate-rss.js`) reads your `public/blog.md` file and:

1. **Parses the markdown structure** - Splits content by `## ` headings, just like your `script.js` does
2. **Filters out draft posts** - Excludes any posts with `[draft]` in the heading (case-insensitive)
3. **Extracts metadata** - Gets post titles, dates (in YYYY.MM.DD format), and content
4. **Converts to HTML** - Uses markdown-it to convert markdown content to HTML
5. **Generates RSS XML** - Creates a valid RSS 2.0 feed with proper metadata
6. **Creates consistent URLs** - Uses the same ID generation logic as your client-side script for consistent linking

## Key features

- **Draft filtering**: Posts marked with `[draft]` are automatically excluded
- **Consistent URLs**: RSS items link to `yoursite.com/#post-id` using the same ID logic as your frontend
- **Image handling**: Converts relative `assets/` paths to absolute URLs
- **HTML descriptions**: Full post content is included as HTML in RSS descriptions
- **Valid RSS 2.0**: Generates standards-compliant RSS with proper metadata

## Usage

### Run the script directly:
```bash
node generate-rss.js
```

### Or use the npm script:
```bash
npm run generate-rss
```

### Output
The script generates `public/rss.xml` with your blog posts as RSS items.

## Configuration

Edit the constants at the top of `generate-rss.js` to customize:

```javascript
const SITE_URL = 'https://spasiu.com'; // Your domain
const SITE_TITLE = "Spasiu's Weblog";  // Feed title
const SITE_DESCRIPTION = 'The scratchpad of my life.'; // Feed description
const AUTHOR_EMAIL = 'your-email@example.com'; // Your email
```

## Integration

You can integrate this into your build process, run it manually when you add new posts, or set up automation to regenerate the RSS feed whenever `blog.md` changes.

The generated `public/rss.xml` can be served alongside your other static files and linked in your HTML:

```html
<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
```
