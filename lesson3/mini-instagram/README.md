# Mini Instagram

The app built in lesson 3, as a real React + TypeScript + Vite project. The config files
match `npm create vite@latest -- --template react-ts`.

- `starter/` is step 1 (a clean Vite app). Use it if `npm create vite` gave you trouble.
- `completed/` is the finished app: typed data, components, likes, follow, favorites,
  search, and tag filters.

Both are generated from `../example.js` by `node build-example.js`, so they always
match the slides. Don't edit them by hand.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer (the LTS version is fine). In a
terminal, inside `starter/` or `completed/`:

```sh
npm install      # once: downloads React, TypeScript and Vite into node_modules/
npm run dev      # starts the app; open the localhost link it prints
npm run build    # type-checks everything, then builds dist/ for deploying
```

`npm run dev` doesn't check types (it only removes them). VS Code shows type errors as
you type, and `npm run build` stops if there are any.

Stop the dev server with Ctrl+C.

## Files

| File | Job |
| --- | --- |
| `index.html` | The one HTML page, with an empty `<div id="root">` |
| `src/main.tsx` | Starts React and draws `<App />` inside `#root` |
| `src/App.tsx` | The root component: owns the favorites, search and tag state |
| `src/types.ts` | The shapes of the data: `Tag`, `Post`, `User` (and `TAGS`) |
| `src/data.ts` | The profile and posts, typed as `User` |
| `src/index.css` | Global CSS for every component |
| `src/components/` | `Profile`, `PostCard`, `Section`, `FollowButton` |

Post images come from picsum.photos, so they need an internet connection.

## Deploy

`npm run build` makes a `dist/` folder. For GitHub Pages, first add
`base: "/your-repo-name/"` to the config in `vite.config.ts`. For Netlify, drag `dist/`
onto <https://app.netlify.com/drop>.
