import { For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { ArrowUpRight, BadgeCheck, EyeOff, FolderLock, Handshake, KeyRound, Lock, Pause, UserX } from 'lucide-solid';
import { spotlight, usePageAnim } from '../lib/anim';
import { gsap } from '../lib/gsap';
import { SECURITY_DOC_URL } from '../lib/release';

const PILLARS = [
  { icon: Lock, title: 'End-to-end encryption', text: 'Every connection is a Noise session with keys pinned at pairing and renewed every hour, over Wi-Fi, Bluetooth and the relay alike.' },
  { icon: Handshake, title: 'Only your devices', text: 'Pairing needs the QR code, or both people confirming the same six-digit code. A stranger on your Wi-Fi can’t connect, watch your screen or read anything.' },
  { icon: Pause, title: 'Pause means off', text: 'Pausing a device cuts it off at the connection itself, not just in the app, until you resume it.' },
  { icon: EyeOff, title: 'The relay is blind', text: 'Your relay only joins two encrypted streams. It sees encrypted, padded traffic, never content.' },
  { icon: KeyRound, title: 'Secrets at rest', text: 'Keys live in your keyring on Linux, the Windows data folder, or the Android Keystore.' },
  { icon: FolderLock, title: 'File sharing is opt-in', text: 'Off by default on PCs, read-only unless you allow changes, and hidden files like .ssh are never shared.' },
  { icon: BadgeCheck, title: 'Signed updates', text: 'Updates install only if they carry the project’s signature, so a tampered download or hijacked account can’t push anything.' },
  { icon: UserX, title: 'Nothing of ours', text: 'No accounts, no tracking, no ads, and no cloud of ours. Your devices talk to each other, and that’s it.' },
];

const THREATS = [
  { who: 'Someone on the same Wi-Fi', reads: false, controls: false, why: 'Every link is a Noise session with fresh ephemeral keys; unpaired keys are refused.' },
  { who: 'The relay operator', reads: false, controls: false, why: 'The relay only joins two Noise streams by room ID.' },
  { who: 'A man-in-the-middle while pairing', reads: false, controls: false, why: 'The QR secret and pinned key, or a commit/reveal code check: a 1-in-a-million guess per attempt.' },
  { who: 'Someone who steals a key later', reads: false, controls: true, why: 'Past traffic stays safe thanks to forward secrecy. Unpair the device to lock them out.' },
  { who: 'Someone nearby over Bluetooth', reads: false, controls: false, why: 'Bluetooth carries the same Noise sessions. Pairing still needs the code or QR.' },
];

const SPECS = [
  ['Cipher', 'Noise_*_25519_ChaChaPoly_BLAKE2s'],
  ['Pairing (QR)', 'Noise_XXpsk3 · one-time 128-bit secret · expires in 5 min'],
  ['Pairing (code)', 'Noise_XX + commit/reveal six-digit check'],
  ['Rekeying', 'Every 1 hour or 1 GiB, per direction'],
  ['Handshake limits', '16 pending · 10 s timeout · 3 prompts at once'],
];

export default function Security() {
  let root!: HTMLDivElement;

  usePageAnim(() => root, () => {
    // The shield: rings breathe, the lock settles in.
    gsap.from('.shield-ring', { scale: 0.4, autoAlpha: 0, stagger: 0.15, duration: 1.4, ease: 'expo.out', delay: 0.3 });
    gsap.to('.shield-ring', { scale: 1.06, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4, delay: 1.6 });
    gsap.from('.shield-core', { scale: 0, rotate: -45, duration: 1.2, ease: 'back.out(1.7)', delay: 0.5 });

    gsap.from('.pillar', {
      y: 60,
      autoAlpha: 0,
      stagger: { each: 0.08, grid: 'auto' },
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.pillars', start: 'top 80%' },
    });

    gsap.utils.toArray<HTMLElement>('.threat').forEach((row) => {
      gsap.from(row, { x: -40, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: row, start: 'top 90%' } });
    });

    gsap.from('.spec', {
      autoAlpha: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.7,
      scrollTrigger: { trigger: '.specs', start: 'top 85%' },
    });
  });

  return (
    <div ref={root} class="page">
      <section class="page-hero container sec-hero">
        <div>
          <span class="kicker" data-fade="hero">Security & privacy</span>
          <h1 data-split="hero">
            Private by design, <span class="grad">not by promise.</span>
          </h1>
          <p class="lead" data-fade="hero">
            Pairly is built so that only your own devices can read what passes between them, whichever way they
            connect.
          </p>
        </div>
        <div class="shield" aria-hidden="true">
          <div class="shield-ring r1" />
          <div class="shield-ring r2" />
          <div class="shield-ring r3" />
          <div class="shield-core">
            <Lock size={46} />
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="pillars">
          <For each={PILLARS}>
            {(p) => (
              <article class="pillar" ref={spotlight}>
                <div class="bento-icon">
                  <Dynamic component={p.icon} size={22} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class="section container">
        <div class="section-head">
          <span class="kicker">Threat model</span>
          <h2 data-split>Who might try, and what they get.</h2>
        </div>
        <div class="threats">
          <div class="threat threat-head">
            <span>Attacker</span>
            <span>Reads content</span>
            <span>Controls a device</span>
            <span>Why not</span>
          </div>
          <For each={THREATS}>
            {(t) => (
              <div class="threat">
                <b>{t.who}</b>
                <span class={t.reads ? 'bad' : 'good'}>{t.reads ? 'Yes' : 'No'}</span>
                <span class={t.controls ? 'warn' : 'good'}>{t.controls ? 'Until unpaired' : 'No'}</span>
                <span class="muted">{t.why}</span>
              </div>
            )}
          </For>
        </div>
      </section>

      <section class="section container">
        <div class="section-head">
          <span class="kicker">Under the hood</span>
          <h2 data-split>The details, for the curious.</h2>
          <p data-fade>One core written in Rust handles the encryption, pairing, connections and every feature’s protocol for all three apps.</p>
        </div>
        <div class="specs">
          <For each={SPECS}>
            {([k, v]) => (
              <div class="spec">
                <span>{k}</span>
                <code>{v}</code>
              </div>
            )}
          </For>
        </div>
        <div class="center-row" data-fade>
          <a class="btn btn-ghost" href={SECURITY_DOC_URL} target="_blank" rel="noopener">
            Read the full security review <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
