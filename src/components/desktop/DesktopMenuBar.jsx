import { Search } from 'lucide-react';
import { formatCurrentTimestamp } from '../../utils/date';
import { getModeLabel } from '../../utils/displayMode';

export function DesktopMenuBar({ displayMode, onBackHome }) {
  const canReturnHome = displayMode !== 'home';

  return (
    <div className="relative z-40 flex h-9 items-center justify-between border-b border-white/[0.26] bg-[#f7f3de]/55 px-3 text-[12px] text-black/70 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl sm:px-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <img src="/favicon.png" alt="" className="h-4 w-4 rounded-[4px]" />
        <span className="font-semibold text-black/86">{getModeLabel(displayMode)}</span>
        <span className="hidden sm:inline">Session</span>
        <span className="hidden sm:inline">Portfolio</span>
        {canReturnHome ? (
          <button
            type="button"
            onClick={onBackHome}
            className="cursor-pointer rounded px-1 py-0.5 transition hover:bg-black/[0.06] hover:text-black/[0.86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[0.22]"
          >
            Home
          </button>
        ) : (
          <span>Home</span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{formatCurrentTimestamp()}</span>
      </div>
    </div>
  );
}
