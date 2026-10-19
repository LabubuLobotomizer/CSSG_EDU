// Live demos for lesson 3: a small "Vite in the browser".
// - Live.highlight(code, lang, marks)  read-only syntax highlighting
// - Live.editor(...)                    editable, highlighted code with file tabs
// - Live.preview(files, opts)           compile JSX with Babel, run it with React in a sandbox
// Everything runs from ./vendor, so it works offline.
(function (root) {
  const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const vendor = name => new URL('vendor/' + name, document.baseURI).href;

  /* ---------- Syntax highlighting ---------- */
  const JS_KEYWORDS = /^(import|from|export|default|function|return|const|let|var|if|else|for|of|in|new|true|false|null|undefined|typeof|while|async|await)$/;
  const JS_TOKENS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|\{\/\*[\s\S]*?\*\/\})|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(=>)|(<\/?[A-Za-z][\w.]*|\/?>|<>|<\/>)|\b([A-Za-z_$][\w$]*)\b(?==[{"'])|\b([A-Za-z_$][\w$]*)\b(?=\()|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;

  function hlJs(code) {
    let out = '', last = 0, m;
    JS_TOKENS.lastIndex = 0;
    while ((m = JS_TOKENS.exec(code))) {
      out += esc(code.slice(last, m.index));
      last = JS_TOKENS.lastIndex;
      const [all, com, str, arrow, tag, attr, call, num, word] = m;
      if (com) out += '<span class="t-com">' + esc(com) + '</span>';
      else if (str) out += '<span class="t-str">' + esc(str) + '</span>';
      else if (arrow) out += '<span class="t-kw">=&gt;</span>';
      else if (tag) out += '<span class="t-tag">' + esc(tag) + '</span>';
      else if (attr) out += JS_KEYWORDS.test(attr) ? '<span class="t-kw">' + attr + '</span>' : '<span class="t-attr">' + attr + '</span>';
      else if (call) out += JS_KEYWORDS.test(call) ? '<span class="t-kw">' + call + '</span>' : '<span class="t-fn">' + call + '</span>';
      else if (num) out += '<span class="t-num">' + num + '</span>';
      else if (word) out += JS_KEYWORDS.test(word) ? '<span class="t-kw">' + word + '</span>'
        : /^[A-Z]/.test(word) ? '<span class="t-comp">' + word + '</span>' : esc(word);
      else out += esc(all);
    }
    return out + esc(code.slice(last));
  }

  // HTML, with any <script> contents highlighted as JavaScript.
  function hlHtml(code) {
    return code.split(/(<script[^>]*>)([\s\S]*?)(?=<\/script>)/).map((part, i) =>
      i % 3 === 2 ? hlJs(part) : hlMarkup(part)).join('');
  }

  function hlMarkup(code) {
    return esc(code)
      .replace(/&lt;!--[\s\S]*?--&gt;/g, s => '<span class="t-com">' + s + '</span>')
      .replace(/(&lt;\/?)(!doctype|[A-Za-z][\w-]*)([\s\S]*?)(\/?&gt;)/gi, (all, open, name, attrs, close) =>
        '<span class="t-tag">' + open + name + '</span>' +
        attrs.replace(/([\w:-]+)(=)("[^"]*")/g, '<span class="t-attr">$1</span>$2<span class="t-str">$3</span>') +
        '<span class="t-tag">' + close + '</span>');
  }

  function hlCss(code) {
    return esc(code)
      .replace(/\/\*[\s\S]*?\*\//g, s => '<span class="t-com">' + s + '</span>')
      .replace(/^([^{}\n<]+?)(\s*\{)/gm, '<span class="t-sel">$1</span>$2')
      .replace(/^(\s+)([\w-]+)(\s*:)([^;\n]*)(;?)/gm, '$1<span class="t-prop">$2</span>$3<span class="t-val">$4</span>$5');
  }

  // Highlight a whole file, then cut it into lines (so multi-line comments still work).
  function highlightLines(code, lang) {
    const html = lang === 'html' ? hlHtml(code) : lang === 'css' ? hlCss(code)
      : lang === 'text' ? esc(code) : hlJs(code);
    const result = [];
    let open = [];
    html.split('\n').forEach(line => {
      let text = open.join('') + line;
      const tags = line.match(/<span[^>]*>|<\/span>/g) || [];
      tags.forEach(t => { if (t === '</span>') open.pop(); else open.push(t); });
      text += '</span>'.repeat(open.length);
      result.push(text);
    });
    return result;
  }

  function highlight(code, lang, marks) {
    return highlightLines(code, lang).map((line, i) =>
      '<span class="ln' + (marks && marks.has(i + 1) ? ' mark' : '') + '">' + (line || ' ') + '</span>').join('');
  }

  const langOf = name => /\.css$/.test(name) ? 'css' : /\.html$/.test(name) ? 'html' : /\.(txt|sh)$/.test(name) ? 'text' : 'js';

  /* ---------- Editor: a textarea on top of highlighted code ---------- */
  function editor(fileMap, { open, marks = {}, changed = [], big = false, onChange, onRun, label } = {}) {
    let files = Object.assign({}, fileMap);
    let current = open || Object.keys(files)[0];
    const box = document.createElement('div');
    box.className = 'live-editor' + (big ? ' big' : '');
    box.innerHTML = '<div class="ed-tabs"></div><div class="ed-body"><div class="ed-gutter"></div>' +
      '<div class="ed-code"><pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>';
    const tabs = box.querySelector('.ed-tabs');
    const gutter = box.querySelector('.ed-gutter');
    const pre = box.querySelector('pre');
    const ta = box.querySelector('textarea');

    function drawTabs() {
      tabs.innerHTML = '';
      Object.keys(files).forEach(name => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ed-tab' + (name === current ? ' on' : '') + (changed.includes(name) ? ' changed' : '');
        b.textContent = name.replace(/^src\//, '');
        b.title = name;
        b.addEventListener('click', () => { current = name; drawTabs(); load(); });
        tabs.append(b);
      });
      const tools = document.createElement('span');
      tools.className = 'ed-tools';
      tools.innerHTML = (label ? '<span class="ed-label"></span>' : '') +
        (onRun ? '<button type="button" data-run>▶ run <small>ctrl+enter</small></button>' : '') +
        '<button type="button" data-reset>reset</button>';
      if (label) tools.querySelector('.ed-label').textContent = label;
      tabs.append(tools);
      tools.querySelector('[data-reset]').addEventListener('click', () => {
        files = Object.assign({}, fileMap); load(); changedNow();
      });
      if (onRun) tools.querySelector('[data-run]').addEventListener('click', () => onRun(files));
    }

    function paint() {
      const text = ta.value;
      const lang = langOf(current);
      pre.innerHTML = highlight(text, lang, files[current] === fileMap[current] ? marks[current] : null) + '<span class="ln"> </span>';
      const count = text.split('\n').length;
      let nums = '';
      for (let i = 1; i <= count; i++) nums += i + '\n';
      gutter.textContent = nums;
      sync();
    }
    function sync() {
      pre.style.transform = 'translate(' + -ta.scrollLeft + 'px,' + -ta.scrollTop + 'px)';
      gutter.style.transform = 'translateY(' + -ta.scrollTop + 'px)';
    }
    function load() {
      ta.value = files[current];
      ta.setAttribute('aria-label', current + ' source code');
      paint();
      ta.scrollTop = 0;
      const first = pre.querySelector('.mark');
      if (first) ta.scrollTop = Math.max(0, first.offsetTop - 40);
      sync();
    }
    let timer;
    function changedNow() { clearTimeout(timer); if (onChange) onChange(files); }

    ta.addEventListener('input', () => {
      files[current] = ta.value;
      paint();
      clearTimeout(timer);
      if (onChange) timer = setTimeout(() => onChange(files), 450);
    });
    ta.addEventListener('scroll', sync);
    ta.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (onRun) onRun(files); else changedNow();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Keep the indentation of the line you were on.
        const before = ta.value.slice(0, ta.selectionStart);
        const indent = before.slice(before.lastIndexOf('\n') + 1).match(/^ */)[0];
        const extra = /[({[>]\s*$/.test(before) && !/(<\/[^>]*>|\/>)\s*$/.test(before) ? '  ' : '';
        e.preventDefault();
        ta.setRangeText('\n' + indent + extra, ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    });

    drawTabs();
    load();
    box.getFiles = () => files;
    box.setFiles = (next, openName) => {
      fileMap = Object.assign({}, next); files = Object.assign({}, next);
      current = openName || Object.keys(files)[0]; marks = {}; changed = [];
      drawTabs(); load(); changedNow();
    };
    box.addFile = name => {
      if (!name || files[name] !== undefined) return;
      files[name] = ''; fileMap[name] = ''; current = name; drawTabs(); load();
    };
    return box;
  }

  /* ---------- Compiling ---------- */
  function compile(code, filename, modules = true) {
    return root.Babel.transform(code, {
      filename,
      sourceType: 'module',
      presets: [['react', { runtime: 'classic' }]],
      plugins: modules ? ['transform-modules-commonjs'] : []
    }).code;
  }

  // The script that runs inside every preview frame. It loads modules on demand,
  // forwards console output and errors to the slide, and swaps BrowserRouter for an
  // in-memory router (a preview frame can't change its own address).
  function runtime(id, modules, css, entry, startPath) {
    /* eslint-disable no-undef */
    const post = msg => parent.postMessage(Object.assign({ __live: id }, msg), '*');
    const fmt = (v, depth) => {
      if (typeof v === 'string') return depth ? JSON.stringify(v) : v;
      if (typeof v === 'function') return v.name ? 'ƒ ' + v.name + '()' : 'ƒ ()';
      if (v === undefined) return 'undefined';
      if (v === null || typeof v !== 'object') return String(v);
      if (v instanceof Error) return v.name + ': ' + v.message;
      if (v.$$typeof) return '<' + (typeof v.type === 'string' ? v.type : (v.type && v.type.name) || 'Component') + ' />';
      if (v.nodeType === 1) return '<' + v.tagName.toLowerCase() + '>';
      if (depth > 2) return Array.isArray(v) ? '[…]' : '{…}';
      if (Array.isArray(v)) return '[' + v.map(x => fmt(x, depth + 1)).join(', ') + ']';
      return '{ ' + Object.keys(v).map(k => k + ': ' + fmt(v[k], depth + 1)).join(', ') + ' }';
    };
    ['log', 'info', 'warn', 'error'].forEach(level => {
      const orig = console[level];
      console[level] = function (...args) {
        orig.apply(console, args);
        let text = args.map(a => fmt(a, 0)).join(' ');
        // React's warnings use %s placeholders.
        if (typeof args[0] === 'string' && args[0].includes('%s')) {
          let i = 1;
          text = args[0].replace(/%s/g, () => fmt(args[i++], 0)).split('\n')[0];
        }
        post({ type: 'log', level, text });
      };
    });
    const overlay = (title, text) => {
      let box = document.getElementById('__err');
      if (!box) {
        box = document.createElement('div');
        box.id = '__err';
        box.style.cssText = 'position:fixed;inset:0;background:rgba(255,245,243,.97);color:#8a1f17;padding:16px;font:13px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;overflow:auto;z-index:99999;border-top:4px solid #c0392b';
        document.body.append(box);
      }
      box.textContent = '';
      const b = document.createElement('b');
      b.textContent = title + '\n\n';
      box.append(b, document.createTextNode(text));
    };
    window.addEventListener('error', e => {
      const msg = e.error ? e.error.message : e.message;
      overlay('Error while running your code', msg);
      post({ type: 'log', level: 'error', text: msg });
    });

    const cache = {};
    const resolve = (from, spec) => {
      const parts = from.split('/').slice(0, -1);
      spec.split('/').forEach(p => { if (p === '..') parts.pop(); else if (p !== '.' && p !== '') parts.push(p); });
      const base = (spec.startsWith('/') ? spec.slice(1) : parts.join('/'));
      return [base, base + '.jsx', base + '.js', base + '/index.jsx'].find(p => p in modules || p in css) || base;
    };
    let routerLib = null;
    const router = () => {
      if (routerLib) return routerLib;
      const R = window.ReactRouterDOM, h = React.createElement;
      function Spy() {
        const loc = R.useLocation();
        React.useEffect(() => { post({ type: 'path', path: loc.pathname }); }, [loc.pathname]);
        return null;
      }
      function BrowserRouter(props) {
        return h(R.MemoryRouter, { initialEntries: [startPath || '/'] }, h(Spy), props.children);
      }
      routerLib = Object.assign({}, R, { BrowserRouter, HashRouter: BrowserRouter, __esModule: true });
      return routerLib;
    };
    const require = (from, spec) => {
      if (spec === 'react') return React;
      if (spec === 'react-dom' || spec === 'react-dom/client') return ReactDOM;
      if (spec === 'react-router' || spec === 'react-router-dom') return router();
      const path = resolve(from, spec);
      if (path in css) {
        if (!document.querySelector('style[data-file="' + path + '"]')) {
          const s = document.createElement('style');
          s.dataset.file = path;
          s.textContent = css[path];
          document.head.append(s);
        }
        return {};
      }
      if (!(path in modules)) throw new Error('Cannot find "' + spec + '" (imported in ' + from + ').\nCheck the file name, its folder, and capital letters.');
      if (cache[path]) return cache[path].exports;
      const module = { exports: {} };
      cache[path] = module;
      new Function('require', 'module', 'exports', 'React', modules[path] + '\n//# sourceURL=' + path)(
        s => require(path, s), module, module.exports, React);
      return module.exports;
    };

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || a.getAttribute('href').charAt(0) === '#') return;
      e.preventDefault();
      window.open(a.href, '_blank');
    });
    let lastTitle = '';
    setInterval(() => { if (document.title !== lastTitle) { lastTitle = document.title; post({ type: 'title', title: lastTitle }); } }, 250);
    try {
      const exp = require('', './' + entry);
      if (!/main\.jsx?$/.test(entry)) {
        const Comp = exp.default;
        if (typeof Comp !== 'function') throw new Error(entry + ' has no default export to show.\nAdd: export default YourComponent;');
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Comp));
      }
    } catch (err) {
      overlay('Error while running your code', err.message);
      post({ type: 'log', level: 'error', text: err.message });
    }
  }

  // Previews talk back to the slide with postMessage.
  const listeners = {};
  window.addEventListener('message', e => {
    const d = e.data;
    if (d && d.__live && listeners[d.__live]) listeners[d.__live](d);
  });
  let nextId = 1;

  const BASE_CSS = 'body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;margin:12px;color:#222;line-height:1.45}' +
    'button{font:inherit;padding:6px 14px;border-radius:6px;border:1px solid #bbb;background:#fff;cursor:pointer}' +
    'button:hover{background:#f2f2f2}input{font:inherit;padding:6px 8px;border:1px solid #bbb;border-radius:6px}img{max-width:100%}';

  // Build the HTML for one preview. mode 'react' runs modules; mode 'html' shows index.html as-is.
  function buildDoc(id, files, { entry, path, mode, baseCss = true }) {
    const bridge = 'var __id=' + JSON.stringify(id) + ';';
    if (mode === 'html') {
      const html = files['index.html'] || '';
      const inject = '<script>' + bridge + '(' + runtimeConsoleOnly.toString() + ')(__id);<\/script>';
      return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + inject) : inject + html;
    }
    const modules = {}, css = {};
    for (const [name, text] of Object.entries(files)) {
      if (/\.css$/.test(name)) css[name] = text;
      else if (/\.jsx?$/.test(name)) modules[name] = compile(text, name);
    }
    if (!entry) entry = 'src/main.jsx' in files ? 'src/main.jsx' : Object.keys(modules)[0];
    const needsRouter = Object.values(files).some(t => /from\s+["']react-router/.test(t));
    const scripts = ['react.development.js', 'react-dom.development.js']
      .concat(needsRouter ? ['router.umd.min.js', 'react-router.production.min.js', 'react-router-dom.production.min.js'] : [])
      .map(f => root.LiveVendor ? '<script>' + root.LiveVendor[f] + '<\/script>' : '<script src="' + vendor(f) + '"><\/script>').join('');
    const json = s => JSON.stringify(s).replace(/</g, '\\u003c');
    let title = 'Preview';
    const m = (files['index.html'] || '').match(/<title>([^<]*)<\/title>/);
    if (m) title = m[1];
    return '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title>' +
      (baseCss ? '<style>' + BASE_CSS + '</style>' : '') + scripts + '</head><body><div id="root"></div><script>' +
      '(' + runtime.toString() + ')(' + [json(id), json(modules), json(css), json(entry), json(path || '/')].join(',') + ');' +
      '<\/script></body></html>';
  }

  // A plain page (no React) still sends its console to the slide.
  function runtimeConsoleOnly(id) {
    const post = msg => parent.postMessage(Object.assign({ __live: id }, msg), '*');
    const fmt = v => typeof v === 'string' ? v : (() => { try { return JSON.stringify(v); } catch (e) { return String(v); } })();
    ['log', 'info', 'warn', 'error'].forEach(level => {
      const orig = console[level];
      console[level] = function (...args) { orig.apply(console, args); post({ type: 'log', level, text: args.map(fmt).join(' ') }); };
    });
    window.addEventListener('error', e => post({ type: 'log', level: 'error', text: e.message }));
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (a && !e.defaultPrevented && a.getAttribute('href').charAt(0) !== '#') { e.preventDefault(); window.open(a.href, '_blank'); }
    });
  }

  /* ---------- Preview: browser frame + optional console ---------- */
  function preview({ label = 'localhost:5173', console: showConsole = false, mode = 'react', entry, path, height } = {}) {
    const id = 'p' + (nextId++);
    const box = document.createElement('div');
    box.className = 'live-preview';
    box.innerHTML = '<div class="browser-frame"><div class="browser-bar"><i></i><i></i><i></i><span class="url"></span>' +
      '<span class="tab-title"></span><button type="button" class="reload" title="Reload the preview">↻</button></div>' +
      '<div class="compile-error" hidden></div></div>' +
      (showConsole ? '<div class="console"><div class="console-head"><span>CONSOLE</span><button type="button">clear</button></div><div class="console-body"></div></div>' : '');
    const frameBox = box.querySelector('.browser-frame');
    const urlEl = box.querySelector('.url');
    const titleEl = box.querySelector('.tab-title');
    const errEl = box.querySelector('.compile-error');
    const consoleBody = box.querySelector('.console-body');
    let iframe = null, lastFiles = null, currentPath = path || '/';
    const showUrl = () => { urlEl.textContent = mode === 'html' ? label : label + (currentPath === '/' ? '' : currentPath); };
    showUrl();

    const log = (level, text) => {
      if (!consoleBody) return;
      const row = document.createElement('div');
      row.className = 'log ' + level;
      row.textContent = text;
      const prev = consoleBody.lastElementChild;
      if (prev && prev.dataset.text === text && prev.dataset.level === level) {
        const n = (Number(prev.dataset.count) || 1) + 1;
        prev.dataset.count = n;
        prev.setAttribute('data-badge', n);
        return;
      }
      row.dataset.text = text;
      row.dataset.level = level;
      consoleBody.append(row);
      consoleBody.scrollTop = consoleBody.scrollHeight;
    };
    if (consoleBody) box.querySelector('.console-head button').addEventListener('click', () => { consoleBody.innerHTML = ''; });

    listeners[id] = msg => {
      if (msg.type === 'log') log(msg.level, msg.text);
      else if (msg.type === 'path') { currentPath = msg.path; showUrl(); }
      else if (msg.type === 'title') titleEl.textContent = msg.title;
    };

    box.show = files => {
      lastFiles = files;
      let doc;
      try {
        doc = buildDoc(id, files, { entry, path: currentPath, mode });
        errEl.hidden = true;
      } catch (err) {
        // A syntax error: keep the last working page and explain the problem on top of it.
        errEl.hidden = false;
        errEl.textContent = '';
        const b = document.createElement('b');
        b.textContent = 'Syntax error · the page will update when this is fixed\n';
        errEl.append(b, document.createTextNode(String(err.message).replace(/^\/?/, '')));
        return;
      }
      if (consoleBody) consoleBody.innerHTML = '';
      const next = document.createElement('iframe');
      next.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals');
      next.title = 'Live preview';
      if (height) next.style.height = height;
      if (iframe) iframe.replaceWith(next); else frameBox.append(next);
      iframe = next;
      iframe.srcdoc = doc;
    };
    box.querySelector('.reload').addEventListener('click', () => {
      currentPath = path || '/';
      showUrl();
      if (lastFiles) box.show(lastFiles);
    });
    return box;
  }

  /* ---------- Editor + preview, wired together ---------- */
  function live(files, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'live' + (opts.stack ? ' stack' : '') + (opts.full ? ' full' : '');
    const view = preview(opts);
    const ed = editor(files, Object.assign({}, opts, { onChange: f => view.show(f) }));
    wrap.append(ed, view);
    view.show(ed.getFiles());
    wrap.editor = ed;
    wrap.preview = view;
    return wrap;
  }

  // Plain JavaScript: press run, see the console.
  function jsRunner(code, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'live js-runner' + (opts.stack ? ' stack' : '');
    const id = 'p' + (nextId++);
    const out = document.createElement('div');
    out.className = 'console tall';
    out.innerHTML = '<div class="console-head"><span>CONSOLE · OUTPUT</span><button type="button">clear</button></div><div class="console-body"></div>';
    const body = out.querySelector('.console-body');
    out.querySelector('button').addEventListener('click', () => { body.innerHTML = ''; });
    let frame = null;
    listeners[id] = msg => {
      if (msg.type !== 'log') return;
      const row = document.createElement('div');
      row.className = 'log ' + msg.level;
      row.textContent = msg.text;
      body.append(row);
      body.scrollTop = body.scrollHeight;
    };
    const run = files => {
      body.innerHTML = '';
      const src = files['script.js'];
      const doc = '<!doctype html><script>var __id=' + JSON.stringify(id) + ';(' + runtimeConsoleOnly.toString() + ')(__id);<\/script>' +
        '<script>' + src.replace(/<\/script/gi, '<\\/script') + '\n<\/script>';
      const next = document.createElement('iframe');
      next.setAttribute('sandbox', 'allow-scripts');
      next.hidden = true;
      if (frame) frame.replaceWith(next); else wrap.append(next);
      frame = next;
      frame.srcdoc = doc;
    };
    const ed = editor({ 'script.js': code }, Object.assign({}, opts, { onRun: run }));
    wrap.append(ed, out);
    run(ed.getFiles());
    return wrap;
  }

  // JSX on the left, the plain JavaScript Babel turns it into on the right.
  function jsxCompiler(code, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'live';
    const out = document.createElement('div');
    out.className = 'code-window';
    out.innerHTML = '<div class="window-label"><span>WHAT THE BROWSER ACTUALLY RUNS (PLAIN JAVASCRIPT)</span><span></span></div><pre></pre>';
    const pre = out.querySelector('pre');
    const show = files => {
      try {
        const js = compile(files['App.jsx'], 'App.jsx', false).replace(/\/\*#__PURE__\*\//g, '');
        pre.innerHTML = highlight(js, 'js');
        out.classList.remove('bad');
      } catch (err) {
        pre.textContent = String(err.message);
        out.classList.add('bad');
      }
    };
    const ed = editor({ 'App.jsx': code }, Object.assign({}, opts, { onChange: show }));
    wrap.append(ed, out);
    show(ed.getFiles());
    return wrap;
  }

  root.Live = { highlight, langOf, editor, preview, live, jsRunner, jsxCompiler, compile, esc };
})(window);
