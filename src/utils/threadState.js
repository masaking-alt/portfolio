import { works } from '../works';
import { aboutContent, contactContent } from '../constants/content';

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

export function createTerminalEntries(lines, kind = 'system') {
  return lines.map((text) => ({ kind, text }));
}

export function createCliOutputEntries(pathname) {
  if (pathname === '/') {
    return [{ kind: 'cli-home', text: 'cli-home' }];
  }

  if (pathname === '/works') {
    return createTerminalEntries([
      '[works]',
      ...works.map((work, index) => `${String(index + 1).padStart(2, '0')}. ${work.title} | ${work.category} | ${work.id}`),
      '',
      'Open detail: /open 1 or /open marple',
    ]);
  }

  if (pathname === '/about') {
    return createTerminalEntries([
      '[about]',
      ...aboutContent.leadLines,
      ...aboutContent.paragraphs.flatMap((paragraph) => splitTextLines(paragraph, 56)),
    ]);
  }

  if (pathname === '/contact') {
    return createTerminalEntries([
      '[contact]',
      ...splitTextLines(contactContent.intro, 56),
      `mail: ${contactContent.email}`,
      ...contactContent.links.map((link) => `${link.label}: ${link.href}`),
    ]);
  }

  return [];
}

export function createWorkDetailEntries(work) {
  return createTerminalEntries([
    `[work] ${work.title}`,
    `id: ${work.id}`,
    `category: ${work.category}`,
    '',
    ...splitTextLines(work.description, 72),
    '',
    'technologies:',
    ...work.technologies.map((technology) => `- ${technology}`),
    '',
    `url: ${work.externalUrl}`,
  ]);
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

export function getAddedLineCount(diffEntries) {
  return diffEntries.reduce((total, entry) => total + entry.addedLines.length, 0);
}

export function getThreadState(threadType, selectedWork) {
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
