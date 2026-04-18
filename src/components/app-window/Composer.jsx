import { ArrowUp, ChevronDown, FolderOpen, Mic, Settings } from 'lucide-react';

export function Composer() {
  return (
    <div className="shrink-0 bg-[#111112] px-5 pb-6 pt-3 lg:px-10">
      <div className="mx-auto max-w-[820px]">
        <div className="rounded-[22px] border border-white/[0.08] bg-[#2d2d30] px-4 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
          <div className="min-h-[52px] px-1 pt-0.5 text-[14px] text-white/26">Ask for follow-up changes</div>

          <div className="mt-2 flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-[11.5px] text-white/50">
              <button type="button" className="rounded-md p-1 hover:bg-white/[0.06]">+</button>
              <span>GPT-5.4</span>
              <ChevronDown className="h-3 w-3" />
              <span className="border-l border-white/[0.06] pl-3">Extra High</span>
              <ChevronDown className="h-3 w-3" />
            </div>

            <div className="flex items-center gap-1.5">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/[0.06]">
                <Mic className="h-4 w-4" />
              </button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a1a1a]">
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between px-2 text-[11.5px] text-white/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              Local environment
              <ChevronDown className="h-3 w-3" />
            </span>
            <span className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Default permissions
              <ChevronDown className="h-3 w-3" />
            </span>
          </div>
          <span className="flex items-center gap-1">
            <FolderOpen className="h-3 w-3" />
            codex/new_design
            <ChevronDown className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
