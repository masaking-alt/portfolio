import { ChangeSummary } from './ChangeSummary';

export function WorkDetailContent({ work, diffEntries }) {
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
