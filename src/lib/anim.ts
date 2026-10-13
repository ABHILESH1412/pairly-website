import { onCleanup, onMount } from 'solid-js';
import { gsap, reducedMotion, SplitText } from './gsap';
import { onReveal } from './transition';

/**
 * Page animations. `setup` runs inside a gsap context scoped to the page root when the page is
 * revealed, and everything it created (tweens, ScrollTriggers, splits) is reverted on unmount.
 * Elements marked with data attributes get the shared treatments:
 *  - [data-split]  heading lines rise in when scrolled to (data-split="hero" plays immediately)
 *  - [data-fade]   fades up when scrolled to; children of [data-stagger] fade up in turn
 */
export function usePageAnim(root: () => HTMLElement | undefined, setup?: (el: HTMLElement) => void) {
  let ctx: gsap.Context | undefined;
  onMount(() => {
    const el = root();
    if (!el) return;
    ctx = gsap.context(() => {}, el);
    onReveal(() => {
      ctx?.add(() => {
        sharedReveals(el);
        setup?.(el);
      });
    });
  });
  onCleanup(() => ctx?.revert());
}

function sharedReveals(el: HTMLElement) {
  if (reducedMotion) return;

  el.querySelectorAll<HTMLElement>('[data-split]').forEach((node) => {
    const hero = node.dataset.split === 'hero';
    SplitText.create(node, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: hero ? 1.2 : 1,
          stagger: 0.09,
          ease: 'expo.out',
          delay: hero ? 0.15 : 0,
          scrollTrigger: hero ? undefined : { trigger: node, start: 'top 88%' },
        }),
    });
  });

  el.querySelectorAll<HTMLElement>('[data-fade]').forEach((node) => {
    const hero = node.dataset.fade === 'hero';
    gsap.from(node, {
      y: 40,
      autoAlpha: 0,
      duration: 1,
      delay: hero ? 0.45 : 0,
      scrollTrigger: hero ? undefined : { trigger: node, start: 'top 90%' },
    });
  });

  el.querySelectorAll<HTMLElement>('[data-stagger]').forEach((node) => {
    gsap.from(node.children, {
      y: 50,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.08,
      scrollTrigger: { trigger: node, start: 'top 85%' },
    });
  });
}

/** Buttons that lean toward the pointer. */
export function magnetic(el: HTMLElement, strength = 0.3) {
  if (reducedMotion || window.matchMedia('(hover: none)').matches) return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * strength);
    yTo((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  onCleanup(() => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
  });
}

/** Cards whose glow follows the pointer (reads --mx / --my in CSS). */
export function spotlight(el: HTMLElement) {
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  el.addEventListener('pointermove', move);
  onCleanup(() => el.removeEventListener('pointermove', move));
}
