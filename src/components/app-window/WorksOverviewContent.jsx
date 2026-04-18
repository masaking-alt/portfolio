import { works } from '../../works';
import { ChangeSummary } from './ChangeSummary';

export function WorksOverviewContent({ diffEntries }) {
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
