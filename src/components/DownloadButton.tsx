import { Show } from 'solid-js';
import { Download } from 'lucide-solid';
import { latest, platform, PLATFORM_NAME, RELEASES_URL, type Platform } from '../lib/release';
import { Link } from '../lib/router';
import { magnetic } from '../lib/anim';
import { AndroidIcon, LinuxIcon, WindowsIcon } from './BrandIcons';

export function PlatformIcon(props: { platform: Platform; size?: number }) {
  return (
    <>
      {props.platform === 'android' && <AndroidIcon size={props.size} />}
      {props.platform === 'windows' && <WindowsIcon size={props.size} />}
      {(props.platform === 'linux' || props.platform === 'arch') && <LinuxIcon size={props.size} />}
    </>
  );
}

/**
 * The main call to action. On Android, Windows and Linux it downloads the matching file of the
 * latest release straight away; anywhere else it opens the download page.
 */
export default function DownloadButton(props: { large?: boolean }) {
  const asset = () => (platform ? latest()?.files[platform] : undefined);
  const cls = () => `btn btn-primary${props.large ? ' btn-lg' : ''}`;

  return (
    <Show
      when={platform}
      fallback={
        <Link href="/download" class={cls()} ref={(el: HTMLElement) => magnetic(el)}>
          <Download size={18} />
          <span>Download Pairly</span>
        </Link>
      }
    >
      {(p) => (
        <a
          class={cls()}
          href={asset()?.url ?? RELEASES_URL}
          ref={(el) => magnetic(el)}
          {...(asset() ? { download: '' } : { target: '_blank', rel: 'noopener' })}
        >
          <PlatformIcon platform={p()} size={18} />
          <span>Download for {PLATFORM_NAME[p()]}</span>
          <Show when={latest()}>
            <span class="btn-tag">{latest()!.tag}</span>
          </Show>
        </a>
      )}
    </Show>
  );
}
