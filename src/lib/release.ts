import { createResource } from 'solid-js';

export const REPO = 'ABHILESH1412/pairly';
export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const ALL_RELEASES_URL = `${REPO_URL}/releases`;
export const RELAY_GUIDE_URL = `${REPO_URL}/blob/main/pairly-relay-worker/README.md`;
export const SECURITY_DOC_URL = `${REPO_URL}/blob/main/docs/security.md`;

export type Platform = 'android' | 'windows' | 'linux' | 'arch';

export type Asset = { name: string; size: number; url: string };

export type Release = {
  tag: string;
  version: string;
  name: string;
  url: string;
  published: Date;
  notes: string[];
  checksums: { hash: string; file: string }[];
  assets: Asset[];
  files: Partial<Record<Platform, Asset>>;
  arch: Asset[];
};

const MATCH: Record<Exclude<Platform, 'arch'>, RegExp> = {
  android: /\.apk$/i,
  windows: /windows.*setup\.exe$/i,
  linux: /linux.*\.tar\.gz$/i,
};

const CACHE_KEY = 'pairly:latest-release';
const CACHE_MS = 10 * 60 * 1000;

type ApiRelease = {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string | null;
  assets: { name: string; size: number; browser_download_url: string }[];
};

async function fetchApi(): Promise<ApiRelease> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;
  } catch {
    /* storage unavailable */
  }
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const data = (await res.json()) as ApiRelease;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable */
  }
  return data;
}

function parseNotes(body: string): string[] {
  const section = body.split(/^##\s+What's new\s*$/im)[1]?.split(/^##\s/m)[0] ?? '';
  return section
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, ''));
}

function parseChecksums(body: string) {
  return [...body.matchAll(/^([a-f0-9]{64})\s+\*?(\S+)\s*$/gim)].map((m) => ({ hash: m[1], file: m[2] }));
}

async function fetchLatest(): Promise<Release> {
  const r = await fetchApi();
  const assets: Asset[] = r.assets.map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url }));
  const files: Release['files'] = {};
  for (const [platform, re] of Object.entries(MATCH) as [Platform, RegExp][]) {
    const hit = assets.find((a) => re.test(a.name));
    if (hit) files[platform] = hit;
  }
  const arch = assets.filter((a) => a.name === 'PKGBUILD' || a.name === 'pairly.install');
  if (arch.length) files.arch = arch.find((a) => a.name === 'PKGBUILD');
  const body = r.body ?? '';
  return {
    tag: r.tag_name,
    version: r.tag_name.replace(/^v/, ''),
    name: r.name || r.tag_name,
    url: r.html_url,
    published: new Date(r.published_at),
    notes: parseNotes(body),
    checksums: parseChecksums(body),
    assets,
    files,
    arch,
  };
}

const [latest] = createResource(fetchLatest);
export { latest };

export function detectPlatform(): Platform | null {
  const ua = navigator.userAgent;
  const hint = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? '';
  if (/android/i.test(ua) || /android/i.test(hint)) return 'android';
  if (/iphone|ipad|ipod|mac/i.test(ua)) return null;
  if (/win/i.test(hint) || /windows/i.test(ua)) return 'windows';
  if (/linux|x11|cros/i.test(ua) || /linux|chrome os/i.test(hint)) return 'linux';
  return null;
}

export const platform = detectPlatform();

export const PLATFORM_NAME: Record<Platform, string> = {
  android: 'Android',
  windows: 'Windows',
  linux: 'Linux',
  arch: 'Arch Linux',
};

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
