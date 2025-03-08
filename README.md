# prashishphunyal.github.io

A minimalist markdown-based blog system with dynamic content loading and dark/light theme switching.

## Features

- Markdown to HTML conversion
- Category-based organization of posts
- Static site generation from markdown posts
- Dark/light theme toggling with persistent preferences
- Mobile-responsive design

## Getting Started

### Setup

1. Clone this repository:
   ```
   git clone https://github.com/prashishphunyal/prashishphunyal.github.io.git
   cd prashishphunyal.github.io
   ```

2. Create new posts in the appropriate category folder:
   ```
   /posts/
     /bloc/     # Blockchain posts
     /cryp/     # Cryptography posts
     /econ/     # Economics posts
     /frag/     # Fragments (short posts)
     /phi/      # Blue Team posts
     /nep/      # LLM posts
   ```

### Writing Posts

Create a new markdown file in the appropriate category folder with frontmatter:

```markdown
---
title: Your Post Title
date: YYYY-MM-DD
category: cryp
slug: optional-custom-slug
---

# Your Content Starts Here

Post content in markdown format.
```

### Building the Site

Run the build script to generate the static site:

```
node build.js
```

Generated files will be in the `public` directory.

### Local Development

Start the local development server:

```
node server.js
```

Access the site at `http://localhost:3000`.

## Customizing

- Edit `src/style.css` and `src/blog.css` to modify site styling
- Update theme colors in `src/style.css` (`:root` and `[data-theme="light"]` sections)
- Modify templates in `build.js` to change HTML structure

## Deployment

This site is designed to be deployed to GitHub Pages. Simply push changes to the main branch, and GitHub will automatically deploy your site.