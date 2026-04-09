import {
  Apple,
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
  Mic,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  SquarePen,
  LayoutGrid,
} from 'lucide-react';
import { createElement, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { works } from './works';

const navigationItems = [
  { label: '新しいスレッド', icon: SquarePen },
  { label: 'Search', icon: Search },
  { label: 'スキルとアプリ', icon: LayoutGrid },
  { label: 'オートメーション', icon: Clock3 },
];

const homeProject = {
  title: 'portfolio',
  category: 'Workspace',
  description:
    'AIネイティブなWebアプリとChrome拡張を中心に制作しているポートフォリオです。React + Vite + Tailwind CSS を軸に、Codex デスクトップアプリ風のUIで作品一覧と詳細を1つの画面にまとめています。',
  technologies: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'lucide-react', 'UI Design'],
};

function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

function formatCurrentTimestamp() {
  const now = new Date();
  const dayLabel = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
  return `${now.getMonth() + 1}月${now.getDate()}日(${dayLabel}) ${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`;
}

function formatThreadTime(index) {
  const labels = ['27分', '1時間', '3時間', '昨日', '3日前', '1か月', '1か月'];
  return labels[index] ?? '1か月';
}

function splitTextLines(text, width = 26) {
  const lines = [];
  for (let index = 0; index < text.length; index += width) {
    lines.push(text.slice(index, index + width));
  }
  return lines;
}

function buildHomeDiffEntries() {
  const technologies = Array.from(new Set(works.flatMap((work) => work.technologies))).slice(0, 8);

  return [
    {
      kind: 'text',
      fileName: 'README.md',
      addedLines: [
        '# portfolio',
        '',
        'AIネイティブな開発スタイルで作ったポートフォリオです。',
        '左にスレッド一覧、中央に会話、右にステージ済み表示を配置しています。',
        '作品一覧と詳細を同一ワークスペース内で切り替えられます。',
      ],
    },
    {
      kind: 'text',
      fileName: 'workspace.md',
      addedLines: [
        '## Layout',
        '- 左カラム: スレッド一覧風の作品ナビゲーション',
        '- 中央カラム: 会話ログとフォローアップ入力',
        '- 右カラム: ステージ済みの差分表示',
        '- ブラウザ幅いっぱいの可変カラムレイアウト',
      ],
    },
    {
      kind: 'text',
      fileName: 'stack.json',
      addedLines: technologies.map((technology) => `"${technology}"`),
    },
  ];
}

function buildWorkDiffEntries(work) {
  return [
    {
      kind: 'image',
      fileName: work.imageUrl.split('/').pop() ?? 'preview.png',
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

function getAddedLineCount(diffEntries) {
  return diffEntries.reduce((total, entry) => total + entry.addedLines.length, 0);
}

function getConversationContent(work) {
  if (!work) {
    return {
      question: 'このプロジェクトについて説明して',
      answerTitle: 'このプロジェクトについて説明します。',
      paragraphs: [
        'このポートフォリオは、作品一覧と作品詳細を1つのワークスペース上で切り替える React + Vite 製のフロントエンドです。UI は Codex デスクトップアプリを参照し、ダークテーマ、3カラム構成、差分表示、下部コンポーザーまで含めて再構成しています。',
        '左カラムはスレッド一覧として各作品へ移動する導線、中央カラムは会話ログとして概要説明、右カラムはステージ済み表示としてプロジェクト説明や技術情報を追加-only の diff 形式で表示します。ブラウザ幅いっぱいに使いながら、カラム幅はドラッグで調整できる設計です。',
      ],
    };
  }

  return {
    question: `${work.title} について説明して`,
    answerTitle: `${work.title} について説明します。`,
    paragraphs: [
      work.description,
      `${work.category} として公開している作品で、右側のステージ済み欄にはプレビュー画像、説明文、使用技術を追加-only の diff としてまとめています。外部リンクや技術スタックの確認をしやすい構成です。`,
    ],
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

function LeftSidebar({ selectedWorkId, isHomeSelected }) {
  return (
    <aside className="relative order-4 flex min-h-0 flex-col bg-[#141415] lg:order-none lg:col-start-1 lg:row-[1/3] lg:border-r lg:border-white/[0.05]">
      <div className="flex h-12 items-center justify-between px-3.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
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
        <span>スレッド</span>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          <LayoutGrid className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-3 custom-scrollbar">
        <div className="mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-white/86">
          <FolderOpen className="h-4 w-4 text-white/46" />
          <span>portfolio</span>
        </div>

        <Link
          to="/"
          className={`ml-[22px] flex items-start justify-between rounded-xl px-3 py-2 transition ${
            isHomeSelected
              ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
              : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
          }`}
        >
          <div className="min-w-0 pr-2">
            <div className="truncate text-[12.5px] font-medium">このプロジェクトについて説明して</div>
            <div className={`mt-0.5 truncate text-[11px] ${isHomeSelected ? 'text-white/42' : 'text-white/28'}`}>
              プロジェクト概要
            </div>
          </div>
          <span className={`pt-0.5 text-[10.5px] ${isHomeSelected ? 'text-white/42' : 'text-white/28'}`}>57分</span>
        </Link>

        {works.map((work, index) => {
          const isSelected = selectedWorkId === work.id;
          return (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              className={`ml-[22px] flex items-start justify-between rounded-xl px-3 py-2 transition ${
                isSelected
                  ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="truncate text-[12.5px] font-medium">{work.title}</div>
                <div className={`mt-0.5 truncate text-[11px] ${isSelected ? 'text-white/42' : 'text-white/28'}`}>
                  {work.category}
                </div>
              </div>
              <span className={`pt-0.5 text-[10.5px] ${isSelected ? 'text-white/42' : 'text-white/28'}`}>{formatThreadTime(index)}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/[0.05] px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] text-white/68 transition hover:bg-white/[0.045] hover:text-white"
        >
          <Settings className="h-4 w-4 text-white/52" />
          <span>設定</span>
        </button>
      </div>
    </aside>
  );
}

function MacMenuBar() {
  return (
    <div className="flex h-6 items-center justify-between border-b border-white/[0.05] bg-[#17181a] px-3 text-[12px] text-white/72">
      <div className="flex items-center gap-4">
        <Apple className="h-3.5 w-3.5 text-white/88" />
        <span className="font-semibold text-white/90">Codex</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
        <span>Help</span>
      </div>

      <div className="flex items-center gap-3">
        <Search className="h-3.5 w-3.5" />
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded border border-white/20 px-1 text-[10px] font-semibold">A</span>
        <span>{formatCurrentTimestamp()}</span>
      </div>
    </div>
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
          <span>コミット</span>
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
          <span>{diffEntries.length}個のファイルが変更されました</span>
          <span className="font-mono text-[#3fb950]">+{totalAddedLines}</span>
        </div>
        <button type="button" className="text-white/38 hover:text-white/70">
          元に戻す
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
        <div className="rounded-[22px] border border-white/[0.08] bg-[#2d2d30] px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
          <div className="min-h-[72px] px-1 pt-1 text-[14px] text-white/26">フォローアップの変更を求める</div>

          <div className="mt-3 flex items-center justify-between pt-3">
            <div className="flex items-center gap-2 text-[11.5px] text-white/50">
              <button type="button" className="rounded-md p-1 hover:bg-white/[0.06]">+</button>
              <span>GPT-5.4</span>
              <ChevronDown className="h-3 w-3" />
              <span className="border-l border-white/[0.06] pl-3">非常に高い</span>
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
              ローカル環境
              <ChevronDown className="h-3 w-3" />
            </span>
            <span className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              デフォルト権限
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

function WorkCenterContent({ work, diffEntries }) {
  return (
    <>
      <div>
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl">
          <img src={work.imageUrl} alt={work.title} className="h-auto max-h-[360px] w-full object-contain" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[12px] tracking-[0.08em] text-white/38">{work.category}</div>
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white/92">{work.title}</h2>
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

function CenterColumn({ work, diffEntries, scrollRef }) {
  const conversation = getConversationContent(work);

  return (
    <section className="order-2 flex min-h-0 flex-col bg-[#111112] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.05]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-5 pb-8 pt-9 lg:px-10 custom-scrollbar">
        <div className="mx-auto max-w-[820px]">
          <div className="ml-auto flex max-w-[560px] flex-col items-end">
            <div className="rounded-2xl bg-[#2e2e31] px-4 py-3 text-[13.5px] leading-[1.6] text-white/92 shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
              {conversation.question}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-white/38">
              <span>25m 55s作業しました</span>
              <ChevronRight className="h-3 w-3" />
            </div>

            <p className="text-[14px] font-medium leading-7 text-white/86">{conversation.answerTitle}</p>
            {work ? (
              <div className="mt-5">
                <WorkCenterContent work={work} diffEntries={diffEntries} />
              </div>
            ) : (
              <>
                {conversation.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 pr-10 text-[13.5px] leading-[1.9] text-white/68">
                    {paragraph}
                  </p>
                ))}

                <ChangeSummary diffEntries={diffEntries} />
              </>
            )}
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

function AddOnlyImageDiff({ work }) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)]">
      <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-3 text-right font-mono text-[11.5px] text-white/28">
        1
      </div>
      <div className="bg-[#132418] px-4 py-4">
        <div className="mx-auto aspect-square max-w-[420px] overflow-hidden rounded-lg border border-emerald-400/10 bg-black/20 p-3">
          <img src={work.imageUrl} alt={work.title} className="h-full w-full object-contain" />
        </div>
        <div className="mt-3 font-mono text-[11.5px] text-[#89d39a]">+ プレビュー画像を追加</div>
      </div>
    </div>
  );
}

function RightColumn({ work, diffEntries, scrollRef }) {
  const totalAddedLines = getAddedLineCount(diffEntries);

  return (
    <aside className="order-3 flex min-h-0 flex-col bg-[#121212] lg:order-none lg:col-start-3 lg:row-start-2">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.05] px-3">
        <div className="flex items-center gap-1.5 text-white/80">
          <ChevronRight className="h-3.5 w-3.5 text-white/38" />
          <span className="text-[12.5px] font-medium">ステージ済み</span>
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
              {entry.kind === 'image' ? <AddOnlyImageDiff work={work} /> : <AddOnlyTextDiff lines={entry.addedLines} />}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}

function WorkspaceScreen() {
  const { id } = useParams();
  const selectedWork = works.find((work) => work.id === id) ?? null;
  const isHomeSelected = !selectedWork;
  const diffEntries = selectedWork ? buildWorkDiffEntries(selectedWork) : buildHomeDiffEntries();
  const addedCount = getAddedLineCount(diffEntries);
  const title = isHomeSelected
    ? 'Codexアプリ風にポートフォリオ改修 portfolio'
    : `${selectedWork.title} の説明更新 portfolio`;

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
  }, [id]);

  const gridStyle = isDesktop
    ? { gridTemplateColumns: `${columnWidths.left}px minmax(0, 1fr) ${columnWidths.right}px` }
    : undefined;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#111112] text-white antialiased">
      <div className="flex h-full w-full flex-col">
        <MacMenuBar />

        <div ref={containerRef} className="relative min-h-0 flex-1 overflow-auto lg:overflow-hidden">
          <div
            className="grid h-full w-full grid-cols-1 auto-rows-max lg:grid-cols-[268px_minmax(0,1fr)_864px] lg:grid-rows-[40px_minmax(0,1fr)]"
            style={gridStyle}
          >
            <LeftSidebar selectedWorkId={selectedWork?.id ?? null} isHomeSelected={isHomeSelected} />
            <TopBar title={title} addedCount={addedCount} />
            <CenterColumn work={selectedWork} diffEntries={diffEntries} scrollRef={centerScrollRef} />
            <RightColumn work={selectedWork ?? { ...homeProject, imageUrl: '/profile.jpg' }} diffEntries={diffEntries} scrollRef={rightScrollRef} />
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
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceScreen />} />
      <Route path="/work/:id" element={<WorkspaceScreen />} />
    </Routes>
  );
}

export default App;
