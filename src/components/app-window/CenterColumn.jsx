import { ChevronRight } from 'lucide-react';
import { AboutContent } from './AboutContent';
import { ContactContent } from './ContactContent';
import { WorkDetailContent } from './WorkDetailContent';
import { WorksOverviewContent } from './WorksOverviewContent';

export function CenterColumn({ threadType, selectedWork, threadState, scrollRef }) {
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
