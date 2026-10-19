# Mini Instagram

The app built in lesson 3, as a real React + Vite project.

- `starter/` is step 1 (a clean Vite app). Use it if `npm create vite` gave you trouble.
- `completed/` is the finished app from the last step.

Both are generated from `../example.js` by `node build-example.js`, so they always
match the slides. Don't edit them by hand.

## Run it

You need [Node.js](https://nodejs.org) (the LTS version). In a terminal, inside
`starter/` or `completed/`:

```sh
npm install      # once: downloads React and Vite into node_modules/
npm run dev      # starts the app; open the localhost link it prints
```

The starter doesn't include React Router yet. Install it when you reach the routing
step:

```sh
npm install react-router
```

Stop the dev server with Ctrl+C.

## Files

| File | Job |
| --- | --- |
| `index.html` | The one HTML page, with an empty `<div id="root">` |
| `src/main.jsx` | Starts React and draws `<App />` inside `#root` |
| `src/App.jsx` | The root component: navbar + routes |
| `src/style.css` | Global CSS for every component |
| `src/data.js` | The profile and posts |
| `src/components/` | `Navbar`, `Home`, `Profile`, `Post`, `FollowButton` |

Post images come from picsum.photos, so they need an internet connection.
