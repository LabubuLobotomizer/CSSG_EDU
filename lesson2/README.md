# Lesson 2 · HTML & CSS from zero

An interactive slide deck for complete beginners. It covers:

1. **Start** — HTML/CSS/JS roles, what a browser does when it loads a page
2. **HTML basics** — files, elements, tags, attributes, empty elements, nesting
3. **The tree** — the DOM, parent/child/sibling words, a live tree viewer
4. **The elements** — document skeleton, text, links, file paths, images, lists,
   div/span and block vs inline, semantic elements, a quick tour, a checkpoint quiz
5. **CSS** — CSS as "extra rules", where CSS goes, selectors, inheritance
   (closest ancestor wins), the cascade (closest / most specific rule wins), DevTools
6. **Can I use it?** — reading caniuse.com, a pair lookup activity
7. **Worked example** — the class builds a club page in 10 steps, including a
   real cascade bug and its fix
8. **Wrap-up** — common mistakes, recap, and the About Me assignment

## Running it

No install needed. Either double-click `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

and open <http://localhost:8000>.

- **Slides** — arrow keys / Space / PageUp / PageDown to move, Home / End to jump.
  The sidebar jumps to any slide and shows timings. The URL hash (`#12`) keeps your
  place on refresh. **Present** goes full screen and hides the teacher notes.
- **Playground** — a free HTML editor with a live preview and DOM tree.
- **Assignment** — the About Me checklist (checkboxes are remembered in that browser).

## Editing

- Slides are `<template>` elements in `index.html`. Code samples go in
  `<script type="text/plain">` blocks so you can write raw HTML without escaping:
  - `data-pair` → code + live preview side by side
  - `data-tree` → the DOM tree for that code
  - `data-playground` (+ `data-tree`) → editable code with preview
  - `data-lang="css"`, `data-label="…"`, `data-mark="2-4"` (highlight lines), `data-big`
- `.quiz` blocks: put `data-ok` on the right button and `data-why` on every button.
- The worked example lives in `example.js`; the slides highlight changed lines
  automatically. Run `node build-example.js` afterwards to update `club-page/completed/`.
