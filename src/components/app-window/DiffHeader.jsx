import { ChevronDown, MoreHorizontal } from 'lucide-react';

export function DiffHeader({ name, addedCount }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] bg-[#171717] px-3 py-2.5">
      <div className="flex items-center gap-2 font-mono text-[11.5px] text-white/78">
        <ChevronDown className="h-3.5 w-3.5 text-white/34" />
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11.5px] text-[#3fb950]">+{addedCount}</span>
        <MoreHorizontal className="h-3.5 w-3.5 text-white/34" />
      </div>
    </div>
  );
}
