import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { BatteryMedium, Bell, Clipboard, FolderOpen, Lock, MessageSquare, MousePointer2, Pause, Phone, Presentation, SkipBack, SkipForward, Wifi } from 'lucide-solid';
import { gsap, reducedMotion } from '../lib/gsap';
import { onReveal } from '../lib/transition';
import { LogoMark } from './Logo';

const TOASTS = [
  { icon: MessageSquare, app: 'Messages', who: 'Maya', text: 'Running 5 min late, save me a seat!' },
  { icon: Phone, app: 'Incoming call', who: 'Mum', text: 'Answer · Speaker · Reject' },
  { icon: FolderOpen, app: 'Files', who: 'IMG_2041.jpg', text: 'Received in Downloads/Pairly' },
  { icon: Bell, app: 'Calendar', who: 'Stand-up', text: 'Starts in 10 minutes' },
];

const BEAM = 'M 228 330 C 330 200, 400 380, 540 215';

/** A phone and a laptop, linked by a beam that carries notifications, files and clipboard. */
export default function DeviceScene() {
  let root!: HTMLDivElement;
  let toast!: HTMLDivElement;
  const [idx, setIdx] = createSignal(0);
  const t = () => TOASTS[idx()];

  onMount(() => {
    const ctx = gsap.context(() => {}, root);
    onCleanup(() => ctx.revert());

    onReveal(() =>
      ctx.add(() => {
        if (reducedMotion) return;
        const intro = gsap.timeline({ delay: 0.5 });
        intro
          .from('.sc-laptop', { y: 120, autoAlpha: 0, rotateX: 18, duration: 1.4, ease: 'expo.out' })
          .from('.sc-phone', { x: -140, y: 60, autoAlpha: 0, rotate: -14, duration: 1.4, ease: 'expo.out' }, 0.15)
          .from('.sc-beam-path', { drawSVG: '0%', duration: 1.2, ease: 'power2.inOut' }, 0.7)
          .from('.sc-chip', { scale: 0.6, autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.8, ease: 'back.out(1.8)' }, 1.0)
          .from('.sc-tile', { y: 16, autoAlpha: 0, stagger: 0.05, duration: 0.6 }, 0.8);

        // Packets travelling from the phone to the PC, forever.
        gsap.utils.toArray<SVGCircleElement>('.sc-packet').forEach((dot, i) => {
          gsap.to(dot, {
            motionPath: { path: '.sc-beam-core', align: '.sc-beam-core', alignOrigin: [0.5, 0.5] },
            duration: 2.4,
            ease: 'none',
            repeat: -1,
            delay: 1.6 + i * 0.8,
            keyframes: { opacity: [0, 1, 1, 0] },
          });
        });

        // A new notification lands on the PC every few seconds.
        const cycle = () => {
          gsap.timeline()
            .to(toast, { x: 40, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
            .call(() => setIdx((i) => (i + 1) % TOASTS.length))
            .fromTo(toast, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' })
            .fromTo('.sc-recv', { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 1, duration: 0.2 }, '<');
        };
        gsap.fromTo(toast, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, delay: 2.2, ease: 'expo.out' });
        const loop = gsap.delayedCall(5.2, function again() {
          cycle();
          loop.restart(true);
        });

        gsap.to('.sc-chip', { y: '-=10', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.6 } });

        // Pointer parallax.
        if (window.matchMedia('(hover: hover)').matches) {
          const layers = [
            { el: '.sc-laptop', depth: 10 },
            { el: '.sc-phone', depth: 26 },
            { el: '.sc-chips', depth: 40 },
          ].map((l) => ({
            x: gsap.quickTo(l.el, 'x', { duration: 1, ease: 'power3.out' }),
            y: gsap.quickTo(l.el, 'y', { duration: 1, ease: 'power3.out' }),
            depth: l.depth,
          }));
          const move = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.x(nx * l.depth);
              l.y(ny * l.depth);
            });
          };
          window.addEventListener('pointermove', move);
          onCleanup(() => window.removeEventListener('pointermove', move));
        }

        // The whole scene settles back as the hero scrolls away.
        gsap.to('.sc-stage', {
          rotateX: 12,
          scale: 0.92,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 40%', end: 'bottom top', scrub: true },
        });
      }),
    );
  });

  return (
    <div class="scene" ref={root} aria-hidden="true">
      <div class="sc-glow" />
      <div class="sc-stage">
        <div class="sc-laptop">
          <div class="sc-lid">
            <div class="sc-screen">
              <div class="pc-bar">
                <span /><span /><span />
                <em>Pairly</em>
              </div>
              <div class="pc-body">
                <aside class="pc-side">
                  <div class="pc-dev active">
                    <i class="dot-live" />
                    <div>
                      <b>Pixel 8</b>
                      <small>Wi-Fi · 82%</small>
                    </div>
                  </div>
                  <div class="pc-dev">
                    <i />
                    <div>
                      <b>work-laptop</b>
                      <small>Relay</small>
                    </div>
                  </div>
                  <div class="pc-add">+ Pair a New Device</div>
                </aside>
                <section class="pc-main">
                  <div class="pc-head">
                    <div>
                      <h5>Pixel 8</h5>
                      <small><Wifi size={11} /> Connected · <BatteryMedium size={11} /> 82%</small>
                    </div>
                    <span class="pc-badge"><Lock size={10} /> Encrypted</span>
                  </div>
                  <div class="pc-grid">
                    <For each={[
                      ['Messages', MessageSquare],
                      ['Browse Files', FolderOpen],
                      ['Send Files', FolderOpen],
                      ['Clipboard', Clipboard],
                      ['Ring Phone', Bell],
                      ['Calls', Phone],
                    ] as const}>
                      {([label, Icon]) => (
                        <div class="sc-tile">
                          <Icon size={14} />
                          <span>{label}</span>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="pc-msgs">
                    <div class="bubble in">Did you get the photos?</div>
                    <div class="bubble out">Yep, already on my desktop 🎉</div>
                  </div>
                </section>
              </div>
              <div class="sc-toast" ref={toast}>
                <div class="sc-toast-icon"><Dynamic component={t().icon} size={16} /></div>
                <div>
                  <small>{t().app} · now</small>
                  <b>{t().who}</b>
                  <p>{t().text}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="sc-base" />
        </div>

        <div class="sc-phone">
          <div class="ph-notch" />
          <div class="ph-screen">
            <div class="ph-status">
              <span>9:41</span>
              <span class="ph-icons"><Wifi size={10} /> <BatteryMedium size={11} /></span>
            </div>
            <div class="ph-head">
              <LogoMark size={22} />
              <div>
                <b>arch-desktop</b>
                <small><i class="dot-live" /> Connected</small>
              </div>
            </div>
            <div class="ph-tiles">
              <div class="sc-tile"><MousePointer2 size={13} /> Touchpad</div>
              <div class="sc-tile"><Presentation size={13} /> Presenter</div>
              <div class="sc-tile"><FolderOpen size={13} /> Files</div>
              <div class="sc-tile"><Lock size={13} /> Lock PC</div>
            </div>
            <div class="ph-media sc-recv">
              <div class="ph-art" />
              <div class="ph-track">
                <b>Midnight City</b>
                <small>Playing on arch-desktop</small>
                <div class="ph-prog"><i /></div>
              </div>
              <div class="ph-ctrl">
                <SkipBack size={12} />
                <Pause size={14} />
                <SkipForward size={12} />
              </div>
            </div>
          </div>
        </div>

        <svg class="sc-beam" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="beam-g" x1="0" x2="1">
              <stop offset="0" stop-color="#8ab4ff" />
              <stop offset="1" stop-color="#b48cff" />
            </linearGradient>
            <filter id="beam-blur">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path class="sc-beam-path sc-beam-glow" d={BEAM} stroke="url(#beam-g)" stroke-width="10" fill="none" opacity="0.5" filter="url(#beam-blur)" />
          <path class="sc-beam-path sc-beam-core" d={BEAM} stroke="url(#beam-g)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <For each={[0, 1, 2]}>{() => <circle class="sc-packet" r="5.5" fill="#fff" opacity="0" />}</For>
        </svg>

        <div class="sc-chips">
          <div class="sc-chip c1"><Clipboard size={14} /> Clipboard synced</div>
          <div class="sc-chip c2"><Lock size={14} /> Noise · ChaCha20-Poly1305</div>
          <div class="sc-chip c3"><FolderOpen size={14} /> holiday.mp4 → PC</div>
        </div>
      </div>
    </div>
  );
}
