import { ChevronRight, FolderOpen } from 'lucide-react';

export function ThreadGroup({ label, isActive, isOpen, onToggle, children }) {
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition ${
          isActive ? 'text-white/76' : 'text-white/50 hover:bg-white/[0.03] hover:text-white/68'
        }`}
      >
        <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition ${isOpen ? 'rotate-90 text-white/32' : 'text-white/24'}`} />
        <FolderOpen className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white/50' : 'text-white/28'}`} />
        <span>{label}</span>
      </button>
      {isOpen ? <div className="space-y-0.5">{children}</div> : null}
    </div>
  );
}
