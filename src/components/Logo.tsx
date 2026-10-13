/** Rounded-rectangle path, so DrawSVG can trace it exactly. */
export function roundRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;
}

export const LEFT = roundRect(30, 34, 34, 60, 8);
export const RIGHT = roundRect(64, 34, 34, 60, 8);

export function LogoMark(props: { size?: number; class?: string }) {
  const id = `lg-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg class={props.class} width={props.size ?? 32} height={props.size ?? 32} viewBox="0 0 128 128" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#4f6bff" />
          <stop offset="1" stop-color="#7b3fe4" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="112" height="112" rx="28" fill={`url(#${id})`} />
      <path d={LEFT} fill="none" stroke="#fff" stroke-width="7" />
      <path d={RIGHT} fill="none" stroke="#b9c6ff" stroke-width="7" />
    </svg>
  );
}
