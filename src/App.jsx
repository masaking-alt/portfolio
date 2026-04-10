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
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
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

const MASAKING_LOGO_LINES = [
"      ___           ___           ___           ___           ___                       ___           ___     ",
"     /__/\         /  /\         /  /\         /  /\         /__/|        ___          /__/\         /  /\    ",
"    |  |::\       /  /::\       /  /:/_       /  /::\       |  |:|       /  /\         \  \:\       /  /:/_   ",
"    |  |:|:\     /  /:/\:\     /  /:/ /\     /  /:/\:\      |  |:|      /  /:/          \  \:\     /  /:/ /\  ",
"  __|__|:|\:\   /  /:/~/::\   /  /:/ /::\   /  /:/~/::\   __|  |:|     /__/::\      _____\__\:\   /  /:/_/::\ ",
" /__/::::| \:\ /__/:/ /:/\:\ /__/:/ /:/\:\ /__/:/ /:/\:\ /__/\_|:|____ \__\/\:\__  /__/::::::::\ /__/:/__\/\:\ ",
" \  \:\~~\__\/ \  \:\/:/__\/ \  \:\/:/~/:/ \  \:\/:/__\/ \  \:\/:::::/    \  \:\/\ \  \:\~~\~~\/ \  \:\ /~~/:/",
"  \  \:\        \  \::/       \  \::/ /:/   \  \::/       \  \::/~~~~      \__\::/  \  \:\  ~~~   \  \:\  /:/ ",
"   \  \:\        \  \:\        \__\/ /:/     \  \:\        \  \:\          /__/:/    \  \:\        \  \:\/:/  ",
"    \  \:\        \  \:\         /__/:/       \  \:\        \  \:\         \__\/      \  \:\        \  \::/   ",
"     \__\/         \__\/         \__\/         \__\/         \__\/                     \__\/         \__\/    "
];

const PROFILE_ASCII_LINES = [
"#%@@@@@@@@@@@@@@#--------------*@#@@@%%@@@%#@@%%@@@*@@@#@@%*@@@%*@@@@%*@+-----=%@@@@=---------------",
"%@@@@@@@@@@@@@@@@------------*@%@@@%#@@@@#@@@#@@@%#@@%%@@%%@@@%#@@@@%#@@@#%+-----*@@@@*----:--------",
"#@@@@@@@@@@@@@@@@#----------@%@@@@*@@@@%@@@@#@@@*@@@#@@@#@@@@#%@@@@#%@@@*%@@%%-----+@@%------:----:-",
"%@@@@@@@@@@@@@@@@@@@@%+---+@%@@@%%@@@%#@@@#%@@@#@@@#@@@#@@@@#%@@@@*%@@@*@@@@@@*%-----%*----+-----=#@",
"%@@@@@@@@@@@@@@@@@@@%----%%@@@@#@@@@#@@@@#@@@%%@@%%@@%%@@@@*@@@@@*@@@%*@@@@@%*@@@=---------@%:---#@@",
"%@@@@@@@@@@@@@@@@@@*---+%@@@@*%@@@%%@@@#@@@@#@@@#@@@#@@@@%*@@@@%*@@@%#@@@@@%#@@@*@+-:-:----+@=----%@",
"%@@@@@@@@@@@@@@@@@=---#%@@@%#@@@@*@@@%#@@@%#@@@#@@@#@@@@%#@@@@##@@@#%@@@@@#%@@%#@@@=-:::---%*=----#@",
"%@@@@@@@@@@@@@@@@----#@@@@*@@@@#%@@@#@@@@#%@@%#@@%#@@@@%#@@@@#%@@@#%@@@@@*%@@#%@@@#%=:-::--#@@=----@",
"%@@@@@@@@@@@@@@%---=@@@@#%@@@%#@@@%#@@@@*@@@#@@@*----@%#@@@@*%@@@*@@@@@@*@@@#@@@@*%@@---::--@@%:---*",
"@@@@@@@@@@@@@@#---+@@@%*@@@@*%@@@#@@@@%#@@@#@@@*-----%%@@@@*@@@%*@@@@@%#@@%#@@@%*@@@#%=-:-:-#@@*----",
"@@@@@@@@@@@@@#:--*@@@#%@@@%*@@@%*@@@@##@@%#@@@#------#@@@@*@@@%*@@@@@#%@@%#@@@%#@@@*@@@-:::--%@%:---",
"@@@@@@@@@@@@+---#@@%*@@@@*@@@@#%@@@@*%@@#%@@@##-------%@%*@%%%#%%%%%*%%@#%%@%#%%%%*@@%@+:::::-#@*:-:",
"@@@@@@@@@@@=---%@@##@@@##@@@@*@@@@%#@@%#@@@@*%:::-::--*%*%%%##%%%%%*%%%*%%%%*%%%%*@%%@*%#::::::=@-::",
"@@@@@@@@@%=---#@@*@@@@+%@@@%#@@@@##@@%*@@@@*@----#*::-:*@@@*%@%%%##%%%*@%%%*%%%##%%%%*%-::::::::::::",
"@@@@@@@@%=-::::=+@@@%#@@@@#%@@@@*@@%%#%@@@*@*---+@@=:::-@%:::-@%+%%%%*@%%##%%%*%%%%%*%%*::::*@=::-+:",
"@@@@@@@@@%-::::-#@@*@@@@%*@@@@%*@@@#::---+@%::::@@@%:-:-=+:::-+=@%%##%%%+%%%%*%%%%%*@%%#=::::-::-#@#",
"@@@@@@@@@@@=:--#@%#@@@@%#@@@@##@@@*::::---+-:--%@@@@%::::::::::%@%=%%%%+%%%%*%%%%##%%@*#@#:::::::=%@",
"@@@@@@@@@@-::-%@*%@@@@*%@@@@*%@@%+::::-::--::-*@@@@@%%:::::::::-%=%%%#*%%%##%%%%*%%%%*%%%+::::=:::::",
"@@@@@@@@%=:::-=+@@@@%#@@@@%+@@@#*:---#@@::---=@@@@@@@%#-::::::::-%%%*#@%%*%%%%%*%%%%*@%%*%::::#%%#%%",
"@@@@@@@@@*::--=@@@@*%@@@@##@@@*#::--%@@@@+=*%@@@@@@@@@%%+:-+*:::::#+%%%%+%%%%*%%%%##%%#*@=:::-%%%%%%",
"@@@@@@@@@@----=@@%*@@@@@*%@@@+*::::-------=*@@@@@@@@%%%%@@#-::::::::#@##%%%%+%%%%*%#@##@*::::+%%%%%%",
"@@@@@@@@@@----=@*%@@@@@+@@@%*+:::::--::------@@@@@@@@@%%+:::::::::::::#@%%**@%%##*:::#@*=:::-%%%%%%%",
"@@@@@@@@@@-----+@@@@@%--#@#%-:::++====+**#%@@@@@@@%%%%%@%%%%%%%%%*::::::--==+#=%#::::#-:::::*%%%%%%%",
"@@@@@@@@@@=:--:---*@#:--**@*::--@@@@@@@@@@@@@@@@%%%%%%@@@%%%%%@%%@%@*::::::::=@%::::::::::::%%%%%%%%",
"@@@@@@@@@%+--::-::-@-::-+#%::--+@@@%==+*%@@@@@@%#:---@@@@@%%*=+#**%%%%%%+:::::*::::::::::::#%%%%%%%%",
"@@@@@@@@@@%::-::-::::-::::-----@@@=-:::-:--#@%%%=-::-%@%%%:::::::::+%%%%::::::::::::::-:::::%%%%%%%%",
"@@@@@@@@@@@=--::::::::::::--=%@@@#=-==-::-:-%%%%+::--#%%%+-::::-%%%%%%%%#=:::::::::::%%+::::#%%%%%%%",
"@@@@@@@@@@@%:::::::::::::-=@@@@@@@@@%@=:::-@@@%%+::::*@%%%%::::=@%%%%%%%%%-::::::::-%@@=::::#%%%%%%%",
"@@@@@@@@@@@-:--#-::::::::-=@@@@@@@@@%%::::-@%@%%*:::-+@%%%==+*#*%%%%%%%%%%#:::::::+@@*::::::#%%%%#::",
"@@@@@@@@@@+:---@@+::--::--=@@@@@@@@@%%%%%%%%%%%%%::::=%%%%%%%%%%%%%%%%%%%%%*:::::%@#:::::::-@%=:::::",
"@@@@@@@@@%=::::-%@+::-:::-=@@@@@@@@%%%%%%%%%%%%%%::::-%%%%%%%%%%%%%%%%%%%%%#::::+%:::-+::::-::::::+%",
"@@@@@@@@@@#:::::--*=:-::::-@@@@%%%%%%%%%%%%%%%%=::::-*%%%%%%%%%%%%%%%%%%%%%#::::::::%@::::::::-#%@%%",
"@@@@@@@@@@%-::-+=::-::::::=@%%@%%%%%%%%%%%%%%%::::-%%%%%%%%%%%%%%%%%%%%%%%%*:::::-*@@-:::::+%@#=:::#",
"@@@@@@@@@@@-::--@@%-:::::-=@@%%%%%%%%%%%%%%%%:::::%%%%%%%%%%%%%%%%%%%%%%%%%*::::*@%%+::::%%=::::#%%%",
"@@@@@@@@@@@=::--%@@@@#::::=%@%%%%%%%%%%%%%%%#::::=@%%%%%%#%%%%%%%%%%%%%%%%%=::::#%%#:::::::-+%%%%%%%",
"@@@@@@@@@@%%::::=@@@@#:::-=%%%%%%%%%%%%%%%%%%:::::%@@@+:::-%%%%%%%%%%%%%%%%-::::%%#::::*%%%%%%%%%%%%",
"@@@@@@@@@@@%*:::-+@@%*::::=%%%%%%%%%%%%%%%%%%#::::::::::::-%%%%%%%%%%%%%%%%::::-%-::::%%%%%%%%%%%%%%",
"@@@@@@@@@@@%@+::::-=::::::=%%%%%%%%%%%%%%%%%%%%#*++++++#%%%%%%%%%%%%%%%%%%*::::::::-#%%%%%%%%%%%%%%%",
"@@@@@@@%@@@@%@#:::::::::::=%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%+--#%%%%%%%%%+::::+#%%%%%%%%%%%%%%%%%%%",
"@@@@@@@%@@@@@@@%%%%%%#::::=%%%%%%%%%%%%%%+::-%%%%%%%%%%%%%%%+::::%%%%%%%%%-::::%%%%%%%%%%%%%%%%%%%%%",
"@@@@@@@@@@@@@%%%%%%%%%::::-%%%%%%%%%%%%%*::::-*#%%@@@%%##*+=::::-%%%%%%%%%:::::%%%%%%%%%%%%%%%%%%%%%",
"@@@@%@%@@@%%%%%%%%%%%%:::::%%%%%%%%%%%%%%*::::::::::::::::::::-%%%%%%%%%%*::::::::-*%%%%%%%%%%%%%%%%",
"@@@@%@%%%%%%%%%%%#+*++:::::=%%%%%%%%%%%%%%%%%##*+++++###%%%%%%%%%%%%%%%%%-::::-::::::=%%%%%%%%%%%%%%",
"@@%%%%%%%%%%%%%=::::::::::::-%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:::::*%%%+::::#%%%%%%%%%%%%%",
"%@%%%%%%%%%%%%#::::*%%%#:::::::*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=::::-%%%%%+::::#%%%%%%%%%%%%%",
"%%%%%%%%%%%%%%=::::#%%%%%#-::::::-#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*:::::#%%%%%%=::::%%%%%%%%%%%%%%",
"%%%%%%%%%%%%%%=::::*%%%%%%%%=:::::::=%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*:::::::#%%%%%%::::::=%%%%%%%%%%%%",
"%%%%%%%%%%%%%=:::::*%%%%%%%%-::::::::::*%%%%%%%%%%%%%%%%%%%%%%%%+:::::::::%%%%%%%%#=::::::#%%%%%%%%%",
"%%%%%%%%%%#:::::-=*%%%%%%%%%-::::*+::::::-#%%%%%%%%%%%%%%%%%%%=::::-#-::::%%%%%%%%%%%%-::::%%%%%%%%%",
"%%%%%%%%%%::::+%%%%%%%%%%%%%-::::#%%%=::::::-%%%%%%%%%%%%%%%:::::-%%%:::::=%%%%%%%%%%%-::::%%%%%%%%%",
"%%%%%%%%%#::::#%%%%%%%%%%%#=:::::#%%%%%#-:::::::---::::::::::::*%%%%%::::::::+%%%%%%%+::::*%%%%%%%%%",
"%%%%%%%%%+:::-%%%%%%%%%=:::::::::*%%%%%%%%%+::::::::::::::::-%%%%%%%%::::::::::%%%%%=::::*%%%%%%%%%%",
"%%%%%%%%%-:::-%%%%%%%*:::::::::::*%%%%%%%%%%%%%######%%%%%%%%%%%%%%%%:::::::::*%%%*:::::*#%%%%%%%%%%",
"%%%%%%%%%+::::=%%%%%%%#-:::::::::*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:::::::#%%%+::::::::::::=*%%%%%",
"%%%%%%%#-:::::::+@%%%%%%#::::::::%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*:::::-%%%%=::::::::::::::::::::-",
"%%#+-:::::::::::::*@%+#%%%%-::::::*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#-:::::**-%%-::.::::::::::::::::::::",
"*-:::::::::::::::::-*@%*+%%%%*::::::-%%%%%%%%%%%%%%%%%%%%%%%%#-:::::+%+-%+::::::::::::::::::::::::::"
];

const AVAILABLE_COMMANDS_TEXT = 'available commands: "masaking" , "masaking app" , "help" , "clear"';
const CLI_COMMANDS_TEXT = 'CLI commands: "/top" , "/works" , "/about" , "/contact"';
const TERMINAL_PROMPT = 'Visitor@MasakingPortfolio >';
const HELP_COMMAND_LINES = [
  AVAILABLE_COMMANDS_TEXT,
  'masaking: launch Masaking CLI',
  'masaking app: launch Masaking App',
  'help: show command list',
  'clear: clear terminal and return to top',
];
const CLI_BOOT_MESSAGE = 'Masaking CLI started.';
const APP_BOOT_MESSAGE = 'Masaking App started.';

function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

function formatCurrentTimestamp() {
  const now = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()];
  return `${weekday}, ${month} ${now.getDate()} ${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`;
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

function splitTextLines(text, width = 26) {
  const lines = [];
  for (let index = 0; index < text.length; index += width) {
    lines.push(text.slice(index, index + width));
  }
  return lines;
}

function createTerminalEntries(lines, kind = 'system') {
  return lines.map((text) => ({ kind, text }));
}

function getCliPathFromCommand(command) {
  if (command === '/top') {
    return '/';
  }
  if (command === '/works') {
    return '/works';
  }
  if (command === '/about') {
    return '/about';
  }
  if (command === '/contact') {
    return '/contact';
  }
  return null;
}

function getCliOutputLines(pathname) {
  if (pathname === '/works') {
    return [
      '[works]',
      ...works.map((work, index) => `${String(index + 1).padStart(2, '0')}. ${work.title} | ${work.category}`),
    ];
  }

  if (pathname === '/about') {
    return [
      '[about]',
      ...aboutContent.leadLines,
      ...aboutContent.paragraphs.flatMap((paragraph) => splitTextLines(paragraph, 56)),
    ];
  }

  if (pathname === '/contact') {
    return [
      '[contact]',
      ...splitTextLines(contactContent.intro, 56),
      `mail: ${contactContent.email}`,
      ...contactContent.links.map((link) => `${link.label}: ${link.href}`),
    ];
  }

  return [
    '[top]',
    'Welcome to masaking portfolio.',
    CLI_COMMANDS_TEXT,
  ];
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

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getFallbackDesktopArea(viewportWidth, viewportHeight) {
  return {
    width: Math.max(320, viewportWidth - 48),
    height: Math.max(260, viewportHeight - 96),
  };
}

function getMaximizedFrame(containerWidth, containerHeight) {
  return {
    x: 0,
    y: 0,
    width: Math.max(320, containerWidth),
    height: Math.max(260, containerHeight),
    isMaximized: true,
  };
}

function clampWindowFrame(frame, containerWidth, containerHeight) {
  if (frame.isMaximized) {
    return {
      ...frame,
      ...getMaximizedFrame(containerWidth, containerHeight),
    };
  }

  const margin = 18;
  const width = Math.min(frame.width, Math.max(320, containerWidth - margin * 2));
  const height = Math.min(frame.height, Math.max(260, containerHeight - margin * 2));
  return {
    ...frame,
    width,
    height,
    x: clampValue(frame.x, 0, Math.max(0, containerWidth - width)),
    y: clampValue(frame.y, 0, Math.max(0, containerHeight - height)),
  };
}

function getDesktopWindowFrames(containerWidth, containerHeight, mode) {
  const terminalLargeWidth = Math.min(containerWidth - 36, 1180);
  const terminalLargeHeight = Math.min(containerHeight - 36, 760);
  const centeredTerminal = {
    x: Math.max(18, Math.round((containerWidth - terminalLargeWidth) / 2)),
    y: Math.max(18, Math.round((containerHeight - terminalLargeHeight) / 2) - 10),
    width: terminalLargeWidth,
    height: terminalLargeHeight,
    isMaximized: false,
  };

  const terminalCompact = clampWindowFrame(
    {
      x: 24,
      y: 24,
      width: Math.min(460, containerWidth * 0.3),
      height: Math.min(380, containerHeight * 0.44),
      isMaximized: false,
    },
    containerWidth,
    containerHeight,
  );

  const appLarge = clampWindowFrame(
    {
      x: Math.max(120, Math.round(containerWidth * 0.14)),
      y: 24,
      width: Math.min(containerWidth - 48, 1180),
      height: Math.min(containerHeight - 48, 760),
      isMaximized: false,
    },
    containerWidth,
    containerHeight,
  );

  if (mode === 'app') {
    return {
      terminal: terminalCompact,
      app: appLarge,
    };
  }

  return {
    terminal: centeredTerminal,
    app: appLarge,
  };
}

function WindowControlButtons({ onToggleMaximize, isMaximized = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        aria-label="close window"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        className="h-3 w-3 rounded-full bg-[#ff5f57]"
      />
      <button
        type="button"
        aria-label="minimize window"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        className="h-3 w-3 rounded-full bg-[#febc2e]"
      />
      <button
        type="button"
        aria-label={isMaximized ? 'restore window' : 'maximize window'}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMaximize?.();
        }}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]"
      >
        <span className="h-[5px] w-[5px] rounded-[1px] bg-black/25" />
      </button>
    </div>
  );
}

function WindowShell({
  active = false,
  className = '',
  bodyClassName = '',
  onWindowPointerDown,
  children,
}) {
  return (
    <section
      onPointerDown={onWindowPointerDown}
      className={`relative overflow-hidden rounded-[28px] border bg-[#0d1017]/90 backdrop-blur-xl ${
        active
          ? 'border-white/16 shadow-[0_28px_90px_rgba(0,0,0,0.48)]'
          : 'border-white/10 shadow-[0_18px_56px_rgba(0,0,0,0.34)]'
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className={`relative flex min-h-0 flex-col ${bodyClassName}`}>{children}</div>
    </section>
  );
}

function TerminalWindowShell({
  title,
  onWindowPointerDown,
  onHeaderPointerDown,
  onToggleMaximize,
  isMaximized = false,
  active = false,
  className = '',
  children,
}) {
  return (
    <section
      onPointerDown={onWindowPointerDown}
      className={`relative overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#1c1c1c] shadow-[0_22px_60px_rgba(0,0,0,0.45)] ${
        active ? 'ring-1 ring-white/8' : ''
      } ${className}`}
    >
      <div
        onPointerDown={onHeaderPointerDown}
        className={`flex h-8 items-center justify-between border-b border-white/[0.06] bg-[linear-gradient(180deg,#303030_0%,#262626_100%)] px-3 ${
          onHeaderPointerDown ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <WindowControlButtons onToggleMaximize={onToggleMaximize} isMaximized={isMaximized} />

        <div className="min-w-0 flex-1 px-4 text-center text-[11px] font-medium text-white/72">
          <span className="truncate">{title}</span>
        </div>

        <div className="w-[42px]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#1e1e1e]">{children}</div>
    </section>
  );
}

function DesktopBackdrop() {
  return <div className="pointer-events-none absolute inset-0 bg-black" />;
}

function DesktopMenuBar({ displayMode }) {
  return (
    <div className="relative z-40 flex h-9 items-center justify-between border-b border-white/[0.08] bg-black px-4 text-[12px] text-white/72">
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

function TerminalPrompt() {
  return <span className="shrink-0 text-[#32d74b]">{TERMINAL_PROMPT}</span>;
}

function TerminalCommandLine({ command }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-6">
      <TerminalPrompt />
      <span className="whitespace-pre-wrap break-all text-[#f5f5f5]">{command}</span>
    </div>
  );
}

function TerminalPromptInput({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 text-[12px] leading-6">
      <TerminalPrompt />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#f5f5f5] outline-none placeholder:text-[#6c6c6c]"
        autoComplete="off"
        autoFocus
        spellCheck="false"
      />
    </form>
  );
}

function TerminalLogLine({ entry }) {
  if (entry.kind === 'command') {
    return <TerminalCommandLine command={entry.text} />;
  }

  if (entry.kind === 'error') {
    return <div className="text-[#f5f5f5]">{entry.text}</div>;
  }

  return <div className="text-[#d0d0d0]">{entry.text}</div>;
}

function LauncherTerminalWindow({
  terminalCommand,
  terminalLog,
  onTerminalCommandChange,
  onTerminalSubmit,
  shellProps = {},
}) {
  const terminalTitle = 'Visitor@MasakingPortfolio ~ website/portfolio';
  const launcherScrollRef = useRef(null);

  useEffect(() => {
    if (launcherScrollRef.current) {
      launcherScrollRef.current.scrollTop = launcherScrollRef.current.scrollHeight;
    }
  }, [terminalLog]);

  return (
    <TerminalWindowShell title={terminalTitle} active className="flex h-full min-h-0 flex-col" {...shellProps}>
      <div
        ref={launcherScrollRef}
        className="min-h-0 flex-1 overflow-auto bg-[#1e1e1e] px-5 py-4 font-mono text-[12px] leading-6 text-[#d0d0d0] custom-scrollbar"
      >
        <div className="space-y-0">
          {terminalLog.map((entry, index) => (
            <div key={`${entry.text}-${index}`}>
              <TerminalLogLine entry={entry} />
            </div>
          ))}
        </div>
        <div className="pt-0">
          <TerminalPromptInput value={terminalCommand} onChange={onTerminalCommandChange} onSubmit={onTerminalSubmit} />
        </div>
      </div>
    </TerminalWindowShell>
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

function LeftSidebar({
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
                className="group flex items-center justify-center rounded-xl border border-white/[0.06] bg-black/20 p-4"
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="block h-auto max-h-[220px] w-auto max-w-full object-contain transition duration-300 group-hover:scale-[1.02]"
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
        <div className="mx-auto flex justify-center">
          <a
            href={work.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-xl border border-white/[0.06] bg-black/20 p-4"
          >
            <img
              src={work.imageUrl}
              alt={work.title}
              className="block h-auto max-h-[420px] w-auto max-w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            />
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
  const isWorkDetail = Boolean(selectedWork);

  return (
    <section className="order-2 flex min-h-0 flex-col overflow-hidden bg-[#111112] lg:order-none lg:col-start-2 lg:row-start-2 lg:border-r lg:border-white/[0.05]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-9 lg:px-10 custom-scrollbar">
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

            {!isWorkDetail ? (
              <>
                <p className="text-[14px] font-medium leading-7 text-white/86">{threadState.answerTitle}</p>
                {threadState.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 pr-10 text-[13.5px] leading-[1.9] text-white/68">
                    {paragraph}
                  </p>
                ))}
              </>
            ) : null}

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
        <div className="mx-auto flex max-w-[420px] items-center justify-center rounded-lg border border-emerald-400/10 bg-black/20 p-3">
          <img src={entry.imageUrl} alt={entry.imageAlt} className="block h-auto max-h-[420px] w-auto max-w-full object-contain" />
        </div>
        <div className="mt-3 font-mono text-[11.5px] text-[#89d39a]">{entry.caption}</div>
      </div>
    </div>
  );
}

function RightColumn({ diffEntries, scrollRef }) {
  const totalAddedLines = getAddedLineCount(diffEntries);

  return (
    <aside className="order-3 flex min-h-0 flex-col overflow-hidden bg-[#121212] lg:order-none lg:col-start-3 lg:row-start-2">
      <div className="flex h-10 items-center justify-between px-3">
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

function AppWindow({ threadType, selectedWork, threadState, shellProps = {} }) {
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
  const { onHeaderPointerDown, onToggleMaximize, isMaximized } = shellProps;

  return (
    <WindowShell
      active
      className="flex h-full min-h-0 flex-col"
      bodyClassName="flex-1 min-h-0"
      {...shellProps}
    >
      <div ref={containerRef} className="relative h-full min-h-0 flex-1 overflow-hidden bg-[#111112]">
        <div
          className="grid h-full w-full grid-cols-1 auto-rows-max lg:grid-cols-[268px_minmax(0,1fr)_864px] lg:grid-rows-[40px_minmax(0,1fr)]"
          style={gridStyle}
        >
          <LeftSidebar
            activeThreadType={threadType}
            selectedWorkId={selectedWork?.id ?? null}
            onHeaderPointerDown={onHeaderPointerDown}
            onToggleMaximize={onToggleMaximize}
            isMaximized={isMaximized}
          />
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

function WorkspaceScreen({
  threadType = 'works',
  displayMode,
  terminalCommand,
  terminalLog,
  onTerminalCommandChange,
  onTerminalSubmit,
}) {
  const { id } = useParams();
  const selectedWork = threadType === 'works' && id ? works.find((work) => work.id === id) ?? null : null;
  const effectiveThreadType = selectedWork ? 'works' : threadType;
  const threadState = getThreadState(effectiveThreadType, selectedWork);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const desktopViewportRef = useRef(null);
  const [desktopArea, setDesktopArea] = useState(() => getFallbackDesktopArea(window.innerWidth, window.innerHeight));
  const [windowFrames, setWindowFrames] = useState(() =>
    getDesktopWindowFrames(desktopArea.width, desktopArea.height, displayMode),
  );
  const [activeWindow, setActiveWindow] = useState(displayMode === 'app' ? 'app' : 'terminal');
  const [dragState, setDragState] = useState(null);
  const previousDisplayModeRef = useRef(displayMode);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const desktopViewport = desktopViewportRef.current;
    if (!desktopViewport) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width <= 0 || entry.contentRect.height <= 0) {
        return;
      }

      setDesktopArea({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(desktopViewport);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      previousDisplayModeRef.current = displayMode;
      return;
    }

    if (previousDisplayModeRef.current !== displayMode) {
      setWindowFrames(getDesktopWindowFrames(desktopArea.width, desktopArea.height, displayMode));
      setActiveWindow(displayMode === 'app' ? 'app' : 'terminal');
      previousDisplayModeRef.current = displayMode;
    }
  }, [desktopArea.height, desktopArea.width, displayMode, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    setWindowFrames((currentFrames) => ({
      terminal: clampWindowFrame(currentFrames.terminal, desktopArea.width, desktopArea.height),
      app: clampWindowFrame(currentFrames.app, desktopArea.width, desktopArea.height),
    }));
  }, [desktopArea.height, desktopArea.width, isDesktop]);

  useEffect(() => {
    if (!isDesktop || !dragState) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const desktopViewport = desktopViewportRef.current;
      if (!desktopViewport) {
        return;
      }

      const viewportRect = desktopViewport.getBoundingClientRect();
      setWindowFrames((currentFrames) => {
        const currentFrame = currentFrames[dragState.key];
        if (!currentFrame || currentFrame.isMaximized) {
          return currentFrames;
        }

        return {
          ...currentFrames,
          [dragState.key]: clampWindowFrame(
            {
              ...currentFrame,
              x: event.clientX - viewportRect.left - dragState.offsetX,
              y: event.clientY - viewportRect.top - dragState.offsetY,
            },
            desktopArea.width,
            desktopArea.height,
          ),
        };
      });
    };

    const handlePointerUp = () => setDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [desktopArea.height, desktopArea.width, dragState, isDesktop]);

  function focusWindow(windowKey) {
    setActiveWindow(windowKey);
  }

  function startWindowDrag(windowKey, event) {
    if (!isDesktop) {
      return;
    }

    const desktopViewport = desktopViewportRef.current;
    const frame = windowFrames[windowKey];
    if (!desktopViewport || !frame || frame.isMaximized) {
      return;
    }

    const viewportRect = desktopViewport.getBoundingClientRect();
    event.preventDefault();
    setActiveWindow(windowKey);
    setDragState({
      key: windowKey,
      offsetX: event.clientX - viewportRect.left - frame.x,
      offsetY: event.clientY - viewportRect.top - frame.y,
    });
  }

  function toggleWindowMaximize(windowKey) {
    if (!isDesktop) {
      return;
    }

    setActiveWindow(windowKey);
    setWindowFrames((currentFrames) => {
      const frame = currentFrames[windowKey];
      if (!frame) {
        return currentFrames;
      }

      if (frame.isMaximized && frame.restoreFrame) {
        return {
          ...currentFrames,
          [windowKey]: {
            ...clampWindowFrame(
              {
                ...frame.restoreFrame,
                isMaximized: false,
              },
              desktopArea.width,
              desktopArea.height,
            ),
            restoreFrame: null,
          },
        };
      }

      return {
        ...currentFrames,
        [windowKey]: {
          ...getMaximizedFrame(desktopArea.width, desktopArea.height),
          restoreFrame: {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
          },
        },
      };
    });
  }

  const terminalShellProps = {
    active: activeWindow === 'terminal',
    isMaximized: Boolean(windowFrames.terminal?.isMaximized),
    onWindowPointerDown: () => focusWindow('terminal'),
    onHeaderPointerDown: (event) => startWindowDrag('terminal', event),
    onToggleMaximize: () => toggleWindowMaximize('terminal'),
  };

  const appShellProps = {
    active: activeWindow === 'app',
    isMaximized: Boolean(windowFrames.app?.isMaximized),
    onWindowPointerDown: () => focusWindow('app'),
    onHeaderPointerDown: (event) => startWindowDrag('app', event),
    onToggleMaximize: () => toggleWindowMaximize('app'),
  };
  const hasMaximizedWindow = Boolean(windowFrames.terminal?.isMaximized || windowFrames.app?.isMaximized);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white antialiased">
      <DesktopBackdrop />

      <div className="relative flex h-full flex-col overflow-hidden">
        <DesktopMenuBar displayMode={displayMode} />

        <div
          className={`relative flex-1 overflow-hidden ${
            hasMaximizedWindow ? 'px-0 pt-0' : 'px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6'
          }`}
        >
          <div className="flex h-full flex-col gap-4 lg:hidden">
            {displayMode === 'cli' ? (
              <div className="min-h-0 flex-1">
                <LauncherTerminalWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  displayMode={displayMode}
                  terminalCommand={terminalCommand}
                  terminalLog={terminalLog}
                  onTerminalCommandChange={onTerminalCommandChange}
                  onTerminalSubmit={onTerminalSubmit}
                />
              </div>
            ) : (
              <>
                <div className="shrink-0">
                    <LauncherTerminalWindow
                      threadType={effectiveThreadType}
                      selectedWork={selectedWork}
                      threadState={threadState}
                      displayMode={displayMode}
                      terminalCommand={terminalCommand}
                      terminalLog={terminalLog}
                      onTerminalCommandChange={onTerminalCommandChange}
                      onTerminalSubmit={onTerminalSubmit}
                    />
                </div>

                {displayMode === 'app' ? (
                  <div className="min-h-0 flex-1">
                    <AppWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div ref={desktopViewportRef} className="relative hidden h-full lg:block">
            <div
              style={{
                left: `${windowFrames.terminal.x}px`,
                top: `${windowFrames.terminal.y}px`,
                width: `${windowFrames.terminal.width}px`,
                height: `${windowFrames.terminal.height}px`,
                zIndex: activeWindow === 'terminal' ? 30 : 20,
              }}
              className="absolute"
            >
                <LauncherTerminalWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  displayMode={displayMode}
                  terminalCommand={terminalCommand}
                  terminalLog={terminalLog}
                  onTerminalCommandChange={onTerminalCommandChange}
                  onTerminalSubmit={onTerminalSubmit}
                  shellProps={terminalShellProps}
              />
            </div>

            {displayMode === 'app' ? (
              <div
                style={{
                  left: `${windowFrames.app.x}px`,
                  top: `${windowFrames.app.y}px`,
                  width: `${windowFrames.app.width}px`,
                  height: `${windowFrames.app.height}px`,
                  zIndex: activeWindow === 'app' ? 30 : 20,
                }}
                className="absolute"
              >
                <AppWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  shellProps={appShellProps}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState('idle');
  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalLog, setTerminalLog] = useState(() => [
    { kind: 'system', text: AVAILABLE_COMMANDS_TEXT },
  ]);

  function appendTerminalLines(lines, kind = 'system') {
    setTerminalLog((currentLog) => [
      ...currentLog,
      ...createTerminalEntries(lines, kind),
    ]);
  }

  function handleTerminalSubmit(event) {
    event.preventDefault();
    const rawCommand = terminalCommand.trim();
    const normalizedCommand = rawCommand.toLowerCase().replace(/\s+/g, ' ');
    setTerminalCommand('');

    if (!normalizedCommand) {
      return;
    }

    setTerminalLog((currentLog) => [...currentLog, { kind: 'command', text: rawCommand }]);

    if (normalizedCommand === 'masaking') {
      setHasEnteredWorkspace(true);
      setDisplayMode('cli');
      navigate('/');
      appendTerminalLines([CLI_BOOT_MESSAGE, CLI_COMMANDS_TEXT, ...getCliOutputLines('/')]);
      return;
    }

    if (normalizedCommand === 'masaking app') {
      setHasEnteredWorkspace(true);
      setDisplayMode('app');
      appendTerminalLines([APP_BOOT_MESSAGE]);
      return;
    }

    if (normalizedCommand === 'help') {
      appendTerminalLines(hasEnteredWorkspace ? [...HELP_COMMAND_LINES, CLI_COMMANDS_TEXT] : HELP_COMMAND_LINES);
      return;
    }

    if (normalizedCommand === 'clear') {
      setTerminalLog([]);
      navigate('/');
      return;
    }

    const cliPath = getCliPathFromCommand(normalizedCommand);
    if (cliPath) {
      if (!hasEnteredWorkspace) {
        appendTerminalLines(['Run "masaking" or "masaking app" first.'], 'error');
        return;
      }

      navigate(cliPath);
      appendTerminalLines(getCliOutputLines(cliPath));
      return;
    }

    appendTerminalLines([`command not found: ${rawCommand}`], 'error');
  }

  function renderWorkspaceRoute(threadType) {
    return (
      <WorkspaceScreen
        threadType={threadType}
        displayMode={displayMode}
        terminalCommand={terminalCommand}
        terminalLog={terminalLog}
        onTerminalCommandChange={setTerminalCommand}
        onTerminalSubmit={handleTerminalSubmit}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <WorkspaceScreen
            threadType="top"
            displayMode={displayMode}
            terminalCommand={terminalCommand}
            terminalLog={terminalLog}
            onTerminalCommandChange={setTerminalCommand}
            onTerminalSubmit={handleTerminalSubmit}
          />
        }
      />
      <Route
        path="/works"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/work/:id"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/about"
        element={renderWorkspaceRoute('about')}
      />
      <Route
        path="/contact"
        element={renderWorkspaceRoute('contact')}
      />
    </Routes>
  );
}

export default App;
