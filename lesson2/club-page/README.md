# Club page · worked example

- `starter/` — copy this folder to start. It contains a step list and the logo.
- `completed/` — the finished page after step 10 of the slides.

`completed/` is generated from `../example.js` so it always matches the slides.
After editing `example.js`, run `node build-example.js` from the `lesson2` folder.

Steps 8 and 9 deliberately add a CSS conflict (`#meetings li` vs `.highlight`)
and fix it, so the finished `style.css` keeps the teammate's rule.
