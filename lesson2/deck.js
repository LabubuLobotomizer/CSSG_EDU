(() => {
  const templates = [...document.querySelectorAll('#slideTemplates template')];
  const nav = document.getElementById('sectionNav');
  const slide = document.getElementById('slide');
  const example = window.ClubExample;
  let current = 0;

  /* ---------- Small helpers ---------- */
  const esc = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const pad = n => String(n).padStart(2, '0');

  function dedent(text) {
    const lines = text.replace(/^\n+|\s+$/g, '').split('\n');
    const indents = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => l.slice(cut)).join('\n');
  }

  function parseMarks(spec) {
    const marks = new Set();
    (spec || '').split(',').filter(Boolean).forEach(part => {
      const [a, b] = part.split('-').map(Number);
      for (let i = a; i <= (b || a); i++) marks.add(i);
    });
    return marks;
  }

  /* ---------- Syntax highlighting (one line at a time) ---------- */
  function hlTag(tag) {
    if (tag.startsWith('<!--')) return '<span class="t-com">' + esc(tag) + '</span>';
    const m = tag.match(/^<(\/?)([^\s>\/]+)([\s\S]*?)(\/?)>$/);
    if (!m) return esc(tag);
    const attrs = esc(m[3]).replace(/([\w:-]+)(?:(=)("[^"]*"|'[^']*'))?/g, (all, name, eq, value) =>
      eq ? '<span class="t-attr">' + name + '</span>=<span class="t-str">' + value + '</span>'
         : '<span class="t-attr">' + name + '</span>');
    return '<span class="t-tag">&lt;' + m[1] + m[2] + '</span>' + attrs +
      '<span class="t-tag">' + m[4] + '&gt;</span>';
  }

  function hlHtmlLine(line) {
    let out = '', last = 0, m;
    const re = /<!--.*?-->|<\/?[a-zA-Z!][^>]*>/g;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index)) + hlTag(m[0]);
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  function hlDecls(text) {
    return text.replace(/([\w-]+)(\s*:\s*)([^;]+)(;?)/g, (all, prop, colon, value, semi) =>
      '<span class="t-prop">' + prop + '</span><span class="t-punc">' + colon + '</span>' +
      '<span class="t-val">' + value + '</span><span class="t-punc">' + semi + '</span>');
  }

  function hlCssLine(line) {
    const e = esc(line);
    if (/^\s*\/\*/.test(line)) return '<span class="t-com">' + e + '</span>';
    let m = e.match(/^(\s*)([^{]+?)(\s*\{)(.*?)(\}?)\s*$/);
    if (m) return m[1] + '<span class="t-sel">' + m[2] + '</span><span class="t-punc">' + m[3] + '</span>' +
      hlDecls(m[4]) + '<span class="t-punc">' + m[5] + '</span>';
    if (/^\s*\}\s*$/.test(line)) return '<span class="t-punc">' + e + '</span>';
    return hlDecls(e);
  }

  function highlight(code, lang, marks) {
    const fn = lang === 'css' ? hlCssLine : lang === 'text' ? esc : hlHtmlLine;
    return code.split('\n').map((line, i) =>
      '<span class="ln' + (marks && marks.has(i + 1) ? ' mark' : '') + '">' + (fn(line) || ' ') + '</span>'
    ).join('');
  }

  function codeWindow(code, { lang = 'html', label = '', marks = null, big = false, right = '' } = {}) {
    const box = document.createElement('div');
    box.className = 'code-window' + (big ? ' big' : '');
    box.innerHTML = '<div class="window-label"><span>' + esc(label) + '</span><span>' + right + '</span></div>' +
      '<pre>' + highlight(code, lang, marks) + '</pre>';
    return box;
  }

  // Previews run in a sandbox. This helper makes #section links scroll inside the
  // preview and opens other links in a new tab instead of replacing the preview.
  const LINK_HELPER = '<script>document.addEventListener("click",function(e){var a=e.target.closest("a[href]");' +
    'if(!a)return;e.preventDefault();var h=a.getAttribute("href");if(h.charAt(0)==="#"){' +
    'var t=document.getElementById(decodeURIComponent(h.slice(1)));if(t)t.scrollIntoView();}' +
    'else window.open(a.href,"_blank");});<\/script>';

  function browserFrame(html, label = 'preview') {
    const frame = document.createElement('div');
    frame.className = 'browser-frame';
    frame.innerHTML = '<div class="browser-bar"><i></i><i></i><i></i><span></span></div>';
    frame.querySelector('span').textContent = label;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
    iframe.title = 'Rendered page preview';
    frame.append(iframe);
    frame.show = source => { iframe.srcdoc = source + LINK_HELPER; };
    frame.show(html);
    return frame;
  }

  /* ---------- DOM tree drawing ---------- */
  function nodeLabel(node) {
    if (node.nodeType === 3) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      return { cls: 'text', html: '"' + esc(text.length > 28 ? text.slice(0, 27) + '…' : text) + '"' };
    }
    if (node.nodeType === 8) return { cls: 'comment', html: '&lt;!-- comment --&gt;' };
    let meta = '';
    if (node.id) meta += '#' + node.id;
    if (node.classList && node.classList.length) meta += '.' + [...node.classList].join('.');
    return { cls: '', html: node.tagName.toLowerCase() + (meta ? '<span class="meta">' + esc(meta) + '</span>' : '') };
  }

  function treeItems(nodes, hideText) {
    const ul = document.createElement('ul');
    nodes.forEach(node => {
      if (node.nodeType === 3 && (hideText || !node.textContent.trim())) return;
      if (![1, 3, 8].includes(node.nodeType)) return;
      const li = document.createElement('li');
      const { cls, html } = nodeLabel(node);
      li.innerHTML = '<span class="node ' + cls + '">' + html + '</span>';
      if (node.nodeType === 1 && node.childNodes.length) {
        const sub = treeItems([...node.childNodes], hideText);
        if (sub.children.length) li.append(sub);
      }
      ul.append(li);
    });
    return ul;
  }

  function buildTree(source, hideText = false) {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    let roots;
    if (/<html|<!doctype/i.test(source)) roots = [doc.documentElement];
    else if (/<body/i.test(source)) roots = [doc.body];
    else roots = [...doc.body.childNodes];
    const ul = treeItems(roots, hideText);
    ul.className = 'tree';
    return ul;
  }

  function treePanel(source, { big = false, label = 'THE TREE THE BROWSER BUILDS', hideText = false } = {}) {
    const panel = document.createElement('div');
    panel.className = 'tree-panel' + (big ? ' tree-big' : '');
    panel.innerHTML = '<div class="window-label"><span></span></div>';
    panel.querySelector('span').textContent = label;
    panel.append(buildTree(source, hideText));
    return panel;
  }

  /* ---------- Playground ---------- */
  function playground(start, { tree = true, full = false, label = 'index.html · edit me' } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'playground' + (full ? ' full' : '');
    wrap.innerHTML = '<div class="editor"><div class="window-label"><span></span>' +
      '<span class="pg-tools"><button type="button" data-reset>reset</button></span></div>' +
      '<textarea spellcheck="false" aria-label="HTML source code"></textarea></div><div class="right"></div>';
    wrap.querySelector('.window-label span').textContent = label;
    const textarea = wrap.querySelector('textarea');
    const right = wrap.querySelector('.right');
    const frame = browserFrame('', 'what the browser shows');
    right.append(frame);
    let panel = null;
    if (tree) { panel = treePanel(''); right.append(panel); }
    textarea.value = start;
    let timer;
    const update = () => {
      frame.show(textarea.value);
      if (panel) panel.replaceChild(buildTree(textarea.value), panel.querySelector('ul'));
    };
    textarea.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 200); });
    textarea.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      textarea.setRangeText('  ', textarea.selectionStart, textarea.selectionEnd, 'end');
      textarea.dispatchEvent(new Event('input'));
    });
    wrap.querySelector('[data-reset]').addEventListener('click', () => { textarea.value = start; update(); });
    update();
    wrap.setSource = value => { start = value; textarea.value = value; update(); };
    return wrap;
  }

  /* ---------- Inheritance lab: the closest rule wins ---------- */
  const inheritTree = {
    tag: 'body', children: [
      { tag: 'header', children: [{ tag: 'h1', text: 'Club page' }] },
      { tag: 'section', children: [{ tag: 'h2', text: 'Meetings' }, { tag: 'p', text: 'Mondays at 4' }] },
      { tag: 'footer', children: [{ tag: 'p', text: 'Made by us' }] }
    ]
  };
  const inheritRules = [
    { tag: 'body', color: '#2b6cb0', name: 'blue', on: true },
    { tag: 'section', color: '#b5481f', name: 'orange', on: false },
    { tag: 'p', color: '#2f7d4a', name: 'green', on: false }
  ];

  function inheritLab() {
    const box = document.createElement('div');
    box.className = 'lab';
    box.innerHTML = '<div class="lab-rules"></div><div class="lab-out"><div class="tree-panel tree-big">' +
      '<div class="window-label"><span>EACH ELEMENT’S COLOR · AND WHERE IT CAME FROM</span></div><div class="it"></div></div></div>';
    const rulesBox = box.querySelector('.lab-rules');
    inheritRules.forEach(rule => {
      const label = document.createElement('label');
      label.className = 'rule-toggle';
      label.innerHTML = '<input type="checkbox"' + (rule.on ? ' checked' : '') + '><span class="code">' + rule.tag +
        ' { color: <span class="swatch" style="background:' + rule.color + '"></span>' + rule.name + '; }</span>';
      label.querySelector('input').addEventListener('change', e => { rule.on = e.target.checked; draw(); });
      rulesBox.append(label);
    });
    const tip = document.createElement('p');
    tip.style.cssText = 'font-size:13px;margin:8px 0 0';
    tip.innerHTML = 'Turn rules on and off. A rule on the element itself beats anything inherited. Otherwise the element takes the color of its <b>closest</b> ancestor that has one.';
    rulesBox.append(tip);

    function draw() {
      const holder = box.querySelector('.it');
      const walk = (node, inherited) => {
        const own = inheritRules.find(r => r.on && r.tag === node.tag);
        const color = own ? { c: own.color, from: 'its own rule' } : inherited;
        const li = document.createElement('li');
        const why = color ? (own ? 'own rule' : 'inherited from ' + color.src) : 'browser default';
        li.innerHTML = '<span class="node" style="' + (color ? 'color:' + color.c + ';border-color:' + color.c : '') + '">' +
          node.tag + (node.text ? ' <i style="font-style:normal">“' + node.text + '”</i>' : '') +
          '</span> <small style="font:11px var(--mono);color:#7a7f77">← ' + why + '</small>';
        if (node.children) {
          const ul = document.createElement('ul');
          const pass = own ? { c: own.color, src: node.tag } : inherited;
          node.children.forEach(child => ul.append(walk(child, pass)));
          li.append(ul);
        }
        return li;
      };
      const ul = document.createElement('ul');
      ul.className = 'tree';
      ul.append(walk(inheritTree, null));
      holder.replaceChildren(ul);
    }
    draw();
    return box;
  }

  /* ---------- Cascade lab: which rule wins? ---------- */
  const cascadeRules = [
    { code: 'body { color: gray; }', color: '#777777', rank: 0, why: 'inherited from parent · weakest' },
    { code: 'p { color: blue; }', color: '#2b6cb0', rank: 1, why: 'element selector' },
    { code: 'p { color: teal; }  /* later */', color: '#147a78', rank: 1.5, why: 'same strength, written later' },
    { code: '.note { color: green; }', color: '#2f7d4a', rank: 2, why: 'class selector' },
    { code: '#intro { color: purple; }', color: '#7b3fa0', rank: 3, why: 'id selector' },
    { code: 'style="color: orange"', color: '#c2581b', rank: 4, why: 'inline · on the element itself' }
  ];

  function cascadeLab() {
    const on = cascadeRules.map((_, i) => i < 2);
    const box = document.createElement('div');
    box.className = 'lab';
    box.innerHTML = '<div class="lab-rules"></div><div class="lab-out">' +
      '<div class="code-window"><div class="window-label"><span>THE ELEMENT</span></div><pre></pre></div>' +
      '<div class="lab-target">Welcome to the club!</div><div class="lab-verdict"></div></div>';
    box.querySelector('pre').innerHTML = highlight('<p id="intro" class="note">\n  Welcome to the club!\n</p>', 'html');
    const rows = cascadeRules.map((rule, i) => {
      const label = document.createElement('label');
      label.className = 'rule-toggle';
      label.innerHTML = '<input type="checkbox"' + (on[i] ? ' checked' : '') + '><span class="code"><span class="swatch" style="background:' +
        rule.color + '"></span>' + esc(rule.code) + '</span><span class="why">' + rule.why + '</span>';
      label.querySelector('input').addEventListener('change', e => { on[i] = e.target.checked; draw(); });
      box.querySelector('.lab-rules').append(label);
      return label;
    });
    function draw() {
      let winner = -1;
      cascadeRules.forEach((rule, i) => { if (on[i] && (winner < 0 || rule.rank >= cascadeRules[winner].rank)) winner = i; });
      rows.forEach((row, i) => {
        row.classList.toggle('off', !on[i]);
        row.classList.toggle('winner', i === winner);
        row.classList.toggle('loser', on[i] && i !== winner);
      });
      const target = box.querySelector('.lab-target');
      target.style.color = winner < 0 ? '#111' : cascadeRules[winner].color;
      box.querySelector('.lab-verdict').innerHTML = winner < 0
        ? 'No rules on. The browser’s <b>default</b> (black) is used.'
        : '<b>' + esc(cascadeRules[winner].code) + '</b> wins: ' + cascadeRules[winner].why + '. Crossed-out rules still exist; they just lost.';
    }
    draw();
    return box;
  }

  /* ---------- Worked example steps ---------- */
  function lineDiff(before, after) {
    const a = before ? before.split('\n') : [], b = after.split('\n');
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const added = new Set();
    let i = 0, j = 0;
    while (j < b.length) {
      if (i < a.length && a[i] === b[j]) { i++; j++; }
      else if (i < a.length && dp[i + 1][j] >= dp[i][j + 1]) i++;
      else { if (b[j].trim()) added.add(j + 1); j++; }
    }
    return added;
  }

  function previewDoc(step) {
    let html = example.indexHtml(step);
    const css = example.styleCss(step);
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '</style>');
    // Resolve images/logo.svg against the real project folder.
    html = html.replace('<head>', '<head>\n    <base href="club-page/completed/">');
    const focus = example.steps[step].focus;
    if (focus) html += '<script>addEventListener("load",function(){var e=document.querySelector("' + focus +
      '");if(e)e.scrollIntoView({block:"center"});});<\/script>';
    return html;
  }

  function exampleStep(step) {
    const info = example.steps[step];
    const box = document.createElement('div');
    const dots = document.createElement('div');
    dots.className = 'step-dots';
    example.steps.forEach((s, i) => {
      if (!s) return;
      const span = document.createElement('span');
      span.textContent = pad(i) + ' ' + s.title;
      span.className = i === step ? 'on' : i < step ? 'done' : '';
      dots.append(span);
    });
    box.append(dots);
    const grid = document.createElement('div');
    grid.className = 'example-step';
    const codeCol = document.createElement('div');
    codeCol.style.cssText = 'display:grid;gap:10px;min-width:0;align-content:start';
    info.files.forEach(file => {
      const isCss = file === 'style.css';
      const now = isCss ? example.styleCss(step) : example.indexHtml(step);
      const before = step > 1 ? (isCss ? example.styleCss(step - 1) : example.indexHtml(step - 1)) : '';
      const marks = lineDiff(before, now);
      const win = codeWindow(now.trimEnd(), {
        lang: isCss ? 'css' : 'html', label: 'club-page/' + file,
        marks, right: marks.size ? marks.size + ' new/changed lines' : ''
      });
      const pre = win.querySelector('pre');
      pre.style.maxHeight = info.files.length > 1 ? (isCss ? '250px' : '150px') : '400px';
      pre.style.overflowY = 'auto';
      codeCol.append(win);
      requestAnimationFrame(() => {
        const first = pre.querySelector('.mark');
        if (first) pre.scrollTop = Math.max(0, first.offsetTop - pre.offsetTop - 40);
      });
    });
    grid.append(codeCol, browserFrame(previewDoc(step), 'club-page/index.html'));
    box.append(grid);
    return box;
  }

  /* ---------- Turn slide markup into live pieces ---------- */
  function enhance(root) {
    root.querySelectorAll('script[type="text/plain"]').forEach(block => {
      const code = dedent(block.textContent);
      const d = block.dataset;
      let node;
      if ('playground' in d) node = playground(code, { tree: 'tree' in d });
      else if ('tree' in d) node = treePanel(code, { big: 'big' in d, label: d.label });
      else if ('render' in d) node = browserFrame(code, d.label || 'preview');
      else if ('pair' in d) {
        node = document.createElement('div');
        node.className = 'side-by-side';
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.innerHTML = '<b>→</b>' + (d.arrow || 'browser draws');
        node.append(codeWindow(code, { lang: d.lang, label: d.label || 'index.html', marks: parseMarks(d.mark), big: 'big' in d }),
          arrow, browserFrame(code, d.url || 'index.html'));
      } else node = codeWindow(code, { lang: d.lang, label: d.label || '', marks: parseMarks(d.mark), big: 'big' in d });
      if (d.style) node.style.cssText += d.style;
      block.replaceWith(node);
    });
    root.querySelectorAll('[data-example-step]').forEach(el => el.replaceWith(exampleStep(Number(el.dataset.exampleStep))));
    root.querySelectorAll('[data-club-tree]').forEach(el => {
      const body = example.indexHtml(5).match(/<body>[\s\S]*<\/body>/)[0];
      const panel = treePanel(body, { label: 'CLUB PAGE · ELEMENTS ONLY (TEXT HIDDEN)', hideText: true });
      panel.style.maxHeight = '460px';
      el.replaceWith(panel);
    });
    root.querySelectorAll('[data-inherit-lab]').forEach(el => el.replaceWith(inheritLab()));
    root.querySelectorAll('[data-cascade-lab]').forEach(el => el.replaceWith(cascadeLab()));
    root.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      answer.classList.toggle('show');
    }));
    root.querySelectorAll('.quiz').forEach(quiz => {
      const feedback = quiz.querySelector('.feedback');
      quiz.querySelectorAll('.options button').forEach(button => button.addEventListener('click', () => {
        quiz.querySelectorAll('.options button').forEach(b => b.classList.remove('right', 'wrong'));
        const ok = 'ok' in button.dataset;
        button.classList.add(ok ? 'right' : 'wrong');
        feedback.innerHTML = (ok ? '<b>Yes.</b> ' : '<b>Not quite.</b> ') + (button.dataset.why || '');
      }));
    });
    root.querySelectorAll('[data-open]').forEach(button =>
      button.addEventListener('click', () => setMode(button.dataset.open)));
  }

  /* ---------- Navigation ---------- */
  let lastPart = '';
  templates.forEach((template, index) => {
    if (template.dataset.part && template.dataset.part !== lastPart) {
      lastPart = template.dataset.part;
      const head = document.createElement('div');
      head.className = 'nav-part';
      head.textContent = lastPart;
      nav.append(head);
    }
    const button = document.createElement('button');
    button.className = 'nav-item';
    button.innerHTML = '<span class="nav-number">' + pad(index + 1) + '</span><span></span><span class="nav-duration">' +
      (template.dataset.time || '') + '</span>';
    button.children[1].textContent = template.dataset.title;
    button.addEventListener('click', () => go(index));
    nav.append(button);
  });
  const totalMinutes = templates.reduce((sum, t) => sum + (parseInt(t.dataset.time, 10) || 0), 0);
  document.getElementById('totalTime').textContent = 'SLIDES ≈ ' + totalMinutes + ' MIN';

  function go(index) {
    current = Math.max(0, Math.min(templates.length - 1, index));
    render();
  }

  function render() {
    const template = templates[current];
    document.getElementById('sectionLabel').textContent = template.dataset.label || '';
    document.getElementById('sectionTime').textContent = template.dataset.time || '';
    document.getElementById('slideIndex').textContent = 'SLIDE ' + pad(current + 1) + ' / ' + templates.length;
    document.getElementById('routeCount').textContent = pad(current + 1) + ' / ' + templates.length;
    document.getElementById('progress').style.width = ((current + 1) / templates.length * 100) + '%';
    slide.replaceChildren(template.content.cloneNode(true));
    enhance(slide);
    slide.classList.remove('fade-in');
    void slide.offsetWidth;
    slide.classList.add('fade-in');
    document.querySelectorAll('.nav-item').forEach((button, index) => {
      button.classList.toggle('active', index === current);
      if (index === current) { button.setAttribute('aria-current', 'step'); button.scrollIntoView({ block: 'nearest' }); }
      else button.removeAttribute('aria-current');
    });
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').innerHTML = current === templates.length - 1
      ? 'Assignment <span>→</span>' : 'Next <span>→</span>';
    document.getElementById('main').scrollTop = 0;
    window.scrollTo(0, 0);
    history.replaceState(null, '', '#' + (current + 1));
  }

  document.getElementById('prev').addEventListener('click', () => go(current - 1));
  document.getElementById('next').addEventListener('click', () => {
    if (current < templates.length - 1) go(current + 1);
    else setMode('assignment');
  });
  document.addEventListener('keydown', event => {
    if (event.target.matches('textarea,input,select') || document.getElementById('slidesMode').hidden) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && !event.target.matches('button'))) {
      event.preventDefault(); go(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(current - 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(templates.length - 1);
  });

  /* ---------- Modes: slides / playground / assignment ---------- */
  function setMode(mode) {
    ['slides', 'playground', 'assignment'].forEach(name =>
      document.getElementById(name + 'Mode').hidden = name !== mode);
    document.querySelectorAll('.mode-tab').forEach(button =>
      button.classList.toggle('active', button.dataset.mode === mode));
    if (mode !== 'slides') {
      if (document.fullscreenElement) document.exitFullscreen();
      document.body.classList.remove('presenting');
    }
    if (mode === 'playground') mountPlayground();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.mode-tab').forEach(button =>
    button.addEventListener('click', () => setMode(button.dataset.mode)));

  const samples = {
    blank: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>My page</title>\n  </head>\n  <body>\n    <h1>Hello!</h1>\n    <p>Edit me.</p>\n  </body>\n</html>\n',
    style: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Cascade practice</title>\n    <style>\n      body { color: navy; font-family: sans-serif; }\n      p { color: gray; }\n      .note { color: green; }\n      #intro { color: purple; }\n    </style>\n  </head>\n  <body>\n    <h1>Which color wins?</h1>\n    <p>A plain paragraph.</p>\n    <p class="note">A paragraph with a class.</p>\n    <p id="intro" class="note">A paragraph with an id and a class.</p>\n    <p class="note" style="color: orange">A paragraph with an inline style.</p>\n  </body>\n</html>\n',
    club: example.indexHtml(example.last).replace('<link rel="stylesheet" href="style.css">',
      '<style>\n' + example.styleCss(example.last) + '</style>')
  };
  let pg = null;
  function mountPlayground() {
    if (pg) return;
    const select = document.getElementById('pgSample');
    pg = playground(samples.blank, { tree: true, full: true, label: 'index.html · type anything' });
    document.getElementById('pgHolder').append(pg);
    select.addEventListener('change', () => pg.setSource(samples[select.value]));
  }

  /* ---------- Present mode ---------- */
  const presentButton = document.getElementById('present');
  function syncPresent() {
    presentButton.innerHTML = '⛶ <span>' + (document.body.classList.contains('presenting') ? 'Exit' : 'Present') + '</span>';
  }
  presentButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      document.body.classList.toggle('presenting');
      syncPresent();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('presenting', Boolean(document.fullscreenElement));
    syncPresent();
  });

  /* ---------- Assignment checklist (remembered in this browser only) ---------- */
  const KEY = 'cssg-lesson2-checklist';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { saved = {}; }
  const boxes = [...document.querySelectorAll('#assignmentMode input[type="checkbox"]')];
  const countDone = () => {
    document.getElementById('checkCount').textContent =
      boxes.filter(b => b.checked).length + ' / ' + boxes.length + ' checked';
  };
  boxes.forEach((box, i) => {
    box.checked = Boolean(saved[i]);
    box.addEventListener('change', () => {
      saved[i] = box.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
      countDone();
    });
  });
  countDone();

  const slideFromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return n >= 1 && n <= templates.length ? n - 1 : 0;
  };
  window.addEventListener('hashchange', () => { if (slideFromHash() !== current) go(slideFromHash()); });
  current = slideFromHash();
  render();
})();
