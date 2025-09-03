# Personal Blog (Architect SPA)

A tiny static blog powered by Architect (arc.codes). Content lives in `public/blog.md`, rendered client‑side.

## Quick start

1) Install dependencies

- Node.js 18+
- npm install (installs Architect + markdown-it)

```
npm install
```

2) Run locally (Architect Sandbox)

```
npx sandbox
```

Then open the local URL printed in the terminal (typically http://localhost:3333).

## Write your blog

- Replace `public/blog.md` with your own Markdown content.
- Put images and other assets in `public/assets/` and reference them from Markdown like:
  - `![Alt text](assets/my-image.jpg)`
- Top‑level headings (`#`, `##`) become sections on the page.

Minimal example for `public/blog.md`:

```
# My Blog Title

A one‑liner about the blog.

## First Post 2025.09.01

Your post content here. Embed an image:

![A pic](assets/example.jpg)
```

## Project structure

- `app.arc` — Architect app manifest; `@static` with `spa true` serves the static site.
- `public/` — Static files deployed as‑is.
  - `blog.md` — Your Markdown blog content.
  - `assets/` — Images and other static assets referenced by `blog.md`.
  - `script.js` — Client code that renders Markdown (via `markdown-it`).

## Deploy

Architect deploys static assets to AWS (S3 + CloudFront) using your AWS credentials.

1) Configure AWS credentials in your environment (e.g., via `aws configure`).
2) Optionally edit `region` in `app.arc` (defaults to `us-west-2`).
3) Deploy:

```
npx arc deploy
```

This will build and publish the contents of `public/`.

## RSS Feed

This blog automatically generates an RSS feed at `public/rss.xml`. The RSS feed includes all published blog posts (excluding drafts marked with `[draft]` in the heading).

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```
SITE_URL=https://yourdomain.com
SITE_TITLE=Your Blog Title
SITE_DESCRIPTION=A description of your blog
AUTHOR_EMAIL=your.email@example.com
```

### Generating RSS Feed

To manually generate the RSS feed:

```
npm run generate-rss
```

The RSS feed is automatically regenerated on every git commit via a pre-commit hook.

### RSS Feed Features

- Automatically extracts blog posts from `public/blog.md`
- Excludes draft posts (those with `[draft]` in the heading)
- Converts relative image paths to absolute URLs
- Generates proper RSS 2.0 XML format
- Uses dates from post headings (format: YYYY.MM.DD)

## Notes

- Image paths in Markdown should be relative to `public/` (e.g., `assets/foo.jpg`).
- To resize or optimize images before deploy, do so in `public/assets/`.
- For more on Architect: https://arc.codes/docs/en/get-started/quickstart/static

