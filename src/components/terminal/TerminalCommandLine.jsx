import { TerminalPrompt } from './TerminalPrompt';

export function TerminalCommandLine({ command }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-6">
      <TerminalPrompt />
      <span className="whitespace-pre-wrap break-all text-[#f5f5f5]">{command}</span>
    </div>
  );
}
