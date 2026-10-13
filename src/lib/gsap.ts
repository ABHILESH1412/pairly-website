import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const lenis = new Lenis({ duration: 1.15, smoothWheel: !reducedMotion });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

export function scrollToTop() {
  lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export { gsap, ScrollTrigger, SplitText };

if (import.meta.env.DEV) Object.assign(window, { lenis, gsap, ScrollTrigger });
