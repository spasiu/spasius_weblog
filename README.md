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

## Notes

- Image paths in Markdown should be relative to `public/` (e.g., `assets/foo.jpg`).
- To resize or optimize images before deploy, do so in `public/assets/`.
- For more on Architect: https://arc.codes/docs/en/get-started/quickstart/static

