import { createSignal, For, type JSX } from 'solid-js';
import { ArrowUpRight, ChevronDown } from 'lucide-solid';
import CodeBlock from '../components/CodeBlock';
import { usePageAnim } from '../lib/anim';
import { gsap, lenis, ScrollTrigger } from '../lib/gsap';
import { RELAY_GUIDE_URL } from '../lib/release';

const SECTIONS = [
  { id: 'pair', label: 'Pair your devices' },
  { id: 'relay', label: 'Away from home' },
  { id: 'files', label: 'Browse files' },
  { id: 'updates', label: 'Updates' },
  { id: 'help', label: 'Troubleshooting' },
];

const PERMISSIONS = [
  ['Notification access', 'Sending the phone’s notifications to the PC'],
  ['SMS, phone, contacts', 'Texts, calls and contacts on the PC'],
  ['All files access', 'Letting the PC browse the phone’s storage'],
  ['Accessibility service', 'Locking the phone, typing from the PC, automatic clipboard'],
  ['Screen capture', 'Showing the phone’s screen on the PC (asked each time)'],
];

const FAQ: { q: string; a: () => JSX.Element }[] = [
  {
    q: 'Android won’t install the APK',
    a: () => (
      <ul>
        <li><b>“Not allowed to install unknown apps”:</b> tap Settings in the message and allow your browser or Files app.</li>
        <li><b>“Blocked by Play Protect”:</b> tap More details → Install anyway.</li>
        <li><b>“App not installed” / “conflicts with an existing package”:</b> an older Pairly may be installed in another profile (work or private). Uninstall it there.</li>
      </ul>
    ),
  },
  {
    q: 'My devices don’t see each other',
    a: () => (
      <ul>
        <li>Both must be on the <b>same Wi-Fi</b>, or set up the relay.</li>
        <li><b>Firewall:</b> allow UDP 47100 and mDNS on Linux, and allow Pairly in the Windows firewall prompt (private networks).</li>
        <li>Some routers (guest networks, “client isolation”) stop devices talking to each other: use the relay, Bluetooth, or USB tethering.</li>
      </ul>
    ),
  },
  {
    q: 'Switching to the relay takes a while after I leave Wi-Fi',
    a: () => (
      <p>
        When Wi-Fi fades away, it looks to Pairly as if the link simply went quiet, so it waits up to about 45 seconds
        before switching to the relay. Turning Wi-Fi off by hand also works.
      </p>
    ),
  },
  {
    q: 'Remote control doesn’t move the mouse on Linux',
    a: () => (
      <ul>
        <li><b>Hyprland, Sway and other wlroots compositors:</b> works directly.</li>
        <li><b>GNOME and KDE:</b> goes through the desktop’s RemoteDesktop portal.</li>
        <li><b>Anywhere else:</b> the uinput fallback works if your user may write to /dev/uinput.</li>
      </ul>
    ),
  },
];

function Faq(props: { q: string; a: () => JSX.Element }) {
  let body!: HTMLDivElement;
  let icon!: HTMLSpanElement;
  const [open, setOpen] = createSignal(false);
  const toggle = () => {
    const next = !open();
    setOpen(next);
    gsap.to(body, {
      height: next ? 'auto' : 0,
      duration: 0.6,
      ease: 'expo.inOut',
      onComplete: () => ScrollTrigger.refresh(),
    });
    gsap.to(icon, { rotate: next ? 180 : 0, duration: 0.5, ease: 'expo.out' });
  };
  return (
    <div class="faq" classList={{ open: open() }}>
      <button onClick={toggle} aria-expanded={open()}>
        <span>{props.q}</span>
        <span ref={icon} class="faq-icon">
          <ChevronDown size={20} />
        </span>
      </button>
      <div class="faq-body" ref={body}>
        <div class="faq-inner">{props.a()}</div>
      </div>
    </div>
  );
}

export default function Guide() {
  let root!: HTMLDivElement;
  const [active, setActive] = createSignal('pair');

  usePageAnim(() => root, () => {
    SECTIONS.forEach((s) => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(s.id),
      });
    });
    gsap.from('.toc a', { x: -20, autoAlpha: 0, stagger: 0.06, duration: 0.7, delay: 0.5 });
    gsap.utils.toArray<HTMLElement>('.g-step').forEach((el) =>
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 88%' } }),
    );
  });

  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) lenis.scrollTo(el, { offset: -110 });
  };

  return (
    <div ref={root} class="page">
      <section class="page-hero container">
        <span class="kicker" data-fade="hero">Guide</span>
        <h1 data-split="hero">
          Up and running <span class="grad">in a minute.</span>
        </h1>
        <p class="lead" data-fade="hero">
          Pair your devices, keep them connected away from home, share files, and fix the usual hiccups.
        </p>
      </section>

      <div class="container guide">
        <aside class="toc">
          <For each={SECTIONS}>
            {(s, i) => (
              <a href={`#${s.id}`} onClick={jump(s.id)} classList={{ active: active() === s.id }}>
                <span>0{i() + 1}</span> {s.label}
              </a>
            )}
          </For>
        </aside>

        <div class="guide-body">
          <section id="pair" class="g-sec">
            <h2 data-split>Pair your devices</h2>
            <ol class="g-steps">
              <li class="g-step">On the PC, click <b>Pair a New Device</b>. A QR code appears.</li>
              <li class="g-step">
                On the phone, tap <b>Scan code</b> and point it at the QR code. No camera? Pick the PC in the phone’s
                list of nearby devices instead, and <b>check that both show the same code</b>.
              </li>
              <li class="g-step">Done. Each device now shows the other’s page, with everything you can do.</li>
              <li class="g-step">On the phone, turn on the features you want. Pairly asks Android for each permission when you first use it.</li>
            </ol>
            <div class="table g-step">
              <For each={PERMISSIONS}>
                {([k, v]) => (
                  <div class="table-row">
                    <b>{k}</b>
                    <span>{v}</span>
                  </div>
                )}
              </For>
            </div>
          </section>

          <section id="relay" class="g-sec">
            <h2 data-split>Use it away from home</h2>
            <p class="g-step">
              To reach your PC from mobile data or another network, Pairly needs a meeting point on the internet. You
              can run your own <b>for free on Cloudflare</b>, no server needed, in about five minutes.
            </p>
            <ol class="g-steps">
              <li class="g-step">
                Follow the{' '}
                <a class="text-link" href={RELAY_GUIDE_URL} target="_blank" rel="noopener">
                  relay guide <ArrowUpRight size={14} />
                </a>
                . It gives you an address like:
                <CodeBlock label="Relay address" code="wss://TOKEN@pairly-relay.yourname.workers.dev" />
              </li>
              <li class="g-step">
                Put that address into Pairly on your PC: <b>Linux:</b> Settings → Away from home → Relay address.{' '}
                <b>Windows:</b> Settings → Connections → Relay.
              </li>
              <li class="g-step">Your phone learns it automatically the next time it’s connected to that PC at home.</li>
            </ol>
            <p class="g-step muted">
              The relay only passes on encrypted data, and only your token gets in. An idle connection checks in just
              every 2 minutes, so it’s light on the battery.
            </p>
          </section>

          <section id="files" class="g-sec">
            <h2 data-split>Browse files between devices</h2>
            <p class="g-step">
              Forgot a file at home? Open the other device in Pairly and tap <b>Browse Files</b>. It works over Wi-Fi,
              Bluetooth and the relay. A phone shares its storage once you allow file access. A PC shares only what
              you choose, in Settings → <b>Share Files</b>:
            </p>
            <div class="table g-step">
              <div class="table-row">
                <b>Share a folder with my devices</b>
                <span>Off until you turn it on</span>
              </div>
              <div class="table-row">
                <b>Folder</b>
                <span>Which folder (your home folder unless you pick another)</span>
              </div>
              <div class="table-row">
                <b>Allow changes</b>
                <span>Off: others can only look and download. On: they may also upload, rename and delete.</span>
              </div>
            </div>
            <p class="g-step muted">Hidden files are never shared, like .ssh with your keys, or Windows’ hidden and system files.</p>
          </section>

          <section id="updates" class="g-sec">
            <h2 data-split>Updates</h2>
            <p class="g-step">
              All three apps <b>update themselves</b> when a new version is released, and tell you when they did. You
              can switch this off in each app’s Settings → Updates.
            </p>
            <p class="g-step muted">
              Updates are only installed if they carry the project’s signature. Linux package installs (makepkg) are
              left to your package manager: Pairly tells you when there’s a new version.
            </p>
          </section>

          <section id="help" class="g-sec">
            <h2 data-split>Troubleshooting</h2>
            <div class="faqs g-step">
              <For each={FAQ}>{(f) => <Faq q={f.q} a={f.a} />}</For>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
