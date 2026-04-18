import { getAddedLineCount } from '../../utils/threadState';

export function ChangeSummary({ diffEntries }) {
  const totalAddedLines = getAddedLineCount(diffEntries);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-[#141414]">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3 text-[12.5px]">
        <div className="flex items-center gap-2 text-white/70">
          <span>{diffEntries.length} files changed</span>
          <span className="font-mono text-[#3fb950]">+{totalAddedLines}</span>
        </div>
        <button type="button" className="text-white/38 hover:text-white/70">
          Revert
        </button>
      </div>

      {diffEntries.map((entry) => (
        <div key={entry.fileName} className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 first:border-t-0">
          <span className="font-mono text-[12px] text-white/74">{entry.fileName}</span>
          <span className="font-mono text-[11.5px] text-[#3fb950]">+{entry.addedLines.length}</span>
        </div>
      ))}
    </div>
  );
}
