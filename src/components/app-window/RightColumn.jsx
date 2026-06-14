import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { getAddedLineCount } from '../../utils/threadState';
import { AddOnlyImageDiff } from './AddOnlyImageDiff';
import { AddOnlyTextDiff } from './AddOnlyTextDiff';
import { DiffHeader } from './DiffHeader';

export function RightColumn({ diffEntries, scrollRef, variant = 'desktop' }) {
  const totalAddedLines = getAddedLineCount(diffEntries);

  return (
    <aside
      className={`min-h-0 flex-col overflow-hidden bg-[#121212] ${
        variant === 'drawer' ? 'flex h-full w-full border-l border-white/[0.08]' : 'hidden lg:order-none lg:col-start-3 lg:row-start-2 lg:flex'
      }`}
    >
      <div className="flex h-10 items-center justify-between px-3">
        <div className="flex items-center gap-1.5 text-white/80">
          <ChevronRight className="h-3.5 w-3.5 text-white/38" />
          <span className="text-[12.5px] font-medium">Staged</span>
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/48">{diffEntries.length}</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/32" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11.5px] text-[#3fb950]">+{totalAddedLines}</span>
          <button type="button" className="rounded p-1 text-white/34 hover:bg-white/[0.05] hover:text-white/70">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-4 py-4 custom-scrollbar">
        <div className="space-y-4">
          {diffEntries.map((entry) => (
            <section key={entry.fileName} className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]">
              <DiffHeader name={entry.fileName} addedCount={entry.addedLines.length} />
              {entry.kind === 'image' ? <AddOnlyImageDiff entry={entry} /> : <AddOnlyTextDiff lines={entry.addedLines} />}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}
