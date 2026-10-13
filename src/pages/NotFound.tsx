import { ArrowLeft } from 'lucide-solid';
import { Link } from '../lib/router';
import { usePageAnim } from '../lib/anim';
import { gsap } from '../lib/gsap';

export default function NotFound() {
  let root!: HTMLDivElement;
  usePageAnim(() => root, () => {
    gsap.from('.nf-card', { x: (i) => (i ? 200 : -200), rotate: (i) => (i ? 20 : -20), autoAlpha: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 });
    gsap.to('.nf-card.a', { x: -24, rotate: -8, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
    gsap.to('.nf-card.b', { x: 24, rotate: 8, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
  });
  return (
    <div ref={root} class="page nf">
      <div class="nf-pair" aria-hidden="true">
        <div class="nf-card a" />
        <div class="nf-card b" />
      </div>
      <h1 data-split="hero">This page lost its pair.</h1>
      <p class="lead" data-fade="hero">The link you followed doesn’t lead anywhere. Let’s get you reconnected.</p>
      <div data-fade="hero">
        <Link href="/" class="btn btn-primary btn-lg">
          <ArrowLeft size={18} /> Back home
        </Link>
      </div>
    </div>
  );
}
