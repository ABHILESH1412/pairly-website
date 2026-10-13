import { For, Show } from 'solid-js';
import { ArrowRight, ArrowUpRight, BadgeCheck, EyeOff, KeyRound, Lock, Pause, QrCode, ShieldCheck, Smartphone } from 'lucide-solid';
import { Dynamic } from 'solid-js/web';
import DeviceScene from '../components/DeviceScene';
import DownloadButton, { PlatformIcon } from '../components/DownloadButton';
import { Link } from '../lib/router';
import { magnetic, spotlight, usePageAnim } from '../lib/anim';
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap';
import { FEATURES, LINKS } from '../data/content';
import { formatSize, latest, RELEASES_URL, type Platform } from '../lib/release';

const MARQUEE = ['Notifications', 'Texts', 'Calls', 'Files', 'Clipboard', 'Screens', 'Media', 'Remote control', 'Find my phone'];

const NOTIFS: [string, string, string, boolean?][] = [
  ['WhatsApp', 'Sam', 'Pushed the fix, can you check?', true],
  ['Gmail', 'Your order has shipped', 'Arriving Thursday'],
  ['Phone', 'Missed call', 'Mum · 2 min ago'],
];

const PLATFORMS: { id: Platform; name: string; req: string; file: string }[] = [
  { id: 'android', name: 'Android', req: 'Android 8 or newer', file: '.apk' },
  { id: 'windows', name: 'Windows', req: 'Windows 10 or 11 · x64', file: 'setup.exe' },
  { id: 'linux', name: 'Linux', req: 'GTK 4 · libadwaita · x86_64', file: '.tar.gz' },
];

const STEPS = [
  { icon: Smartphone, title: 'Install on both', text: 'Get Pairly on your phone and your PC from the latest release.' },
  { icon: QrCode, title: 'Scan the code', text: 'On the PC, click Pair a New Device. Scan the QR code with the phone.' },
  { icon: ShieldCheck, title: 'You’re paired', text: 'Keys are pinned, the link is encrypted, and every feature lights up.' },
];

export default function Home() {
  let root!: HTMLDivElement;

  usePageAnim(() => root, () => {
    const mm = gsap.matchMedia();

    // Eyebrow + hero button row.
    gsap.from('.hero-eyebrow', { y: 20, autoAlpha: 0, duration: 0.8, delay: 0.1 });

    // Marquee: drifts on its own, speeds up and skews with scroll velocity.
    const track = root.querySelector<HTMLElement>('.marquee-track')!;
    const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
    ScrollTrigger.create({
      trigger: '.marquee',
      onUpdate: (self) => {
        const v = self.getVelocity() / 300;
        gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(v), 6), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
        skew(gsap.utils.clamp(-12, 12, -v * 2));
        gsap.delayedCall(0.2, () => skew(0));
      },
    });

    // Feature bento.
    gsap.from('.bento-card', {
      y: 80,
      autoAlpha: 0,
      rotateX: -12,
      transformOrigin: '50% 100%',
      stagger: { each: 0.07, grid: 'auto', from: 'start' },
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.bento', start: 'top 80%' },
    });

    gsap.from('.notif', {
      y: 40,
      autoAlpha: 0,
      scale: 0.9,
      stagger: 0.15,
      duration: 0.9,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.bento', start: 'top 70%' },
    });

    // Connections: pinned horizontal track on wide screens.
    mm.add('(min-width: 900px)', () => {
      const rail = root.querySelector<HTMLElement>('.links-rail')!;
      const dist = () => rail.scrollWidth - window.innerWidth + 80;
      gsap.to(rail, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.links-pin',
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    gsap.from('.speed i', {
      scaleX: 0,
      transformOrigin: 'left',
      stagger: 0.06,
      duration: 0.8,
      scrollTrigger: { trigger: '.links-pin', start: 'top 60%' },
    });

    // Steps: the line draws as you scroll.
    gsap.fromTo('.steps-line i', { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true },
    });
    gsap.from('.step', {
      y: 60,
      autoAlpha: 0,
      stagger: 0.15,
      duration: 1,
      scrollTrigger: { trigger: '.steps', start: 'top 75%' },
    });

    // Privacy statement: each word lights up as it scrolls past.
    const statement = SplitText.create('.statement', { type: 'words' });
    gsap.fromTo(statement.words, { opacity: 0.12 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
    });

    // Platform cards.
    gsap.from('.plat-card', {
      y: 100,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.plats', start: 'top 80%' },
    });

    // Final CTA: the big word scales into place.
    gsap.from('.cta-word', {
      scale: 0.6,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.cta', start: 'top 75%' },
    });
  });

  return (
    <div ref={root} class="page home">
      {/* Hero */}
      <section class="hero">
        <div class="hero-bg">
          <div class="blob b1" />
          <div class="blob b2" />
          <div class="blob b3" />
          <div class="grid-lines" />
        </div>
        <div class="container hero-copy">
          <Link href="/download" class="hero-eyebrow">
            <span class="pulse-dot" />
            <Show when={latest()} fallback={<span>Free &amp; open source</span>}>
              <span>
                <b>{latest()!.name}</b> is out
              </span>
            </Show>
            <ArrowRight size={14} />
          </Link>
          <h1 class="hero-title" data-split="hero">
            Your phone and your PC, <span class="grad">working as one.</span>
          </h1>
          <p class="hero-sub" data-fade="hero">
            Pairly links your Android phone with your Linux and Windows PCs. Notifications, texts, calls,
            files, clipboard, media and screens, all end-to-end encrypted. No accounts, no cloud.
          </p>
          <div class="hero-ctas" data-fade="hero">
            <DownloadButton large />
            <Link href="/features" class="btn btn-ghost btn-lg" ref={(el: HTMLElement) => magnetic(el, 0.2)}>
              Explore features <ArrowRight size={18} />
            </Link>
          </div>
          <div class="hero-plats" data-fade="hero">
            <span>Available for</span>
            <PlatformIcon platform="android" size={16} /> Android
            <PlatformIcon platform="windows" size={16} /> Windows
            <PlatformIcon platform="linux" size={16} /> Linux
          </div>
        </div>
        <div class="container">
          <DeviceScene />
        </div>
      </section>

      {/* Marquee */}
      <section class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <For each={[...MARQUEE, ...MARQUEE]}>
            {(w, i) => (
              <span classList={{ outline: i() % 2 === 1 }}>
                {w}
                <em>✦</em>
              </span>
            )}
          </For>
        </div>
      </section>

      {/* Features */}
      <section class="section container">
        <div class="section-head">
          <span class="kicker">01 — Everything, both ways</span>
          <h2 data-split>Two devices. One flow.</h2>
          <p data-fade>
            Pick up where you left off on any screen. Pairly brings what’s on your phone to your desk, and puts
            your PC in your pocket.
          </p>
        </div>
        <div class="bento">
          <For each={FEATURES}>
            {(f, i) => (
              <article class={`bento-card bc${i()}`} ref={spotlight}>
                <div class="bento-icon">
                  <Dynamic component={f.icon} size={22} />
                </div>
                <Show when={i() === 0}>
                  <div class="notif-stack" aria-hidden="true">
                    <For each={NOTIFS}>
                      {(n) => (
                        <div class="notif">
                          <span class="notif-app">{n[0]}</span>
                          <b>{n[1]}</b>
                          <p>{n[2]}</p>
                          <Show when={n[3]}>
                            <div class="notif-actions">
                              <span>Reply</span>
                              <span>Mark as read</span>
                            </div>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                <h3>{f.title}</h3>
                <p>{f.blurb}</p>
              </article>
            )}
          </For>
        </div>
        <div class="center-row" data-fade>
          <Link href="/features" class="btn btn-ghost">
            See every feature <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Connections */}
      <section class="links-pin">
        <div class="links-inner">
          <div class="container section-head">
            <span class="kicker">02 — Always connected</span>
            <h2 data-split>Home, nearby, or anywhere.</h2>
            <p data-fade>Pairly always uses the best link it has, and moves between them without losing anything.</p>
          </div>
          <div class="links-rail">
            <For each={LINKS}>
              {(l, i) => (
                <article class="link-card" ref={spotlight}>
                  <div class="link-num">0{i() + 1}</div>
                  <div class="link-icon">
                    <Dynamic component={l.icon} size={34} />
                  </div>
                  <span class="chip">{l.tag}</span>
                  <h3>{l.name}</h3>
                  <p>{l.when}</p>
                  <div class="speed" aria-label={`Speed ${l.speed} of 3`}>
                    <For each={[1, 2, 3]}>{(n) => <i classList={{ on: n <= l.speed }} />}</For>
                  </div>
                </article>
              )}
            </For>
            <article class="link-card link-note">
              <h3>Screen sharing needs the same Wi-Fi.</h3>
              <p>Everything else works over all three. Leave home and your devices simply stay connected.</p>
              <Link href="/guide" class="text-link">
                Set up your free relay <ArrowUpRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section class="section container">
        <div class="section-head">
          <span class="kicker">03 — Pair in seconds</span>
          <h2 data-split>Scan once. Linked for good.</h2>
        </div>
        <div class="steps">
          <div class="steps-line">
            <i />
          </div>
          <For each={STEPS}>
            {(s, i) => (
              <div class="step">
                <div class="step-badge">
                  <Dynamic component={s.icon} size={22} />
                  <span>{i() + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            )}
          </For>
        </div>
      </section>

      {/* Privacy */}
      <section class="section privacy">
        <div class="container">
          <span class="kicker">04 — Private by design</span>
          <p class="statement">
            No accounts. No tracking. No ads. No cloud of ours. Just your devices, talking to each other over
            an end-to-end encrypted link that only they can read.
          </p>
          <div class="privacy-grid" data-stagger>
            <div class="p-item">
              <Lock size={20} />
              <b>Noise protocol</b>
              <span>Keys pinned at pairing, renewed every hour.</span>
            </div>
            <div class="p-item">
              <KeyRound size={20} />
              <b>Only your devices</b>
              <span>QR code or a matching six-digit code to pair.</span>
            </div>
            <div class="p-item">
              <EyeOff size={20} />
              <b>A blind relay</b>
              <span>It only ever sees encrypted, padded traffic.</span>
            </div>
            <div class="p-item">
              <BadgeCheck size={20} />
              <b>Signed updates</b>
              <span>Tampered downloads are refused, always.</span>
            </div>
            <div class="p-item">
              <Pause size={20} />
              <b>Pause anytime</b>
              <span>Cut a device off at the connection itself.</span>
            </div>
          </div>
          <div class="center-row" data-fade>
            <Link href="/security" class="btn btn-ghost">
              How Pairly keeps you safe <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section class="section container">
        <div class="section-head">
          <span class="kicker">05 — Get Pairly</span>
          <h2 data-split>Made for the devices you already have.</h2>
          <p data-fade>
            Every download comes straight from the latest release on GitHub
            <Show when={latest()}> ({latest()!.tag})</Show>. After the first install, Pairly updates itself.
          </p>
        </div>
        <div class="plats">
          <For each={PLATFORMS}>
            {(p) => {
              const asset = () => latest()?.files[p.id];
              return (
                <article class={`plat-card plat-${p.id}`} ref={spotlight}>
                  <div class="plat-icon">
                    <PlatformIcon platform={p.id} size={40} />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.req}</p>
                  <div class="plat-meta">
                    <span>{asset()?.name ?? p.file}</span>
                    <Show when={asset()}>
                      <span>{formatSize(asset()!.size)}</span>
                    </Show>
                  </div>
                  <a
                    class="btn btn-primary"
                    href={asset()?.url ?? RELEASES_URL}
                    {...(asset() ? { download: '' } : { target: '_blank', rel: 'noopener' })}
                  >
                    Download <ArrowRight size={16} />
                  </a>
                  <Link href="/download" class="text-link">
                    Install steps
                  </Link>
                </article>
              );
            }}
          </For>
        </div>
      </section>

      {/* CTA */}
      <section class="cta">
        <div class="cta-glow" />
        <div class="container cta-inner">
          <h2 class="cta-word">Pair up.</h2>
          <p data-fade>Free, open source, and yours. It takes about a minute.</p>
          <div class="hero-ctas" data-fade>
            <DownloadButton large />
            <Link href="/guide" class="btn btn-ghost btn-lg">
              Read the guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
