import { For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { ArrowRight, Check } from 'lucide-solid';
import { EXTRAS, FEATURES, MATRIX } from '../data/content';
import { spotlight, usePageAnim } from '../lib/anim';
import { gsap } from '../lib/gsap';
import { Link } from '../lib/router';
import DownloadButton, { PlatformIcon } from '../components/DownloadButton';

export default function Features() {
  let root!: HTMLDivElement;

  usePageAnim(() => root, () => {
    // Each feature row: the big index counts in, the icon spins into place, points follow.
    gsap.utils.toArray<HTMLElement>('.f-row').forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } });
      tl.from(row.querySelector('.f-num'), { yPercent: 100, autoAlpha: 0, duration: 1, ease: 'expo.out' })
        .from(row.querySelector('.f-icon'), { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(1.6)' }, 0.1)
        .from(row.querySelectorAll('.f-points li'), { x: 30, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, 0.2);
      gsap.to(row.querySelector('.f-num'), {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    gsap.from('.matrix tbody tr', {
      autoAlpha: 0,
      x: -20,
      stagger: 0.05,
      duration: 0.6,
      scrollTrigger: { trigger: '.matrix', start: 'top 80%' },
    });
    gsap.from('.matrix .tick', {
      scale: 0,
      stagger: 0.015,
      duration: 0.5,
      ease: 'back.out(2)',
      delay: 0.3,
      scrollTrigger: { trigger: '.matrix', start: 'top 80%' },
    });
  });

  return (
    <div ref={root} class="page">
      <section class="page-hero container">
        <span class="kicker" data-fade="hero">Features</span>
        <h1 data-split="hero">
          Everything your phone does, <span class="grad">now on your desk.</span>
        </h1>
        <p class="lead" data-fade="hero">
          Notifications, texts, calls, files, clipboard, screens, media and remote control, in both directions,
          between Android, Linux and Windows.
        </p>
      </section>

      <section class="container f-list">
        <For each={FEATURES}>
          {(f, i) => (
            <article class="f-row" classList={{ flip: i() % 2 === 1 }}>
              <div class="f-side">
                <span class="f-num">{String(i() + 1).padStart(2, '0')}</span>
                <div class="f-icon">
                  <Dynamic component={f.icon} size={30} />
                </div>
              </div>
              <div class="f-body">
                <h2 data-split>{f.title}</h2>
                <p class="f-blurb">{f.blurb}</p>
                <ul class="f-points">
                  <For each={f.points}>
                    {(p) => (
                      <li>
                        <Check size={16} />
                        <span>{p}</span>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </article>
          )}
        </For>
      </section>

      <section class="section container">
        <div class="section-head">
          <span class="kicker">And more</span>
          <h2 data-split>The little things that add up.</h2>
        </div>
        <div class="extras" data-stagger>
          <For each={EXTRAS}>
            {(x) => (
              <div class="extra" ref={spotlight}>
                <Dynamic component={x.icon} size={22} />
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </div>
            )}
          </For>
        </div>
      </section>

      <section class="section container">
        <div class="section-head">
          <span class="kicker">Compatibility</span>
          <h2 data-split>What each app can do.</h2>
        </div>
        <div class="matrix-wrap">
          <table class="matrix">
            <thead>
              <tr>
                <th>Feature</th>
                <th>
                  <PlatformIcon platform="linux" size={18} /> Linux
                </th>
                <th>
                  <PlatformIcon platform="windows" size={18} /> Windows
                </th>
                <th>
                  <PlatformIcon platform="android" size={18} /> Android
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={MATRIX}>
                {(r) => (
                  <tr>
                    <td>{r.feature}</td>
                    <For each={[r.linux, r.windows, r.android]}>
                      {(v) => (
                        <td>
                          {v === '✓' ? (
                            <span class="tick">
                              <Check size={14} />
                            </span>
                          ) : (
                            <span class="tick-note">{v}</span>
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section container band">
        <h2 data-split>Ready when you are.</h2>
        <div class="hero-ctas" data-fade>
          <DownloadButton large />
          <Link href="/guide" class="btn btn-ghost btn-lg">
            How to pair <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
