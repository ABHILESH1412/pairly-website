import { createEffect, createMemo, createSignal, on, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Overlay from './components/Overlay';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Download from './pages/Download';
import Security from './pages/Security';
import Guide from './pages/Guide';
import NotFound from './pages/NotFound';
import { path } from './lib/router';
import { scrollToTop } from './lib/gsap';
import { cover, playIntro, reveal } from './lib/transition';

const PAGES: Record<string, { component: () => any; label: string; title: string }> = {
  '/': { component: Home, label: 'Home', title: 'Pairly — your phone and your PCs, working as one' },
  '/features': { component: Features, label: 'Features', title: 'Features — Pairly' },
  '/security': { component: Security, label: 'Security', title: 'Security — Pairly' },
  '/guide': { component: Guide, label: 'Guide', title: 'Guide — Pairly' },
  '/download': { component: Download, label: 'Download', title: 'Download — Pairly' },
};
const NOT_FOUND = { component: NotFound, label: 'Lost', title: 'Not found — Pairly' };

const pageFor = (p: string) => PAGES[p] ?? NOT_FOUND;

export default function App() {
  // `path` is where the user wants to be; `shown` changes only while the curtain is down.
  const [shown, setShown] = createSignal(path());
  const page = createMemo(() => pageFor(shown()));
  let target = path();
  let busy = false;

  async function run() {
    if (busy) return;
    busy = true;
    while (target !== shown()) {
      const next = target;
      await cover(pageFor(next).label);
      setShown(next);
      scrollToTop();
      await new Promise((r) => requestAnimationFrame(r));
      await reveal();
    }
    busy = false;
  }

  createEffect(on(path, (p) => {
    target = p;
    run();
  }, { defer: true }));

  createEffect(() => (document.title = page().title));

  onMount(() => requestAnimationFrame(() => playIntro()));

  return (
    <>
      <Overlay />
      <Nav current={shown()} />
      <main>
        <Dynamic component={page().component} />
      </main>
      <Footer />
    </>
  );
}
