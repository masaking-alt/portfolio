import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock3, Filter, FolderOpen, LayoutGrid, Search, Settings, SquarePen } from 'lucide-react';
import { works } from '../../works';
import { WindowControlButtons } from '../desktop/WindowControlButtons';
import { ThreadGroup } from './ThreadGroup';

const navigationItems = [
  { label: 'New Thread', icon: SquarePen },
  { label: 'Search', icon: Search },
  { label: 'Skills & Apps', icon: LayoutGrid },
  { label: 'Automation', icon: Clock3 },
];


export function LeftSidebar({
  activeThreadType,
  selectedWorkId,
  onHeaderPointerDown,
  onToggleMaximize,
  isMaximized = false,
}) {
  const [openGroups, setOpenGroups] = useState(() => ({
    top: true,
    works: true,
    about: activeThreadType === 'about',
    contact: activeThreadType === 'contact',
  }));

  useEffect(() => {
    setOpenGroups((current) => ({
      ...current,
      [activeThreadType]: true,
    }));
  }, [activeThreadType]);

  function toggleGroup(group) {
    setOpenGroups((current) => ({
      ...current,
      [group]: !current[group],
    }));
  }

  return (
    <aside className="relative order-4 flex min-h-0 flex-col overflow-hidden bg-[#141415] lg:order-none lg:col-start-1 lg:row-[1/3] lg:border-r lg:border-white/[0.05]">
      <div
        onPointerDown={onHeaderPointerDown}
        className={`px-3.5 py-3 ${
          onHeaderPointerDown ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <WindowControlButtons onToggleMaximize={onToggleMaximize} isMaximized={isMaximized} />
          <div className="flex items-center gap-1 text-white/28">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              className="rounded-md p-1 hover:bg-white/[0.05]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              className="rounded-md p-1 hover:bg-white/[0.05]"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-2.5 pb-1">
        {navigationItems.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-white/72 transition hover:bg-white/[0.045] hover:text-white/88"
          >
            {createElement(icon, { className: 'h-[14px] w-[14px] text-white/48' })}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-4 text-[12px] text-white/36">
        <span>Threads</span>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          <LayoutGrid className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-3 custom-scrollbar">
        <ThreadGroup
          label="TOP"
          isActive={activeThreadType === 'top'}
          isOpen={openGroups.top}
          onToggle={() => toggleGroup('top')}
        >
          <Link
            to="/"
            className={`ml-[32px] flex min-w-0 items-center rounded-lg px-3 py-1.5 transition ${
              activeThreadType === 'top'
                ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
            }`}
          >
            <div className="truncate text-[12.5px] font-medium">overview</div>
          </Link>
        </ThreadGroup>

        <ThreadGroup
          label="works"
          isActive={activeThreadType === 'works'}
          isOpen={openGroups.works}
          onToggle={() => toggleGroup('works')}
        >
          {works.map((work) => {
            const isSelected = activeThreadType === 'works' && selectedWorkId === work.id;
            return (
              <Link
                key={work.id}
                to={`/work/${work.id}`}
                className={`ml-[32px] flex min-w-0 items-center rounded-lg px-3 py-1.5 transition ${
                  isSelected
                    ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                    : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
                }`}
              >
                <div className="truncate text-[12.5px] font-medium">{work.title}</div>
              </Link>
            );
          })}
        </ThreadGroup>

        <ThreadGroup
          label="about"
          isActive={activeThreadType === 'about'}
          isOpen={openGroups.about}
          onToggle={() => toggleGroup('about')}
        >
          <Link
            to="/about"
            className={`ml-[32px] flex min-w-0 items-center rounded-lg px-3 py-1.5 transition ${
              activeThreadType === 'about'
                ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
            }`}
          >
            <div className="truncate text-[12.5px] font-medium">about me</div>
          </Link>
        </ThreadGroup>

        <ThreadGroup
          label="contact"
          isActive={activeThreadType === 'contact'}
          isOpen={openGroups.contact}
          onToggle={() => toggleGroup('contact')}
        >
          <Link
            to="/contact"
            className={`ml-[32px] flex min-w-0 items-center rounded-lg px-3 py-1.5 transition ${
              activeThreadType === 'contact'
                ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
            }`}
          >
            <div className="truncate text-[12.5px] font-medium">reach out</div>
          </Link>
        </ThreadGroup>
      </div>

      <div className="px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] text-white/68 transition hover:bg-white/[0.045] hover:text-white"
        >
          <Settings className="h-4 w-4 text-white/52" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
