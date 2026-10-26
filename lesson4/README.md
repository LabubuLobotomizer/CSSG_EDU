# Lesson 4 · Async, APIs & fetch

“Waiting, without freezing.” A **lecture** deck, not a follow-along: laptops mostly closed,
and the room reasons out loud. It goes from the machine up to the network:

- **Intro**: the hook (a 4-line puzzle we solve in section 04), the predict → pair → vote →
  step-through routine, today's map
- **01 · Why wait?**: latency numbers scaled to human time (click to reveal), one thread,
  a live “freeze the page” demo (busy loop vs `setTimeout` vs `await`), sync vs async
- **02 · Memory**: stack and heap, the call stack step by step, stack overflow, values vs
  references, closures keeping a scope alive on the heap, garbage collection and leaks
- **03 · Event loop**: the whole machine (stack, heap, Web APIs, task and microtask
  queues, the loop in pseudocode), `setTimeout(…, 0)`, a delay is a minimum, `var` vs `let`
  in a loop
- **04 · Promises**: callback pyramids, a promise as a heap object (state, value,
  reactions), the executor runs right away, promise vs timer, two chains taking turns,
  errors and `catch`, writing `wait(ms)`
- **05 · async / await**: same promises nicer syntax, where a paused function goes, the
  final boss, sequential vs `Promise.all`, the forgotten `await`
- **06 · APIs & HTTP**: what an API is, URLs, raw requests and responses, designing REST
  endpoints for Mini Instagram, status codes, JSON
- **07 · fetch**: a first fetch, why two awaits, fetch on the event loop, a 404 doesn't
  reject, a `getJSON` helper, POST, loading / error / success (live Pokédex), `useEffect` +
  fetch in React, race conditions, N + 1 requests, timeouts / retries / rate limits / CORS
- **Wrap-up**: seven rules, a cheat sheet, an exit ticket, homework

## Teaching it

- **PREDICT slides** (orange numbers in the sidebar) open frozen at step 0. Use the think
  timer, let pairs argue, take a vote, then step through.
- **→ / Space / a clicker steps the trace first**, then moves to the next slide. ← steps back.
  The **answer** button jumps to the end if you're short on time.
- **Teacher notes** are under every slide, labelled so you can scan them mid-sentence:
  SAY, ASK, ANSWER, COMMON WRONG ANSWER, IF STUCK, DO.
- **Speaker view**: press **S** (or the button in the top bar). A second window shows the
  current slide's notes, what's next, a clock, and an elapsed timer (click to reset). Its
  ← → buttons and keys drive the main window, including trace steps. Put the main window
  on the projector and press **Present** (full screen, notes hidden, bigger code).
- Slides marked **OPT** in the sidebar can be skipped. The top bar shows the core time.
  The full deck is long (≈3 hours of core material): it fits two sessions, splitting
  after the async checkpoint (there's a break note there).
- **No Wi-Fi?** Any fetch slide has a **network: live / offline copy** switch. The offline
  copy answers PokeAPI and JSONPlaceholder requests (pikachu, bulbasaur, charmander,
  squirtle, eevee, snorlax, mew; users 1–3; posts) with a realistic delay. The setting is
  remembered across slides.

## Running it

No install needed. Serve the repo root and open `/lesson4/`:

```sh
python3 -m http.server 8000
```

Opening `index.html` directly also works, except the speaker view, which needs both
windows on the same origin.

## Editing

- Slides are `<template>` elements in `index.html` (`data-part`, `data-title`,
  `data-time`, `data-label`; add `data-optional` to mark a slide skippable).
- `<div data-predict="60">question</div>` draws the predict banner with a 60 s timer.
- `<div data-trace="name"></div>` draws a step-through from `traces.js`. Each trace has
  the code, which panels to show (stack, heap, apis, micro, tasks, console), and steps
  that list only what changed. See the comment at the top of `traces.js`. If you edit a
  trace's code, make sure its `log` steps still match what the code really prints.
- `<script type="text/plain" data-run>` is editable, runnable JS with a timestamped
  console (top-level `await` works). Add `data-net` for the network switch and
  `data-mark="2-4"` to highlight lines. Without `data-run` it's read-only
  (`data-label` names it).
- `<div data-freeze>` is the blocking demo, `<div data-poke>` the Pokédex demo.
- `.quiz` blocks: `data-ok` on the right button, `data-why` on every button.
  `data-reveal` on a button toggles the `.answer` after it. Clicking a `.latency`
  cell reveals it.
- `runner.js` is the highlighter, the runner, and the offline fetch copy; `deck.js` is
  navigation, the visualizer, the demos, and the speaker view.
