import { gsap, lenis, reducedMotion, ScrollTrigger } from './gsap';

type OverlayEls = {
  root: HTMLElement;
  accent: HTMLElement[];
  ink: HTMLElement[];
  center: HTMLElement;
  left: SVGPathElement;
  right: SVGPathElement;
  pulse: HTMLElement;
  chars: HTMLElement[];
  label: HTMLElement;
  count: HTMLElement;
  meta: HTMLElement;
};

let els: OverlayEls;
let covered = true;
let pending: (() => void)[] = [];

export function registerOverlay(e: OverlayEls) {
  els = e;
}

/** Run `cb` when the current page becomes visible: right away, or when the overlay starts lifting. */
export function onReveal(cb: () => void) {
  if (covered) pending.push(cb);
  else cb();
}

function flush() {
  covered = false;
  const q = pending;
  pending = [];
  q.forEach((f) => f());
  lenis.start();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

const fromCenter = { each: 0.055, from: 'center' } as const;

/** The opening sequence, played once when someone lands on the site. */
export async function playIntro() {
  const { root, accent, ink, center, left, right, pulse, chars, count, meta } = els;
  lenis.stop();

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

  if (reducedMotion) {
    await gsap.to(root, { autoAlpha: 0, duration: 0.4, onStart: flush });
    gsap.set(root, { autoAlpha: 1, pointerEvents: 'none' });
    gsap.set([...accent, ...ink], { scaleY: 0 });
    gsap.set(center, { autoAlpha: 0 });
    return;
  }

  const counter = { v: 0 };
  const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });

  tl.set(center, { autoAlpha: 1 })
    .set(left, { x: -30, drawSVG: '0%' })
    .set(right, { x: 30, drawSVG: '0%' })
    .set(chars, { yPercent: 115 })
    .set(meta, { autoAlpha: 0, y: 10 })
    .to(meta, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
    .to(counter, {
      v: 100,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, '0')),
    }, 0)
    .to(left, { drawSVG: '100%', duration: 1.1 }, 0.1)
    .to(right, { drawSVG: '100%', duration: 1.1 }, 0.25)
    .to([left, right], { x: 0, duration: 0.8, ease: 'expo.inOut' }, 1.05)
    .fromTo(pulse, { scale: 0.4, autoAlpha: 0.9 }, { scale: 3.2, autoAlpha: 0, duration: 1.1, ease: 'power2.out', immediateRender: false }, 1.75)
    .to(chars, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, 1.6)
    .to(meta, { autoAlpha: 0, duration: 0.4 }, 2.5)
    .to(center, { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 2.55)
    .add('lift', 2.95)
    .add(flush, 'lift')
    .to(ink, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.95, stagger: fromCenter }, 'lift')
    .to(accent, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.95, stagger: fromCenter }, 'lift+=0.12')
    .set(root, { pointerEvents: 'none' });

  await tl;
}

/** Covers the screen before a page change. `label` is shown in the middle. */
export async function cover(label: string) {
  const { root, accent, ink, center, left, right, chars, label: labelEl } = els;
  covered = true;
  lenis.stop();
  gsap.set(root, { pointerEvents: 'auto' });

  if (reducedMotion) {
    gsap.set([...accent, ...ink], { scaleY: 1 });
    gsap.set(center, { autoAlpha: 0 });
    await gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
    return;
  }

  labelEl.textContent = label;
  const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
  tl.set(chars, { yPercent: 115 })
    .set(center, { autoAlpha: 0, yPercent: 0 })
    .fromTo(accent, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.7, stagger: fromCenter }, 0)
    .fromTo(ink, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.7, stagger: fromCenter }, 0.1)
    .set(center, { autoAlpha: 1 }, 0.55)
    .fromTo(left, { x: -26, drawSVG: '0%' }, { x: 0, drawSVG: '100%', duration: 0.55, ease: 'power3.out' }, 0.55)
    .fromTo(right, { x: 26, drawSVG: '0%' }, { x: 0, drawSVG: '100%', duration: 0.55, ease: 'power3.out' }, 0.6)
    .fromTo(labelEl, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.65);
  await tl;
}

/** Lifts the overlay off the newly rendered page. */
export async function reveal() {
  const { root, accent, ink, center } = els;

  if (reducedMotion) {
    flush();
    await gsap.to(root, { autoAlpha: 0, duration: 0.25 });
    gsap.set(root, { autoAlpha: 1, pointerEvents: 'none' });
    gsap.set([...accent, ...ink], { scaleY: 0 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
  tl.to(center, { yPercent: -60, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0.1)
    .add(flush, 0.35)
    .to(ink, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, stagger: fromCenter }, 0.35)
    .to(accent, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, stagger: fromCenter }, 0.45)
    .set(root, { pointerEvents: 'none' });
  await tl;
}
