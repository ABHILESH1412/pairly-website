import { createEffect, For, on, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Monitor, Moon, Sun } from 'lucide-solid';
import { gsap } from '../lib/gsap';
import { pref, setPref, type ThemePref } from '../lib/theme';

const OPTIONS: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'dark', label: 'Dark', icon: Moon },
];

/** Light / System / Dark switch with a pill that slides to the chosen option. */
export default function ThemeToggle(props: { class?: string; labels?: boolean }) {
  let root!: HTMLDivElement;
  let pill!: HTMLDivElement;

  const place = (instant = false) => {
    const active = root.querySelector<HTMLElement>(`[data-theme-opt="${pref()}"]`);
    if (!active || !active.offsetWidth) return;
    const box = { x: active.offsetLeft, width: active.offsetWidth };
    instant ? gsap.set(pill, box) : gsap.to(pill, { ...box, duration: 0.5, ease: 'expo.out' });
  };

  onMount(() => {
    document.fonts.ready.then(() => place(true));
    const ro = new ResizeObserver(() => place(true));
    ro.observe(root);
    onCleanup(() => ro.disconnect());
  });
  createEffect(on(pref, () => place(), { defer: true }));

  return (
    <div class={`theme-toggle ${props.class ?? ''}`} ref={root} role="radiogroup" aria-label="Colour theme">
      <div class="tt-pill" ref={pill} />
      <For each={OPTIONS}>
        {(o) => (
          <button
            type="button"
            role="radio"
            data-theme-opt={o.id}
            aria-checked={pref() === o.id}
            aria-label={`${o.label} theme`}
            title={`${o.label} theme`}
            classList={{ active: pref() === o.id }}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPref(o.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
          >
            <Dynamic component={o.icon} size={16} />
            {props.labels && <span>{o.label}</span>}
          </button>
        )}
      </For>
    </div>
  );
}
