import { For, onMount } from 'solid-js';
import { LEFT, RIGHT } from './Logo';
import { registerOverlay } from '../lib/transition';

const COLS = 6;
const WORD = 'Pairly'.split('');

/** The full-screen curtain used for the opening sequence and every page change. */
export default function Overlay() {
  let root!: HTMLDivElement;
  let center!: HTMLDivElement;
  let left!: SVGPathElement;
  let right!: SVGPathElement;
  let pulse!: HTMLDivElement;
  let label!: HTMLSpanElement;
  let count!: HTMLSpanElement;
  let meta!: HTMLDivElement;
  const accent: HTMLElement[] = [];
  const ink: HTMLElement[] = [];
  const chars: HTMLElement[] = [];

  onMount(() => registerOverlay({ root, accent, ink, center, left, right, pulse, chars, label, count, meta }));

  return (
    <div class="tx" ref={root} aria-hidden="true">
      <div class="tx-cols tx-cols--accent">
        <For each={Array(COLS)}>{() => <div ref={(el) => accent.push(el)} />}</For>
      </div>
      <div class="tx-cols tx-cols--ink">
        <For each={Array(COLS)}>{() => <div ref={(el) => ink.push(el)} />}</For>
      </div>

      <div class="tx-center" ref={center}>
        <div class="tx-logo">
          <div class="tx-pulse" ref={pulse} />
          <svg viewBox="0 0 128 128" width="120" height="120">
            <defs>
              <linearGradient id="tx-r" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#8ab4ff" />
                <stop offset="1" stop-color="#b48cff" />
              </linearGradient>
            </defs>
            <path ref={left} d={LEFT} fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" />
            <path ref={right} d={RIGHT} fill="none" stroke="url(#tx-r)" stroke-width="6" stroke-linecap="round" />
          </svg>
        </div>
        <div class="tx-word">
          <For each={WORD}>{(c) => <span ref={(el) => chars.push(el)}>{c}</span>}</For>
        </div>
        <div class="tx-label">
          <span ref={label} />
        </div>
      </div>

      <div class="tx-meta" ref={meta}>
        <span>Phone ⟷ PC · end-to-end encrypted</span>
        <span class="tx-count">
          <span ref={count}>000</span>%
        </span>
      </div>
    </div>
  );
}
