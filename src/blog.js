// Blog post management system

class BlogSystem {
  constructor() {
    this.converter = new MarkdownConverter();
    this.categories = {
      'bloc': 'Blockchain',
      'cryp': 'Cryptography',
      'econ': 'Economics',
      'frag': 'Fragments',
      'blt': 'Blue Team',
      'llms': 'LLMs'
    };
  }

  // Load post metadata from JSON file
  async loadPosts() {
    try {
      // Try to load from public directory first (production environment)
      let response = await fetch('/public/posts/index.json');
      
      // If that fails, try development path
      if (!response.ok) {
        response = await fetch('/posts/index.json');
      }
      
      if (!response.ok) {
        throw new Error('Failed to load post index');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  // Load a specific markdown post and convert to HTML
  async loadPost(postPath) {
    try {
      const response = await fetch(postPath);
      if (!response.ok) {
        throw new Error(`Failed to load post from ${postPath}`);
      }
      const markdown = await response.text();
      return this.converter.convert(markdown);
    } catch (error) {
      console.error('Error loading post:', error);
      return '<p>Error loading post content</p>';
    }
  }

  // Create post HTML from template
  createPostHTML(postContent, metadata) {
    const template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${metadata.title} | Prashish Phunyal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
          // Apply theme immediately to prevent flash
          (function() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
          })();
        </script>
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
              <span class="post-category">${this.categories[metadata.category]}</span>
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
    return template;
  }

  // Render post list for a category
  renderPostList(posts, category) {
    return posts
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(post => `
        <li>
          <span class="post-meta">${post.date}</span>
          <h2>
            <a href="${post.url}" class="post-link">${post.title}</a>
          </h2>
        </li>
      `)
      .join('');
  }
}

// Use in browser
if (typeof window !== 'undefined') {
  window.BlogSystem = BlogSystem;
}
