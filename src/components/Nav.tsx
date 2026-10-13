import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from 'solid-js';
import { Menu, X } from 'lucide-solid';
import { Link, path } from '../lib/router';
import { gsap, lenis } from '../lib/gsap';
import { latest, REPO_URL } from '../lib/release';
import { LogoMark } from './Logo';
import { GitHubIcon } from './BrandIcons';
import ThemeToggle from './ThemeToggle';

export const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/security', label: 'Security' },
  { href: '/guide', label: 'Guide' },
  { href: '/download', label: 'Download' },
];

export default function Nav(props: { current: string }) {
  let nav!: HTMLElement;
  let pill!: HTMLDivElement;
  let links!: HTMLDivElement;
  let menu!: HTMLDivElement;
  const [open, setOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  // The pill glides under whichever link matches the shown page.
  const placePill = (instant = false) => {
    const active = links.querySelector<HTMLElement>(`[data-href="${props.current}"]`);
    if (!active) return gsap.to(pill, { autoAlpha: 0, duration: 0.3 });
    const box = { x: active.offsetLeft, width: active.offsetWidth, autoAlpha: 1 };
    instant ? gsap.set(pill, box) : gsap.to(pill, { ...box, duration: 0.6, ease: 'expo.out' });
  };

  onMount(() => {
    document.fonts.ready.then(() => placePill(true));
    let last = 0;
    const onScroll = ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 20);
      if (!open()) {
        const hide = scroll > last && scroll > 160;
        gsap.to(nav, { yPercent: hide ? -130 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      }
      last = scroll;
    };
    lenis.on('scroll', onScroll);
    const onResize = () => placePill(true);
    window.addEventListener('resize', onResize);
    onCleanup(() => {
      lenis.off('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    });
  });

  createEffect(on(() => props.current, () => {
    placePill();
    gsap.set(nav, { yPercent: 0 });
  }, { defer: true }));

  // Close the mobile menu as soon as a new page is asked for.
  createEffect(on(path, () => setOpen(false), { defer: true }));

  createEffect(on(open, (isOpen) => {
    if (isOpen) {
      lenis.stop();
      gsap.timeline()
        .set(menu, { display: 'flex' })
        .fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'power4.inOut' })
        .from(menu.querySelectorAll('.m-link'), { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.7, ease: 'expo.out' }, 0.35);
    } else if (menu.style.display === 'flex') {
      lenis.start();
      gsap.to(menu, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'power4.inOut', onComplete: () => gsap.set(menu, { display: 'none' }) });
    }
  }, { defer: true }));

  return (
    <>
      <header class="nav" classList={{ 'nav--scrolled': scrolled() || open() }} ref={nav}>
        <div class="nav-inner">
          <Link href="/" class="brand" aria-label="Pairly home">
            <LogoMark size={34} />
            <span>Pairly</span>
            <Show when={latest()}>
              <span class="brand-tag">{latest()!.tag}</span>
            </Show>
          </Link>

          <nav class="nav-links" ref={links}>
            <div class="nav-pill" ref={pill} />
            <For each={NAV_LINKS}>
              {(l) => (
                <Link href={l.href} data-href={l.href} classList={{ active: props.current === l.href }}>
                  {l.label}
                </Link>
              )}
            </For>
          </nav>

          <div class="nav-actions">
            <ThemeToggle class="nav-theme" />
            <a class="icon-btn" href={REPO_URL} target="_blank" rel="noopener" aria-label="Pairly on GitHub">
              <GitHubIcon size={20} />
            </a>
            <Link href="/download" class="btn btn-primary btn-sm nav-cta">
              Get Pairly
            </Link>
            <button class="icon-btn menu-btn" onClick={() => setOpen(!open())} aria-label={open() ? 'Close menu' : 'Open menu'}>
              <Show when={open()} fallback={<Menu size={22} />}>
                <X size={22} />
              </Show>
            </button>
          </div>
        </div>
      </header>

      <div class="m-menu" ref={menu}>
        <nav>
          <For each={[{ href: '/', label: 'Home' }, ...NAV_LINKS]}>
            {(l, i) => (
              <div class="m-mask">
                <Link href={l.href} class="m-link" classList={{ active: props.current === l.href }}>
                  <span class="m-index">0{i() + 1}</span>
                  {l.label}
                </Link>
              </div>
            )}
          </For>
        </nav>
        <ThemeToggle class="m-theme" labels />
        <a class="m-link m-gh" href={REPO_URL} target="_blank" rel="noopener">
          <GitHubIcon size={18} /> View on GitHub
        </a>
      </div>
    </>
  );
}
