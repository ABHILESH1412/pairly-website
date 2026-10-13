# Pairly website

The website for [Pairly](https://github.com/ABHILESH1412/pairly), built with Solid, Vite and GSAP.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build     # outputs to dist/
npm run preview   # serves the build locally
```

`dist/404.html` is a copy of `index.html`, so static hosts such as GitHub Pages serve the app for
deep links like `/download`. To host under a sub-path (for example `/pairly-website/`), build with
`npx vite build --base=/pairly-website/`.

## How it works

- **Downloads** come from the latest GitHub release, fetched at runtime from the GitHub API
  (`src/lib/release.ts`). The visitor's OS is detected so the main button downloads the right file
  (APK, Windows installer or Linux tarball). If GitHub can't be reached, the buttons open the
  latest release page instead.
- **Transitions** (`src/lib/transition.ts`, `src/components/Overlay.tsx`): an opening sequence plays
  on first load, and a curtain covers the screen on every page change, including back and forward.
  Pages register their entrance animations with `usePageAnim` (`src/lib/anim.ts`), which run as
  the curtain lifts and are cleaned up when the page unmounts.
- **Smooth scrolling** uses Lenis, synced with GSAP ScrollTrigger (`src/lib/gsap.ts`).
- Animations are shortened to simple fades for visitors who prefer reduced motion.
