# Lesson 3 · JavaScript & React from zero

An interactive slide deck for beginners, built as a follow-along. It combines the two
Week 03 decks: the JavaScript + DOM intro from the first, and the Mini Instagram build
from the second. React is taught as one layer on top of plain HTML, CSS, and JS.

1. **Start**: where React fits (a layer above HTML/CSS/JS), how the session works
2. **JS you need**: let/const, objects & arrays, functions, arrow functions, `map()`,
   ternaries, destructuring, import/export, a checkpoint quiz
3. **The DOM by hand**: `<script>` tags, changing the page with plain JS, a like button
   with no React, building elements from data with `createElement` (a component by hand),
   and why keeping the page in sync by hand gets painful
4. **Components & JSX**: first component, JSX → `React.createElement` (live), JSX rules,
   fixing broken JSX, `{ }`, how rendering works
5. **Props**: components in components, props, lists with `map()` and `key`
6. **State & hooks**: why normal variables don't work, `useState`, re-rendering,
   events, the like button in plain JS vs React, toggles, inputs, `useEffect`
7. **A real project**: Node + npm, `npm create vite`, the files and how they connect
8. **Build Mini Instagram**: 11 follow-along steps, plus routing with React Router
9. **Wrap-up**: common mistakes, a plain JS → React cheat sheet, recap, the assignment

## Original Week 03 slides

All slides from the two original Week 03 decks (by the CS+SG Education Team) are in the
deck exactly as they were made: they're rendered images in `original/` (from the
`.pptx` files, via LibreOffice), framed as **ORIGINAL SLIDE** and shown in italics with
a ◆ in the sidebar. Each one sits just before the website slides that expand on it. Their
links and speaker notes are shown under the image. Two slides in deck #2 were exact
copies of deck 1 slides (“React!” and “React Routing”), so each appears once. The last
slide of deck #2 (“Thank you!!!” with the attendance QR code) is left out.

To add one: `<template data-original="deck2-03" data-part="…" data-title="…" data-time="2 MIN" data-label="…"></template>`.
To re-render after a deck changes:

```sh
soffice --headless --convert-to pdf "Week 03_ JS and React.pptx"
pdftoppm -r 180 -jpeg -jpegopt quality=85 "Week 03_ JS and React.pdf" original/deck1
```

## Running it

No install needed. Double-click `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

and open <http://localhost:8000>. Everything (React, React Router, Babel) is in
`vendor/`, so it works offline.

- **Slides**: arrow keys / Space / PageUp / PageDown to move, Home / End to jump.
  The URL hash (`#12`) keeps your place. **Present** goes full screen and hides teacher notes.
- **LIVE slides**: the code is editable. The preview updates as you type, syntax errors
  appear over the preview, and `console.log` output shows in the console box.
  **reset** restores the original code. JavaScript-only slides run on **▶ run** / Ctrl+Enter.
- **Playground**: a multi-file React app in the browser (counter, blank app, or the
  finished Mini Instagram). **+ file** adds a component file.
- **Assignment**: the “make it yours” checklist (remembered in that browser).

## The real project

`mini-instagram/` has the same app as a real Vite project. See its README.

## Editing

- Slides are `<template>` elements in `index.html`. Code goes in
  `<script type="text/plain">` blocks so you can write JSX/HTML without escaping
  (write `<\/script>` for a closing script tag inside one):
  - `data-react` → editable component + live preview (`data-console` adds a console,
    `data-file="Name.jsx"` names the tab)
  - `data-js` → editable JavaScript + console, runs on ▶ run
  - `data-compile` → JSX on the left, the compiled JavaScript on the right
  - `data-html-live` → editable plain HTML page (with `<script>`) + console
  - none of the above → read-only code; `data-lang`, `data-label`, `data-big`
  - `data-mark="2-4"` highlights lines on any of them
- Multi-file demos: `<div data-live data-open="App.jsx">` holding several
  `<script type="text/plain" data-file="...">` blocks. Imports between them work, and
  `import "./style.css"` applies the CSS.
- Previews swap `BrowserRouter` for an in-memory router (a frame can't change its own
  address); the browser bar shows the current path and the tab title.
- `.quiz` blocks: put `data-ok` on the right button and `data-why` on every button.
- The worked example lives in `example.js`; step slides highlight changed lines
  automatically. Run `node build-example.js` afterwards to update
  `mini-instagram/starter/` (step 1) and `mini-instagram/completed/` (last step).
- `live.js` is the in-browser compiler and preview. If you update `vendor/`, run
  `node build-vendor.js` to regenerate `vendor/inline.js` (the previews run React from it).
