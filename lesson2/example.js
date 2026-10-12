// Worked example: the CS + SG club page, built one step at a time.
// The slides show each step's file and highlight the lines that changed.
// `node build-example.js` writes the final step into club-page/completed/.
(function (root) {
  function indexHtml(step) {
    const lines = [];
    const add = (from, text) => { if (step >= from) lines.push(text); };
    const sectionClass = step >= 7 ? ' class="card"' : '';
    const highlight = step >= 7 ? ' class="highlight"' : '';

    lines.push('<!DOCTYPE html>');
    lines.push('<html lang="en">');
    lines.push('  <head>');
    lines.push('    <meta charset="utf-8">');
    lines.push('    <title>CS + SG Club</title>');
    add(6, '    <link rel="stylesheet" href="style.css">');
    lines.push('  </head>');
    lines.push('  <body>');
    if (step === 1) {
      lines.push('    <h1>CS + SG Club</h1>');
      lines.push('    <p>We build real websites as a team.</p>');
    } else {
      lines.push('    <header>');
      lines.push('      <h1>CS + SG Club</h1>');
      lines.push('      <p>We build real websites as a team.</p>');
      lines.push('      <nav>');
      lines.push('        <a href="#about">About</a>');
      lines.push('        <a href="#meetings">Meetings</a>');
      lines.push('        <a href="#join">Join</a>');
      lines.push('      </nav>');
      lines.push('    </header>');
    }
    if (step >= 3) {
      lines.push('');
      lines.push('    <main>');
      lines.push('      <section id="about"' + sectionClass + '>');
      lines.push('        <h2>About us</h2>');
      lines.push('        <img src="images/logo.svg" alt="CS + SG logo: a green code bracket" width="120">');
      lines.push('        <p>We are students who learn <strong>web development</strong>');
      lines.push('          by building projects for <em>real people</em>.</p>');
      lines.push('      </section>');
      if (step >= 4) {
        lines.push('');
        lines.push('      <section id="meetings"' + sectionClass + '>');
        lines.push('        <h2>Meetings</h2>');
        lines.push('        <ul>');
        lines.push('          <li>Monday · 4:00 PM · Room 204</li>');
        lines.push('          <li' + highlight + '>Wednesday · 4:00 PM · Computer lab</li>');
        lines.push('          <li>Friday · Project demos</li>');
        lines.push('        </ul>');
        lines.push('      </section>');
        lines.push('');
        lines.push('      <section id="join"' + sectionClass + '>');
        lines.push('        <h2>How to join</h2>');
        lines.push('        <ol>');
        lines.push('          <li>Come to any meeting.</li>');
        lines.push('          <li>Make a GitHub account.</li>');
        lines.push('          <li>Build your first page!</li>');
        lines.push('        </ol>');
        lines.push('      </section>');
      }
      lines.push('    </main>');
    }
    if (step >= 5) {
      lines.push('');
      lines.push('    <footer>');
      lines.push('      <p>Made by the CS + SG Production Team.</p>');
      lines.push('      <p>Read more on <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN</a>');
      lines.push('        or go <a href="../../index.html">back to the slides</a>.</p>');
      lines.push('    </footer>');
    }
    lines.push('  </body>');
    lines.push('</html>');
    return lines.join('\n') + '\n';
  }

  function styleCss(step) {
    if (step < 6) return '';
    const blocks = [];
    if (step >= 10) blocks.push(
      'html {\n' +
      '  scroll-behavior: smooth;\n' +
      '}');
    blocks.push(
      'body {\n' +
      '  font-family: Arial, sans-serif;\n' +
      '  max-width: 700px;\n' +
      '  margin: 0 auto;\n' +
      '  padding: 0 16px;\n' +
      '  color: #222;\n' +
      '  background: #f7f7f2;\n' +
      '}');
    blocks.push(
      'header {\n' +
      '  background: #2f4d36;\n' +
      '  color: white;\n' +
      '  padding: 16px 24px;\n' +
      '}');
    blocks.push(
      'nav a {\n' +
      '  color: #cfe8c9;\n' +
      '  margin-right: 12px;\n' +
      '}');
    if (step >= 7) {
      blocks.push(
        '.card {\n' +
        '  background: white;\n' +
        '  border: 1px solid #ddd;\n' +
        '  padding: 12px 20px;\n' +
        '  margin: 16px 0;\n' +
        '}');
      blocks.push(
        'li {\n' +
        '  color: #444;\n' +
        '}');
      blocks.push(
        (step >= 9 ? '#meetings .highlight {\n' : '.highlight {\n') +
        '  color: #b5481f;\n' +
        '  font-weight: bold;\n' +
        '}');
    }
    if (step >= 8) blocks.push(
      '/* A teammate added this later... */\n' +
      '#meetings li {\n' +
      '  color: gray;\n' +
      '}');
    return blocks.join('\n\n') + '\n';
  }

  // focus: the part of the page the slide preview scrolls to.
  const steps = [
    null,
    { files: ['index.html'], title: 'Skeleton' },
    { files: ['index.html'], title: 'Header + nav' },
    { files: ['index.html'], title: 'About + image', focus: '#about' },
    { files: ['index.html'], title: 'Lists', focus: '#meetings' },
    { files: ['index.html'], title: 'Footer + links', focus: 'footer' },
    { files: ['index.html', 'style.css'], title: 'Link CSS' },
    { files: ['index.html', 'style.css'], title: 'Classes', focus: '#meetings' },
    { files: ['style.css'], title: 'A bug!', focus: '#meetings' },
    { files: ['style.css'], title: 'The fix', focus: '#meetings' },
    { files: ['style.css'], title: 'Smooth scroll' }
  ];

  root.ClubExample = { indexHtml, styleCss, steps, last: steps.length - 1 };
  if (typeof module !== 'undefined') module.exports = root.ClubExample;
})(typeof window !== 'undefined' ? window : globalThis);
