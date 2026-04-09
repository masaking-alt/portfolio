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
  Image as ImageIcon,
  LayoutGrid,
  Mic,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  SquarePen,
  SquareTerminal,
  CloudSun,
  Apple as AppleLogo
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

function LeftSidebar({ 選択ID, isHome }) {
  return (
    <aside className="order-3 flex min-h-0 flex-col bg-[#141415] lg:order-none lg:col-start-1 lg:row-[1/3] lg:border-r lg:border-white/[0.04] pt-2">
      <div className="flex px-4 py-2 items-center justify-between">
        <div className="flex items-center gap-1.5 opacity-0">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1 text-white/30">
          <button type="button" className="rounded p-1 hover:bg-white/5">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-white/5">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="px-2 pt-1 pb-2">
        {ナビ項目.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-white/70 transition hover:bg-white/[0.045] font-medium"
          >
            {createElement(icon, { className: 'h-[14px] w-[14px] text-white/40' })}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between px-4 text-[11.5px] font-medium text-white/40 mb-1">
        <span>スレッド</span>
        <div className="flex items-center gap-1.5">
          <Filter className="h-[14px] w-[14px] text-white/30" />
          <LayoutGrid className="h-[14px] w-[14px] text-white/30" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-3 custom-scrollbar">
        <div className="rounded-lg px-2.5 py-1.5 text-[13px] text-white/80 transition hover:bg-white/[0.045] flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-white/40" />
          <span className="font-medium">portfolio</span>
        </div>

        <Link
          to="/"
          className={`ml-[22px] flex items-start justify-between rounded-lg px-2.5 py-1.5 transition ${isHome
            ? 'bg-[#2b2b2d] text-white'
            : 'text-white/60 hover:bg-white/[0.045] hover:text-white/80'
            }`}
        >
          <div className="min-w-0 pr-2">
            <div className="truncate text-[12px] font-medium">Codexアプリ風にポートフォリオ...</div>
            <div className={`mt-0.5 truncate text-[11px] ${isHome ? 'text-white/40' : 'text-white/30'}`}>UI改修</div>
          </div>
          <span className={`shrink-0 pt-[1px] text-[10.5px] ${isHome ? 'text-white/40' : 'text-white/30'}`}>57分</span>
        </Link>

        {works.map((作品, index) => {
          const 選択中 = 選択ID === 作品.id;
          return (
            <Link
              key={作品.id}
              to={`/work/${作品.id}`}
              className={`ml-[22px] flex items-start justify-between rounded-lg px-2.5 py-1.5 transition ${選択中
                ? 'bg-[#2b2b2d] text-white'
                : 'text-white/60 hover:bg-white/[0.045] hover:text-white/80'
                }`}
            >
              <div className="min-w-0 pr-2">
                <div className="truncate text-[12px] font-medium">{作品.title}</div>
                <div className={`mt-0.5 truncate text-[11px] ${選択中 ? 'text-white/40' : 'text-white/30'}`}>{作品.category}</div>
              </div>
              <span className={`shrink-0 pt-[1px] text-[10.5px] ${選択中 ? 'text-white/40' : 'text-white/30'}`}>{スレッド時刻(index)}</span>
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

function TopBar({ 合計, isHome, 対象 }) {
  return (
    <header className="order-1 flex h-[44px] items-center justify-between border-b border-white/[0.04] bg-[#1a1a1a] px-4 text-[12px] lg:col-[2/4] lg:row-start-1 shadow-sm relative z-20">
      <div className="flex min-w-0 items-center gap-2 text-white/80">
        <span className="truncate font-semibold">{isHome ? 'Codexアプリ風にポートフォリオ改修 portfolio' : `${対象.title} portfolio`}</span>
        <MoreHorizontal className="h-[14px] w-[14px] shrink-0 text-white/30" />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="inline-flex h-[26px] w-[26px] items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white/80 rounded"
        >
          <Play className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="inline-flex h-[26px] w-[26px] items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white/80 rounded"
        >
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
        <div className="h-3 w-[1px] bg-white/[0.08] mx-1"></div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.04] px-2.5 py-[3px] text-white/70"
        >
          <GitCommitHorizontal className="h-3.5 w-3.5 text-white/40" />
          <span className="text-[11.5px] font-medium">コミット</span>
          <ChevronDown className="h-3 w-3 text-white/40" />
        </button>
        <div className="ml-2 flex items-center gap-1.5 text-[11.5px] font-mono">
          <span className="text-[#3fb950]">+{isHome ? 336 : 合計.added}</span>
          <span className="text-[#f85149]">-{(isHome ? 216 : 合計.removed)}</span>
        </div>
      </div>
    </header>
  );
}

function ChangeFileSummary({ 差分一覧, 合計, isHome }) {
  if (isHome) {
    return (
      <div className="mt-8 rounded-lg border border-white/[0.06] bg-[#161616]">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2.5 text-[12.5px] font-medium">
          <div className="flex items-center gap-2 text-white/70">
            <span>2個のファイルが変更されました</span>
            <span className="text-[#3fb950] font-mono">+443</span>
            <span className="text-[#f85149] font-mono">-255</span>
          </div>
          <button type="button" className="text-white/40 hover:text-white/70 flex items-center gap-1">
            <span>元に戻す</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3.20697 5.75L4.7645 4.19247L4.0574 3.48537L1.10775 6.43501L1.4613 6.78856L4.41095 9.73821L5.11806 9.0311L3.46142 7.37446C6.1558 7.37446 8.33777 9.55643 8.33777 12.2508C8.33777 13.9149 7.50201 15.3887 6.22019 16L7.14022 16.5C8.68307 15.765 9.68777 14.1133 9.68777 12.2508C9.68777 8.80838 6.90387 6.02449 3.46142 6.02449H3.20697Z" /></svg>
          </button>
        </div>
        <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3 bg-[#111111]">
          <span className="font-mono text-[12px] text-white/70">src/App.jsx</span>
          <div className="flex items-center gap-2 font-mono text-[11.5px]">
            <span className="text-[#3fb950]">+440</span>
            <span className="text-[#f85149]">-254</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-[#111111]">
          <span className="font-mono text-[12px] text-white/70">src/index.css</span>
          <div className="flex items-center gap-2 font-mono text-[11.5px]">
            <span className="text-[#3fb950]">+3</span>
            <span className="text-[#f85149]">-1</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-white/[0.06] bg-[#161616]">
      <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2.5 text-[12.5px] font-medium">
        <div className="flex items-center gap-2 text-white/70">
          <span>{差分一覧.length}個のファイルが変更されました</span>
          <span className="text-[#3fb950] font-mono">+{合計.added}</span>
          <span className="text-[#f85149] font-mono">-{合計.removed}</span>
        </div>
        <button type="button" className="text-white/40 hover:text-white/70">
          元に戻す <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 align-text-bottom"><path fillRule="evenodd" clipRule="evenodd" d="M3.20697 5.75L4.7645 4.19247L4.0574 3.48537L1.10775 6.43501L1.4613 6.78856L4.41095 9.73821L5.11806 9.0311L3.46142 7.37446C6.1558 7.37446 8.33777 9.55643 8.33777 12.2508C8.33777 13.9149 7.50201 15.3887 6.22019 16L7.14022 16.5C8.68307 15.765 9.68777 14.1133 9.68777 12.2508C9.68777 8.80838 6.90387 6.02449 3.46142 6.02449H3.20697Z" /></svg>
        </button>
      </div>

      {差分一覧.map((項目) => (
        <div
          key={項目.fileName}
          className="flex items-center justify-between border-t border-white/[0.04] px-4 py-3 bg-[#111111] first:border-0"
        >
          <span className="font-mono text-[12px] text-white/70">{項目.fileName}</span>
          <div className="flex items-center gap-2 font-mono text-[11.5px]">
            <span className="text-[#3fb950]">+{項目.added}</span>
            <span className="text-[#f85149]">-{項目.removed}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CenterColumn({ 対象, 差分一覧, 合計, scrollRef, isHome }) {
  return (
    <section className="order-2 flex min-h-0 flex-col bg-[#0e0e0e] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.04]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-4 pb-8 pt-6 lg:px-8 custom-scrollbar">
        <div className="mx-auto max-w-[800px]">

          {isHome ? (
            <div className="mb-8 rounded-lg border border-white/[0.04] bg-[#111] overflow-hidden">
              {[
                { name: 'src/HamburgerMenu.jsx', added: 5, removed: 5 },
                { name: 'src/MobileHome.jsx', added: 7, removed: 7 },
                { name: 'src/ParallaxText.jsx', added: 3, removed: 3 },
                { name: 'src/Reveal.jsx', added: 3, removed: 3 },
                { name: 'src/SideDecor.jsx', added: 2, removed: 2 },
                { name: 'src/index.css', added: 12, removed: 47 },
                { name: 'vite.config.js', added: 2, removed: 1 }
              ].map((f, i) => (
                <div key={i} className="flex items-center font-mono text-[11.5px] border-b border-white/[0.04] last:border-0 px-4 py-2.5">
                  <span className="text-white/70 w-44">{f.name}</span>
                  <span className="text-[#3fb950] ml-2">+{f.added}</span>
                  <span className="text-[#f85149] ml-2">-{f.removed}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="ml-auto flex w-fit max-w-[560px] flex-col items-end">
            {isHome ? null : (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/[0.06] bg-[#1a1a1a] shadow-lgmax-w-[120px]">
                <img src={対象.imageUrl} alt={対象.title} className="w-[120px] h-[80px] object-cover" />
              </div>
            )}

            <div className="rounded-2xl bg-[#262626] px-4 py-3.5 text-[13.5px] text-white/90 leading-relaxed shadow-sm text-left relative">
              {isHome ? (
                <>
                  antigravityでgeminiにデザインの修正してもらうから、簡潔にプロジェクトの仕様を説明するプロンプト書いて。
                </>
              ) : (
                `${対象.title} の detail を Codex アプリのステージ済みビューみたいにして。画像、説明文、使用技術を diff 風に並べて。`
              )}
            </div>
          </div>

          <div className="mt-8">

            {isHome ? (
              <>
                <div className="text-[13.5px] leading-[1.8] text-white/80 pr-10">
                  以下をそのまま使えます。
                </div>
                <div className="mt-3 relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#1c1c1f]">
                  <div className="flex items-center justify-between border-b border-white/[0.04] bg-[#222225] px-4 py-2 text-[12px] font-medium text-white/50">
                    <span>text</span>
                    <Copy className="h-3.5 w-3.5 opacity-60 hover:opacity-100 cursor-pointer" />
                  </div>
                  <div className="p-4 overflow-auto custom-scrollbar bg-[#1c1c1f]">
                    <pre className="font-mono text-[12.5px] leading-[1.7] text-white/80 whitespace-pre-wrap">
                      React + Vite + Tailwind CSS で作っているポートフォリオです。主な実装は `src/App.jsx`、作品データは `src...

                      現在の構成:
                      - 左カラム: スレッド一覧風の作品ナビゲーション
                      - 中央カラム: 会話ログ風のメイン表示と入力欄風エリア
                      - 右カラム: 「ステージ済み」風の作品詳細 diff 表示
                      - ルートは `/` と `/work/:id`。作品を選ぶと同じレイアウト内で詳細が切り替わる

                      修正してほしいこと:
                      - 機能、文言、ルーティング、作品データは変えず、見た目だけ改善
                      - Codex アプリ風の完成度を上げたい
                      - 余白、境界線、パネルの高さ、アイコン位置、文字サイズ、密度感を整えてほしい
                      - 右カラムは GitHub/Codex の diff 表示っぽさを強めたい
                      - レスポンシブは維持
                      - フル幅レイアウトは維持
                      - 既存の画像、リンク、作品データは壊さない
                      - できるだけ Tailwind の class 中心で修正
                      - 必要ならアイコンは `lucide-react` を使ってよい
                      - 依存追加や大きな構造変更は最小限でお願いします
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-1.5 text-[11.5px] font-medium text-white/40">
                  <span>25m 55s作業しました</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p className="text-[13.5px] leading-[1.8] text-white/80 pr-10">
                  {対象.title} の詳細を、Codex のステージング欄に寄せた構成で整理しています。右側では画像、説明文、使用技術を GitHub diff に近い密度で表示し、上部ツールバーや集計値も合わせています。
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.8] text-white/60 pr-10">
                  作品リンク、技術スタック、説明文を右カラムで分割表示し、ステージ済みのファイル一覧は中央にも要約カードとして配置しています。
                </p>
                <ChangeFileSummary 差分一覧={差分一覧} 合計={合計} isHome={false} />
              </>
            )}

            {isHome && (
              <div className="mt-6 flex justify-end">
                <button className="rounded-full border border-white/[0.08] bg-[#1a1a1a] px-5 py-2 text-[12.5px] text-white/70 hover:bg-white/[0.04]">
                  このスレッドでした事のコミットメッセージ書いて
                </button>
              </div>
            )}

            {isHome && (
              <div className="mt-8">
                <p className="font-mono text-[13px] text-white/80 leading-relaxed font-medium">feat: Codex風全幅UIと高解像度レイアウトへの改修</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 pt-2 lg:px-10">
        <div className="mx-auto max-w-[800px]">
          <div className="relative rounded-[20px] bg-[#1e1e1e] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-3 pt-3 pb-3">
            <div className="px-2 pb-6 pt-1 text-[13.5px] text-white/40">フォローアップの変更を求める</div>
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 px-1">
              <div className="flex items-center gap-1.5 text-[11.5px] text-white/50 font-medium tracking-wide">
                <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/[0.08] leading-none text-[16px] pb-0.5">+</button>
                <span className="px-1">GPT-5.4</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                <span className="px-1 border-l border-white/[0.08] ml-1 pl-2">非常に高い</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>

              <div className="flex items-center gap-1.5">
                <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full hover:bg-white/[0.08] text-white/50">
                  <Mic className="h-[15px] w-[15px]" />
                </button>
                <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#484848] opacity-50 cursor-pointer text-white">
                  <ArrowUp className="h-[15px] w-[15px]" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11.5px] font-medium text-white/30 px-2 tracking-wide">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><SquareTerminal className="h-3 w-3" />ローカル環境<ChevronDown className="h-3 w-3" /></span>
              <span className="flex items-center gap-1"><Settings className="h-3 w-3" />デフォルト権限<ChevronDown className="h-3 w-3" /></span>
            </div>
            <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" /> codex/new_design<ChevronDown className="h-3 w-3" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiffHeader({ 名前, added, removed }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04] bg-[#1a1a1a]">
      <div className="flex items-center gap-2 font-mono text-[11.5px] text-white/80">
        <ChevronDown className="h-[14px] w-[14px] text-white/40 mr-0.5" />
        <span>{名前}</span>
      </div>
      <div className="flex items-center gap-1 text-[11.5px] text-white/40 mr-1 cursor-pointer tracking-wider">
        <span className="leading-none mb-1">•••</span>
      </div>
    </div>
  );
}

function DiffSplitRow({ 行番号1, 内容1, side1, 行番号2, 内容2, side2 }) {
  const isLabel = side1 === 'unmodified' && 内容1.includes('unmodified lines');
  return (
    <div className={`flex w-full group relative ${isLabel ? 'bg-[#1e1e1e] border-y border-white/[0.04]' : ''}`}>
      <div className={`flex flex-1 min-w-0 ${side1 === 'old' ? 'bg-[#ffeef0]/[0.05] text-[#ff7b72] line-through decoration-white/20' : ''}`}>
        <div className={`w-[36px] shrink-0 border-r border-white/[0.02] px-2 py-[2px] text-right font-mono text-[11.5px] text-white/30 select-none ${isLabel ? 'border-r-0' : ''}`}>
          {行番号1}
        </div>
        <div className={`px-3 py-[2px] font-mono text-[12px] whitespace-pre-wrap flex-1 leading-[1.6] ${isLabel ? 'text-white/40' : ''}`}>
          {isLabel ? 内容1 : (side1 === 'old' ? `-   ${内容1}` : `    ${内容1}`)}
        </div>
      </div>

      <div className={`w-[1px] bg-white/[0.04]`}></div>

      <div className={`flex flex-1 min-w-0 ${side2 === 'new' ? 'bg-[#e6ffed]/[0.05] text-[#3fb950]' : ''} ${side2 === 'unmodified-space' ? 'bg-[#1e1e1e]' : ''}`}>
        {side2 === 'unmodified-space' ? <div className="flex-1"></div> : (
          <>
            <div className={`w-[36px] shrink-0 border-r border-white/[0.02] px-2 py-[2px] text-right font-mono text-[11.5px] text-white/30 select-none`}>
              {行番号2}
            </div>
            <div className="px-3 py-[2px] font-mono text-[12px] whitespace-pre-wrap flex-1 leading-[1.6]">
              {side2 === 'new' ? `+   ${内容2}` : `    ${内容2}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ImageDiff({ 対象, 項目 }) {
  return (
    <div className="flex flex-col border-b border-white/[0.04]">
      <div className="bg-[#111] p-6 flex items-center justify-center min-h-[160px] relative">
        <div className="absolute top-2 left-2 text-[11px] font-mono text-white/40">New</div>
        <img src={対象.imageUrl} alt={対象.title} className="max-h-[240px] max-w-full object-contain rounded shadow shadow-black/50" />
      </div>
    </div>
  );
}

function TextDiff({ 項目 }) {
  const 最大行数 = Math.max(項目.oldLines.length, 項目.newLines.length);

  return (
    <div className="flex flex-col w-full border-b border-white/[0.04]">
      {Array.from({ length: 最大行数 }).map((_, index) => {
        const oldLine = 項目.oldLines[index];
        const newLine = 項目.newLines[index];
        let side1, side2;
        if (oldLine !== undefined && newLine !== undefined) {
          side1 = 'old'; side2 = 'new';
        } else if (oldLine !== undefined) {
          side1 = 'old'; side2 = 'none';
        } else if (newLine !== undefined) {
          side1 = 'none'; side2 = 'new';
        }
        return (
          <div key={`diff-${index}`} className="flex w-full">
            <div className="w-1/2">
              {side1 === 'old' && (
                <div className={`flex w-full bg-[#ffeef0]/[0.05] text-[#ff7b72] line-through decoration-white/20`}>
                  <div className="w-[48px] shrink-0 border-r border-white/[0.02] px-2 py-[2px] text-right font-mono text-[11.5px] text-white/30 select-none">{index + 1}</div>
                  <div className="px-3 py-[2px] font-mono text-[12px] whitespace-pre-wrap flex-1 leading-[1.6]">-   {oldLine}</div>
                </div>
              )}
            </div>
            <div className="w-1/2 border-l border-white/[0.04]">
              {side2 === 'new' && (
                <div className={`flex w-full bg-[#e6ffed]/[0.05] text-[#3fb950]`}>
                  <div className="w-[48px] shrink-0 border-r border-white/[0.02] px-2 py-[2px] text-right font-mono text-[11.5px] text-white/30 select-none">{index + 1}</div>
                  <div className="px-3 py-[2px] font-mono text-[12px] whitespace-pre-wrap flex-1 leading-[1.6]">+   {newLine}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RightColumn({ 対象, 差分一覧, scrollRef, isHome }) {
  return (
    <aside className="order-2 flex min-h-0 flex-col bg-[#111111] lg:order-none lg:col-start-3 lg:row-start-2 lg:row-span-2 shadow-[-4px_0_24px_rgba(0,0,0,0.15)] relative z-10 custom-scrollbar">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.04] px-3 shrink-0">
        <div className="flex items-center gap-1.5 text-white/80 cursor-pointer">
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded hover:bg-white/[0.06]">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="-rotate-90 text-white/50"><path d="M11.646 12.354L10.939 13.061L5.878 8L10.939 2.939L11.646 3.646L7.293 8L11.646 12.354Z" /></svg>
          </div>
          <span className="text-[12.5px] font-medium tracking-tight">ステージ済み</span>
          {!isHome && (
            <div className="flex items-center">
              <ChevronDown className="h-[14px] w-[14px] text-white/40 ml-0.5" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 text-white/40">
          <button type="button" className="rounded p-1 hover:bg-white/[0.06] hover:text-white/80">
            <span className="text-[14px] tracking-widest leading-none block pb-1">...</span>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto flex flex-col pb-8 custom-scrollbar relative">
        {isHome ? (
          <div className="w-full flex-col flex select-text">
            <section className="w-full border-b border-white/[0.04]">
              <DiffHeader 名前="src/App.jsx" added={307} removed={214} />
            </section>
            <section className="w-full border-b border-white/[0.04]">
              <DiffHeader 名前="src/index.css" added={29} removed={2} />
              <div className="flex flex-col w-full pb-4">
                <DiffSplitRow 行番号1="" 内容1="2 unmodified lines" side1="unmodified" 行番号2="" 内容2="" side2="unmodified-space" />
                <DiffSplitRow 行番号1={3} 内容1=":root {" side1="none" 行番号2={3} 内容2=":root {" side2="none" />
                <DiffSplitRow 行番号1={4} 内容1="  color-scheme: dark;" side1="none" 行番号2={4} 内容2="  color-scheme: dark;" side2="none" />
                <DiffSplitRow 行番号1={5} 内容1={'  font-family: -apple-system, BlinkMacSystemFont, "SF Pro D..'} side1="none" 行番号2={5} 内容2={'  font-family: -apple-system, BlinkMacSystemFont, "SF Pro D..'} side2="none" />
                <DiffSplitRow 行番号1={6} 内容1="  background: #0f1011;" side1="old" 行番号2={6} 内容2="  background: #0e0e0e;" side2="new" />
                <DiffSplitRow 行番号1={7} 内容1="}" side1="none" 行番号2={7} 内容2="}" side2="none" />
                <DiffSplitRow 行番号1={8} 内容1="" side1="none" 行番号2={8} 内容2="" side2="none" />
                <DiffSplitRow 行番号1={9} 内容1="html," side1="none" 行番号2={9} 内容2="html," side2="none" />
                <DiffSplitRow 行番号1="" 内容1="6 unmodified lines" side1="unmodified" 行番号2="" 内容2="" side2="unmodified-space" />
                <DiffSplitRow 行番号1={16} 内容1="" side1="none" 行番号2={16} 内容2="" side2="none" />
                <DiffSplitRow 行番号1={17} 内容1="body {" side1="none" 行番号2={17} 内容2="body {" side2="none" />
                <DiffSplitRow 行番号1={18} 内容1="  margin: 0;" side1="none" 行番号2={18} 内容2="  margin: 0;" side2="none" />
                <DiffSplitRow 行番号1={19} 内容1="  background: #0f1011;" side1="old" 行番号2={19} 内容2="  background: #0e0e0e;" side2="new" />
                <DiffSplitRow 行番号1={20} 内容1="}" side1="none" 行番号2={20} 内容2="}" side2="none" />
                <DiffSplitRow 行番号1={21} 内容1="" side1="none" 行番号2={21} 内容2="" side2="none" />
                <DiffSplitRow 行番号1={22} 内容1="a {" side1="none" 行番号2={22} 内容2="a {" side2="none" />
                <DiffSplitRow 行番号1="" 内容1="6 unmodified lines" side1="unmodified" 行番号2="" 内容2="" side2="unmodified-space" />
                <DiffSplitRow 行番号1={28} 内容1="a {" side1="none" 行番号2={28} 内容2="a {" side2="none" />
                <DiffSplitRow 行番号1={29} 内容1="  -webkit-tap-highlight-color: transparent;" side1="none" 行番号2={29} 内容2="  -webkit-tap-highlight-color: transparent;" side2="none" />
                <DiffSplitRow 行番号1={30} 内容1="}" side1="none" 行番号2={30} 内容2="}" side2="none" />

                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={31} 内容2="/* Custom Scrollbar for inner components */" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={32} 内容2=".custom-scrollbar::-webkit-scrollbar {" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={33} 内容2="  width: 10px;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={34} 内容2="  height: 10px;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={35} 内容2="}" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={36} 内容2="" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={37} 内容2=".custom-scrollbar::-webkit-scrollbar-track {" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={38} 内容2="  background: transparent;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={39} 内容2="}" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={40} 内容2="" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={41} 内容2=".custom-scrollbar::-webkit-scrollbar-thumb {" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={42} 内容2="  background: rgba(255, 255, 255, 0.1);" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={43} 内容2="  border: 3px solid transparent;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={44} 内容2="  background-clip: padding-box;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={45} 内容2="  border-radius: 9999px;" side2="new" />
                <DiffSplitRow 行番号1="" 内容1="" side1="none" 行番号2={46} 内容2="}" side2="new" />
              </div>
            </section>
          </div>
        ) : (
          <div className="w-full flex-col flex">
            {差分一覧.map((項目) => (
              <section
                key={項目.fileName}
                className="w-full border-b border-white/[0.04] last:border-b-0"
              >
                <DiffHeader 名前={項目.fileName} added={項目.added} removed={項目.removed} />
                {項目.kind === 'image' ? <ImageDiff 対象={対象} 項目={項目} /> : <TextDiff 項目={項目} />}
              </section>
            ))}
          </div>
        )}
      </div>

      {isHome && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <button className="flex items-center gap-1.5 rounded-full bg-[#1c1c1c] border border-white/[0.08] hover:bg-white/[0.08] px-4 py-2 text-[12.5px] font-medium text-white/50 transition">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3.20697 5.75L4.7645 4.19247L4.0574 3.48537L1.10775 6.43501L1.4613 6.78856L4.41095 9.73821L5.11806 9.0311L3.46142 7.37446C6.1558 7.37446 8.33777 9.55643 8.33777 12.2508C8.33777 13.9149 7.50201 15.3887 6.22019 16L7.14022 16.5C8.68307 15.765 9.68777 14.1133 9.68777 12.2508C9.68777 8.80838 6.90387 6.02449 3.46142 6.02449H3.20697Z" /></svg>
            すべてを戻す
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.04] px-4 py-2 text-[12.5px] font-medium text-white shadow-sm transition">
            <span className="text-[14px] leading-none mb-0.5">+</span>
            すべてをステージする
          </button>
        </div>
      )}
    </aside>
  );
}

function WorkspaceScreen() {
  const { id } = useParams();
  const isHome = !id;
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
    <div className="h-screen w-screen bg-[#0e0e0e] text-white antialiased overflow-hidden font-sans">
      <div className="flex h-full w-full flex-col">
        <div className="flex h-9 items-center justify-between bg-[#121212] px-4 text-[13px] text-white/80 border-b border-black">
          <div className="flex items-center gap-4 text-white/70">
            <span className="font-semibold text-white/90">Codex</span>
            <span className="hover:text-white cursor-pointer">File</span>
            <span className="hover:text-white cursor-pointer">Edit</span>
            <span className="hover:text-white cursor-pointer">View</span>
            <span className="hover:text-white cursor-pointer">Window</span>
            <span className="hover:text-white cursor-pointer">Help</span>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-[12px] font-medium pr-2">
            <div className="flex items-center gap-1.5 opacity-80 cursor-pointer hover:opacity-100">
              <AppleLogo className="h-[14px] w-[14px] -mt-0.5" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white">
              <Search className="h-[13px] w-[13px]" />
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <CloudSun className="h-[15px] w-[15px]" />
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <span className="font-semibold px-2 py-0.5 rounded border border-white/20 select-none">A</span>
            </div>
            <span>{現在時刻表示()}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 relative">
          <div className="grid h-full w-full grid-cols-[200px_minmax(0,0.8fr)_minmax(300px,1.2fr)] grid-rows-[44px_1fr]">
            <LeftSidebar 選択ID={選択作品?.id ?? null} isHome={isHome} />
            <TopBar 合計={合計} isHome={isHome} 対象={対象} />
            <CenterColumn
              対象={対象}
              差分一覧={差分一覧}
              合計={合計}
              scrollRef={中央スクロール参照}
              isHome={isHome}
            />
            <RightColumn 対象={対象} 差分一覧={差分一覧} scrollRef={右スクロール参照} isHome={isHome} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Apple/Cloud SVG icons missing in lucide-react if needed, or fallback
// added at the top in the import area. Let's make sure AppleLogo exists!

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceScreen />} />
      <Route path="/work/:id" element={<WorkspaceScreen />} />
    </Routes>
  );
}

export default App;
