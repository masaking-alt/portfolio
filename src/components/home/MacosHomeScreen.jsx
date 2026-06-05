import { createElement } from 'react';
import { Monitor, Terminal } from 'lucide-react';

const homeOptions = [
  {
    key: 'cui',
    label: 'CUI',
    detail: 'SSH',
    Icon: Terminal,
    iconClassName: 'bg-[linear-gradient(145deg,#262626_0%,#111111_100%)] text-[#32d74b]',
  },
  {
    key: 'gui',
    label: 'GUI',
    detail: 'App',
    Icon: Monitor,
    iconClassName: 'bg-[linear-gradient(145deg,#ffffff_0%,#dce9ff_58%,#8fb7ff_100%)] text-[#1b3768]',
  },
];

export function MacosHomeScreen({ onSelectCui, onSelectGui }) {
  const handlers = {
    cui: onSelectCui,
    gui: onSelectGui,
  };

  return (
    <main className="flex h-full min-h-0 items-center justify-center px-6 py-10">
      <h1 className="sr-only">Masaking interface selection</h1>
      <div className="grid w-full max-w-[520px] grid-cols-2 gap-8 sm:gap-14">
        {homeOptions.map(({ key, label, detail, Icon, iconClassName }) => (
          <button
            key={key}
            type="button"
            onClick={handlers[key]}
            className="group flex min-w-0 flex-col items-center rounded-[22px] px-3 py-4 text-center outline-none transition duration-200 hover:bg-white/[0.22] focus-visible:bg-white/[0.28] focus-visible:ring-2 focus-visible:ring-black/[0.18]"
          >
            <span
              className={`flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/[0.45] shadow-[0_18px_42px_rgba(42,45,53,0.2),inset_0_1px_0_rgba(255,255,255,0.38)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_rgba(42,45,53,0.24),inset_0_1px_0_rgba(255,255,255,0.42)] sm:h-28 sm:w-28 ${iconClassName}`}
            >
              {createElement(Icon, { className: 'h-11 w-11 sm:h-12 sm:w-12', strokeWidth: 1.8 })}
            </span>
            <span className="mt-3 inline-flex min-w-[58px] flex-col items-center rounded-lg bg-[#f7f3de]/80 px-2.5 py-1 shadow-[0_6px_18px_rgba(42,45,53,0.12)] backdrop-blur-sm">
              <span className="text-[13px] font-semibold leading-4 text-black/[0.82]">{label}</span>
              <span className="mt-0.5 text-[11px] leading-3 text-black/[0.52]">{detail}</span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
