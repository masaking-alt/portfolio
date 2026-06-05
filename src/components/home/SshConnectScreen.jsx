import { useState } from 'react';
import { ArrowLeft, Check, Copy, Terminal } from 'lucide-react';

const SSH_COMMAND = 'ssh ssh.masaking.net';

export function SshConnectScreen({ onBackHome }) {
  const [copyState, setCopyState] = useState('idle');

  async function handleCopyCommand() {
    try {
      await navigator.clipboard.writeText(SSH_COMMAND);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('failed');
    }
  }

  const hasCopied = copyState === 'copied';

  return (
    <main className="flex h-full min-h-0 items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-[640px] overflow-hidden rounded-[24px] border border-white/[0.55] bg-white/[0.58] text-black shadow-[0_30px_80px_rgba(47,52,65,0.24)] backdrop-blur-xl">
        <div className="flex h-11 items-center justify-between border-b border-black/[0.06] bg-white/40 px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="min-w-0 px-3 text-center text-[12px] font-medium text-black/[0.52]">Masaking CUI</div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-black/[0.54] transition hover:bg-black/[0.06] hover:text-black/[0.78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.18]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </button>
        </div>

        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-[#171717] text-[#32d74b] shadow-[0_14px_34px_rgba(0,0,0,0.18)]">
              <Terminal className="h-8 w-8" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[28px] font-semibold leading-tight text-black/[0.82] sm:text-[34px]">Connect from your terminal.</h1>
            </div>
          </div>

          <div className="mt-8 rounded-[18px] border border-black/[0.08] bg-[#171717] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap rounded-xl bg-black/40 px-4 py-3 font-mono text-[14px] leading-6 text-[#f3f3f3] custom-scrollbar">
                {SSH_COMMAND}
              </code>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[13px] font-semibold text-[#171717] transition hover:bg-[#f2f2f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
