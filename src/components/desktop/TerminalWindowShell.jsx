import { WindowControlButtons } from './WindowControlButtons';

export function TerminalWindowShell({
  title,
  onWindowPointerDown,
  onHeaderPointerDown,
  onToggleMaximize,
  isMaximized = false,
  active = false,
  className = '',
  children,
}) {
  return (
    <section
      onPointerDown={onWindowPointerDown}
      className={`desktop-window-surface ${isMaximized ? 'desktop-window-surface--maximized' : ''} relative overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#1c1c1c] shadow-[0_22px_60px_rgba(0,0,0,0.45)] ${
        active ? 'ring-1 ring-white/8' : ''
      } ${className}`}
    >
      <div
        onPointerDown={onHeaderPointerDown}
        className={`flex h-8 items-center justify-between border-b border-white/[0.06] bg-[linear-gradient(180deg,#303030_0%,#262626_100%)] px-3 ${
          onHeaderPointerDown ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <WindowControlButtons onToggleMaximize={onToggleMaximize} isMaximized={isMaximized} />

        <div className="min-w-0 flex-1 px-4 text-center text-[11px] font-medium text-white/72">
          <span className="truncate">{title}</span>
        </div>

        <div className="w-[42px]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#1e1e1e]">{children}</div>
    </section>
  );
}
