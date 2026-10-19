(() => {
  const templates = [...document.querySelectorAll('#slideTemplates template')];
  const nav = document.getElementById('sectionNav');
  const slide = document.getElementById('slide');
  const example = window.MiniInsta;
  const { highlight, esc } = window.Live;
  let current = 0;

  /* ---------- Small helpers ---------- */
  const pad = n => String(n).padStart(2, '0');

  function dedent(text) {
    const lines = text.replace(/^\n+|\s+$/g, '').split('\n');
    const indents = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    // <\/script> lets a slide show a script tag inside a text/plain block.
    return lines.map(l => l.slice(cut)).join('\n').replace(/<\\\/script>/g, '</script>') + '\n';
  }

  function parseMarks(spec) {
    const marks = new Set();
    (spec || '').split(',').filter(Boolean).forEach(part => {
      const [a, b] = part.split('-').map(Number);
      for (let i = a; i <= (b || a); i++) marks.add(i);
    });
    return marks;
  }

  function codeWindow(code, { lang = 'js', label = '', marks = null, errs = null, big = false, right = '' } = {}) {
    const box = document.createElement('div');
    box.className = 'code-window' + (big ? ' big' : '');
    box.innerHTML = '<div class="window-label"><span>' + esc(label) + '</span><span>' + right + '</span></div>' +
      '<pre>' + highlight(code.replace(/\n$/, ''), lang, marks, errs) + '</pre>';
    return box;
  }

  // A <ul class="problems"> right after a code block lists type errors, VS Code style:
  // <li data-line="4">message</li>. Those lines get a red squiggle; hovering an error
  // or clicking it lights up its line.
  function problems(list, codeBox) {
    const head = document.createElement('div');
    head.className = 'problems-head';
    head.textContent = 'PROBLEMS · ' + list.children.length;
    list.before(head);
    list.querySelectorAll('li[data-line]').forEach(li => {
      li.tabIndex = 0;
      const line = () => codeBox && codeBox.querySelectorAll('.ln')[li.dataset.line - 1];
      const on = () => { list.querySelectorAll('li').forEach(x => x.classList.remove('hot')); li.classList.add('hot'); line() && line().classList.add('hot'); };
      const off = () => { li.classList.remove('hot'); line() && line().classList.remove('hot'); };
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
      li.addEventListener('focus', on); li.addEventListener('blur', off);
    });
  }

  // Which lines are new in `after` compared with `before` (longest common subsequence).
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

  /* ---------- Worked example: one step of Mini Instagram ---------- */
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
    const now = example.files(step);
    const before = step > 1 ? example.files(step - 1) : {};
    const marks = {};
    info.files.forEach(name => { if (step > 1 || name !== 'index.html') marks[name] = lineDiff(before[name] || '', now[name]); });
    // Files the class touches this step come first; the rest follow.
    const ordered = {};
    info.files.forEach(name => { ordered[name] = now[name]; });
    Object.keys(now).forEach(name => { if (!(name in ordered)) ordered[name] = now[name]; });
    const live = window.Live.live(ordered, {
      open: info.files[0], marks, changed: info.files, path: info.path,
      console: true
    });
    live.classList.add('example-live');
    box.append(live);
    return box;
  }

  /* ---------- Original Week 03 slides, shown exactly as they were made ---------- */
  const DECKS = {
    deck1: { title: 'Introduction to JavaScript & (some) React', count: 12 },
    deck2: { title: 'Introduction to React (#2)', count: 19 }
  };

  function originalSlide(template) {
    const [deck, num] = template.dataset.original.split('-');
    const info = DECKS[deck];
    const box = document.createElement('div');
    box.className = 'original-slide';
    box.innerHTML = '<div class="orig-head"><span class="badge orig">ORIGINAL SLIDE</span><span></span></div>' +
      '<figure><img></figure>';
    box.querySelector('.orig-head span:last-child').textContent =
      'Week 03 · “' + info.title + '” · slide ' + Number(num) + ' of ' + info.count + ' · CS+SG Education Team';
    const img = box.querySelector('img');
    img.src = 'original/' + template.dataset.original + '.jpg';
    img.alt = 'Original slide: ' + template.dataset.title;
    box.append(template.content.cloneNode(true));
    return box;
  }

  /* ---------- Turn slide markup into live pieces ---------- */
  function enhance(root) {
    // A multi-file demo: <div data-live> with <script type="text/plain" data-file="..."> inside.
    root.querySelectorAll('[data-live]').forEach(holder => {
      const files = {};
      const marks = {};
      holder.querySelectorAll('script[type="text/plain"]').forEach(s => {
        files[s.dataset.file] = dedent(s.textContent);
        if (s.dataset.mark) marks[s.dataset.file] = parseMarks(s.dataset.mark);
      });
      const d = holder.dataset;
      const node = window.Live.live(files, {
        open: d.open, marks, console: 'console' in d, stack: 'stack' in d, big: 'big' in d,
        mode: d.mode, path: d.path, label: d.label
      });
      holder.replaceWith(node);
    });
    root.querySelectorAll('script[type="text/plain"]').forEach(block => {
      const code = dedent(block.textContent);
      const d = block.dataset;
      const name = d.file || ('js' in d ? 'script.ts' : 'App.tsx');
      const marks = parseMarks(d.mark);
      const common = { big: 'big' in d, stack: 'stack' in d, file: name, marks: { [name]: marks } };
      let node;
      if ('react' in d) node = window.Live.live({ [name]: code }, Object.assign(common, { console: 'console' in d, path: d.path }));
      else if ('js' in d) node = window.Live.jsRunner(code, common);
      else if ('compile' in d) node = window.Live.jsxCompiler(code, common);
      else if ('htmlLive' in d) node = window.Live.live({ 'index.html': code },
        Object.assign(common, { mode: 'html', console: true, label: 'index.html', marks: { 'index.html': marks } }));
      else {
        const list = block.nextElementSibling && block.nextElementSibling.matches('ul.problems') ? block.nextElementSibling : null;
        const errs = list ? new Set([...list.querySelectorAll('li[data-line]')].map(li => Number(li.dataset.line))) : null;
        node = codeWindow(code, { lang: d.lang || window.Live.langOf(name), label: d.label || '', marks, errs, big: 'big' in d });
        if (list) problems(list, node);
      }
      if (d.style) node.style.cssText += d.style;
      block.replaceWith(node);
    });
    root.querySelectorAll('[data-example-step]').forEach(el => el.replaceWith(exampleStep(Number(el.dataset.exampleStep))));
    root.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => {
      button.nextElementSibling.classList.toggle('show');
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
    button.className = 'nav-item' + ('original' in template.dataset ? ' orig' : '');
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
    slide.classList.toggle('is-original', 'original' in template.dataset);
    slide.replaceChildren('original' in template.dataset ? originalSlide(template) : template.content.cloneNode(true));
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
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && !event.target.matches('button, summary, a'))) {
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

  const finished = example.files(example.last);
  const samples = {
    counter: { 'App.tsx': "import { useState } from \"react\";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  console.log(\"App rendered. count is\", count);\n\n  return (\n    <div>\n      <h1>You clicked {count} times</h1>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  );\n}\n\nexport default App;\n" },
    blank: {
      'index.html': finished['index.html'].replace('Mini Instagram', 'My React app'),
      'src/main.tsx': finished['src/main.tsx'],
      'src/App.tsx': "function App() {\n  return (\n    <main className=\"app\">\n      <h1>Hello!</h1>\n      <p>Edit src/App.tsx. Add files with “+ file”.</p>\n    </main>\n  );\n}\n\nexport default App;\n",
      'src/index.css': "body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n}\n\n.app {\n  padding: 16px;\n}\n"
    },
    insta: finished
  };
  let pg = null;
  function mountPlayground() {
    if (pg) return;
    const select = document.getElementById('pgSample');
    pg = window.Live.live(samples.counter, { console: true, full: true });
    document.getElementById('pgHolder').append(pg);
    select.addEventListener('change', () => pg.editor.setFiles(samples[select.value], select.value === 'insta' ? 'src/App.tsx' : undefined));
    document.getElementById('pgAddFile').addEventListener('click', () => {
      const name = prompt('New file name (for example src/components/Card.tsx):', 'src/components/');
      if (name && /\.([jt]sx?|css)$/.test(name.trim())) pg.editor.addFile(name.trim());
      else if (name) alert('Use a name ending in .tsx, .ts, .jsx, .js, or .css');
    });
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
  const KEY = 'cssg-lesson3-ts-checklist';
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
