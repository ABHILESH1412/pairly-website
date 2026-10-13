import { createSignal } from 'solid-js';
import { reducedMotion } from './gsap';

export type ThemePref = 'system' | 'light' | 'dark';
type Theme = 'light' | 'dark';

// Kept in sync with the inline script in index.html, which applies the theme before first paint.
const KEY = 'pairly:theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

const [pref, setPrefSignal] = createSignal<ThemePref>(readPref());
const [systemDark, setSystemDark] = createSignal(media.matches);

const resolve = (p: ThemePref): Theme => (p === 'system' ? (systemDark() ? 'dark' : 'light') : p);
export const theme = () => resolve(pref());
export { pref };

function apply() {
  const t = theme();
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#07070d' : '#f7f7fc');
}

apply();
media.addEventListener('change', (e) => {
  setSystemDark(e.matches);
  apply();
});

/**
 * Switches the theme. When the visible theme changes, the new one grows out of `origin`
 * (the button that was pressed) as a circle.
 */
export function setPref(next: ThemePref, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable */
  }
  const commit = () => {
    setPrefSignal(next);
    apply();
  };
  if (resolve(next) === theme() || reducedMotion || !document.startViewTransition) return commit();

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  let done = false;
  const vt = document.startViewTransition(() => {
    done = true;
    commit();
  });
  // A page that can't paint (e.g. a hidden tab) never starts the transition; skipping it
  // still runs the update, so the theme always changes.
  setTimeout(() => !done && vt.skipTransition(), 400);
  vt.ready.then(() =>
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    ),
  );
}
