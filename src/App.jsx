import {
  ArrowUp,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Filter,
  FolderOpen,
  GitCommitHorizontal,
  LayoutGrid,
  Mic,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  SquarePen,
} from 'lucide-react';
import { createElement, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { works } from './works';

const navigationItems = [
  { label: 'New Thread', icon: SquarePen },
  { label: 'Search', icon: Search },
  { label: 'Skills & Apps', icon: LayoutGrid },
  { label: 'Automation', icon: Clock3 },
];

const aboutContent = {
  title: 'about me',
  imageUrl: '/profile.jpg',
  leadLines: ['高知大学で', '情報科学を専攻。', 'バイブコーディングに', '没頭する日々。'],
  paragraphs: [
    '昔からプログラミングに興味があり、AIを利用することでそのハードルが下がったため、web制作に挑戦しています。ユーザーにとって魅力的で使いやすいサイトを作れるようになりたいです。',
    '好きなゲームはモンハンで、特に3DSのシリーズが好きです。好きなアーティストはVaundy。アニメ、マンガ、映画を見るのも好きです。',
  ],
  technologies: ['HTML', 'CSS', 'JavaScript (React)', 'Vite', 'React Router', 'ESLint', 'Node.js', 'npm'],
};

const contactContent = {
  title: 'reach out',
  intro: '制作やサイトの相談、感想、コラボの相談などがあれば気軽にご連絡ください。',
  email: 'banbenjianggui@gmail.com',
  links: [
    { label: 'Instagram', href: 'https://www.instagram.com/masa.ki8904?igsh=b3hqMjd6aHdnazJ5' },
    { label: 'X (Twitter)', href: 'https://x.com/KZOzame1?s=09' },
    { label: 'BeReal', href: 'https://bere.al/masaki9876' },
  ],
};

function buildTopDiffEntries() {
  return [
    {
      kind: 'text',
      fileName: 'README.md',
      addedLines: [
        '# portfolio',
        '',
        'AIネイティブなWebアプリとChrome拡張を中心に制作しているポートフォリオです。',
        'works, about, contact の各スレッドから内容を切り替えられます。',
      ],
    },
    {
      kind: 'text',
      fileName: 'overview.md',
      addedLines: [
        '- works: 制作した作品一覧',
        '- about: 自己紹介とこのサイトについて',
        '- contact: メールとSNSリンク',
      ],
    },
  ];
}

function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

function formatCurrentTimestamp() {
  const now = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()];
  return `${weekday}, ${month} ${now.getDate()} ${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`;
}

function splitTextLines(text, width = 26) {
  const lines = [];
  for (let index = 0; index < text.length; index += width) {
    lines.push(text.slice(index, index + width));
  }
  return lines;
}

function buildWorksOverviewDiffEntries() {
  return [
    {
      kind: 'text',
      fileName: 'works.md',
      addedLines: ['# works', '', ...works.map((work) => `- ${work.title} / ${work.category}`)],
    },
    {
      kind: 'text',
      fileName: 'links.json',
      addedLines: works.map((work) => `"${work.title}": "${work.externalUrl}"`),
    },
    {
      kind: 'text',
      fileName: 'stack.json',
      addedLines: Array.from(new Set(works.flatMap((work) => work.technologies))).slice(0, 10).map((technology) => `"${technology}"`),
    },
  ];
}

function buildWorkDiffEntries(work) {
  return [
    {
      kind: 'image',
      fileName: work.imageUrl.split('/').pop() ?? 'preview.png',
      imageUrl: work.imageUrl,
      imageAlt: work.title,
      caption: '+ プレビュー画像を追加',
      addedLines: ['preview updated'],
    },
    {
      kind: 'text',
      fileName: 'description.md',
      addedLines: splitTextLines(work.description, 24),
    },
    {
      kind: 'text',
      fileName: 'technologies.json',
      addedLines: work.technologies.map((technology) => `"${technology}"`),
    },
  ];
}

function buildAboutDiffEntries() {
  return [
    {
      kind: 'image',
      fileName: 'profile.jpg',
      imageUrl: aboutContent.imageUrl,
      imageAlt: 'プロフィール写真',
      caption: '+ プロフィール画像を追加',
      addedLines: ['profile updated'],
    },
    {
      kind: 'text',
      fileName: 'about.md',
      addedLines: [...aboutContent.leadLines, '', ...aboutContent.paragraphs],
    },
    {
      kind: 'text',
      fileName: 'site-stack.json',
      addedLines: aboutContent.technologies.map((technology) => `"${technology}"`),
    },
  ];
}

function buildContactDiffEntries() {
  return [
    {
      kind: 'text',
      fileName: 'contact.md',
      addedLines: ['# reach out', '', contactContent.intro, '', `mail: ${contactContent.email}`],
    },
    {
      kind: 'text',
      fileName: 'socials.json',
      addedLines: contactContent.links.map((link) => `"${link.label}": "${link.href}"`),
    },
  ];
}

function getAddedLineCount(diffEntries) {
  return diffEntries.reduce((total, entry) => total + entry.addedLines.length, 0);
}

function getThreadState(threadType, selectedWork) {
  if (selectedWork) {
    return {
      title: `${selectedWork.title} portfolio`,
      question: `${selectedWork.title} について説明して`,
      answerTitle: `${selectedWork.title} について説明します。`,
      paragraphs: [
        selectedWork.description,
        `${selectedWork.category} として公開している作品です。画像から公開ページに移動でき、技術スタックや概要をまとめて確認できます。`,
      ],
      diffEntries: buildWorkDiffEntries(selectedWork),
    };
  }

  if (threadType === 'about') {
    return {
      title: 'about portfolio',
      question: 'about me を見せて',
      answerTitle: 'about me です。',
      paragraphs: [
        'プロフィール、簡単な自己紹介、このサイトを作るのに使った技術をまとめています。',
      ],
      diffEntries: buildAboutDiffEntries(),
    };
  }

  if (threadType === 'contact') {
    return {
      title: 'contact portfolio',
      question: '連絡先を教えて',
      answerTitle: '連絡先はこちらです。',
      paragraphs: [
        'メールとSNSのリンクをまとめています。気軽にご連絡ください。',
      ],
      diffEntries: buildContactDiffEntries(),
    };
  }

  if (threadType === 'top') {
    return {
      title: 'top portfolio',
      question: 'このポートフォリオについて教えて',
      answerTitle: 'ポートフォリオの概要です。',
      paragraphs: [
        'このポートフォリオでは、works / about / contact のスレッドごとに内容を切り替えられます。',
        '左のスレッドから作品一覧、自己紹介、連絡先に移動できます。',
      ],
      diffEntries: buildTopDiffEntries(),
    };
  }

  return {
    title: 'works portfolio',
    question: '制作した作品を見せて',
    answerTitle: '作品一覧です。',
    paragraphs: [
      'Webアプリ、Chrome拡張、Webサイト、ゲームなど、これまでに制作したものを一覧でまとめています。',
      '各作品の画像または Open ボタンから公開中のページへ移動できます。',
    ],
    diffEntries: buildWorksOverviewDiffEntries(),
  };
}

function clampColumnWidths(widths, containerWidth) {
  const minLeft = 220;
  const minCenter = 520;
  const minRight = 420;
  const maxLeft = Math.max(minLeft, containerWidth - minCenter - minRight);
  const left = Math.min(Math.max(widths.left, minLeft), maxLeft);
  const maxRight = Math.max(minRight, containerWidth - left - minCenter);
  const right = Math.min(Math.max(widths.right, minRight), maxRight);
  return { left, right };
}

function getRouteLabel(threadType, selectedWork) {
  if (selectedWork) {
    return `works/${selectedWork.id}`;
  }
  return threadType;
}

function getModeLabel(displayMode) {
  if (displayMode === 'cli') {
    return 'Masaking CLI';
  }
  if (displayMode === 'app') {
    return 'Masaking App';
  }
  return 'Terminal standby';
}

function WindowShell({ title, subtitle, statusLabel, actions, active = false, className = '', bodyClassName = '', children }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border bg-[#0d1017]/90 backdrop-blur-xl ${
        active
          ? 'border-white/16 shadow-[0_28px_90px_rgba(0,0,0,0.48)]'
          : 'border-white/10 shadow-[0_18px_56px_rgba(0,0,0,0.34)]'
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />

      <div className="relative flex h-12 items-center justify-between border-b border-white/[0.08] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-medium text-white/88">{title}</div>
            {subtitle ? (
              <div className="truncate text-[10.5px] uppercase tracking-[0.12em] text-white/34">{subtitle}</div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusLabel ? (
            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10.5px] uppercase tracking-[0.12em] text-white/56">
              {statusLabel}
            </span>
          ) : null}
          {actions}
        </div>
      </div>

      <div className={`relative min-h-0 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

function DesktopBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(84,118,255,0.28),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(51,207,198,0.18),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(255,120,84,0.18),transparent_28%)]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '140px 140px',
        }}
      />
      <div className="absolute -left-12 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-500/14 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
    </div>
  );
}

function DesktopMenuBar({ displayMode }) {
  return (
    <div className="relative z-40 flex h-9 items-center justify-between border-b border-white/[0.08] bg-[#070a10]/70 px-4 text-[12px] text-white/72 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-4">
        <img src="/favicon.png" alt="" className="h-4 w-4 rounded-[4px]" />
        <span className="font-semibold text-white/88">masaking.desktop</span>
        <span>Session</span>
        <span>Portfolio</span>
        <span>Window</span>
        <span className="truncate rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10.5px] uppercase tracking-[0.12em] text-white/52">
          {getModeLabel(displayMode)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Search className="h-3.5 w-3.5" />
        <span>{formatCurrentTimestamp()}</span>
      </div>
    </div>
  );
}

function DesktopDock({ displayMode, onSelectMode }) {
  const dockItems = [
    { id: 'idle', label: 'Terminal' },
    { id: 'cli', label: 'Masaking CLI' },
    { id: 'app', label: 'Masaking App' },
  ];

  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-2 rounded-[24px] border border-white/[0.1] bg-[#0b0f16]/78 px-3 py-2 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {dockItems.map((item) => {
          const isActive = item.id === displayMode;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMode(item.id)}
              className={`flex min-w-[94px] flex-col items-center rounded-2xl border px-3 py-2 text-center transition ${
                isActive
                  ? 'border-cyan-300/30 bg-cyan-300/12 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.08)]'
                  : 'border-white/[0.06] bg-white/[0.03] text-white/62 hover:bg-white/[0.06] hover:text-white/86'
              }`}
            >
              <span className="text-[12px] font-medium">{item.label}</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/34">
                {item.id === 'idle' ? 'launcher' : item.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LauncherTerminalWindow({ threadType, selectedWork, displayMode, onSelectMode }) {
  const routeLabel = getRouteLabel(threadType, selectedWork);
  const modeOptions = [
    {
      id: 'cli',
      command: './launch masaking-cli',
      description: 'コマンド履歴ベースで閲覧',
    },
    {
      id: 'app',
      command: 'open -a "Masaking App"',
      description: 'GUIワークスペースで閲覧',
    },
  ];

  return (
    <WindowShell
      title="terminal"
      subtitle="runtime selector"
      statusLabel={displayMode === 'idle' ? 'waiting' : 'linked'}
      active={displayMode === 'idle'}
      className="flex h-full min-h-0 flex-col"
      bodyClassName="flex-1 min-h-0"
    >
      <div className="flex h-full min-h-0 flex-col bg-[#081018] p-4 font-mono text-[12px] leading-6 text-[#9ab0c6]">
        <div className="space-y-1">
          <div className="text-[#d6e7ff]">Last login: {formatCurrentTimestamp()} on portfolio.local</div>
          <div>connect target ........ portfolio://masaking</div>
          <div>content route ........ {routeLabel}</div>
          <div>workspace state ..... {getModeLabel(displayMode)}</div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#1a2a39] bg-[#0b1420] p-3">
          <div className="text-[#79e7ff]">visitor@portfolio ~ % select-runtime</div>

          <div className="mt-3 space-y-2">
            {modeOptions.map((option) => {
              const isActive = displayMode === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelectMode(option.id)}
                  className={`flex w-full items-start justify-between rounded-xl border px-3 py-2 text-left transition ${
                    isActive
                      ? 'border-cyan-300/28 bg-cyan-300/10 text-[#d9f7ff]'
                      : 'border-[#163044] bg-[#0e1a27] text-[#a8bed2] hover:border-cyan-300/22 hover:text-[#d9f7ff]'
                  }`}
                >
                  <span>{option.command}</span>
                  <span className="ml-4 shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#6e87a0]">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#152433] bg-[#0b1420]/80 p-3">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#64809a]">Hint</div>
          <div className="mt-2 space-y-1 text-[#91a8be]">
            <div>CLI: 作品説明や差分をコマンドライン風に確認</div>
            <div>App: 既存の3カラムUIをアプリウィンドウとして表示</div>
            <div>Terminal: メインウィンドウを閉じてランチャーだけ残す</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectMode('idle')}
          className="mt-4 rounded-xl border border-[#163044] bg-[#0e1a27] px-3 py-2 text-left text-[#8fa4b9] transition hover:border-white/16 hover:text-white"
        >
          visitor@portfolio ~ % exit-workspace
        </button>

        <div className="mt-auto pt-4 text-[#607b93]">ready for Masaking CLI / Masaking App</div>
      </div>
    </WindowShell>
  );
}

function ThreadGroup({ label, isActive, isOpen, onToggle, children }) {
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

function LeftSidebar({ activeThreadType, selectedWorkId }) {
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
    <aside className="relative order-4 flex min-h-0 flex-col bg-[#141415] lg:order-none lg:col-start-1 lg:row-[1/3] lg:border-r lg:border-white/[0.05]">
      <div className="flex h-12 items-center justify-between px-3.5">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/28">Workspace</div>
          <div className="mt-1 text-[13px] font-medium text-white/82">Masaking App</div>
        </div>

        <div className="flex items-center gap-1 text-white/28">
          <button type="button" className="rounded-md p-1 hover:bg-white/[0.05]">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="rounded-md p-1 hover:bg-white/[0.05]">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
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

      <div className="border-t border-white/[0.05] px-3 py-3">
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

function TopBar({ title, addedCount }) {
  return (
    <header className="order-1 flex h-10 items-center justify-between border-b border-white/[0.05] bg-[#181818] px-4 lg:order-none lg:col-[2/4] lg:row-start-1">
      <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-white/84">
        <span className="truncate font-medium">{title}</span>
        <MoreHorizontal className="h-3.5 w-3.5 shrink-0 text-white/34" />
      </div>

      <div className="flex items-center gap-1.5 text-white/46">
        <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.05] hover:bg-white/[0.05]">
          <Play className="h-3.5 w-3.5" />
        </button>
        <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.05] hover:bg-white/[0.05]">
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="ml-1 flex items-center gap-1.5 rounded-md border border-white/[0.05] bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-white/76 hover:bg-white/[0.06]"
        >
          <GitCommitHorizontal className="h-3.5 w-3.5 text-white/44" />
          <span>Commit</span>
          <ChevronDown className="h-3 w-3 text-white/34" />
        </button>
        <span className="ml-2 font-mono text-[11.5px] text-[#3fb950]">+{addedCount}</span>
      </div>
    </header>
  );
}

function ChangeSummary({ diffEntries }) {
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

function Composer() {
  return (
    <div className="px-5 pb-6 pt-2 lg:px-10">
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

function WorksOverviewContent({ diffEntries }) {
  return (
    <>
      <div className="mt-6 space-y-5">
        {works.map((work) => (
          <article key={work.id} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141415] p-4">
            <div className="grid gap-5 md:grid-cols-[240px_minmax(0,1fr)]">
              <a
                href={work.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-black/20"
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </a>

              <div className="min-w-0">
                <div className="text-[12px] tracking-[0.08em] text-white/38">{work.category}</div>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-white/92">{work.title}</h2>
                  <a
                    href={work.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-white/[0.08] px-3 py-1.5 text-[11.5px] text-white/68 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Open
                  </a>
                </div>
                <p className="mt-3 text-[13.5px] leading-[1.9] text-white/68">{work.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.technologies.map((technology) => (
                    <span
                      key={`${work.id}-${technology}`}
                      className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/64"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ChangeSummary diffEntries={diffEntries} />
    </>
  );
}

function WorkDetailContent({ work, diffEntries }) {
  return (
    <>
      <div>
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl">
          <a
            href={work.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-black/20"
          >
            <img src={work.imageUrl} alt={work.title} className="h-auto max-h-[360px] w-full object-contain transition duration-300 group-hover:scale-[1.02]" />
          </a>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[12px] tracking-[0.08em] text-white/38">{work.category}</div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white/92">{work.title}</h2>
          <a
            href={work.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-white/[0.08] px-3 py-1.5 text-[11.5px] text-white/68 transition hover:bg-white/[0.05] hover:text-white"
          >
            Open
          </a>
        </div>
        <p className="mt-4 text-[13.5px] leading-[1.95] text-white/68">{work.description}</p>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-[12px] tracking-[0.08em] text-white/38">使用技術</div>
        <div className="flex flex-wrap gap-2.5">
          {work.technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      <ChangeSummary diffEntries={diffEntries} />
    </>
  );
}

function AboutContent({ diffEntries }) {
  return (
    <>
      <div className="mt-6">
        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141415] p-3">
            <img src={aboutContent.imageUrl} alt="プロフィール写真" className="aspect-square w-full rounded-xl object-cover" />
          </div>

          <div className="min-w-0">
            <p className="text-[24px] font-semibold leading-[1.5] tracking-[-0.03em] text-white/92">
              {aboutContent.leadLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <div className="mt-5 space-y-3">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[13.5px] leading-[1.95] text-white/68">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 text-[12px] tracking-[0.08em] text-white/38">このサイトの技術</div>
          <div className="flex flex-wrap gap-2.5">
            {aboutContent.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ChangeSummary diffEntries={diffEntries} />
    </>
  );
}

function ContactContent({ diffEntries }) {
  return (
    <>
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#141415] p-6">
        <p className="text-[15px] leading-7 text-white/76">{contactContent.intro}</p>
        <a
          href={`mailto:${contactContent.email}`}
          className="mt-5 inline-flex rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[14px] text-white/84 transition hover:bg-white/[0.06]"
        >
          {contactContent.email}
        </a>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {contactContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-4 py-4 text-[13px] text-white/72 transition hover:bg-white/[0.04] hover:text-white"
            >
              <div className="text-[11px] tracking-[0.08em] text-white/34">LINK</div>
              <div className="mt-2 font-medium">{link.label}</div>
            </a>
          ))}
        </div>
      </div>

      <ChangeSummary diffEntries={diffEntries} />
    </>
  );
}

function CenterColumn({ threadType, selectedWork, threadState, scrollRef }) {
  return (
    <section className="order-2 flex min-h-0 flex-col bg-[#111112] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.05]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-5 pb-8 pt-9 lg:px-10 custom-scrollbar">
        <div className="mx-auto max-w-[820px]">
          <div className="ml-auto flex max-w-[560px] flex-col items-end">
            <div className="rounded-2xl bg-[#2e2e31] px-4 py-3 text-[13.5px] leading-[1.6] text-white/92 shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
              {threadState.question}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-white/38">
              <span>Worked for 25m 55s</span>
              <ChevronRight className="h-3 w-3" />
            </div>

            <p className="text-[14px] font-medium leading-7 text-white/86">{threadState.answerTitle}</p>
            {threadState.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 pr-10 text-[13.5px] leading-[1.9] text-white/68">
                {paragraph}
              </p>
            ))}

            {selectedWork ? <WorkDetailContent work={selectedWork} diffEntries={threadState.diffEntries} /> : null}
            {!selectedWork && threadType === 'works' ? <WorksOverviewContent diffEntries={threadState.diffEntries} /> : null}
            {!selectedWork && threadType === 'about' ? <AboutContent diffEntries={threadState.diffEntries} /> : null}
            {!selectedWork && threadType === 'contact' ? <ContactContent diffEntries={threadState.diffEntries} /> : null}
          </div>
        </div>
      </div>

      <Composer />
    </section>
  );
}

function DiffHeader({ name, addedCount }) {
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

function AddOnlyTextDiff({ lines }) {
  return (
    <div className="font-mono text-[12px] leading-[1.65]">
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} className="grid grid-cols-[44px_minmax(0,1fr)]">
          <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-1.5 text-right text-white/28">
            {index + 1}
          </div>
          <div className="bg-[#15321f] px-3 py-1.5 text-[#89d39a]">+ {line}</div>
        </div>
      ))}
    </div>
  );
}

function AddOnlyImageDiff({ entry }) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)]">
      <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-3 text-right font-mono text-[11.5px] text-white/28">
        1
      </div>
      <div className="bg-[#132418] px-4 py-4">
        <div className="mx-auto aspect-square max-w-[420px] overflow-hidden rounded-lg border border-emerald-400/10 bg-black/20 p-3">
          <img src={entry.imageUrl} alt={entry.imageAlt} className="h-full w-full object-contain" />
        </div>
        <div className="mt-3 font-mono text-[11.5px] text-[#89d39a]">{entry.caption}</div>
      </div>
    </div>
  );
}

function RightColumn({ diffEntries, scrollRef }) {
  const totalAddedLines = getAddedLineCount(diffEntries);

  return (
    <aside className="order-3 flex min-h-0 flex-col bg-[#121212] lg:order-none lg:col-start-3 lg:row-start-2">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.05] px-3">
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

function AppWindow({ threadType, selectedWork, threadState }) {
  const addedCount = getAddedLineCount(threadState.diffEntries);
  const containerRef = useRef(null);
  const centerScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [draggingDivider, setDraggingDivider] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedWidths = JSON.parse(window.localStorage.getItem('portfolio-column-widths') ?? 'null');
      if (savedWidths && typeof savedWidths.left === 'number' && typeof savedWidths.right === 'number') {
        return savedWidths;
      }
    } catch {
      return { left: 268, right: 864 };
    }
    return { left: 268, right: 864 };
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop || containerWidth === 0) {
      return;
    }
    setColumnWidths((currentWidths) => clampColumnWidths(currentWidths, containerWidth));
  }, [containerWidth, isDesktop]);

  useEffect(() => {
    window.localStorage.setItem('portfolio-column-widths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  useEffect(() => {
    if (!isDesktop || !draggingDivider) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (draggingDivider === 'left') {
        const nextLeftWidth = event.clientX - rect.left;
        setColumnWidths((currentWidths) => clampColumnWidths({ ...currentWidths, left: nextLeftWidth }, rect.width));
      } else {
        const nextRightWidth = rect.right - event.clientX;
        setColumnWidths((currentWidths) => clampColumnWidths({ ...currentWidths, right: nextRightWidth }, rect.width));
      }
    };

    const handlePointerUp = () => setDraggingDivider(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingDivider, isDesktop]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (centerScrollRef.current) {
      centerScrollRef.current.scrollTop = 0;
    }
    if (rightScrollRef.current) {
      rightScrollRef.current.scrollTop = 0;
    }
  }, [threadType, selectedWork?.id]);

  const gridStyle = isDesktop
    ? { gridTemplateColumns: `${columnWidths.left}px minmax(0, 1fr) ${columnWidths.right}px` }
    : undefined;

  return (
    <WindowShell
      title="Masaking App"
      subtitle={threadState.title}
      statusLabel="GUI"
      active
      className="flex h-full min-h-0 flex-col"
      bodyClassName="flex-1 min-h-0"
      actions={
        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.12em] text-cyan-100/72">
          workspace
        </span>
      }
    >
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-hidden bg-[#111112]">
        <div
          className="grid h-full w-full grid-cols-1 auto-rows-max lg:grid-cols-[268px_minmax(0,1fr)_864px] lg:grid-rows-[40px_minmax(0,1fr)]"
          style={gridStyle}
        >
          <LeftSidebar activeThreadType={threadType} selectedWorkId={selectedWork?.id ?? null} />
          <TopBar title={threadState.title} addedCount={addedCount} />
          <CenterColumn
            threadType={threadType}
            selectedWork={selectedWork}
            threadState={threadState}
            scrollRef={centerScrollRef}
          />
          <RightColumn diffEntries={threadState.diffEntries} scrollRef={rightScrollRef} />
        </div>

        {isDesktop && containerWidth > 0 ? (
          <>
            <div
              style={{ left: `${columnWidths.left}px` }}
              className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingDivider('left');
              }}
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.05]" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-transparent transition hover:bg-white/[0.16]" />
            </div>
            <div
              style={{ left: `${containerWidth - columnWidths.right}px` }}
              className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingDivider('right');
              }}
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.05]" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-transparent transition hover:bg-white/[0.16]" />
            </div>
          </>
        ) : null}
      </div>
    </WindowShell>
  );
}

function CliPrompt({ command }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
      <span className="text-[#5d7792]">visitor@portfolio</span>
      <span className="text-[#3fe0aa]">%</span>
      <span className="text-[#d9e9ff]">{command}</span>
    </div>
  );
}

function CliWindow({ threadType, selectedWork, threadState }) {
  const routeLabel = getRouteLabel(threadType, selectedWork);
  const aggregateTechnologies = Array.from(new Set(works.flatMap((work) => work.technologies))).slice(0, 12);
  const technologies = selectedWork
    ? selectedWork.technologies
    : threadType === 'about'
      ? aboutContent.technologies
      : aggregateTechnologies;

  return (
    <WindowShell
      title="Masaking CLI"
      subtitle={`session://${routeLabel}`}
      statusLabel="CLI"
      active
      className="flex h-full min-h-0 flex-col"
      bodyClassName="flex-1 min-h-0"
      actions={
        <span className="rounded-full border border-emerald-300/18 bg-emerald-300/10 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.12em] text-emerald-100/72">
          readonly
        </span>
      }
    >
      <div className="flex h-full min-h-0 flex-col bg-[#060a10]">
        <div className="flex h-10 items-center justify-between border-b border-[#16202c] px-4 font-mono text-[11.5px] text-[#657d96]">
          <span>/Users/user/development/website/portfolio</span>
          <span>{threadState.diffEntries.length} staged previews</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5 font-mono text-[12.5px] leading-6 custom-scrollbar">
          <CliPrompt command="boot masaking-cli" />
          <div className="mt-1 text-[#788fa7]">session attached to {routeLabel}</div>

          <CliPrompt command="ls sections" />
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/" className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#91bfe3] transition hover:text-white">
              open top
            </Link>
            <Link to="/works" className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#91bfe3] transition hover:text-white">
              open works
            </Link>
            <Link to="/about" className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#91bfe3] transition hover:text-white">
              open about
            </Link>
            <Link to="/contact" className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#91bfe3] transition hover:text-white">
              open contact
            </Link>
          </div>

          <CliPrompt command={selectedWork ? `open works/${selectedWork.id}` : `open ${threadType}`} />
          <div className="mt-3 rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
            <div className="text-[#d9e9ff]">{threadState.answerTitle}</div>
            <div className="mt-3 space-y-3 text-[#8da4bb]">
              {threadState.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {!selectedWork && threadType === 'works' ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#16202c] bg-[#0c121a]">
              {works.map((work) => (
                <Link
                  key={work.id}
                  to={`/work/${work.id}`}
                  className="flex items-center justify-between border-t border-[#13202d] px-4 py-3 first:border-t-0 transition hover:bg-white/[0.03]"
                >
                  <div>
                    <div className="text-[#d9e9ff]">{work.title}</div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">{work.category}</div>
                  </div>
                  <span className="text-[#72baf1]">open</span>
                </Link>
              ))}
            </div>
          ) : null}

          {selectedWork ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
              <a
                href={selectedWork.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-2xl border border-[#16202c] bg-[#0c121a] p-3"
              >
                <img src={selectedWork.imageUrl} alt={selectedWork.title} className="aspect-[16/10] w-full rounded-xl object-cover" />
              </a>

              <div className="rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">technologies</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedWork.technologies.map((technology) => (
                    <span key={technology} className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#9bc3e4]">
                      {technology}
                    </span>
                  ))}
                </div>
                <a
                  href={selectedWork.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-[#1e4969] bg-[#0f2132] px-3 py-1.5 text-[#d9f7ff] transition hover:bg-[#15324a]"
                >
                  xdg-open preview
                </a>
              </div>
            </div>
          ) : null}

          {!selectedWork && threadType === 'about' ? (
            <div className="mt-4 rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">stack --list</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {aboutContent.technologies.map((technology) => (
                  <span key={technology} className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#9bc3e4]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {!selectedWork && threadType === 'contact' ? (
            <div className="mt-4 rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">network --show</div>
              <a href={`mailto:${contactContent.email}`} className="mt-3 block text-[#d9f7ff] transition hover:text-white">
                {contactContent.email}
              </a>
              <div className="mt-3 flex flex-wrap gap-2">
                {contactContent.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#9bc3e4] transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {!selectedWork && threadType === 'top' ? (
            <div className="mt-4 rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">available technologies</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {aggregateTechnologies.map((technology) => (
                  <span key={technology} className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#9bc3e4]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {!selectedWork && threadType !== 'contact' && threadType !== 'about' && threadType !== 'top' ? (
            <div className="mt-4 rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#617b95]">stack --list</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span key={technology} className="rounded-full border border-[#17314a] bg-[#0b1420] px-3 py-1 text-[#9bc3e4]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <CliPrompt command="git diff --staged --stat" />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {threadState.diffEntries.map((entry) => (
              <div key={entry.fileName} className="rounded-2xl border border-[#16202c] bg-[#0c121a] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[#d9e9ff]">{entry.fileName}</span>
                  <span className="text-[#41d599]">+{entry.addedLines.length}</span>
                </div>
                <div className="mt-2 text-[#7088a1]">
                  {entry.kind === 'image' ? 'image preview staged' : entry.addedLines.slice(0, 3).join(' / ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowShell>
  );
}

function WorkspaceScreen({ threadType = 'works' }) {
  const { id } = useParams();
  const selectedWork = threadType === 'works' && id ? works.find((work) => work.id === id) ?? null : null;
  const effectiveThreadType = selectedWork ? 'works' : threadType;
  const threadState = getThreadState(effectiveThreadType, selectedWork);
  const [displayMode, setDisplayMode] = useState(() => (threadType === 'top' && !id ? 'idle' : 'app'));

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050816] text-white antialiased">
      <DesktopBackdrop />

      <div className="relative flex h-full flex-col overflow-hidden">
        <DesktopMenuBar displayMode={displayMode} />

        <div className="relative flex-1 overflow-hidden px-3 pb-24 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
          <div className="flex h-full flex-col gap-4 lg:hidden">
            <div className="shrink-0">
              <LauncherTerminalWindow
                threadType={effectiveThreadType}
                selectedWork={selectedWork}
                displayMode={displayMode}
                onSelectMode={setDisplayMode}
              />
            </div>

            {displayMode === 'cli' ? (
              <div className="min-h-0 flex-1">
                <CliWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
              </div>
            ) : null}

            {displayMode === 'app' ? (
              <div className="min-h-0 flex-1">
                <AppWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
              </div>
            ) : null}
          </div>

          <div className="relative hidden h-full lg:block">
            <div className="absolute left-0 top-0 z-20 h-[360px] w-[360px] xl:h-[390px] xl:w-[380px]">
              <LauncherTerminalWindow
                threadType={effectiveThreadType}
                selectedWork={selectedWork}
                displayMode={displayMode}
                onSelectMode={setDisplayMode}
              />
            </div>

            {displayMode === 'cli' ? (
              <div className="absolute bottom-0 left-[300px] right-0 top-[72px] xl:left-[328px] xl:top-[86px]">
                <CliWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
              </div>
            ) : null}

            {displayMode === 'app' ? (
              <div className="absolute bottom-0 left-[286px] right-0 top-[64px] xl:left-[316px] xl:top-[80px]">
                <AppWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
              </div>
            ) : null}
          </div>
        </div>

        <DesktopDock displayMode={displayMode} onSelectMode={setDisplayMode} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceScreen threadType="top" />} />
      <Route path="/works" element={<WorkspaceScreen threadType="works" />} />
      <Route path="/work/:id" element={<WorkspaceScreen threadType="works" />} />
      <Route path="/about" element={<WorkspaceScreen threadType="about" />} />
      <Route path="/contact" element={<WorkspaceScreen threadType="contact" />} />
    </Routes>
  );
}

export default App;
