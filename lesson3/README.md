# Lesson 3 · React + TypeScript

“Objects in, JSX out.” An interactive slide deck for beginners, built as a follow-along.
It teaches React with TypeScript as one layer on top of plain HTML, CSS, and JS, and
builds a typed Mini Instagram. It follows the lesson's ten stops:

- **Intro**: cover, today's ten stops (no `useEffect` or fetching until next week), where
  React fits, why React (UI = f(state)), plain JS rendering from data (and losing focus,
  typed text and escaping), the same app in React
- **01 · Setup**: Node 20+, `npm create vite@latest -- --template react-ts`, deleting the
  demo, where things live (`.tsx` vs `.ts`, one component per file, capitalized names),
  how the files connect, step 1
- **02 · Types**: components are functions and props are objects, a type describes a shape
  (unions, arrays, optional keys, nested objects), types are erased (live), the types you'll
  use and inference, TypeScript checking data (real compiler messages), steps 2–3, a quiz
- **03 · Objects & arrays**: dot access, `??`, destructuring, spread; `map`, `filter`,
  `find`, `some`, copy-then-`sort`; arrows and ternaries; import/export and
  `import type`; a quiz
- **04 · Components**: props as one typed object (data in, actions out), the full PostCard,
  attributes → `jsx(Component, props)` (live), read-only props and `children`, steps 4–5
- **05 · JSX**: six differences from HTML, fixing broken JSX, JSX → JavaScript, `{ }`
  expressions and class strings, one root (fragments, semantic tags), rendering, a quiz
- **06 · Lists**: `.map` + stable keys (key isn't a prop), why not index keys (live),
  `&&` / ternary / empty states / the `0` gotcha, step 6
- **07 · Events**: pass the function, don't call it; `onClick`, `onChange`, `onSubmit`,
  `onKeyDown`; typing events (`ChangeEvent`, `SubmitEvent` + `preventDefault`, inference)
- **08 · State**: `useState` with explicit types for `[]` and `null`, re-rendering, steps 7–8,
  new values never mutation, controlled inputs and derived values, lifting state, a quiz
- **09 · Build it**: Parts 1–4 in `App.tsx`: favorites + `toggleFavorite` + derived
  `visible`, header with count and search, `TAGS.map` tag buttons, `visible.map` + empty state
- **10 · Wrap-up**: five bugs everyone writes (live), quick checks, cheat sheet, recap,
  stretch: React Router (live), homework (port your content, build and deploy), next week
  (`useEffect`, `fetch`, loading and error states)

## Original Week 03 slides

The original Week 03 slides (by the CS+SG Education Team) are in the deck exactly as
they were made: they're rendered images in `original/` (from the `.pptx` files, via
LibreOffice), framed as **ORIGINAL SLIDE** and shown in italics with a ◆ in the sidebar.
Each one sits just before the website slides that expand on it, with a short note where
the TypeScript version differs (`.tsx` file names, `PostCard` instead of `Post`). Two
slides in deck #2 were exact copies of deck 1 slides (“React!” and “React Routing”), so
each appears once. The last slide of deck #2 (“Thank you!!!” with the attendance QR code)
is left out.

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
  **reset** restores the original code. Code-only slides run on **▶ run** / Ctrl+Enter.
  The slides strip TypeScript types (like `npm run dev`) but don't type-check: that's
  VS Code's and `npm run build`'s job. The “TS checks your data” slide shows real
  TypeScript 7 messages.
- **Playground**: a multi-file React + TypeScript app in the browser (counter, blank app, or the
  finished Mini Instagram). **+ file** adds a component file.
- **Assignment**: the “make it yours” checklist (remembered in that browser).

## The real project

`mini-instagram/` has the same app as a real Vite + TypeScript project (the same config as
`npm create vite@latest -- --template react-ts`). See its README.

## Editing

- Slides are `<template>` elements in `index.html`. Code goes in
  `<script type="text/plain">` blocks so you can write TSX/HTML without escaping
  (write `<\/script>` for a closing script tag inside one):
  - `data-react` → editable component + live preview (`data-console` adds a console,
    `data-file="Name.tsx"` names the tab; the default is `App.tsx`)
  - `data-js` → editable TypeScript (`script.ts`) + console, runs on ▶ run
  - `data-compile` → TSX on the left, the compiled JavaScript (`jsx(…)` calls, no types)
    on the right; `data-file="x.ts"` for a types-only example
  - `data-html-live` → editable plain HTML page (with `<script>`) + console
  - none of the above → read-only code; `data-lang`, `data-label`, `data-big`
  - `data-mark="2-4"` highlights lines on any of them
  - a `<ul class="problems">` right after a read-only block draws VS Code-style type
    errors: `<li data-line="4">message</li>` squiggles line 4
- Multi-file demos: `<div data-live data-open="App.tsx">` holding several
  `<script type="text/plain" data-file="...">` blocks. Imports between them work, and
  `import "./index.css"` applies the CSS.
- Previews swap `BrowserRouter` for an in-memory router (a frame can't change its own
  address); the browser bar shows the current path and the tab title.
- `.quiz` blocks: put `data-ok` on the right button and `data-why` on every button.
- The worked example lives in `example.js`; step slides highlight changed lines
  automatically. Run `node build-example.js` afterwards to update
  `mini-instagram/starter/` (step 1) and `mini-instagram/completed/` (last step).
- `live.js` is the in-browser compiler and preview. If you update `vendor/`, run
  `node build-vendor.js` to regenerate `vendor/inline.js` (the previews run React from it).
