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
  Image as ImageIcon,
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

const ナビ項目 = [
  { label: '新しいスレッド', icon: SquarePen },
  { label: 'Search', icon: Search },
  { label: 'スキルとアプリ', icon: LayoutGrid },
  { label: 'オートメーション', icon: Clock3 },
];

const ホーム概要 = {
  title: 'portfolio',
  category: 'Workspace',
  description:
    'AIネイティブなWebアプリとChrome拡張を中心に制作しているポートフォリオです。React + Vite + Tailwind CSS を軸に、Codex デスクトップアプリ風のUIで作品一覧と詳細を1つの画面にまとめています。',
  technologies: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'lucide-react', 'UI Design'],
};

function 二桁(値) {
  return String(値).padStart(2, '0');
}

function 現在時刻表示() {
  const 現在 = new Date();
  const 曜日 = ['日', '月', '火', '水', '木', '金', '土'][現在.getDay()];
  return `${現在.getMonth() + 1}月${現在.getDate()}日(${曜日}) ${二桁(現在.getHours())}:${二桁(現在.getMinutes())}`;
}

function スレッド時刻(index) {
  const 表示 = ['27分', '1時間', '3時間', '昨日', '3日前', '1か月', '1か月'];
  return 表示[index] ?? '1か月';
}

function 文字列を行分割(文字列, 幅 = 26) {
  const 行一覧 = [];
  for (let index = 0; index < 文字列.length; index += 幅) {
    行一覧.push(文字列.slice(index, index + 幅));
  }
  return 行一覧;
}

function ホーム差分データ() {
  const 技術一覧 = Array.from(new Set(works.flatMap((作品) => 作品.technologies))).slice(0, 8);

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
      addedLines: 技術一覧.map((技術) => `"${技術}"`),
    },
  ];
}

function 作品差分データ(作品) {
  return [
    {
      kind: 'image',
      fileName: 作品.imageUrl.split('/').pop() ?? 'preview.png',
      addedLines: ['preview updated'],
    },
    {
      kind: 'text',
      fileName: 'description.md',
      addedLines: 文字列を行分割(作品.description, 24),
    },
    {
      kind: 'text',
      fileName: 'technologies.json',
      addedLines: 作品.technologies.map((技術) => `"${技術}"`),
    },
  ];
}

function 追加行数合計(差分一覧) {
  return 差分一覧.reduce((合計, 項目) => 合計 + 項目.addedLines.length, 0);
}

function 会話内容(作品) {
  if (!作品) {
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
    question: `${作品.title} について説明して`,
    answerTitle: `${作品.title} について説明します。`,
    paragraphs: [
      作品.description,
      `${作品.category} として公開している作品で、右側のステージ済み欄にはプレビュー画像、説明文、使用技術を追加-only の diff としてまとめています。外部リンクや技術スタックの確認をしやすい構成です。`,
    ],
  };
}

function カラム幅を補正(幅, コンテナ幅) {
  const 最小左 = 220;
  const 最小中央 = 520;
  const 最小右 = 420;
  const 最大左 = Math.max(最小左, コンテナ幅 - 最小中央 - 最小右);
  const 左 = Math.min(Math.max(幅.left, 最小左), 最大左);
  const 最大右 = Math.max(最小右, コンテナ幅 - 左 - 最小中央);
  const 右 = Math.min(Math.max(幅.right, 最小右), 最大右);
  return { left: 左, right: 右 };
}

function LeftSidebar({ 選択作品ID, ホーム選択中 }) {
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
        {ナビ項目.map(({ label, icon }) => (
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
            ホーム選択中
              ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
              : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
          }`}
        >
          <div className="min-w-0 pr-2">
            <div className="truncate text-[12.5px] font-medium">このプロジェクトについて説明して</div>
            <div className={`mt-0.5 truncate text-[11px] ${ホーム選択中 ? 'text-white/42' : 'text-white/28'}`}>
              プロジェクト概要
            </div>
          </div>
          <span className={`pt-0.5 text-[10.5px] ${ホーム選択中 ? 'text-white/42' : 'text-white/28'}`}>57分</span>
        </Link>

        {works.map((作品, index) => {
          const 選択中 = 選択作品ID === 作品.id;
          return (
            <Link
              key={作品.id}
              to={`/work/${作品.id}`}
              className={`ml-[22px] flex items-start justify-between rounded-xl px-3 py-2 transition ${
                選択中
                  ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  : 'text-white/62 hover:bg-white/[0.045] hover:text-white/86'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="truncate text-[12.5px] font-medium">{作品.title}</div>
                <div className={`mt-0.5 truncate text-[11px] ${選択中 ? 'text-white/42' : 'text-white/28'}`}>
                  {作品.category}
                </div>
              </div>
              <span className={`pt-0.5 text-[10.5px] ${選択中 ? 'text-white/42' : 'text-white/28'}`}>{スレッド時刻(index)}</span>
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
        <span>{現在時刻表示()}</span>
      </div>
    </div>
  );
}

function TopBar({ タイトル, 追加数 }) {
  return (
    <header className="order-1 flex h-10 items-center justify-between border-b border-white/[0.05] bg-[#181818] px-4 lg:order-none lg:col-[2/4] lg:row-start-1">
      <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-white/84">
        <span className="truncate font-medium">{タイトル}</span>
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
        <span className="ml-2 font-mono text-[11.5px] text-[#3fb950]">+{追加数}</span>
      </div>
    </header>
  );
}

function ChangeSummary({ 差分一覧 }) {
  const 合計 = 追加行数合計(差分一覧);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-[#141414]">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3 text-[12.5px]">
        <div className="flex items-center gap-2 text-white/70">
          <span>{差分一覧.length}個のファイルが変更されました</span>
          <span className="font-mono text-[#3fb950]">+{合計}</span>
        </div>
        <button type="button" className="text-white/38 hover:text-white/70">
          元に戻す
        </button>
      </div>

      {差分一覧.map((項目) => (
        <div key={項目.fileName} className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 first:border-t-0">
          <span className="font-mono text-[12px] text-white/74">{項目.fileName}</span>
          <span className="font-mono text-[11.5px] text-[#3fb950]">+{項目.addedLines.length}</span>
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

function WorkCenterContent({ 作品, 差分一覧 }) {
  return (
    <>
      <div>
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl">
          <img src={作品.imageUrl} alt={作品.title} className="h-auto max-h-[360px] w-full object-contain" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[12px] tracking-[0.08em] text-white/38">{作品.category}</div>
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white/92">{作品.title}</h2>
        <p className="mt-4 text-[13.5px] leading-[1.95] text-white/68">{作品.description}</p>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-[12px] tracking-[0.08em] text-white/38">使用技術</div>
        <div className="flex flex-wrap gap-2.5">
          {作品.technologies.map((技術) => (
            <span
              key={技術}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70"
            >
              {技術}
            </span>
          ))}
        </div>
      </div>

      <ChangeSummary 差分一覧={差分一覧} />
    </>
  );
}

function CenterColumn({ 作品, 差分一覧, scrollRef }) {
  const 会話 = 会話内容(作品);

  return (
    <section className="order-2 flex min-h-0 flex-col bg-[#111112] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.05]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-5 pb-8 pt-9 lg:px-10 custom-scrollbar">
        <div className="mx-auto max-w-[820px]">
          <div className="ml-auto flex max-w-[560px] flex-col items-end">
            <div className="rounded-2xl bg-[#2e2e31] px-4 py-3 text-[13.5px] leading-[1.6] text-white/92 shadow-[0_12px_28px_rgba(0,0,0,0.24)]">
              {会話.question}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-white/38">
              <span>25m 55s作業しました</span>
              <ChevronRight className="h-3 w-3" />
            </div>

            <p className="text-[14px] font-medium leading-7 text-white/86">{会話.answerTitle}</p>
            {作品 ? (
              <div className="mt-5">
                <WorkCenterContent 作品={作品} 差分一覧={差分一覧} />
              </div>
            ) : (
              <>
                {会話.paragraphs.map((段落) => (
                  <p key={段落} className="mt-3 pr-10 text-[13.5px] leading-[1.9] text-white/68">
                    {段落}
                  </p>
                ))}

                <ChangeSummary 差分一覧={差分一覧} />
              </>
            )}
          </div>
        </div>
      </div>

      <Composer />
    </section>
  );
}

function DiffHeader({ 名前, 追加数 }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] bg-[#171717] px-3 py-2.5">
      <div className="flex items-center gap-2 font-mono text-[11.5px] text-white/78">
        <ChevronDown className="h-3.5 w-3.5 text-white/34" />
        <span>{名前}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11.5px] text-[#3fb950]">+{追加数}</span>
        <MoreHorizontal className="h-3.5 w-3.5 text-white/34" />
      </div>
    </div>
  );
}

function AddOnlyTextDiff({ 行一覧 }) {
  return (
    <div className="font-mono text-[12px] leading-[1.65]">
      {行一覧.map((行, index) => (
        <div key={`${行}-${index}`} className="grid grid-cols-[44px_minmax(0,1fr)]">
          <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-1.5 text-right text-white/28">
            {index + 1}
          </div>
          <div className="bg-[#15321f] px-3 py-1.5 text-[#89d39a]">+ {行}</div>
        </div>
      ))}
    </div>
  );
}

function AddOnlyImageDiff({ 作品 }) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)]">
      <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-3 text-right font-mono text-[11.5px] text-white/28">
        1
      </div>
      <div className="bg-[#132418] px-4 py-4">
        <div className="mx-auto aspect-square max-w-[420px] overflow-hidden rounded-lg border border-emerald-400/10 bg-black/20 p-3">
          <img src={作品.imageUrl} alt={作品.title} className="h-full w-full object-contain" />
        </div>
        <div className="mt-3 font-mono text-[11.5px] text-[#89d39a]">+ プレビュー画像を追加</div>
      </div>
    </div>
  );
}

function RightColumn({ 作品, 差分一覧, scrollRef }) {
  const 合計 = 追加行数合計(差分一覧);

  return (
    <aside className="order-3 flex min-h-0 flex-col bg-[#121212] lg:order-none lg:col-start-3 lg:row-start-2">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.05] px-3">
        <div className="flex items-center gap-1.5 text-white/80">
          <ChevronRight className="h-3.5 w-3.5 text-white/38" />
          <span className="text-[12.5px] font-medium">ステージ済み</span>
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/48">{差分一覧.length}</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/32" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11.5px] text-[#3fb950]">+{合計}</span>
          <button type="button" className="rounded p-1 text-white/34 hover:bg-white/[0.05] hover:text-white/70">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-4 py-4 custom-scrollbar">
        <div className="space-y-4">
          {差分一覧.map((項目) => (
            <section key={項目.fileName} className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]">
              <DiffHeader 名前={項目.fileName} 追加数={項目.addedLines.length} />
              {項目.kind === 'image' ? <AddOnlyImageDiff 作品={作品} /> : <AddOnlyTextDiff 行一覧={項目.addedLines} />}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}

function WorkspaceScreen() {
  const { id } = useParams();
  const 選択作品 = works.find((作品) => 作品.id === Number(id)) ?? null;
  const ホーム選択中 = !選択作品;
  const 差分一覧 = 選択作品 ? 作品差分データ(選択作品) : ホーム差分データ();
  const 追加数 = 追加行数合計(差分一覧);
  const タイトル = ホーム選択中
    ? 'Codexアプリ風にポートフォリオ改修 portfolio'
    : `${選択作品.title} の説明更新 portfolio`;

  const コンテナ参照 = useRef(null);
  const 中央スクロール参照 = useRef(null);
  const 右スクロール参照 = useRef(null);
  const [コンテナ幅, setコンテナ幅] = useState(0);
  const [ドラッグ中, setドラッグ中] = useState(null);
  const [デスクトップ, setデスクトップ] = useState(() => window.innerWidth >= 1024);
  const [カラム幅, setカラム幅] = useState(() => {
    try {
      const 保存値 = JSON.parse(window.localStorage.getItem('portfolio-column-widths') ?? 'null');
      if (保存値 && typeof 保存値.left === 'number' && typeof 保存値.right === 'number') {
        return 保存値;
      }
    } catch {
      return { left: 268, right: 864 };
    }
    return { left: 268, right: 864 };
  });

  useEffect(() => {
    const リサイズ監視 = new ResizeObserver(([entry]) => {
      setコンテナ幅(entry.contentRect.width);
    });
    if (コンテナ参照.current) {
      リサイズ監視.observe(コンテナ参照.current);
    }
    return () => リサイズ監視.disconnect();
  }, []);

  useEffect(() => {
    const リサイズ時 = () => setデスクトップ(window.innerWidth >= 1024);
    window.addEventListener('resize', リサイズ時);
    return () => window.removeEventListener('resize', リサイズ時);
  }, []);

  useEffect(() => {
    if (!デスクトップ || コンテナ幅 === 0) {
      return;
    }
    setカラム幅((現在) => カラム幅を補正(現在, コンテナ幅));
  }, [コンテナ幅, デスクトップ]);

  useEffect(() => {
    window.localStorage.setItem('portfolio-column-widths', JSON.stringify(カラム幅));
  }, [カラム幅]);

  useEffect(() => {
    if (!デスクトップ || !ドラッグ中) {
      return undefined;
    }

    const 移動時 = (event) => {
      if (!コンテナ参照.current) {
        return;
      }
      const rect = コンテナ参照.current.getBoundingClientRect();
      if (ドラッグ中 === 'left') {
        const 新しい左幅 = event.clientX - rect.left;
        setカラム幅((現在) => カラム幅を補正({ ...現在, left: 新しい左幅 }, rect.width));
      } else {
        const 新しい右幅 = rect.right - event.clientX;
        setカラム幅((現在) => カラム幅を補正({ ...現在, right: 新しい右幅 }, rect.width));
      }
    };

    const 終了時 = () => setドラッグ中(null);

    window.addEventListener('pointermove', 移動時);
    window.addEventListener('pointerup', 終了時);
    return () => {
      window.removeEventListener('pointermove', 移動時);
      window.removeEventListener('pointerup', 終了時);
    };
  }, [ドラッグ中, デスクトップ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (中央スクロール参照.current) {
      中央スクロール参照.current.scrollTop = 0;
    }
    if (右スクロール参照.current) {
      右スクロール参照.current.scrollTop = 0;
    }
  }, [id]);

  const グリッドスタイル = デスクトップ
    ? { gridTemplateColumns: `${カラム幅.left}px minmax(0, 1fr) ${カラム幅.right}px` }
    : undefined;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#111112] text-white antialiased">
      <div className="flex h-full w-full flex-col">
        <MacMenuBar />

        <div ref={コンテナ参照} className="relative min-h-0 flex-1 overflow-auto lg:overflow-hidden">
          <div
            className="grid h-full w-full grid-cols-1 auto-rows-max lg:grid-cols-[268px_minmax(0,1fr)_864px] lg:grid-rows-[40px_minmax(0,1fr)]"
            style={グリッドスタイル}
          >
            <LeftSidebar 選択作品ID={選択作品?.id ?? null} ホーム選択中={ホーム選択中} />
            <TopBar タイトル={タイトル} 追加数={追加数} />
            <CenterColumn 作品={選択作品} 差分一覧={差分一覧} scrollRef={中央スクロール参照} />
            <RightColumn 作品={選択作品 ?? { ...ホーム概要, imageUrl: '/profile.jpg' }} 差分一覧={差分一覧} scrollRef={右スクロール参照} />
          </div>

          {デスクトップ && コンテナ幅 > 0 ? (
            <>
              <div
                style={{ left: `${カラム幅.left}px` }}
                className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setドラッグ中('left');
                }}
              >
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.05]" />
                <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-transparent transition hover:bg-white/[0.16]" />
              </div>
              <div
                style={{ left: `${コンテナ幅 - カラム幅.right}px` }}
                className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setドラッグ中('right');
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
