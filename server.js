/**
 * Simple development server for testing the blog locally
 * Run with Node.js: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown'
};

// Fallback paths to check in order
const FALLBACK_PATHS = [
  '', // Original path
  '/index.html', // Add index.html
  '/public', // Check in public directory
  '/public/index.html' // Check for index.html in public
];

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url);
  
  // Get the path
  let pathname = parsedUrl.pathname;
  
  // If the path ends with '/', append 'index.html'
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }
  
  // Try multiple possible locations
  tryPaths(pathname, res);
});

// Try multiple possible file locations
function tryPaths(pathname, res, pathIndex = 0) {
  if (pathIndex >= FALLBACK_PATHS.length) {
    // We've tried all paths, return 404
    fs.readFile(path.join(process.cwd(), '404.html'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }
  
  // Construct the path to try
  let tryPath = pathname;
  if (pathIndex > 0) {
    // Try a fallback path if we're not on the first attempt
    if (FALLBACK_PATHS[pathIndex].startsWith('/')) {
      // Absolute fallback path
      tryPath = FALLBACK_PATHS[pathIndex] + pathname;
    } else {
      // Modifier for the current path
      tryPath = pathname + FALLBACK_PATHS[pathIndex];
    }
  }
  
  // Map the pathname to the file system
  let filePath = path.join(process.cwd(), tryPath);
  
  // Get the file extension
  const ext = path.extname(filePath);
  
  // Determine the content type based on the file extension
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If the file doesn't exist, try the next path
      if (err.code === 'ENOENT') {
        tryPaths(pathname, res, pathIndex + 1);
      } else {
        // For other errors, return 500
        console.error(`Server error: ${err}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      // If successful, return the file content
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});

