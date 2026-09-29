'use strict';

const gen = (opts) => `\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.title || 'Lab'}</title>
  <style>
    :root {
      --bg-color: #ffffff;
      --text-main: #111111;
      --text-muted: #555555;
      --border-color: #e5e5e5;
      --code-bg: #f4f4f5;
      --accent-color: #000000;

      /* Typography scale */
      --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: "Source Code Pro", "SFMono-Regular", Menlo, Consolas, monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: var(--font-sans);
      font-size: 17px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Minimalist Navigation Header */
    .site-header {
      border-bottom: 1px solid var(--border-color);
      padding: 1.25rem 2rem;
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      z-index: 100;
    }

    .header-nav {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-logo {
      font-weight: 600;
      font-size: 1.1rem;
      text-decoration: none;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .header-links {
      display: flex;
      gap: 1.5rem;
    }

    .header-links a {
      text-decoration: none;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .header-links a:hover {
      color: var(--accent-color);
    }

    /* Main Content Container (Where 'marked' output goes) */
    .markdown-body {
      max-width: 720px;
      margin: 4rem auto;
      padding: 0 1.5rem;
    }

    /* Marked.js HTML Styling */
    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4 {
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-top: 2.5em;
      margin-bottom: 1em;
      line-height: 1.2;
    }

    .markdown-body h1 {
      font-size: 2.25rem;
      margin-top: 0;
    }

    .markdown-body h2 {
      font-size: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.3em;
    }

    .markdown-body h3 {
      font-size: 1.25rem;
    }

    .markdown-body p,
    .markdown-body ul,
    .markdown-body ol {
      margin-bottom: 1.5em;
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-left: 1.5em;
    }

    .markdown-body li {
      margin-bottom: 0.5em;
    }

    .markdown-body a {
      color: var(--text-main);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .markdown-body a:hover {
      color: var(--text-muted);
    }

    .markdown-body blockquote {
      border-left: 3px solid var(--text-main);
      padding-left: 1rem;
      margin-left: 0;
      color: var(--text-muted);
      font-style: italic;
    }

    .markdown-body code {
      font-family: var(--font-mono);
      background-color: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.85em;
    }

    .markdown-body pre {
      background-color: var(--code-bg);
      padding: 1.25rem;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 1.5em;
    }

    .markdown-body pre code {
      background-color: transparent;
      padding: 0;
      font-size: 0.85em;
    }

    .markdown-body img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 1.5rem 0;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .header-nav {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .markdown-body {
        margin: 2rem auto;
      }
    }
  </style>
</head>
<body>

  <!-- Minimalist Header -->
  <header class="site-header">
    <nav class="header-nav">
      <a href="#" class="header-logo">Drom Labs.</a>
      <div class="header-links">
${opts.links ? opts.links.map(link => `        <a href="${link.href}">${link.text}</a>`).join('\n') : ''}
      </div>
    </nav>
  </header>

  <!-- Marked Output Container -->
  <main class="markdown-body">
${opts.content || ''}
  </main>
</body>
</html>
`;

module.exports = gen;
