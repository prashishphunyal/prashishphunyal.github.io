// Simple Markdown to HTML converter
class MarkdownConverter {
  constructor() {
    // Basic regex patterns for markdown conversion
    this.patterns = {
      heading: /^(#{1,6})\s+(.+)$/gm,
      bold: /\*\*(.+?)\*\*/g,
      italic: /\*(.+?)\*/g,
      link: /\[(.+?)\]\((.+?)\)/g,
      image: /!\[(.+?)\]\((.+?)\)/g,
      codeBlock: /```([a-z]*)\n([\s\S]*?)```/g,
      inlineCode: /`(.+?)`/g,
      blockquote: /^>\s+(.+)$/gm,
      unorderedList: /^\*\s+(.+)$/gm,
      orderedList: /^\d+\.\s+(.+)$/gm,
      horizontalRule: /^---$/gm,
      paragraph: /^(?!<)[^\n]+$/gm
    };
  }

  convert(markdown) {
    let html = markdown;
    
    // Convert headings
    html = html.replace(this.patterns.heading, (match, heading, text) => {
      const level = heading.length;
      return `<h${level}>${text}</h${level}>`;
    });

    // Convert bold text
    html = html.replace(this.patterns.bold, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(this.patterns.italic, '<em>$1</em>');
    
    // Convert links
    html = html.replace(this.patterns.link, '<a href="$2">$1</a>');
    
    // Convert images
    html = html.replace(this.patterns.image, '<img src="$2" alt="$1">');
    
    // Convert code blocks
    html = html.replace(this.patterns.codeBlock, (match, language, code) => {
      return `<pre><code class="language-${language}">${this.escapeHTML(code)}</code></pre>`;
    });
    
    // Convert inline code
    html = html.replace(this.patterns.inlineCode, '<code>$1</code>');
    
    // Convert blockquotes
    html = html.replace(this.patterns.blockquote, '<blockquote>$1</blockquote>');
    
    // Convert unordered lists (simplified)
    html = html.replace(this.patterns.unorderedList, '<ul><li>$1</li></ul>');
    
    // Convert ordered lists (simplified)
    html = html.replace(this.patterns.orderedList, '<ol><li>$1</li></ol>');
    
    // Convert horizontal rules
    html = html.replace(this.patterns.horizontalRule, '<hr>');
    
    // Convert paragraphs (avoiding existing HTML)
    html = html.replace(this.patterns.paragraph, '<p>$&</p>');
    
    return html;
  }
  
  escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Export the converter for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = MarkdownConverter;
}
