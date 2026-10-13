import { createSignal, splitProps, type JSX } from 'solid-js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function readPath(): string {
  let p = window.location.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  p = p.replace(/\/+$/, '');
  return p || '/';
}

const [path, setPath] = createSignal(readPath());

window.addEventListener('popstate', () => setPath(readPath()));

/** The path the user asked for. The rendered page follows it once the transition has covered the screen. */
export { path };

export function navigate(to: string) {
  const [target, hash] = to.split('#');
  const clean = target.replace(/\/+$/, '') || '/';
  if (clean === readPath()) {
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.history.pushState(null, '', BASE + clean);
  setPath(clean);
}

type LinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** An in-app link that goes through the page transition instead of a full reload. */
export function Link(props: LinkProps) {
  const [local, rest] = splitProps(props, ['href', 'onClick']);
  return (
    <a
      {...rest}
      href={BASE + local.href}
      onClick={(e) => {
        if (typeof local.onClick === 'function') (local.onClick as (e: MouseEvent) => void)(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(local.href);
      }}
    />
  );
}
