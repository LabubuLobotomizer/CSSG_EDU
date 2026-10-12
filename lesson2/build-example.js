// Regenerates club-page/completed/ from example.js so the slides and the
// finished project always match. Run from this folder: node build-example.js
const fs = require('fs');
const path = require('path');
const example = require('./example.js');

const out = path.join(__dirname, 'club-page', 'completed');
fs.writeFileSync(path.join(out, 'index.html'), example.indexHtml(example.last));
fs.writeFileSync(path.join(out, 'style.css'), example.styleCss(example.last));
console.log('Wrote club-page/completed/index.html and style.css (step ' + example.last + ')');
