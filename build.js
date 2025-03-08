/**
 * Build script for converting markdown posts to static HTML
 * Run with Node.js: node build.js
 */

const fs = require('fs');
const path = require('path');
const MarkdownConverter = require('./src/markdown.js');

// Configuration
const POSTS_DIR = './posts';
const OUTPUT_DIR = './public';
const SITE_URL = 'https://prashishphunyal.github.io';

// Categories
const CATEGORIES = {
  'bloc': 'Blockchain',
  'cryp': 'Cryptography',
  'econ': 'Economics',
  'frag': 'Fragments',
  'phi': 'Blue Team',
  'nep': 'LLMs'
};

// Create a new markdown converter
const converter = new MarkdownConverter();

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Parse frontmatter from markdown file
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontMatterRegex);
  
  if (!match) return { content, metadata: {} };
  
  const frontMatter = match[1];
  const metadata = {};
  const lines = frontMatter.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      metadata[key] = value;
    }
  }
  
  // Remove frontmatter from content
  const contentWithoutFrontMatter = content.slice(match[0].length);
  
  return { content: contentWithoutFrontMatter, metadata };
}

// Generate slug from title
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

// Create HTML template for a blog post
function createPostHTML(postContent, metadata) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${metadata.title} | Prashish Phunyal</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/src/style.css">
      <link rel="stylesheet" href="/src/blog.css">
    </head>
    <body>
      <div id="color-mode-switch">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <input type="checkbox" id="switch" aria-label="Toggle dark mode" />
        <label for="switch" class="toggle-container">
            <span class="toggle-slider"></span>
        </label>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    
      <header>
        <h1><a href="/" style="color:var(--secondary-color);text-decoration:none;">Prashish</a></h1>
        <div class="socials">
          <a href="https://www.instagram.com/prashishphunyal" target="_blank">Instagram</a>
          <a href="https://www.x.com/prashishphunyal" target="_blank">Twitter</a>
          <a href="https://www.github.com/prashishphunyal" target="_blank">Github</a>
        </div>
      </header>
      <div class="main blog-post">
        <div class="post-header">
          <h1>${metadata.title}</h1>
          <div class="post-meta">
            <span class="post-date">${metadata.date}</span>
            <span class="post-category">${CATEGORIES[metadata.category]}</span>
          </div>
        </div>
        <div class="post-content">
          ${postContent}
        </div>
      </div>
      <script src="/src/index.js"></script>
    </body>
    </html>
  `;
}

// Process all markdown files
async function buildSite() {
  console.log('Building site from markdown files...');
  
  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);
  
  // Create posts index
  const postsIndex = [];
  
  // Create category directories
  Object.keys(CATEGORIES).forEach(category => {
    ensureDirectoryExists(path.join(OUTPUT_DIR, category));
  });
  
  // Process each category directory in posts
  try {
    const categories = fs.readdirSync(POSTS_DIR);
    
    for (const category of categories) {
      const categoryPath = path.join(POSTS_DIR, category);
      
      // Skip if not a directory or not a valid category
      if (!fs.statSync(categoryPath).isDirectory() || !CATEGORIES[category]) {
        continue;
      }
      
      const files = fs.readdirSync(categoryPath);
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Parse frontmatter and content
        const { content: markdownContent, metadata } = parseFrontMatter(content);
        
        // Generate slug if not provided
        if (!metadata.slug) {
          metadata.slug = slugify(metadata.title || path.basename(file, '.md'));
        }
        
        // Set category from directory name
        metadata.category = category;
        
        // Convert markdown to HTML
        const htmlContent = converter.convert(markdownContent);
        
        // Create HTML post
        const postHTML = createPostHTML(htmlContent, metadata);
        
        // Output path
        const outputPath = path.join(OUTPUT_DIR, category, `${metadata.slug}.html`);
        
        // Write HTML file
        fs.writeFileSync(outputPath, postHTML);
        console.log(`Generated: ${outputPath}`);
        
        // Add to posts index
        postsIndex.push({
          title: metadata.title,
          date: metadata.date,
          category: category,
          slug: metadata.slug,
          url: `/${category}/${metadata.slug}.html`
        });
      }
    }
    
    // Sort posts by date (newest first)
    postsIndex.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create posts directory in output
    ensureDirectoryExists(path.join(OUTPUT_DIR, 'posts'));
    
    // Write posts index to both locations (for compatibility)
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'posts', 'index.json'),
      JSON.stringify(postsIndex, null, 2)
    );
    
    // Also copy the index to the root posts directory for local development
    ensureDirectoryExists('./posts');
    fs.writeFileSync(
      path.join('./posts', 'index.json'),
      JSON.stringify(postsIndex, null, 2)
    );
    
    console.log(`Generated posts index with ${postsIndex.length} entries`);
    
    // Generate main index.html with recent posts
    generateMainIndex(postsIndex);
    
    // Copy static files (CSS, JS, etc.)
    copyStaticFiles();
    
    // Copy category pages
    copyCategoryPages();
    
    console.log('Site build complete!');
    
  } catch (error) {
    console.error('Error building site:', error);
  }
}

// Generate main index.html with recent posts
function generateMainIndex(postsIndex) {
  // Read the template
  const indexTemplatePath = path.join(process.cwd(), 'index.html');
  if (!fs.existsSync(indexTemplatePath)) {
    console.warn('index.html template not found, skipping main index generation');
    return;
  }
  
  const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');
  
  // Write to output directory
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexTemplate);
  console.log('Generated main index.html');
}

// Copy category pages to output directory
function copyCategoryPages() {
  const catDir = path.join(process.cwd(), 'cat');
  if (!fs.existsSync(catDir)) {
    console.warn('Category directory not found, skipping category page copying');
    return;
  }
  
  const outputCatDir = path.join(OUTPUT_DIR, 'cat');
  ensureDirectoryExists(outputCatDir);
  
  const categoryFiles = fs.readdirSync(catDir);
  categoryFiles.forEach(file => {
    if (file.endsWith('.html')) {
      fs.copyFileSync(
        path.join(catDir, file),
        path.join(outputCatDir, file)
      );
      console.log(`Copied category page: ${file}`);
    }
  });
}

// Copy static files to output directory
function copyStaticFiles() {
  // Ensure src directory exists in output
  ensureDirectoryExists(path.join(OUTPUT_DIR, 'src'));
  
  // Copy CSS files
  fs.copyFileSync('./src/style.css', path.join(OUTPUT_DIR, 'src', 'style.css'));
  fs.copyFileSync('./src/blog.css', path.join(OUTPUT_DIR, 'src', 'blog.css'));
  
  // Copy JS files
  fs.copyFileSync('./src/index.js', path.join(OUTPUT_DIR, 'src', 'index.js'));
  fs.copyFileSync('./src/markdown.js', path.join(OUTPUT_DIR, 'src', 'markdown.js'));
  fs.copyFileSync('./src/blog.js', path.join(OUTPUT_DIR, 'src', 'blog.js'));
  
  console.log('Static files copied to output directory');
}

// Run the build
buildSite();
