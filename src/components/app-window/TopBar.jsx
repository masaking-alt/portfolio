import { CheckCheck, ChevronDown, GitCommitHorizontal, Menu, MoreHorizontal, Play } from 'lucide-react';

export function TopBar({ title, addedCount, onHeaderPointerDown, onOpenLeftPanel, onOpenRightPanel }) {
  return (
    <header
      onPointerDown={onHeaderPointerDown}
      className={`order-1 flex h-10 items-center justify-between border-b border-white/[0.05] bg-[#181818] px-2 lg:order-none lg:col-[2/4] lg:row-start-1 lg:px-4 ${
        onHeaderPointerDown ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-white/84">
        <button
          type="button"
          aria-label="左パネルを開く"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onOpenLeftPanel?.();
          }}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] text-white/58 hover:bg-white/[0.05] hover:text-white/84 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="truncate font-medium">{title}</span>
        <MoreHorizontal className="h-3.5 w-3.5 shrink-0 text-white/34" />
      </div>

      <div className="flex items-center gap-1.5 text-white/46">
        <button type="button" className="hidden h-7 w-7 items-center justify-center rounded-md border border-white/[0.05] hover:bg-white/[0.05] sm:inline-flex">
          <Play className="h-3.5 w-3.5" />
        </button>
        <button type="button" className="hidden h-7 w-7 items-center justify-center rounded-md border border-white/[0.05] hover:bg-white/[0.05] sm:inline-flex">
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="ml-1 hidden items-center gap-1.5 rounded-md border border-white/[0.05] bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-white/76 hover:bg-white/[0.06] sm:flex"
        >
          <GitCommitHorizontal className="h-3.5 w-3.5 text-white/44" />
          <span>Commit</span>
          <ChevronDown className="h-3 w-3 text-white/34" />
        </button>
        <span className="ml-1 font-mono text-[11.5px] text-[#3fb950] lg:ml-2">+{addedCount}</span>
        <button
          type="button"
          aria-label="右パネルを開く"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onOpenRightPanel?.();
          }}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] text-white/58 hover:bg-white/[0.05] hover:text-white/84 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
