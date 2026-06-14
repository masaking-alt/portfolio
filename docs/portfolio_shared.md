# SSHポートフォリオ共有資料

最終更新: 2026-06-06

## 概要

Masaking のポートフォリオを、ブラウザではなくSSH接続で表示するためのTUIアプリです。

```sh
ssh ssh.msking.net
```

接続後に通常のLinuxシェルを開くのではなく、ポートフォリオ専用の画面を表示します。トップ、作品一覧、作品詳細、自己紹介、連絡先、ヘルプをターミナル上で閲覧できます。

## 表示プロフィール

| 項目 | 内容 |
| --- | --- |
| サイト名 | Portfolio |
| 表示名 | まさきんぐ_masaking |
| 英語名 | Masaking |
| 肩書き | AI-Native Full-Stack Developer |
| ヒーロー文 | Hello, / I'm Masaking. |
| リード文 | 高知大学で情報科学を専攻。バイブコーディングに没頭する日々。 |

## 自己紹介

昔からプログラミングに興味があり、AIを利用することでそのハードルが下がったため、web制作に挑戦しています。ユーザーにとって魅力的で使いやすいサイトを作れるようになりたいです。

好きなゲームはモンハンで、特に3DSのシリーズが好きです。好きなアーティストはVaundy。アニメやマンガを見るのも好きです。

## About内の制作技術

自己紹介画面では、Web版ポートフォリオの制作技術として次を表示します。

- HTML
- CSS
- JavaScript (React)
- Vite
- React Router
- ESLint

## 連絡先

| 種別 | 内容 |
| --- | --- |
| メール | banbenjianggui@gmail.com |
| Instagram | masa.ki8904 |
| X (Twitter) | masaking_alt |
| GitHub | masaking-alt |

## 作品一覧

現在の掲載作品は10件です。SSH版ではIDの降順で表示します。

| ID | 作品名 | 種別 | 概要 |
| --- | --- | --- | --- |
| 10 | Marple | Webアプリ | Marp形式のスライドをブラウザ上で直感的に編集できるWebアプリ。AIによる編集支援、gif風バージョン管理、PDF/PPTXエクスポートに対応。 |
| 9 | Ugomemo | Webアプリ | アイデアをノードとして配置し、つなげながら発想を広げるコラボレーションツール。AIによる視点提案も備える。 |
| 8 | MESI-KO | Webアプリ | ごはんの予定調整に特化した日程調整アプリ。招待コード参加、回答率確認、ログイン導線を備える。 |
| 7 | Selection Charcount | Chrome拡張 | 右クリックメニューから呼び出せる選択文字数カウンター。選択テキストの文字数を浮遊パネルで表示。 |
| 6 | Moodle Enhancer for Kochi University | Chrome拡張 | 高知大学Moodleを快適に使うためのChrome拡張。ダークテーマ、課題カード、資料タブなどを提供。 |
| 5 | 総合映像研究会ホームページ | Webサイト | 高知大学・総合映像研究会の公式サイト。活動予定、BBS、コンタクト、活動レポートを掲載。 |
| 4 | Part-time Shift | Webアプリ | スマホに最適化したシフト管理アプリ。勤務予定、労働時間、給与見込み、カレンダー、csvエクスポートに対応。 |
| 3 | Memo Pad | Webアプリ | Firebase認証を使ったクラウド対応メモツール。端末をまたいだ同期とGoogleログインに対応。 |
| 2 | Todo App | Webアプリ | シンプルなTodoアプリ。全タスク、未完了、完了済みを切り替えるフィルター機能を搭載。 |
| 1 | Gemini謹製 夏のひまつぶしコレクション | ゲーム | 暇つぶし用のミニゲーム集。時間をつぶすことに特化した軽いゲームを複数収録。 |

## 作品詳細

### 10. Marple

- 種別: Webアプリ
- URL: https://marple.hackuniv.club/
- 使用技術: Next.js / React / TypeScript / Tailwind CSS / Marp Core / OpenAI API / Clerk / Cloudflare Workers / Cloudflare D1 / チーム開発
- 説明: Marp形式のスライドをブラウザ上で直感的に編集できるWebアプリです。Markdown編集とスライドプレビューを同時に確認でき、AIによるスライド編集支援、gif風バージョン管理機能、PDF/PPTX形式でのエクスポートまで一貫して行えます。VSCode拡張やローカル環境構築なしで、プレゼン資料作成を効率化できる点が特徴です。

### 9. Ugomemo

- 種別: Webアプリ
- URL: https://ugomemo.ugomemo.workers.dev/
- 使用技術: Next.js / React / Clerk / Cloudflare Workers / Cloudflare D1 / SQLite / チーム開発
- 説明: アイデアをノードとして配置し、つなげながら発想を広げるためのコラボレーションツール。直感的なキャンバス、AIによる視点提案、学生・クリエイター・プランナー向けのユースケースを1ページで伝えるランディング構成にしています。

### 8. MESI-KO

- 種別: Webアプリ
- URL: https://mesi-ko.vercel.app/
- 使用技術: Next.js / React / NextAuth / Vercel / Neon / PostgreSQL / チーム開発
- 説明: ごはんの予定調整に特化した日程調整アプリ。月間カレンダーから日付ごとのイベント作成へ進め、参加候補数や回答率をサイドパネルで確認できます。招待コード参加やログイン導線も備え、少人数の予定を軽くまとめられる構成にしました。

### 7. Selection Charcount

- 種別: Chrome拡張
- URL: https://chromewebstore.google.com/detail/selection-charcount/kmjbolcinnpdiokkieehndnmnbhnmokk
- 使用技術: Chrome Extension (Manifest V3) / JavaScript / Chrome Scripting API
- 説明: 右クリックメニューから呼び出せる選択文字数カウンター。選択中テキストをコンテキストメニューイベントで受け取り、余分な空白や絵文字を除外した上で文字数を計算し、画面右下に浮遊パネルとして描画します。Service Worker ベースの background と scripting API を使って任意ページにインジェクトできるので、Web 上のライティングやレビューで即座にカウントできます。

### 6. Moodle Enhancer for Kochi University

- 種別: Chrome拡張
- URL: https://chromewebstore.google.com/detail/moodle-enhancer-for-kochi/jmnmogonkjhmhgcncebieodddgbaamfg
- 使用技術: Chrome Extension (Manifest V3) / JavaScript / Content Script / CSS
- 説明: 高知大学 Moodle を快適に使うための Chrome 拡張。ダッシュボードやコース画面をダークテーマで再構成し、課題・イベントを色分けカードで強調。リソースを自動収集する「資料」タブやメディア保存ボタン、クイズ画面の視認性改善など、学習体験を底上げする施策をコンテンツスクリプトでまとめて提供しています。

### 5. 総合映像研究会ホームページ

- 種別: Webサイト
- URL: https://soueiken-hp.pages.dev/
- 使用技術: Next.js / React / CSS / Cloudflare Pages / Cloudflare workers & D1 / チーム開発
- 説明: 高知大学・総合映像研究会の公式サイトです。サークルの雰囲気を一気に伝えるヒーローセクションやサイドバー、活動予定・BBS・コンタクトなどの複数セクションを整備し、Markdown で管理する活動レポートをトップの一覧と詳細ページに分離して運用できる構成にしています。

### 4. Part-time Shift

- 種別: Webアプリ
- URL: https://parttime-shift.pages.dev/
- 使用技術: React / TypeScript / Vite / Flask / SQLite / Cloudflare Pages / Render
- 説明: スマホに最適化されたフルスタックのシフト管理アプリ。日付と勤務時間を登録すると、ダッシュボードで次の勤務や今月の労働時間・給与見込みを自動集計。カレンダー表示や csv エクスポートにも対応し、自分の予定をまとめて管理できます。

### 3. Memo Pad

- 種別: Webアプリ
- URL: https://memoapp-5rh.pages.dev/
- 使用技術: React / Testing Library / Jest / Cloudflare Pages
- 説明: このメモ帳アプリは、シンプルな操作でメモを作成・編集できるのはもちろん、Firebase 認証を活用して端末をまたいだ同期まで自動で行ってくれるクラウド対応メモツールです。メールアドレスを使わずにユーザー名でログインでき、さらにワンクリックの Google ログインにも対応。ログインすると異なるデバイス間でリアルタイムにメモが反映されるため、クリップボードとしても使うことができます。軽快な UI に加え、安心の認証と自動バックアップ機能を備えた、日常使いにぴったりの Web メモアプリです。

### 2. Todo App

- 種別: Webアプリ
- URL: https://todo-app-d6h.pages.dev/
- 使用技術: React / TypeScript / Testing Library / Cloudflare Pages / CSS
- 説明: シンプルなTodoアプリ。非常にシンプルながら欲しい機能は揃っています。フィルター機能も搭載し、全てのタスク、未完了のタスク、完了済みのタスクを簡単に切り替えられます。

### 1. Gemini謹製 夏のひまつぶしコレクション

- 種別: ゲーム
- URL: https://himatubusi.pages.dev/
- 使用技術: HTML / CSS / JavaScript / Cloudflare Pages / チーム開発
- 説明: 夏休みといえば？そう、暇。とにかく暇。その暇潰しの一助となるサイト。数多くのミニゲームを遊ぶことができます。楽しさを求めず、ただ時間をつぶしたい人向け。本当にしょうもないゲームをたくさん制作しました。

## SSH版の操作

| キー | 動作 |
| --- | --- |
| ↑ / ↓ または k / j | 選択移動、スクロール |
| ← / Esc / Backspace | 前の画面へ戻る |
| → / Enter | 決定、詳細表示 |
| ? / h | ヘルプ表示 |
| q / Ctrl+C | 終了 |

## 実装・運用

- 実装言語: Go
- TUI: Bubble Tea / Lip Gloss / Bubbles
- SSHサーバ: Wish
- デプロイ先: Fly.io
- Fly.ioアプリ名: portfolio-ssh-63su5w
- リージョン: nrt
- 内部待ち受け: 0.0.0.0:2222
- 外部公開ポート: 22
- ホスト鍵: SSH_HOST_KEY または HOST_KEY_PATH で指定

## 更新時の確認項目

共有前に次を確認します。

- 作品数とID順が `internal/portfolio/portfolio.go` と一致していること
- URL、技術スタック、説明文が最新であること
- 連絡先とSNSが公開してよい内容になっていること
- `go test ./...` が通ること
- デプロイ後に `ssh ssh.msking.net` で接続できること
