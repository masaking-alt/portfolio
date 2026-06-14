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
    <main className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(247,243,222,0.08)_45%,rgba(0,0,0,0.08)_100%)]" />
      <h1 className="sr-only">Masaking interface selection</h1>
      <div className="relative grid w-full max-w-[220px] grid-cols-2 gap-8 sm:max-w-[250px] sm:gap-10">
        {homeOptions.map(({ key, label, detail, Icon, iconClassName }) => (
          <button
            key={key}
            type="button"
            aria-label={`Open ${label} ${detail}`}
            onClick={handlers[key]}
            className="group flex min-w-0 cursor-pointer flex-col items-center text-center outline-none"
          >
            <span
              className="rounded-[22px] p-1.5 transition duration-150 ease-out group-hover:bg-white/[0.18] group-hover:ring-1 group-hover:ring-white/[0.72] group-focus-visible:bg-white/[0.24] group-focus-visible:ring-2 group-focus-visible:ring-black/[0.24]"
            >
              <span
                className={`flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/[0.48] shadow-[0_16px_34px_rgba(30,33,42,0.22),0_1px_5px_rgba(255,255,255,0.30),inset_0_1px_0_rgba(255,255,255,0.42)] transition duration-150 ease-out group-hover:-translate-y-0.5 sm:h-20 sm:w-20 ${iconClassName}`}
              >
                {createElement(Icon, { className: 'h-9 w-9 sm:h-10 sm:w-10', strokeWidth: 1.8 })}
              </span>
            </span>
            <span className="mt-1.5 text-[13px] font-semibold leading-4 text-black/[0.88] [text-shadow:0_1px_2px_rgba(255,255,255,0.72)]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
