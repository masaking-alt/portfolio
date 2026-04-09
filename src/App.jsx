import {
  ArrowUp,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
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
  SquareTerminal,
} from 'lucide-react';
import { createElement, useEffect, useRef } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { works } from './works';

const ナビ項目 = [
  { label: '新しいスレッド', icon: SquarePen },
  { label: 'Search', icon: Search },
  { label: 'スキルとアプリ', icon: LayoutGrid },
  { label: 'オートメーション', icon: Clock3 },
];

const ポートフォリオ概要 = {
  id: 0,
  title: 'portfolio',
  category: 'Workspace',
  imageUrl: '/profile.jpg',
  description:
    '高知大学で情報科学を専攻。AIを使ったWebアプリ、Chrome拡張、UI実装を中心に、使いやすさと視認性を両立したプロダクトを制作しています。',
  technologies: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'UI Design', 'Frontend'],
  externalUrl: 'mailto:banbenjianggui@gmail.com',
};

function 二桁(値) {
  return String(値).padStart(2, '0');
}

function 現在時刻表示() {
  const 現在 = new Date();
  const 曜日 = ['日', '月', '火', '水', '木', '金', '土'][現在.getDay()];
  return `${現在.getMonth() + 1}月${現在.getDate()}日(${曜日}) ${二桁(現在.getHours())}:${二桁(現在.getMinutes())}`;
}

function 行分割(文字列, 幅 = 22) {
  const 行 = [];
  for (let index = 0; index < 文字列.length; index += 幅) {
    行.push(文字列.slice(index, index + 幅));
  }
  return 行;
}

function 差分情報作成(対象) {
  const 説明行 = 行分割(対象.description, 24);
  const 疑似旧説明 = [
    `${対象.title} の説明を更新`,
    'Codex風の差分表示に置換',
  ];
  const 疑似旧技術 = ['"HTML"', '"CSS"', '"JavaScript"'];
  const 画像名 = 対象.imageUrl.split('/').pop() ?? 'preview.png';

  return [
    {
      kind: 'image',
      fileName: 画像名,
      added: 1,
      removed: 1,
      title: 'プレビュー画像',
      oldLines: ['旧プレビュー', '削除済み'],
      newLines: ['新プレビュー', '追加済み'],
    },
    {
      kind: 'description',
      fileName: 'description.md',
      added: 説明行.length + 2,
      removed: 疑似旧説明.length,
      title: '説明文',
      oldLines: 疑似旧説明,
      newLines: 説明行,
    },
    {
      kind: 'stack',
      fileName: 'technologies.json',
      added: 対象.technologies.length,
      removed: 疑似旧技術.length,
      title: '使用技術',
      oldLines: 疑似旧技術,
      newLines: 対象.technologies.map((技術) => `"${技術}"`),
    },
  ];
}

function 合計差分(差分一覧) {
  return 差分一覧.reduce(
    (合計, 項目) => ({
      added: 合計.added + 項目.added,
      removed: 合計.removed + 項目.removed,
    }),
    { added: 0, removed: 0 },
  );
}

function スレッド時刻(index) {
  const 表示 = ['27分', '1時間', '3時間', '昨日', '3日前', '1か月'];
  return 表示[index] ?? '1か月';
}

function LeftSidebar({ 選択ID }) {
  return (
    <aside className="order-3 flex min-h-0 flex-col bg-[#232325] lg:order-none lg:col-start-1 lg:row-[1/3] lg:border-r lg:border-white/[0.07]">
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex items-center gap-2 text-white/35">
          <button type="button" className="rounded p-1 hover:bg-white/5">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-white/5">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="px-3 pt-3">
        {ナビ項目.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] text-white/88 transition hover:bg-white/[0.045]"
          >
            {createElement(icon, { className: 'h-4 w-4 text-white/72' })}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-4 text-[12px] text-white/34">
        <span>スレッド</span>
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-3.5 w-3.5" />
          <MoreHorizontal className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-auto px-2 pb-3">
        <div className="rounded-lg px-2 py-2 text-[14px] text-white/92">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-white/58" />
            <span>portfolio</span>
          </div>
        </div>

        {works.map((作品, index) => {
          const 選択中 = 選択ID === 作品.id;
          return (
            <Link
              key={作品.id}
              to={`/work/${作品.id}`}
              className={`ml-6 flex items-start justify-between rounded-xl px-3 py-2.5 transition ${
                選択中
                  ? 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]'
                  : 'text-white/76 hover:bg-white/[0.045] hover:text-white'
              }`}
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{作品.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-white/38">{作品.category}</div>
              </div>
              <span className="ml-3 shrink-0 pt-0.5 text-[11px] text-white/34">{スレッド時刻(index)}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] text-white/74 transition hover:bg-white/[0.045] hover:text-white"
        >
          <Settings className="h-4 w-4 text-white/64" />
          <span>設定</span>
        </button>
      </div>
    </aside>
  );
}

function TopBar({ 合計 }) {
  return (
    <header className="order-1 flex h-10 items-center justify-between border-b border-white/[0.06] bg-[#181818] px-4 text-[13px] lg:col-[2/4] lg:row-start-1">
      <div className="flex min-w-0 items-center gap-2 text-white/92">
        <span className="truncate font-medium">Codexアプリ風にポートフォリオ改修 portfolio</span>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-white/38" />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-[#1c1c1c] text-white/65 hover:bg-white/[0.05]"
        >
          <Play className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-[#1c1c1c] text-white/70 hover:bg-white/[0.05]"
        >
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-[#1c1c1c] px-3 py-1.5 text-white/86 hover:bg-white/[0.05]"
        >
          <GitCommitHorizontal className="h-3.5 w-3.5" />
          <span>コミット</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/45" />
        </button>
        <div className="ml-1 flex items-center gap-1 text-[13px] font-medium">
          <span className="text-emerald-400">+{合計.added}</span>
          <span className="text-rose-400">-{合計.removed}</span>
        </div>
      </div>
    </header>
  );
}

function ChangeFileSummary({ 差分一覧, 合計 }) {
  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 text-[13px]">
        <div className="flex items-center gap-2 text-white/82">
          <span>{差分一覧.length}個のファイルが変更されました</span>
          <span className="text-emerald-400">+{合計.added}</span>
          <span className="text-rose-400">-{合計.removed}</span>
        </div>
        <button type="button" className="text-white/52 hover:text-white/80">
          元に戻す
        </button>
      </div>

      {差分一覧.map((項目) => (
        <div
          key={項目.fileName}
          className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 last:border-b-0"
        >
          <span className="font-mono text-[13px] text-white/88">{項目.fileName}</span>
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="text-emerald-400">+{項目.added}</span>
            <span className="text-rose-400">-{項目.removed}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CenterColumn({ 対象, 差分一覧, 合計, scrollRef }) {
  const 要求文 = 対象.id
    ? `${対象.title} の detail を Codex アプリのステージ済みビューみたいにして。画像、説明文、使用技術を diff 風に並べて。`
    : 'ポートフォリオを Codex アプリ完コピのレイアウトにして。左のスレッド、中央の会話、右のステージ済みを全部合わせて。';

  const 応答文 = 対象.id
    ? `${対象.title} の詳細を、Codex のステージング欄に寄せた構成で整理しています。右側では画像、説明文、使用技術を GitHub diff に近い密度で表示し、上部ツールバーや集計値も合わせています。`
    : 'ポートフォリオ全体を Codex デスクトップアプリに寄せて再構成しています。左にスレッド一覧、中央に会話ログと変更ファイル一覧、右にステージ済み差分を配置し、余白とアイコン位置も同系統にそろえています。';

  return (
    <section className="order-2 flex min-h-0 flex-col bg-[#171717] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.06]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-6 pb-8 pt-8 lg:px-12 lg:pt-14">
        <div className="mx-auto max-w-[780px]">
          <div className="ml-auto flex max-w-[520px] flex-col items-end">
            <div className="mb-3 h-14 w-14 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1e1e1f] shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
              <img src={対象.imageUrl} alt={対象.title} className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl bg-[#2e2e31] px-4 py-3 text-[14px] font-medium leading-6 text-white/92 shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
              {要求文}
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center gap-2 text-[13px] text-white/44">
              <span>25m 55s作業しました</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
            <p className="max-w-[720px] text-[14px] leading-7 text-white/84">{応答文}</p>
            <p className="mt-4 max-w-[720px] text-[14px] leading-7 text-white/64">
              作品リンク、技術スタック、説明文を右カラムで分割表示し、ステージ済みのファイル一覧は中央にも要約カードとして配置しています。
            </p>
            <ChangeFileSummary 差分一覧={差分一覧} 合計={合計} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-[#171717] px-4 pb-4 pt-3 lg:px-8">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-1 inline-flex items-center gap-2 rounded-t-2xl border border-b-0 border-white/[0.08] bg-[#2b2b2d] px-4 py-2 text-[12px] text-white/58">
            <SquareTerminal className="h-3.5 w-3.5" />
            <span>1個のターミナルを実行しています</span>
          </div>

          <div className="rounded-[24px] border border-white/[0.09] bg-[#2e2e31] px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
            <div className="min-h-16 text-[15px] text-white/26">フォローアップの変更を求める</div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] text-white/55">
                <button type="button" className="rounded-md p-1.5 hover:bg-white/[0.06]">+</button>
                <span>GPT-5.4</span>
                <span>非常に高い</span>
              </div>

              <div className="flex items-center gap-2 text-white/54">
                <button type="button" className="rounded-full p-2 hover:bg-white/[0.06]">
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1a1a1a]"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 px-2 text-[12px] text-white/34">
            <span>ローカル環境</span>
            <span>デフォルト権限</span>
            <span>{対象.category}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiffHeader({ 名前, added, removed }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 font-mono text-[13px] text-white/88">
        <span>{名前}</span>
        <span className="text-emerald-400">+{added}</span>
        <span className="text-rose-400">-{removed}</span>
      </div>
      <ChevronDown className="h-4 w-4 text-white/40" />
    </div>
  );
}

function DiffRow({ 行番号, 内容, side }) {
  const 左側 = side === 'old';
  return (
    <div className={`grid grid-cols-[42px_minmax(0,1fr)] ${左側 ? 'border-r border-white/[0.06]' : ''}`}>
      <div className={`border-r border-white/[0.06] px-3 py-1.5 text-right text-white/28 ${左側 ? 'bg-[#231718]' : 'bg-[#132017]'}`}>
        {行番号}
      </div>
      <div
        className={`px-3 py-1.5 ${
          左側 ? 'bg-[#351e20] text-[#ff9ea0]' : 'bg-[#17311e] text-[#96e3a2]'
        }`}
      >
        {左側 ? `- ${内容}` : `+ ${内容}`}
      </div>
    </div>
  );
}

function ImageDiff({ 対象, 項目 }) {
  return (
    <div className="grid grid-cols-1 border-t border-white/[0.06] lg:grid-cols-2">
      <div className="border-b border-white/[0.06] bg-[repeating-linear-gradient(-45deg,#161616_0,#161616_8px,#1b1b1b_8px,#1b1b1b_16px)] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
        <div className="grid grid-cols-[42px_minmax(0,1fr)]">
          <div className="border-r border-white/[0.06] bg-[#1f1516] px-3 py-3 text-right font-mono text-[12px] text-white/28">
            1
          </div>
          <div className="flex min-h-[214px] items-center justify-center px-4 py-4">
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-black/20 text-white/24">
              <div className="text-center">
                <ImageIcon className="mx-auto h-7 w-7" />
                <div className="mt-2 text-[12px]">旧画像を削除</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#101511]">
        <div className="grid grid-cols-[42px_minmax(0,1fr)]">
          <div className="border-r border-white/[0.06] bg-[#132017] px-3 py-3 text-right font-mono text-[12px] text-white/28">
            1
          </div>
          <div className="px-4 py-4">
            <div className="overflow-hidden rounded-lg border border-emerald-400/10 bg-[#1a1f1b]">
              <img src={対象.imageUrl} alt={対象.title} className="aspect-[16/9] w-full object-cover" />
            </div>
            <div className="mt-3 font-mono text-[12px] text-emerald-300">
              + {項目.title} を更新
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextDiff({ 項目 }) {
  const 最大行数 = Math.max(項目.oldLines.length, 項目.newLines.length);

  return (
    <div className="grid grid-cols-1 border-t border-white/[0.06] font-mono text-[12px] leading-6 lg:grid-cols-2">
      <div className="border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
        {Array.from({ length: 最大行数 }).map((_, index) => (
          <DiffRow
            key={`old-${項目.fileName}-${index}`}
            行番号={index + 1}
            内容={項目.oldLines[index] ?? ''}
            side="old"
          />
        ))}
      </div>

      <div>
        {Array.from({ length: 最大行数 }).map((_, index) => (
          <DiffRow
            key={`new-${項目.fileName}-${index}`}
            行番号={index + 1}
            内容={項目.newLines[index] ?? ''}
            side="new"
          />
        ))}
      </div>
    </div>
  );
}

function RightColumn({ 対象, 差分一覧, scrollRef }) {
  return (
    <aside className="order-2 flex min-h-0 flex-col bg-[#181818] lg:order-none lg:col-start-3 lg:row-start-2">
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-4">
        <div className="flex items-center gap-2 text-white/88">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03]">
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
          <span className="text-[14px] font-medium">ステージ済み</span>
          <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] text-white/58">
            {差分一覧.length}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-white/42" />
        </div>

        <div className="flex items-center gap-2 text-white/42">
          <button type="button" className="rounded p-1 hover:bg-white/[0.05]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-white/[0.05]">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-4 py-4">
        <div className="space-y-4">
          {差分一覧.map((項目) => (
            <section
              key={項目.fileName}
              className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#121212] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            >
              <DiffHeader 名前={項目.fileName} added={項目.added} removed={項目.removed} />
              {項目.kind === 'image' ? <ImageDiff 対象={対象} 項目={項目} /> : <TextDiff 項目={項目} />}
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
  const 対象 = 選択作品 ?? ポートフォリオ概要;
  const 差分一覧 = 差分情報作成(対象);
  const 合計 = 合計差分(差分一覧);
  const 中央スクロール参照 = useRef(null);
  const 右スクロール参照 = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (中央スクロール参照.current) {
      中央スクロール参照.current.scrollTop = 0;
    }
    if (右スクロール参照.current) {
      右スクロール参照.current.scrollTop = 0;
    }
  }, [id]);

  return (
    <div className="min-h-svh w-full bg-[#111112] text-white antialiased">
      <div className="flex h-svh w-full flex-col overflow-hidden">
        <div className="flex h-7 items-center justify-between border-b border-white/[0.06] bg-[#18191b] px-4 text-[12px] text-white/72">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white/92">Codex</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet-400/85" />
            <span>{現在時刻表示()}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <div className="grid h-full grid-cols-1 grid-rows-[40px_minmax(0,1fr)] lg:grid-cols-[266px_minmax(0,1.04fr)_minmax(640px,0.96fr)]">
            <LeftSidebar 選択ID={選択作品?.id ?? null} />
            <TopBar 合計={合計} />
            <CenterColumn
              対象={対象}
              差分一覧={差分一覧}
              合計={合計}
              scrollRef={中央スクロール参照}
            />
            <RightColumn 対象={対象} 差分一覧={差分一覧} scrollRef={右スクロール参照} />
          </div>
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
