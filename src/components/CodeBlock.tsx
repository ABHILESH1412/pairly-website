import { createSignal } from 'solid-js';
import { Check, Copy } from 'lucide-solid';

export default function CodeBlock(props: { code: string; label?: string }) {
  const [copied, setCopied] = createSignal(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div class="code">
      <div class="code-bar">
        <span>{props.label ?? 'Terminal'}</span>
        <button onClick={copy} aria-label="Copy to clipboard">
          {copied() ? <Check size={14} /> : <Copy size={14} />}
          {copied() ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{props.code}</code>
      </pre>
    </div>
  );
}
