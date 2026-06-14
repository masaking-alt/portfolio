import { useState } from 'react';
import { ArrowLeft, Check, Copy, Terminal } from 'lucide-react';

const SSH_COMMAND = 'ssh ssh.masaking.net';

function copyTextWithSelectionFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(247,243,222,0.05)_48%,rgba(0,0,0,0.10)_100%)]" />
      <section className="relative w-full max-w-[520px] overflow-hidden rounded-[22px] border border-white/[0.62] bg-[#f7f3de]/[0.72] text-black shadow-[0_34px_90px_rgba(35,38,48,0.28),inset_0_1px_0_rgba(255,255,255,0.52)] backdrop-blur-2xl">
        <div className="grid h-10 grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.08] bg-white/[0.38] px-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="min-w-0 px-3 text-center text-[12px] font-semibold text-black/[0.58]">Masaking CUI</div>
          <button
            type="button"
            onClick={onBackHome}
            aria-label="Back to home"
            className="ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-black/[0.58] transition hover:bg-black/[0.07] hover:text-black/[0.82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.22]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] border border-white/[0.16] bg-[#171717] text-[#32d74b] shadow-[0_16px_34px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-16 sm:w-16">
              <Terminal className="h-8 w-8" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[24px] font-semibold leading-tight text-black/[0.86] sm:text-[30px]">Connect from your terminal.</h1>
            </div>
          </div>

          <div className="mt-6 rounded-[18px] border border-black/[0.10] bg-[#121417] p-3 shadow-[0_16px_42px_rgba(13,16,23,0.18),inset_0_1px_0_rgba(255,255,255,0.10)]">
            <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-medium text-white/42">
              <span>terminal</span>
              <span>ssh</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap rounded-xl border border-white/[0.08] bg-black/45 px-4 py-3 font-mono text-[14px] leading-6 text-[#f3f3f3] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] custom-scrollbar">
                {SSH_COMMAND}
              </code>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f6f3e7] px-4 text-[13px] font-semibold text-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
              >
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {hasCopied ? 'Copied' : 'Copy command'}
              </button>
            </div>
          </div>

          {copyState === 'failed' ? (
            <div className="mt-3 text-[12px] text-black/[0.46]">Select the command and copy it manually.</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
