import { Search } from 'lucide-react';
import { formatCurrentTimestamp } from '../../utils/date';
import { getModeLabel } from '../../utils/displayMode';

export function DesktopMenuBar({ displayMode }) {
  return (
    <div className="relative z-40 flex h-9 items-center justify-between px-4 text-[12px] text-black/68">
      <div className="flex min-w-0 items-center gap-4">
        <img src="/favicon.png" alt="" className="h-4 w-4 rounded-[4px]" />
        <span className="font-semibold text-black/86">{getModeLabel(displayMode)}</span>
        <span>Session</span>
        <span>Portfolio</span>
        <span>Window</span>
      </div>

      <div className="flex items-center gap-3">
        <Search className="h-3.5 w-3.5" />
        <span>{formatCurrentTimestamp()}</span>
      </div>
    </div>
  );
}
