import { TerminalPrompt } from './TerminalPrompt';

export function TerminalPromptInput({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 text-[12px] leading-6">
      <TerminalPrompt />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#f5f5f5] outline-none placeholder:text-[#6c6c6c]"
        autoComplete="off"
        autoFocus
        spellCheck="false"
      />
    </form>
  );
}
