import { useState } from 'react';
import { ArrowLeft, Check, Copy, Terminal } from 'lucide-react';

const SSH_COMMAND = 'ssh ssh.masaking.net';

function copyTextWithSelectionFallback(text) {
  const activeElement = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);
  selection?.removeAllRanges();
  ranges.forEach((range) => selection?.addRange(range));
  activeElement?.focus?.({ preventScroll: true });

  if (!didCopy) {
    throw new Error('Copy command failed');
  }
}

export function SshConnectScreen({ onBackHome }) {
  const [copyState, setCopyState] = useState('idle');

  async function handleCopyCommand() {
    try {
      try {
        await navigator.clipboard.writeText(SSH_COMMAND);
      } catch {
        copyTextWithSelectionFallback(SSH_COMMAND);
      }
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('failed');
    }
  }

  const hasCopied = copyState === 'copied';

  return (
    <main className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_42%,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.10)_34%,rgba(0,0,0,0.08)_100%)]" />
      <section className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-white/[0.58] bg-[#f7f3de]/[0.46] text-black shadow-[0_36px_95px_rgba(35,38,48,0.30),inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.10)_34%,rgba(232,149,126,0.18)_100%)]" />
        <div className="relative grid h-10 grid-cols-[1fr_auto_1fr] items-center border-b border-white/[0.26] bg-white/[0.28] px-3 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={onBackHome}
                aria-label='Delete CLI menu'
                className="h-3 w-3 rounded-full bg-[#ff5f57]"
              >
              </button>

            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="min-w-0 px-3 text-center text-[12px] font-semibold text-black/[0.58]">Masaking CLI</div>
          <button
            type="button"
            onClick={onBackHome}
            aria-label="Back to home"
            className="ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-black/[0.58] transition hover:bg-black/[0.07] hover:text-black/[0.82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.22]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex items-center gap-3 rounded-[22px] border border-white/[0.62] bg-[#fffbed]/[0.54] px-3 py-3 shadow-[0_18px_46px_rgba(35,38,48,0.14),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.24)] backdrop-blur-xl sm:px-4">
            <code className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap px-1 font-mono text-[17px] font-semibold leading-8 text-black/[0.86] [text-shadow:0_1px_1px_rgba(255,255,255,0.64)] custom-scrollbar sm:text-[22px]">
              {SSH_COMMAND}
            </code>
            <button
              type="button"
              aria-label={hasCopied ? 'SSH command copied' : 'Copy SSH command'}
              title={hasCopied ? 'Copied' : 'Copy'}
              onClick={handleCopyCommand}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[15px] border border-white/[0.66] bg-white/[0.50] text-black/[0.78] shadow-[0_10px_24px_rgba(35,38,48,0.12),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl transition duration-150 hover:bg-white/[0.72] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.22]"
            >
              {hasCopied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 px-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.16] bg-[#171717] text-[#32d74b] shadow-[0_12px_28px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Terminal className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <h1 className="min-w-0 text-[16px] font-semibold leading-6 text-black/[0.78] sm:text-[18px]">Connect from your terminal.</h1>
          </div>

          <div className="sr-only" aria-live="polite">
            {hasCopied ? 'SSH command copied.' : ''}
          </div>

          {copyState === 'failed' ? (
            <div className="mt-3 text-[12px] text-black/[0.52]" role="alert">Select the command and copy it manually.</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
