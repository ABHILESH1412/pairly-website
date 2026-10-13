import { For } from 'solid-js';
import { Link } from '../lib/router';
import { ALL_RELEASES_URL, latest, REPO_URL } from '../lib/release';
import { LogoMark } from './Logo';
import { NAV_LINKS } from './Nav';

export default function Footer() {
  return (
    <footer class="footer">
      <div class="container footer-top">
        <div class="footer-brand">
          <Link href="/" class="brand">
            <LogoMark size={36} />
            <span>Pairly</span>
          </Link>
          <p>Your phone and your computers, working as one. Free software under the GPL-3.0-or-later licence.</p>
        </div>
        <div class="footer-cols">
          <div>
            <h4>Explore</h4>
            <For each={[{ href: '/', label: 'Home' }, ...NAV_LINKS]}>{(l) => <Link href={l.href}>{l.label}</Link>}</For>
          </div>
          <div>
            <h4>Project</h4>
            <a href={REPO_URL} target="_blank" rel="noopener">Source code</a>
            <a href={ALL_RELEASES_URL} target="_blank" rel="noopener">All releases</a>
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener">Report an issue</a>
            <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noopener">Licence</a>
          </div>
        </div>
      </div>
      <div class="footer-word" aria-hidden="true">Pairly</div>
      <div class="container footer-bottom">
        <span>© {new Date().getFullYear()} Pairly · GPL-3.0-or-later</span>
        <span>{latest() ? `Latest: ${latest()!.name}` : 'No accounts · No tracking · No ads'}</span>
      </div>
    </footer>
  );
}
