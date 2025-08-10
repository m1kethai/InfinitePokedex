# [Infinite Pokedex](https://catchemall.mikethai.dev)

A reponsive, single-page React web app, featuring a virtualized infinite scroll list component that contains every single Pokemon to date, with each row displaying the Pokemon name, ID, sprite & types.

![pokedex-readme-demo](https://user-images.githubusercontent.com/15115669/228356192-4e5a56b0-7ca9-4709-af51-4f75aef7ec3d.gif)

***
## Frameworks/Libraries:

- React
- Vite
- TypeScript
- Node.js

- [@tanstack/react-query](https://tanstack.com/query) - for fetching, prefetching, data caching & memoization, and its powerful built-in `useInfiniteQuery` Hook
- [@tanstack/react-virtual](https://tanstack.com/virtual/v3) - to virtualize the large collection of pokemon data and allow the infinite list component tree to be rendered very quickly and efficiently, resulting in a smooth scrolling experience
- Sass
- Bulma

## Local Installation/Usage

1) Clone this repository to your machine
2) Install dependencies by running `yarn` or `npm i` in the root directory
3) Start the local development server with `yarn dev`
4) Open your browser and go to http://localhost:5173 (or http://127.0.0.1:5173)
- `react-query` comes bundled with a great set of built-in dev tools, which are currently enabled by default in the local dev environment. Click on the flower button in the bottom-left corner to see what/when client-side cache operations are being performed.

- Feel free to mess around with these params to see how they each affect the data fetching/rendering performance:
  - `overscan` - the number of list items to render both above and below the the currently visible list items
  - `FETCH_LIMIT` - the number of items to be fetched in each new set of Pokemon data
  - `PREFETCH_IDX` - the number of rows from the bottom of the currently rendered list which, when its position is reached, triggers the next batch of Pokemon to be prefetched (higher values generally result in a longer load-times)

## Live Demo
Check out the live demo at <https://catchemall.mikethai.dev>
***
*Thanks to [pokeapi.co](pokeapi.co) for providing the free Pokemon data API.*
