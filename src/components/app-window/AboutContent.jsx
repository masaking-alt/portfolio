import { aboutContent } from '../../constants/content';
import { ChangeSummary } from './ChangeSummary';

export function AboutContent({ diffEntries }) {
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
