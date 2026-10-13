import { createSignal, For, Match, Show, Switch } from 'solid-js';
import { ArrowUpRight, Download as DownloadIcon, FileDown, Sparkles } from 'lucide-solid';
import CodeBlock from '../components/CodeBlock';
import { PlatformIcon } from '../components/DownloadButton';
import { magnetic, spotlight, usePageAnim } from '../lib/anim';
import { gsap } from '../lib/gsap';
import {
  ALL_RELEASES_URL,
  formatDate,
  formatSize,
  latest,
  platform,
  PLATFORM_NAME,
  RELEASES_URL,
  type Asset,
  type Platform,
} from '../lib/release';

const TABS: { id: Platform; req: string }[] = [
  { id: 'android', req: 'Android 8 or newer' },
  { id: 'windows', req: 'Windows 10 or 11 · x64' },
  { id: 'linux', req: 'Any recent distro · x86_64' },
  { id: 'arch', req: 'Arch, EndeavourOS, Manjaro' },
];

function DownloadLink(props: { asset?: Asset; children: any; primary?: boolean }) {
  return (
    <a
      class={`btn ${props.primary ? 'btn-primary btn-lg' : 'btn-ghost'}`}
      href={props.asset?.url ?? RELEASES_URL}
      ref={(el) => props.primary && magnetic(el, 0.2)}
      {...(props.asset ? { download: '' } : { target: '_blank', rel: 'noopener' })}
    >
      <DownloadIcon size={18} />
      {props.children}
      <Show when={props.asset}>
        <span class="btn-tag">{formatSize(props.asset!.size)}</span>
      </Show>
    </a>
  );
}

export default function Download() {
  let root!: HTMLDivElement;
  let panel!: HTMLDivElement;
  const [tab, setTab] = createSignal<Platform>(platform ?? 'android');
  const files = () => latest()?.files ?? {};

  const choose = (p: Platform) => {
    if (p === tab()) return;
    gsap.to(panel, {
      autoAlpha: 0,
      y: 16,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setTab(p);
        gsap.fromTo(panel, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        gsap.from(panel.querySelectorAll('.inst-step'), { x: 24, autoAlpha: 0, stagger: 0.06, duration: 0.5, delay: 0.1 });
      },
    });
  };

  usePageAnim(() => root, () => {
    gsap.from('.dl-tab', { y: 30, autoAlpha: 0, stagger: 0.07, duration: 0.8, delay: 0.5, clearProps: 'transform' });
    gsap.from('.dl-panel', { y: 50, autoAlpha: 0, duration: 1, delay: 0.7, clearProps: 'transform' });
  });

  return (
    <div ref={root} class="page">
      <section class="page-hero container">
        <span class="kicker" data-fade="hero">
          <Show when={latest()} fallback="Download">
            {latest()!.name} · {formatDate(latest()!.published)}
          </Show>
        </span>
        <h1 data-split="hero">
          Get Pairly on <span class="grad">every device.</span>
        </h1>
        <p class="lead" data-fade="hero">
          Every download below comes straight from the latest release on GitHub. Install it on your phone and your
          PC, then pair them. After that, Pairly keeps itself up to date.
        </p>
        <Show when={latest.error}>
          <p class="notice">
            Couldn’t reach GitHub just now. The buttons will take you to the{' '}
            <a href={RELEASES_URL} target="_blank" rel="noopener">
              latest release page
            </a>{' '}
            instead.
          </p>
        </Show>
      </section>

      <section class="container">
        <div class="dl-tabs" role="tablist">
          <For each={TABS}>
            {(t) => (
              <button
                class="dl-tab"
                role="tab"
                aria-selected={tab() === t.id}
                classList={{ active: tab() === t.id }}
                onClick={() => choose(t.id)}
                ref={spotlight}
              >
                <PlatformIcon platform={t.id} size={26} />
                <span class="dl-tab-name">{PLATFORM_NAME[t.id]}</span>
                <small>{t.req}</small>
                <Show when={platform === t.id}>
                  <span class="chip chip-glow">
                    <Sparkles size={12} /> Your device
                  </span>
                </Show>
              </button>
            )}
          </For>
        </div>

        <div class="dl-panel" ref={panel}>
          <Switch>
            <Match when={tab() === 'android'}>
              <div class="dl-head">
                <div>
                  <h2>Android</h2>
                  <p>{files().android?.name ?? 'pairly-X.Y.Z.apk'}</p>
                </div>
                <DownloadLink asset={files().android} primary>
                  Download APK
                </DownloadLink>
              </div>
              <ol class="inst">
                <li class="inst-step">Download the APK on your phone and open it.</li>
                <li class="inst-step">
                  If Android asks, allow your browser or Files app to <b>install unknown apps</b>.
                </li>
                <li class="inst-step">
                  If <b>Play Protect</b> warns you, tap <b>More details → Install anyway</b>. It warns about every app
                  that doesn’t come from the Play Store.
                </li>
                <li class="inst-step">Only the first install needs this. After that, Pairly updates itself.</li>
              </ol>
            </Match>

            <Match when={tab() === 'windows'}>
              <div class="dl-head">
                <div>
                  <h2>Windows</h2>
                  <p>{files().windows?.name ?? 'pairly-X.Y.Z-windows-x64-setup.exe'}</p>
                </div>
                <DownloadLink asset={files().windows} primary>
                  Download installer
                </DownloadLink>
              </div>
              <ol class="inst">
                <li class="inst-step">Run the installer. No admin rights needed.</li>
                <li class="inst-step">
                  If Windows shows <b>“Windows protected your PC”</b>, click <b>More info → Run anyway</b>.
                </li>
                <li class="inst-step">
                  When the firewall asks, <b>allow Pairly on private networks</b> so your phone can find your PC.
                </li>
                <li class="inst-step">Pairly starts with Windows and lives in the tray.</li>
              </ol>
            </Match>

            <Match when={tab() === 'linux'}>
              <div class="dl-head">
                <div>
                  <h2>Linux</h2>
                  <p>{files().linux?.name ?? 'pairly-X.Y.Z-linux-x86_64.tar.gz'}</p>
                </div>
                <DownloadLink asset={files().linux} primary>
                  Download tarball
                </DownloadLink>
              </div>
              <p class="dl-note">Already built. Needs GTK 4, libadwaita and glibc 2.44 or newer.</p>
              <ol class="inst">
                <li class="inst-step">
                  Unpack it and install for your user under <code>~/.local</code> (no root):
                  <CodeBlock
                    code={`tar xzf pairly-*-linux-x86_64.tar.gz\ncd pairly-*-linux-x86_64\nmake install activate`}
                  />
                </li>
                <li class="inst-step">
                  Open <b>Pairly</b> from your app menu.
                </li>
                <li class="inst-step">
                  If your PC has a firewall, allow Pairly’s port (UDP 47100) and device discovery (mDNS):
                  <CodeBlock code="sudo firewall-cmd --permanent --add-port=47100/udp --add-service=mdns && sudo firewall-cmd --reload" />
                </li>
              </ol>
            </Match>

            <Match when={tab() === 'arch'}>
              <div class="dl-head">
                <div>
                  <h2>Arch Linux</h2>
                  <p>PKGBUILD + pairly.install</p>
                </div>
                <div class="dl-multi">
                  <For each={latest()?.arch ?? []} fallback={<DownloadLink primary>Open release</DownloadLink>}>
                    {(a) => (
                      <DownloadLink asset={a} primary={a.name === 'PKGBUILD'}>
                        {a.name}
                      </DownloadLink>
                    )}
                  </For>
                </div>
              </div>
              <ol class="inst">
                <li class="inst-step">
                  Download <b>PKGBUILD</b> and <b>pairly.install</b> into an empty folder.
                </li>
                <li class="inst-step">
                  Build, install, and start the background service:
                  <CodeBlock code={`makepkg -si\nsystemctl --user enable --now pairlyd`} />
                </li>
                <li class="inst-step">The build takes a few minutes and about 4 GB of RAM.</li>
              </ol>
            </Match>
          </Switch>
        </div>
      </section>

      <Show when={latest()}>
        {(r) => (
          <section class="section container dl-extra">
            <div class="dl-card" data-fade>
              <h3>
                <Sparkles size={18} /> What’s new in {r().tag}
              </h3>
              <ul class="notes">
                <For each={r().notes} fallback={<li>See the release page for details.</li>}>
                  {(n) => <li>{n}</li>}
                </For>
              </ul>
              <a class="text-link" href={r().url} target="_blank" rel="noopener">
                Full release notes <ArrowUpRight size={16} />
              </a>
            </div>

            <div class="dl-card" data-fade>
              <h3>
                <FileDown size={18} /> All files in {r().tag}
              </h3>
              <ul class="files">
                <For each={r().assets}>
                  {(a) => (
                    <li>
                      <a href={a.url} download="">
                        <span>{a.name}</span>
                        <small>{formatSize(a.size)}</small>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
              <a class="text-link" href={ALL_RELEASES_URL} target="_blank" rel="noopener">
                Older releases <ArrowUpRight size={16} />
              </a>
            </div>

            <Show when={r().checksums.length}>
              <div class="dl-card dl-wide" data-fade>
                <h3>Checksums (SHA-256)</h3>
                <CodeBlock label="SHA256SUMS" code={r().checksums.map((c) => `${c.hash}  ${c.file}`).join('\n')} />
                <p class="muted small">
                  Updates are signed too: each app only installs an update that carries the project’s signature.
                </p>
              </div>
            </Show>
          </section>
        )}
      </Show>
    </div>
  );
}
